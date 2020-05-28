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
from baseapp.models import Entity, EntityHistory, Request
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
    parser.add_argument('-ir', '--importRequests', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-io', '--importOrgs', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-pd', '--populateDistricts', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-iu', '--importUsers', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-cue', '--connectUsersEntity', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-isu', '--importSwanUsers', help='Import',
                        required=False, action='store_const', const=1)
    parser.add_argument('-ire', '--importRegions', help='Import',
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
def create_entity(logger, record, wasan_id=None, user=None, assigned_to_group=None,
                  usergroup=None, backend_remarks=None, assigned_to_user=None):
    #logger.info(f"my user is {myUser.id}")
    if usergroup is None:
        usergroup = "wassan"
    obj = None
    if wasan_id is not None:
        obj = Entity.objects.filter(wassan_id=wasan_id).first()
    if obj is None:
        obj = Entity.objects.create(title="blankNewItem")

    obj.wassan_id = wasan_id
    obj.record_type = 'helpseekers'
    obj.form_ui = False
    obj.user = user
    obj.updated_by_user = user
    obj.assigned_to_user = assigned_to_user
    obj.assigned_to_group = assigned_to_group
    obj.backend_notes = backend_remarks

    for key, value in record.items():
        if key == "assigned_to_user":
            continue
        setattr(obj,key,value)

    name = record.get('full_name', '')
    address = record.get('address','')
    title = f"{name}, {address}"
    title = title.replace('nan', '')
    title = title.replace('  ', ' ')
    title = str(title)
    title = title[:255]
    if not (isinstance(obj.how_many_people, int)):
        obj.how_many_people = None
    obj.name = title
    obj.title = title
    phone = record.get('phone',None)
    if phone is None:
        contact_numbers = obj.contact_numbers
        #logger.info(contact_numbers)
        if contact_numbers is not None:
            contact_array = contact_numbers.split(",")
            #logger.info(contact_array)
            if len(contact_array) >= 1:
                phone = contact_array[0]
    obj.phone = phone
    
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
    obj.remarks = remarks
    obj.what_help = help_sought(obj.prefill_json)
    if not isinstance(obj.latitude, float):
        obj.latitude = None
    if not isinstance(obj.longitude, float):
        obj.longitude = None
    
    keywords = f"{obj.title},{obj.phone},{obj.email},{obj.contact_numbers}"
    obj.keywords = keywords
    obj.save()
    return obj.id
    #logger.info(obj.phone)
    #create_history(obj, myUser)
def main():
    """Main Module of this program"""
    args = args_fetch()
    logger = logger_fetch(args.get('log_level'))

    if args['importSwanUsers']:
        logger.info("Importing swan users")
        df = pd.read_csv("../import_data/swan_users_26may20.csv")
        swanteam = Team.objects.filter(name="swanteam").first()
        myorg = Organization.objects.filter(name="swan").first()
        for index, row in df.iterrows():
            email = row['email']
            name = row['name']
            team = str(row['team']).lstrip().rstrip()
            if ((team != '') and (team != "nan")):
                myteam = Team.objects.filter(organization=myorg,
                                             name=team).first()
                if myteam is None:
                    myteam = Team.objects.create(organization=myorg, name=team)
            else:
                myteam = swanteam
            if isinstance(email, str):
                if "@" in email:
                    password = User.objects.make_random_password()
                    password = 'test123'
                    logger.info(f"{index} email is {email} and password is {password}")
                    myuser = User.objects.filter(email=email).first()
                    if myuser is None:
                        myuser = User.objects.create(email=email,name=name)
                    myuser.team = myteam
                    myuser.name = name
                    myuser.phone = ''
                    myuser.formio_usergroup = "swan"
                    myuser.user_role = 'groupadmin'
                    myuser.organization = myorg
                    myuser.set_password(password) 
                    myuser.is_locked=False
                    myuser.login_attempt_count=0
                    myuser.save()
           
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
           
    if args['importRequests']:
        with open('../import_data/support_requests_24may20.json', 'r') as f:
                records = json.load(f)

        for i,record in enumerate(records):
            logger.info(record)
            try:
                email = record['extra_fields']['email']
            except:
                email = None
            try:
                amount_needed = record['prefill_json']['data']['totalcost']
            except:
                amount_needed = '0'
            amount_needed = int(amount_needed.replace(",",""))
            prefill_json = record['prefill_json']
            extra_fields = record['extra_fields']
            myuser = None
            if email is not None:
                myuser = User.objects.filter(email=email).first()
            
            if myuser is not None:
                myorg = myuser.organization
                logger.info(f"{i}-{myuser.email}-{myorg.name}--{amount_needed}")
                title = f"{i}-request from {myorg.name}"
                obj = Request.objects.filter(title=title).first()
                if obj  is None:
                    obj = Request.objects.create(title=title)
                obj.user = myuser
                obj.organization = myorg
                obj.amount_needed = amount_needed
                obj.amount_pending = amount_needed
                obj.amount_pledged = 0
                obj.save()
                try:
                    obj.prefill_json = prefill_json
                    obj.data_json = prefill_json['data']
                    obj.extra_fields = extra_fields
                    obj.save()
                except:
                    logger.info("count not prefill")
    if args['importEntities']:
        #For import on 26may 2020 for swan   StratID = 48913
        superadminuser = User.objects.filter(id=1).first()
        superadminuser = User.objects.filter(email='sakinahnd@gmail.com').first()
        swanteam = Team.objects.filter(name = "swanteam").first()
       #with open('../import_data/2020-05-22_SWAN_Data.json', 'r') as f:
       #    #data = f.read().replace(': NaN,', ': "",').replace(': NaN',':""').replace(',NaN',',""')
       #    data = f.read().replace('NaN','""')
       #with open('/tmp/a.json', 'w') as f:
       #    f.write(data)
       #exit(0)
        with open('../import_data/swan_final_import_26may20.json', 'r') as f:
                records = json.load(f)
        backend_remarks = "Imported Swan Data on 26 May 2020"
        usergroup = "swan"
        base_number = 260520 * 10000
        for i,record in enumerate(records):
            try:
                email = record["extra_fields"]["common"]["user_email"]
                volunteer  = User.objects.filter(email=email).first()
            except:
                volunteer = None
            creator = superadminuser
            team = None
            if volunteer is not None:
                creator = volunteer
                team = volunteer.team
            if team is None:
                team = swanteam
            
            sr_no = base_number + i
            obj_id = create_entity(logger, record, user=creator,
                                   assigned_to_user=volunteer,
                                  assigned_to_group=team, wasan_id=sr_no,
                                   backend_remarks=backend_remarks,
                                   usergroup=usergroup)
            logger.info(f"{i}-{obj_id} creator-{creator} assigned-{volunteer}")
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
    if args['importOrgs']:
        df = pd.read_csv("../import_data/requests_24may20.csv")
        df = df.fillna("")
        password = '123456'
        for index, row in df.iterrows():
            logger.info(index)
            org = row.get('org', None)
            phone = row.get('phone', None)
            try:
                phone = str(int(phone))
            except:
                phone = ''
            email = row.get('email', None)
            name = row.get('name', None)
            if name is None:
                name = org
            logger.info(f"{index}-{org}-{name}-{email}-{phone}")
            if org is not None:
                myorg = Organization.objects.filter(name = org).first()
                if myorg is None:
                    myorg = Organization.objects.create(name = org)
                myorg.contact_phone = phone
                myorg.contact_name = name
                phone_array = [phone]
                data_json = {
                   "contactName" : name,
                    "organization" : org,
                    "mobile" : phone_array
                }
                
                myorg.data_json = data_json
                myorg.save()
                myTeam = Team.objects.filter(name=org).first()
                if myTeam is None:
                    myTeam = Team.objects.create(name=org, organization=myorg)
                myTeam.organization = myorg
                myTeam.save()
            if email is not None:
                myUser = User.objects.filter(email=email).first()
                if myUser is None:
                    myUser = User.objects.create(email=email, name=name)
                myUser.name = name
                myUser.organization = myorg
                myUser.team = myTeam
                myUser.phone = phone
                myUser.user_role = "groupadmin"
                myUser.set_password(password) 
                myUser.save()
    if args['test']:
        objs = Entity.objects.filter(assigned_to_group__organization__name = "swan")
        logger.info(len(objs))
        for obj in objs:
            logger.info(obj.id)
            obj.delete()
        exit(0)
        objs = Entity.objects.filter(information_source__icontains = 'APPI')
        i = 0
        for obj in objs:
            i = i + 1
            logger.info(f"{i}-{obj.record_type}-{obj.information_source}")
        exit(0)
        df = pd.read_csv("/tmp/requests.csv")
        logger.info(df.columns)
        password = "covid@19"
        for index, row in df.iterrows():
            logger.info(index)
            org = row.get('org', None)
            phone = row.get('phone', None)
            email = row.get('email', None)
            total = row.get('total', None)
            remarks = row.get('remarks', None)
            logger.info(remarks)
            if org is not None:
                myorg = Organization.objects.filter(name = org).first()
                if myorg is None:
                    myorg = Organization.objects.create(name = org)
                myorg.contact_phone = phone
                myorg.save()
            if email is not None:
                myUser = User.objects.filter(email=email).first()
                if myUser is None:
                    myUser = User.objects.create(email=email, name=org)
                myUser.organization = myorg
                myUser.user_role = "volunteer"
                myUser.set_password(password) 
                myUser.save()
                logger.info(f"Created user {myUser.id}")
            try:
                total = int(total)
            except:
                total = ''
            if isinstance(total, int):
                req_title = f"request from {org}-{index}"
                my_req = Request.objects.filter(title = req_title).first()
                if my_req is None:
                    my_req = Request.objects.create(title = req_title)
                my_req.amount_needed = total
                my_req.organization = myorg
                my_req.user = myUser
                my_req.amount_pending = total
                my_req.amount_pledged = 0
                my_req.notes = remarks
                my_req.save()
        exit(0)
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
