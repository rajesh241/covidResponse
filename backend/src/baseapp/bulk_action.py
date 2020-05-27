"""This is the module to define Bulk Actions"""
from django.contrib.auth import get_user_model, authenticate
from baseapp.models import Entity, Request, Pledge
from core.models import Team, Organization
from django.conf import settings
import boto3
from io import StringIO
import datetime
import pandas as pd
User = get_user_model()

def perform_bulk_action(data, user):
    is_superuser = False
    if ( (user.is_staff) or (user.user_role == "usergroupadmin")):
        is_superuser = True
    ids_json = data.get("ids_json", None)
    if ids_json is None:
        return
    id_array = ids_json.get("ids", None)
    if id_array is None:
        return
    formio_json = data.get("data_json", None)
    if formio_json is None:
        return
    print(id_array)
    bulk_action = data.get("bulk_action", None)
    if bulk_action == "endorse":
        print("I am in bulk action endorse")
        user_id = formio_json.get("user", None)
        if user_id is None:
            return
        if user_id == '':
            myuser = None
        else:
            myuser = User.objects.filter(id=user_id).first()
        if myuser is None:
            return
        for each_id in id_array:
            obj = Organization.objects.filter(id=each_id).first()
            if obj.endorsed_by is None:
                endorsed_by_array = []
            else:
                endorsed_by_array = obj.endorsed_by.split(",")
            print(f"endorsed by array is {endorsed_by_array}")
            if str(myuser.id) not in endorsed_by_array:
                endorsed_by_array.append(myuser.id)
            endorsed_by = ''
            for elem in endorsed_by_array:
                endorsed_by = f"{endorsed_by},{elem}"
            endorsed_by = endorsed_by.lstrip(",")
            obj.endorsed_by = endorsed_by
            obj.total_endorsed = len(endorsed_by_array)
            obj.save()
    if bulk_action == "pledge":
        print("I am Pledge Amount")
        user_id = formio_json.get("user", None)
        amount = int(formio_json.get("amount", 0))
        if user_id is None:
            return
        if user_id == '':
            myuser = None
        else:
            myuser = User.objects.filter(id=user_id).first()
        if myuser is None:
            return
        for each_id in id_array:
            obj = Request.objects.filter(id=each_id).first()
            pending = obj.amount_pending
            if amount >= pending:
                donation = pending
            else:
                donation = amount
            amount = amount - donation
            obj.amount_pending = pending - donation
            obj.amount_pledged = obj.amount_pledged + donation
            obj.save()
            if donation > 0:
                myPledge = Pledge.objects.create(user=myuser, request=obj,
                                                 amount_pledged=donation)
            if amount == 0:
                break
            
    if bulk_action == "assigntovolunteer":
        print("I am in assign volunteer")
        user_id = formio_json.get("assigntovolunteer", None)
        if user_id is None:
            return
        if user_id == '':
            myuser = None
        else:
            myuser = User.objects.filter(id=user_id).first()
        for each_id in id_array:
            obj = Entity.objects.filter(id=each_id).first()
            if obj is not None:
                if myuser is None:
                    obj.assigned_to_user = None
                else:
                    extra_fields = obj.extra_fields
                    extra_fields['assigned_to_volunteer'] = myuser.name
                    obj.extra_fields = extra_fields
                    obj.assigned_to_user = myuser
                    if myuser.team is not None:
                        obj.assigned_to_group = myuser.team
                obj.updated_by_user = user
                obj.save()
    if bulk_action == "export":
        filename = formio_json.get("filename", None)
        if filename is None:
            return
        queryset = Entity.objects.filter(id__in = id_array)
        export_entities(queryset, filename)
        
    if bulk_action == "assigntogroup":
        print("I am in assign group")
        input_id = formio_json.get("assigntogroup", None)
        if input_id is None:
            return
        if input_id == '':
            myobj = None
        else:
            myobj = Team.objects.filter(id=input_id).first()
        for each_id in id_array:
            obj = Entity.objects.filter(id=each_id).first()
            if obj is not None:
                if ( (obj.assigned_to_group is None) or (is_superuser == True)):
                    if myobj is None:
                        obj.assigned_to_group = None
                    else:
                        extra_fields = obj.extra_fields
                        extra_fields['assigned_to_group'] = myobj.name
                        obj.extra_fields = extra_fields
                        obj.assigned_to_group = myobj
                        if obj.assigned_to_user is not None:
                            if obj.assigned_to_user.team != obj:
                                obj.assigned_to_user = None
                    obj.updated_by_user = user
                    obj.save()

    if bulk_action == "assigntoorg":
        print("I am in assign volunteer")
        try:
            entity_json = formio_json.get("assigntoorg", None)
            print(entity_json)
            entity_id = entity_json.get("id", None)
            print(entity_id)
            myentity = Entity.objects.filter(id=entity_id).first()
        except:
            myentity = None
        if myentity is None:
            return
        print(f"myentity is {myentity.id}")
        for each_id in id_array:
            obj = Entity.objects.filter(id=each_id).first()
            if obj is not None:
                extra_fields = obj.extra_fields
                extra_fields['assigned_to_org'] = myentity.title
                obj.extra_fields = extra_fields
                obj.assigned_to_org = myentity
                obj.save()

def export_pledges(filename=None):
    csv_array = []
    columns = ["srno", "id", "org", "reqid", "org email", "org contact", "amount", "donor name",
               "donor email", "donor phone"]
    queryset = Pledge.objects.all()
    srno = 0
    for obj in queryset:
        srno = srno + 1
        org = ''
        orgphone = ''
        reqid = ''
        orgemail = ''
        if obj.request is not None:
            reqid = obj.request.id
            if obj.request.organization is not None:
                org = obj.request.organization.name
                orgphone = obj.request.organization.contact_phone
        
        if obj.user is not None:
            username = obj.user.name
            useremail = obj.user.email
            userphone = obj.user.phone
        else:
            username = ''
            useremail = ''
            userphone = ''
        a = [srno, obj.id, org, reqid, orgemail, orgphone, obj.amount_pledged,
             username, useremail, userphone]
        csv_array.append(a)
    df = pd.DataFrame(csv_array, columns=columns)
    filename = f"export/pledges.csv"
    file_url = upload_s3(filename, df)

def export_requests(filename=None):
    csv_array = []
    queryset = Request.objects.filter(id__gt = 1).order_by('-id')
    srno = 0
    for obj in queryset:
        # print(f'data_json[{obj.data_json}]')
        srno = srno + 1
        if obj.organization is not None:
            orgname = obj.organization.name
            has_12A = obj.organization.has_12A
            has_FCRA = obj.organization.has_FCRA
            has_GST = obj.organization.has_GST
            orgphone = obj.organization.contact_phone
        else:
            orgname = ''
            orgphone = ''
            has_12A = ''
            has_FCRA = ''
            has_GST = ''
        if obj.user is not None:
            username = obj.user.name
            useremail = obj.user.email
        else:
            username = ''
            useremail = ''

        try:
            district = obj.data_json['origin']['district_name']
        except Exception as e:
            district = ''
            #print(f'Exception[{e}]')
            
        try:
            dest_district = obj.data_json['destinationdistrict']['district_name']            
        except Exception as e:
            dest_district = ''

        try:
            dod = obj.data_json['dateofdeparture']
        except Exception as e:
            dod = ''
            
        try:
            distance = obj.data_json['distance']
        except Exception as e:
            distance = ''
            
        try:
            numPassengers = obj.data_json['numPassengers']
        except Exception as e:
            numPassengers = ''

        try:
            busesRequired = obj.data_json['busesRequired']
        except Exception as e:
            busesRequired = ''

        try:
            total_cost = obj.data_json['totalcost']
        except Exception as e:
            total_cost = ''
            
        a = [
            srno, obj.id, orgname, username, orgphone, useremail, obj.amount_needed,
            obj.amount_pledged, obj.amount_pending, district, dest_district, has_12A,
            has_FCRA, has_GST, dod, numPassengers, busesRequired, distance, total_cost,
        ]
        csv_array.append(a)
        #print(csv_array)

    columns = [
        "srno", "id", "org", "contat name", "contact phone", "email",
        "totalamount", "pledged", "pending",
        "Origin District", "Dest. District",
        "12A", "FCRA", "GST", "Date Of Departure",
        "No of Passengers", "busesRequired", "Distance", "Total Cost",
    ]
    df = pd.DataFrame(csv_array, columns=columns)
    filename = f"export/funding.csv"
    file_url = upload_s3(filename, df)

def export_entities(queryset, filename, bulk_export=False):
        csv_array = []
        columns = ['ID', 'Urgency', 'Status', 'Assigned to', 'Remarks',
                   'Connected with Govt Scheme', 'Team Name', 'Organisation Name',
                   'Contact', 'Mobile', 'Help Expected', 'Stranded State',
                   'Stranded District', 'StrandedBlock', 
                   'Stranded City/Panchayat', 'Stranded Address', 'Native State', 
                   'Native District', 'People Stranded', 'Date Called', 'Contact with Govt Official', 'Contact with anyone', 'Accom for 14 days',
                   'If no', ' Where are you staying"', 'Ration', 'Ration Desc', 'Drinking Water', 'Health Issues', 
                   'Health Issue Desc', 'Urgent Req', 'Need Cash', 'How Much', 'Urgent Req Desc', 'Donor Involved', 'Donor Name', 'Type Of donation',
                   'Donation Value(Rs))', 'Initial Date', 'created', 'modified']
        for obj in queryset:
            a = [obj.title, obj.state, obj.status, obj.urgency, obj.remarks]
            if obj.assigned_to_user is not None:
                user_name = obj.assigned_to_user.name
            else:
                user_name = ''
            try:
                stranded_district = obj.prefill_json["data"]["contactForm"]["data"]["district"]
            except:
                stranded_district = ''
            if obj.assigned_to_group is not None:
                team_name = obj.assigned_to_group.name
                org_name = obj.assigned_to_group.organization.name
            else:
                org_name = ''
                team_name = ''
            government_scheme = ''
            contact = obj.full_name
            stranded_state = obj.state
           # stranded_district = ''
            stranded_block = ''
            stranded_panchayat = ''
            stranded_address = obj.address
            native_state = ''
            native_district = ''
            how_many_people = obj.how_many_people
            date_called = ''
            govt_official = ''
            contact_with_anyone = ''
            accom_for_14_days = ''
            if_no = ''
            where_are_you_staying = ''
            ration = ''
            ration_desc = ''
            drinking_water = ''
            health_issues = ''
            health_issue_description = ''
            urgent_req = ''
            need_cash = ''
            how_much = ''
            urgent_req_desc = ''
            donor_involved = ''
            donar_name = ''
            donation_type = ''
            donation_value = ''
            initial_date = ''
            created = obj.created
            modified = obj.updated

            a = [obj.id, obj.urgency, obj.status, user_name, obj.remarks,
                 government_scheme, team_name, org_name, contact, obj.phone,
                 obj.what_help, stranded_state, stranded_district,
                 stranded_block, stranded_panchayat, stranded_address, native_state,
                 native_district, how_many_people, date_called, govt_official,
                 contact_with_anyone, accom_for_14_days, if_no,
                 where_are_you_staying, ration, ration_desc, drinking_water,
                 health_issues, health_issue_description, urgent_req,
                 need_cash, how_much, urgent_req_desc, donor_involved,
                 donar_name, donation_type, donation_value, initial_date,
                 created, modified]
            csv_array.append(a)
        df = pd.DataFrame(csv_array, columns=columns)
        if bulk_export == True:
            filename = f"export/data.csv"
        else:
            filename = f"export/selected/{filename}"
        file_url = upload_s3(filename, df)
        print(file_url)

def aws_init(use_env=None):
    """Initializes the AWS bucket. It can either pick up AWS credentials from
    the environment variables or it can pick up from the profile in the .aws
    directory location in HOME Directory"""
    boto3.setup_default_session(
        aws_access_key_id=settings.AWS_KEY,
        aws_secret_access_key=settings.AWS_SECRET,
        region_name=settings.AWS_REGION
    )

    s3_instance = boto3.resource('s3', region_name=settings.AWS_REGION)
    return s3_instance
def put_object_s3(bucket, filename, filedata, content_type):
    """Putting object in amazon S3"""
    bucket.put_object(
        Body=filedata,
        Key=filename,
        ContentType=content_type,
        ACL='public-read'
        )


def upload_s3(filename, data, bucket_name=None):
    """
    This function will upload to amazon S3, it can take data either as
    string or as data frame
       filename: filename along with file path where file needs tobe created
       for example abcd/efg/hij.csv
       data : content can be a string or pandas data frame
       bucket: Optional bucket name, in which file needs to be created else
       will default to the AWS_DATA_BUCKET
    """
    s3_instance = aws_init()
    if bucket_name is None:
        bucket_name = settings.AWS_DATA_BUCKET
    bucket = s3_instance.Bucket(bucket_name)
    if isinstance(data, pd.DataFrame):
        #If the data passed is a pandas dataframe
        #data['lastUpdateDate'] = datetime.datetime.now().date()
        csv_buffer = StringIO()
        data.to_csv(csv_buffer, encoding='utf-8-sig', index=False)
        filedata = csv_buffer.getvalue()
        content_type = 'text/csv'
        put_object_s3(bucket, filename, filedata, content_type)
    else:
        content_type = 'text/html'
        filedata = data
        put_object_s3(bucket, filename, filedata, content_type)

    report_url = f"https://{bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{filename}"

    return report_url



