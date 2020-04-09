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
from baseapp.models import Context

def args_fetch():
    '''
    Paser for the argument list that returns the args list
    '''

    parser = argparse.ArgumentParser(description=('This is blank script',
                                                  'you can copy this base script '))
    parser.add_argument('-l', '--log-level', help='Log level defining verbosity', required=False)
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
        logger.info("Testing")
        objs = Context.objects.all()
        for obj in objs:
            logger.info(obj.id)
            
    logger.info("...END PROCESSING")

if __name__ == '__main__':
    main()
