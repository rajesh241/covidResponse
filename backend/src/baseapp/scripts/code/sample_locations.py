"""Blank file which can server as starting point for writing any script file"""
import argparse
import random
import os
import django
import pandas as pd
from django.utils.text import slugify
from commons import logger_fetch, ms_transliterate_word
from defines import DJANGO_SETTINGS, STATE_SHORT_CODE_DICT
os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
django.setup()
from nrega.models import Location, LibtechTag

from commons import logger_fetch

def args_fetch():
    '''
    Paser for the argument list that returns the args list
    '''

    parser = argparse.ArgumentParser(description=('This is blank script',
                                                  'you can copy this base script '))
    parser.add_argument('-l', '--log-level', help='Log level defining verbosity', required=False)
    parser.add_argument('-t', '--test', help='Test Loop',
                        required=False, action='store_const', const=1)
    parser.add_argument('-s', '--sample', help='sample locations',
                        required=False, action='store_const', const=1)
    parser.add_argument('-sn', '--sampleName', help='Sample Name/tag', required=False)
    parser.add_argument('-sc', '--scheme', help='Government Scheme', required=False)
    parser.add_argument('-p', '--percentage', help='Sample Percentag', required=False)
    parser.add_argument('-lt', '--locationType', help='Location Type', required=False)
    args = vars(parser.parse_args())
    return args


#itda_block_codes = ["4845", "4844", "4849", "4843",
#                            "4848", "4850", "4846", "4851",
#                            "4841", "4847", "4842"]
def main():
    """Main Module of this program"""
    args = args_fetch()
    logger = logger_fetch(args.get('log_level'))
    if args['test']:
        logger.info("Testing phase")
    if args['sample']:
        sample_name = args.get("sampleName", None)
        scheme = args.get("scheme", None)
        percentage = int(args.get("percentage", 0))
        location_type = args.get("locationType", None)
        logger.info("Sampling locations")
        itda_tag = LibtechTag.objects.filter(id=2).first()
        ltarray = [itda_tag]
        my_tag = LibtechTag.objects.filter(name=sample_name).first()
        if my_tag is None:
            my_tag = LibtechTag.objects.create(name=sample_name)
        ltarray = [my_tag]
        objs = Location.objects.filter(libtech_tag__in = ltarray)
        for obj in objs:
            logger.info(obj.code)
        exit(0)
        parent_objs = Location.objects.filter(libtech_tag__in=ltarray,
                                               scheme=scheme)
        for parent_obj in parent_objs:
            location_set = Location.objects.filter(parent_location=parent_obj)
            location_set_size = len(location_set)
            village_code_array = []
            for location in location_set:
                village_code_array.append(location.code)
           # logger.info(village_code_array)
            to_be_sampled = round( (percentage*location_set_size)/100 )
            village_code_sampled = random.sample(village_code_array,
                                                 to_be_sampled)
            for village_code in village_code_sampled:
                my_location = Location.objects.filter(code=village_code,
                                                      scheme=scheme).first()
                my_location.libtech_tag.add(my_tag)
                my_location.save()
            logger.info(f"{location_set_size}-{to_be_sampled}--{len(village_code_sampled)}")
    logger.info("...END PROCESSING")

if __name__ == '__main__':
    main()
