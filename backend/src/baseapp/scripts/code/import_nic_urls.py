"""Blank file which can server as starting point for writing any script file"""
import os
import sys
import argparse
import pandas as pd
import django
from django.utils.text import slugify
from commons import logger_fetch
from defines import DJANGO_SETTINGS, STATE_SHORT_CODE_DICT
os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
django.setup()
from nrega.models import Location, Report

def args_fetch():
    '''
    Paser for the argument list that returns the args list
    '''

    parser = argparse.ArgumentParser(description=('This is blank script',
                                                  'you can copy this base script '))
    parser.add_argument('-l', '--log-level', help='Log level defining verbosity', required=False)
    parser.add_argument('-iru', '--import_rejected_urls',
                        help='Import rejected URls',
                        required=False, action='store_const', const=1)
    parser.add_argument('-t', '--test', help='Test Loop',
                        required=False, action='store_const', const=1)
    parser.add_argument('-ti1', '--testInput1', help='Test Input 1', required=False)
    parser.add_argument('-ti2', '--testInput2', help='Test Input 2', required=False)
    args = vars(parser.parse_args())
    return args


def main():
    """Main Module of this program"""
    args = args_fetch()
    logger = logger_fetch(args.get('log_level'))
    if args['test']:
        logger.info("Testing phase")
    if args['import_rejected_urls']:
        logger.info("Going to import Rejected URls")
        state_codes = []
        objs = Location.objects.filter(location_type='state')
        for obj in objs:
            state_codes.append(obj.code)
        for state_code in state_codes:
            if state_code != '34':
                file_path = f"../import_data/rejected_url_data/{state_code}.csv"
                dataframe = pd.read_csv(file_path)
                for index, row in dataframe.iterrows():
                    location_code = row['code']
                    report_type = row['report_type']
                    finyear = row['finyear']
                    report_url = row['report_url']
                    my_location = Location.objects.filter(code=location_code
                                                         ).first()
                    if my_location is not None:
                        my_report = Report.objects.create(location=my_location,
                                                          finyear=finyear,
                                                          report_type=report_type,
                                                          report_url=report_url)
                        logger.info(f" Created report {my_report.id}")
    logger.info("...END PROCESSING")

if __name__ == '__main__':
    main()
