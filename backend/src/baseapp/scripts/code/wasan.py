"""Blank file which can server as starting point for writing any script file"""
import MySQLdb
import argparse
import os
import json
import django
import pandas as pd
from django.utils.text import slugify
from django.utils import timezone
from django.db.models import Func, F, Sum, Count

from django.contrib.auth import get_user_model
from commons import logger_fetch, ms_transliterate_word
from defines import DJANGO_SETTINGS
os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
django.setup()
from core.models import Region
from baseapp.models import Entity, EntityHistory
from baseapp.formio import help_sought, get_status, get_remarks
User = get_user_model()
from core.models import Team, Region, Organization
STATUS_DICT = {
        'closed' : 'closed',
        'contacted-follow-up-person' : 'contacted-follow-up-person',
        'in-process' : 'in-process',
        'none' : 'none',
        'not-started': 'not-started',
        'notStarted' : 'not-started',
        'visited-migrant' : 'visited-migrant'
    }
def args_fetch():
    '''
    Paser for the argument list that returns the args list
    '''

    parser = argparse.ArgumentParser(description=('This is blank script',
                                                  'you can copy this base script '))
    parser.add_argument('-l', '--log-level', help='Log level defining verbosity', required=False)
    parser.add_argument('-t', '--test', help='Test Loop',
                        required=False, action='store_const', const=1)
    parser.add_argument('-i', '--import', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-db', '--db2csv', help='dump Database in csv',
                        required=False, action='store_const', const=1)
    parser.add_argument('-ie', '--importEntities', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-pd', '--populateDistricts', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-iu', '--importUsers', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-cue', '--connectUsersEntity', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-ir', '--importRegions', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-fn', '--filename', help='filename to be imported', required=False)
    parser.add_argument('-ti2', '--testInput2', help='Test Input 2', required=False)
    args = vars(parser.parse_args())
    return args

dbhost = "localhost"
dbuser = "vivek"
dbpasswd = "vivek123"
def dbInitialize(host=dbhost, user=dbuser, passwd=dbpasswd, db="libtech", charset=None):
  '''
  Connect to MySQL Database
  '''
  db = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db, charset=charset)
  db.autocommit(True)
  return db;

def dbFinalize(db):
  db.close()
def create_history(entity, myuser):
    """This will enter the entity object in the entity history table to
    maintain all the edit records"""
    try:
        obj = EntityHistory.objects.create(entity=entity)
        obj.title = entity.title
        obj.what_help = entity.what_help
        obj.user_name = myuser.name
        obj.status = entity.status
        obj.urgency = entity.urgency
        obj.remarks = entity.remarks
        obj.prefill_json = entity.prefill_json
        obj.save()
    except:
        obj = None

org_id_mapping = {
      '2' : 'WASSAN',
    '3' : '3',
    '127' : '0',
    '321' : '321',
    '322' : '9',
    '324' : 'MP',
    '325' : 'Chhattisgarh',
    '326' : 'Gujarat',
    '327' : 'Maharashtra',
    '328' : 'Rajasthan',
    '400' : 'Delhi',
    '500' : 'swanteam'
}
orgs_to_be_imported = ['2', '324', '325', '326', '327', '328', '400', '500']
def create_entity(logger, record, myUser, wasan_id = None, wasan_org_id=None,
                  usergroup=None):
    logger.info(f"my user is {myUser.id}")
    if usergroup is None:
        usergroup = "wassan"
    # This has to go as a string
    # extra_fields = str(record['extra_fields'])
    # revised['extra_fields'] = extra_fields
    logger.info(f"wasan id is {wasan_id}")
    if wasan_id is None: 
        try:
            wasan_id = record['extra_fields']['common']['entity_id']
        except:
            wasan_id = None
    try:
        if wasan_org_id is None:
            wasan_org_id = record['extra_fields']['formio_parsed_data']['sourceSpecific']['organisationId']
        libtech_org_id = org_id_mapping.get(str(wasan_org_id), None)
        logger.info(f"wasan_org_id {wasan_org_id} - libtech_org_id {libtech_org_id}")
        my_group = Team.objects.filter(name=libtech_org_id).first()
        logger.info(my_group)
    except:
        wasan_org_id = None
        my_group = None
    if wasan_org_id is not None:
        if int(wasan_org_id) == 3:
            return
        if int(wasan_org_id) == 322:
            return
        if int(wasan_org_id) == 321:
            return
        if int(wasan_org_id) == 127:
            return
        if int(wasan_org_id) == 0:
            return
        if (wasan_org_id is None) or (str(wasan_org_id) not in orgs_to_be_imported):
            logger.info("will not import this")
            input()
            return
    obj = None
    logger.info(wasan_id)
    if wasan_id is not None:
        logger.info(wasan_id)
        obj = Entity.objects.filter(wassan_id=wasan_id).first()
    if obj is None:
        obj = Entity.objects.create(title="blankNewItem")
    logger.info(obj.id)
    logger.info(f"checking my user again {myUser.id}")
    obj.user = myUser
    obj.updated_by_user = myUser
    for key, value in record.items():
        setattr(obj,key,value)
    obj.record_type = 'helpseekers'
    # False if it does not come via formio
    obj.form_ui = False
    name = record.get('full_name', '')
    title = f"{name}, {record.get('address', None)}"
    title = title.replace('nan', '')
    title = title.replace('  ', ' ')
    title = str(title)
    title = title[:255]
    if not (isinstance(obj.how_many_people, int)):
        obj.how_many_people = None
    obj.name = title
    obj.title = title
    obj.phone = str(record.get('phone',''))
    obj.backend_notes = 'Added from a dump from Min on 2 May.'
    
    # entity_status = status[random.randint(0,len(status)-1)]
    if isinstance(record['extra_fields'], str):
        extra_fields = json.loads(record['extra_fields'].replace("'", '"'))
    else:
        extra_fields = record['extra_fields']
    # extra_fields['status'] = entity_status    
    obj.extra_fields = extra_fields
    obj.formio_usergroup = usergroup
    obj.region = record.get('state', '')
    obj.state = record.get('state', '')
    try:
        remarks = record['prefill_json']['data']['formFillerNotes'][0]
        remarks = remarks.replace("remarks:","").lstrip().rstrip()
        #logger.info(remarks)
    except:
        remarks = ''
    obj.wassan_id = wasan_id
    try:
        user_email = record['common']['user_email']
        assigned_user = User.objects.filter(wassan_username=user_email).first()
        if assigned_user is not None:
            obj.assigned_to_user = assigned_user
        else:
            obj.assigned_to_user = myUser
    except:
        obj.assigned_to_user = myUser
    if my_group is not None:
        obj.assigned_to_group = my_group
    obj.remarks = remarks
    obj.what_help = help_sought(obj.prefill_json)
    logger.info(f"Saving {obj.id}")
    if not isinstance(obj.latitude, float):
        obj.latitude = None
    if not isinstance(obj.longitude, float):
        obj.longitude = None
    
    obj.save()
    #logger.info(obj.phone)
    #create_history(obj, myUser)
def main():
    """Main Module of this program"""
    args = args_fetch()
    logger = logger_fetch(args.get('log_level'))
    if args['connectUsersEntity']:
        objs = Entity.objects.filter(record_type = "helpseekers")
        myTeam = Team.objects.filter(id=10).first()
        for obj in objs:
            obj.assigned_to_group = myTeam
            logger.info(obj.id)
            obj.save()
        exit(0)
        for obj in objs:
            extra_fields = obj.extra_fields
            try:
                wasan_user_email = obj.extra_fields['common']['user_email']
            except:
                wasan_user_id = None
            myUser = User.objects.filter(region=wasan_user_email).first()
            if myUser is not None:
                obj.assigned_to_user = myUser
                obj.save()
    if args['importUsers']:
        logger.info("Importing Users")
        role_dict = {
            '1' : 'usergroupadmin',
            '2' : 'groupadmin',
            '3' : 'volunteer',
            '4' : 'volunteer',
            '5' : 'volunteer',
            '6' : 'usergroupadmin'
        }
        df = pd.read_csv("../import_data/wassan_users_2may.csv")
        for index, row in df.iterrows():
           # wasan_id = row['Id']
            name = row['name']
            email = row['email']
            if "@" not in email:
                email = f"{email}@abcd.com"
            password = row['password']
            user_role = row['role']
            wassan_username = row['username']
            group_name = row['group']
            phone = row['mobile']
            myTeam = Team.objects.filter(name=group_name).first()
            if myTeam is None:
                myTeam = Team.objects.create(name=group_name)
            myuser = User.objects.filter(email=email).first()
            if myuser is None:
                myuser = User.objects.create(email=email)
            myuser.group = myTeam
            myuser.name = name
            myuser.set_password(password) 
            myuser.phone = phone
            myuser.wassan_username = wassan_username
           # myuser.region = wasan_id#Temporary
           # user_role = role_dict.get(str(role_id), "volunteer")
            myuser.user_role = user_role
            myuser.formio_usergroup = 'wassan'
            myuser.save()
           

    if args['importEntities']:
        my_user = User.objects.filter(id=1).first()
        with open('../import_data/swan_14_05_2020.json', 'r') as f:
                records = json.load(f)
        base_number = 200514 * 10000
        for i,record in enumerate(records):
            logger.info(i)
            try:
                username= record["extra_fields"]["source_specific"]["who_entering_this_txn"]
                volunteer  = User.objects.filter(name = username).first()
            except:
                volunteer = None
            if volunteer is None:
                volunteer = User.objects.filter(id=13).first()
            logger.info(f"volunteer id is {volunteer.id}")
            sr_no = base_number + i
            create_entity(logger, record, volunteer, wasan_id = sr_no,
                          wasan_org_id=500, usergroup='swan')
        exit(0)
        usergroup = "wassan"
        objs = Entity.objects.filter(record_type = "helpseekers")
        for obj in objs:
            obj.status = STATUS_DICT.get(obj.status, None)
            obj.save()

    if args['populateDistricts']:
        objs = Entity.objects.filter(record_type = "helpseekers").order_by("-id")
    #    objs = Entity.objects.filter(id = 74533).order_by("-id")
        for obj in objs:
            try:
                district = obj.prefill_json['data']['contactForm']['data']['district']
            except:
                district = None
            logger.info(f"{obj.id} - {district}")
            if district is not None:
                obj.district = district
                obj.save()
    if args['test']:
        users = User.objects.filter(formio_usergroup = "swan")
        for user in users:
            logger.info(user.id)
        exit(0)
        states = Entity.objects.all().values('state').annotate(c=Count('id'))
        for state in states:
            logger.info(state)
        exit(0)
        org = Organization.objects.filter(id=1).first()
        objs = Team.objects.all()
        for obj in objs:
            obj.organization = org
            obj.save()
        exit(0)
        objs = User.objects.all()
        for obj in objs:
            obj.formio_usergroup = "wassan"
            logger.info(obj.id)
            obj.save()
        objs = Entity.objects.filter(record_type = "helpseekers")
        for obj in objs:
            logger.info(obj.id)
            #logger.info(obj.prefill_json)
            obj.what_help = help_sought(obj.prefill_json)
            obj.status = get_status(obj.prefill_json)
            obj.remarks = get_remarks(obj.prefill_json)
            logger.info(obj.what_help)
            obj.save()
        exit(0)
        objs = User.objects.all()
        for obj in objs:
            obj.save()
        exit(0)
        objs = Entity.objects.filter(formio_usergroup = "wassan")
        for obj in objs:
            try:
                status = obj.extra_fields["common"]["status"]
            except:
                status = None
            try:
                urgency = obj.extra_fields["needs"]["urgency"]
            except:
                urgency = None
            obj.status=slugify(status)
            obj.urgency=urgency
            logger.info(obj.urgency)
            obj.save()

        exit(0)
        csv_array = []
    if args['db2csv']:
        logger.info("test")
        dbhost = "localhost"
        dbuser = "vivek"
        dbpasswd = "vivek123"
        #db = MySQLdb.connect(host=dbhost, user=dbuser, passwd=dbpasswd, charset='utf8')
        db = dbInitialize(db='wasan', charset="utf8")  # The rest is updated automatically in the function
        cur=db.cursor()
        db.autocommit(True)
        query="SET NAMES utf8"
        cur.execute(query)
        query="use wasan"
        cur.execute(query)
        query = "show tables"
        cur.execute(query)
        results = cur.fetchall()
        table_names = []
        for row in results:
             table_names.append(row[0])
        logger.info(table_names)
       # table_names = ['blocks', 'districts', 'migrants', 'migrantshistory',   'roles', 'states', 'users']
       # table_names = ["roles"]
        for table_name in table_names:
            csv_array = []
            logger.info(table_name)
            query = f"SHOW COLUMNS from {table_name};"
            cur.execute(query)
            results = cur.fetchall()
            column_headers = []
            for row in results:
                 column_headers.append(row[0])
            logger.info(column_headers)
            query = f"select * from {table_name};"
            cur.execute(query)
            results = cur.fetchall()
            for row in results: 
                a = []
                for item in row:
                    item = str(item).replace(",", "")
                    a.append(item)
                csv_array.append(a)
            df = pd.DataFrame(csv_array, columns=column_headers)
            df.to_csv(f"/tmp/wasan/{table_name}.csv")
    if args['importRegions']:
        logger.info("importing regions")
        df = pd.read_csv("../import_data/states.csv")
        for index, row in df.iterrows():
            name = row['state']
            myreg = Region.objects.filter(name=name).first()
            if myreg is None:
                Region.objects.create(name=name)
    logger.info("...END PROCESSING")

if __name__ == '__main__':
    main()
