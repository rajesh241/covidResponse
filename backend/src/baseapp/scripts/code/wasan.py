"""Blank file which can server as starting point for writing any script file"""
import MySQLdb
import argparse
import os
import json
import django
import pandas as pd
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from commons import logger_fetch, ms_transliterate_word
from defines import DJANGO_SETTINGS, STATE_SHORT_CODE_DICT
os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
django.setup()
from core.models import Region
from baseapp.models import Entity

User = get_user_model()
from core.models import Group, Region
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
    parser.add_argument('-ie', '--importEntities', help='Import',
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

def create_entity(logger, record, myUser):
    # This has to go as a string
    # extra_fields = str(record['extra_fields'])
    # revised['extra_fields'] = extra_fields
    obj = Entity.objects.create(title="blankNewItem")
    obj.user = myUser
    for key, value in record.items():
        setattr(obj,key,value)
    obj.record_type = 'helpseekers'
    # False if it does not come via formio
    obj.form_ui = False
    name = record['full_name']
    title = f"{name}, {record['address']}"
    title = title.replace('nan', '')
    title = title.replace('  ', ' ')
    if not (isinstance(obj.how_many_people, int)):
        obj.how_many_people = None
    obj.name = title
    obj.title = title
    obj.phone = record['mobile']
    obj.backend_notes = 'Added from a dump of 20k plus records from Min on 22 April.'
    
    # entity_status = status[random.randint(0,len(status)-1)]
    if isinstance(record['extra_fields'], str):
        extra_fields = json.loads(record['extra_fields'].replace("'", '"'))
    else:
        extra_fields = record['extra_fields']
    # extra_fields['status'] = entity_status    
    obj.extra_fields = extra_fields
    obj.formio_usergroup = 'wassan'
    obj.region = record['state']
    obj.save()
def main():
    """Main Module of this program"""
    args = args_fetch()
    logger = logger_fetch(args.get('log_level'))
    if args['connectUsersEntity']:
        objs = Entity.objects.filter(formio_usergroup = "wassan")
        for obj in objs:
            extra_fields = obj.extra_fields
            try:
                wasan_user_id = obj.extra_fields['common']['assigned_to_id']
            except:
                wasan_user_id = None
            myUser = User.objects.filter(region=wasan_user_id).first()
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
        df = pd.read_csv("../import_data/wassan_users.csv")
        for index, row in df.iterrows():
            wasan_id = row['Id']
            name = row['FullName']
            email = row['Username']
            if "@" not in email:
                email = f"{email}@abcd.com"
            password = row['Password']
            role_id = row['RoleId']
            group_name = row['OrganizationName']
            phone = row['Mobile']
            myGroup = Group.objects.filter(name=group_name).first()
            if myGroup is None:
                myGroup = Group.objects.create(name=group_name)
            myuser = User.objects.filter(email=email).first()
            if myuser is None:
                myuser = User.objects.create(email=email)
          #  myuser.group = myGroup
            myuser.name = name
            myuser.set_password(password) 
            myuser.phone = phone
            myuser.region = wasan_id#Temporary
            user_role = role_dict.get(str(role_id), "volunteer")
            myuser.user_role = user_role
            myuser.formio_usergroup = 'wassan'
            myuser.save()
           


    if args['importEntities']:
        objs = Entity.objects.filter(formio_usergroup = "wassan")
        for obj in objs:
            logger.info(obj.id)
            obj.delete()
        logger.info("Importing Entities")
        my_user = User.objects.filter(id=1).first()
        with open('../import_data/wassan_dump.json', 'r') as f:
                records = json.load(f)
        for i,record in enumerate(records):
            logger.info(i)
            create_entity(logger, record, my_user)
        usergroup = "wassan"
        
    if args['test']:
        csv_array = []
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
