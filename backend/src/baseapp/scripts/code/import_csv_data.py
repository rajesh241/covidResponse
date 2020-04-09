"""Blank file which can server as starting point for writing any script file"""
import argparse
import os
import django
import pandas as pd
from django.utils.text import slugify
from commons import logger_fetch, ms_transliterate_word
from defines import DJANGO_SETTINGS, STATE_SHORT_CODE_DICT
os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
django.setup()
from baseapp.models import Entity

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
    parser.add_argument('-fn', '--filename', help='filename to be imported', required=False)
    parser.add_argument('-ti2', '--testInput2', help='Test Input 2', required=False)
    args = vars(parser.parse_args())
    return args


def main():
    """Main Module of this program"""
    args = args_fetch()
    logger = logger_fetch(args.get('log_level'))
    if args['test']:
        facility_json = '{"_id":"5e8a81632776ff4e9ea73357","type":"resource","tags":["common"],"owner":"5e8a3d7bf1f3d54924170187","components":[{"autofocus":false,"input":true,"tableView":true,"inputType":"radio","label":"Is this facility functional?","key":"facilityFunctional","values":[{"value":"yes","label":"Yes","shortcut":"Y"},{"value":"no","label":"No","shortcut":"N"}],"defaultValue":"","protected":false,"fieldSet":false,"persistent":true,"hidden":false,"clearOnHide":true,"validate":{"required":false,"custom":"","customPrivate":false},"type":"radio","labelPosition":"top","optionsLabelPosition":"right","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{},"lockKey":true},{"autofocus":false,"input":true,"label":"Submit","tableView":false,"key":"submit","size":"md","leftIcon":"","rightIcon":"","block":false,"action":"submit","disableOnInvalid":false,"theme":"primary","type":"button"}],"display":"form","submissionAccess":[{"roles":["5e8a3d73f1f3d5492417017a"],"type":"create_own"},{"roles":["5e8a3d73f1f3d5492417017a"],"type":"read_own"},{"roles":["5e8a3d73f1f3d5492417017a"],"type":"update_own"},{"roles":["5e8a3d73f1f3d5492417017a"],"type":"delete_own"}],"title":"Help facilities","name":"helpFacilities","path":"map/facility","access":[{"roles":["5e8a3d73f1f3d54924170179","5e8a3d73f1f3d5492417017a","5e8a3d73f1f3d5492417017b"],"type":"read_all"}],"created":"2020-04-06T01:09:55.726Z","modified":"2020-04-06T01:10:33.874Z","machineName":"helpFacilities"}'
        logger.info("Testing")
        objs = Entity.objects.all()
        for obj in objs:
            record_type = obj.record_type
            if record_type == "facility":
                obj.feedback_form_json = facility_json
                obj.save()
        exit(0)
    if args['import']:
        data_dir = "../import_data"
        failed_index_array = []
        filename = args['filename']
        filepath = f"{data_dir}/{filename}"
        df = pd.read_csv(filepath)
        logger.info(df.head())
        record_type = "volunteer"
        icon_url = "./assets/blue-dot.png"
        record_subtype = "orgization NGO"
        for index, row in df.iterrows():
            create_record = False
            place_status = row.get("places_status", None)
            if place_status == "OK":
                create_record = True
            name = row.get("Name", None)
            description =row.get("Work Willing To Do", "")
            latitude = row.get("lat", None)
            longitude = row.get("lng", None)
            information_source = row.get("Source of Information", None)
            contact_numbers = row.get("Phone", None)
            remarks = row.get("Comments", None)
            try:
                obj = Entity.objects.filter(name=name,
                                             record_type=record_type).first()
                if obj is None:
                    obj = Entity.objects.create(name=name,
                                                 description=description,
                                                 record_type=record_type)
                obj.latitude = latitude
                obj.longitude = longitude
                obj.description = description
                obj.record_subtype = record_subtype
                obj.icon_url = icon_url
                obj.remarks = remarks
                obj.information_source = information_source
                obj.contact_numbers = contact_numbers
                obj.save()
            except:
                failed_index_array.append(index)
        logger.info(f"failed index is {failed_index_array}")

            
        exit(0)
        record_type = "facility"
        icon_url = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        record_subtype = "Indira Food Canteen"
        for index, row in df.iterrows():
            create_record = False
            place_status = row.get("places_status", None)
            if place_status == "OK":
                create_record = True
            name = row.get("Ward No and Loc", None)
            latitude = row.get("lat", None)
            longitude = row.get("lng", None)
            zone = row.get("Zone", "")
            constituency = row.get("Constituency", "")
            address = row.get("address_to_use", "")
            description = f"Zone:{zone} constituency:{constituency} ward:{name} addresss:{address}"
            try:
                obj = Entity.objects.filter(name=name,
                                             record_type=record_type).first()
                if obj is None:
                    obj = Entity.objects.create(name=name,
                                                 description=description,
                                                 record_type=record_type)
                obj.latitude = latitude
                obj.longitude = longitude
                obj.description = description
                obj.record_subtype = record_subtype
                obj.icon_url = icon_url
                obj.save()
            except:
                failed_index_array.append(index)
        logger.info(f"failed index is {failed_index_array}")


        exit(0)
        record_subtype = "Delhi Govt Food Facility"
        description = "Delhi Government food facility"
        icon_url = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        for index, row in df.iterrows():
            create_record = False
            name = row.get("Description", None)
            latitude = row.get("Where is it located.lat", None)
            longitude = row.get("Where is it located.lon", None)
            information_source = row.get("source", None)
            logger.info(name)
            logger.info(latitude)
            logger.info(longitude)
            logger.info(information_source)
            if ( isinstance(latitude, float) and isinstance(longitude, float)):
                create_record = True
            try:
                obj = Entity.objects.filter(name=name,
                                             record_type=record_type).first()
                if obj is None:
                    obj = Entity.objects.create(name=name,
                                                 description=description,
                                                 record_type=record_type)
                obj.latitude = latitude
                obj.longitude = longitude
                obj.information_source = information_source
                obj.record_subtype = record_subtype
                obj.icon_url = icon_url
                obj.save()
            except:
                failed_index_array.append(index)
        logger.info(f"failed index is {failed_index_array}")
            
    logger.info("...END PROCESSING")

if __name__ == '__main__':
    main()
