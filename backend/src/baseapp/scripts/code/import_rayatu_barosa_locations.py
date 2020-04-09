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
from nrega.models import Location

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
        logger.info("Testing phase")
        scheme = "rayatubarosa"
        vskp_code = '520'
        vskp_location = Location.objects.filter(scheme=scheme,
                                              code=vskp_code).first()
        logger.info(vskp_location.id)
        vskp_block_url = "https://libtech-india-data.s3.ap-south-1.amazonaws.com/data/locations/rayatu_barosa/vskp_blocks.csv"
        vskp_village_url = "https://libtech-india-data.s3.ap-south-1.amazonaws.com/data/locations/rayatu_barosa/vskp_villages.csv"
        village_df = pd.read_csv(vskp_village_url)
        logger.info(village_df.columns)
        total = len(village_df)
        for index, row in village_df.iterrows():
            block_code = str(int(row['mandal_code']))
            village_code = str(int(row['village_code']))
            logger.info(f"{index}-{total}-{block_code}-{village_code}")
            village_name = row['village_name_telugu']
            english_name = ms_transliterate_word(logger, village_name,
                                                 lang_code='te',
                                                 script_code='Telu'
                                                )
            parent_location = Location.objects.filter(scheme=scheme,
                                                      code=block_code).first()
            my_location = Location.objects.filter(scheme=scheme,
                                                  code=village_code).first()
            if my_location is None:
                my_location = Location.objects.create(scheme=scheme,
                                                      code=village_code,
                                                      name=village_name)
            my_location.parent_location=parent_location
            parent_display_name = parent_location.display_name
            my_location.location_type = "village"
            my_location.state_name = 'Andhra Pradesh'
            my_location.state_code = '28'
            my_location.district_code = parent_location.parent_location.code
            my_location.district_name = parent_location.parent_location.name
            my_location.block_code = parent_location.code
            my_location.block_name = parent_location.name
            my_location.name_not_english = True
            my_location.english_name = english_name
            my_location.display_name = f"{parent_display_name}-{english_name.title()}"
            slug = slugify(english_name)
            my_location.slug = slug
            my_location.save()

            

        block_df = pd.read_csv(vskp_block_url)
        logger.info(block_df.columns)
        for index, row in block_df.iterrows():
            block_code = str(int(row['mandal_code']))
            english_name = row['mandal_name_eng']
            block_name = row["block_name_telugu"]
            logger.info(block_code)
            my_location = Location.objects.filter(scheme=scheme,
                                                  code=block_code).first()
            if my_location is None:
                my_location = Location.objects.create(scheme=scheme,
                                                      code=block_code,
                                                      name=block_name)
            my_location.parent_location=vskp_location
            parent_display_name = vskp_location.display_name
            my_location.state_code = '28'
            my_location.state_name = 'Andhra Pradesh'
            my_location.district_code = vskp_location.code
            my_location.district_name = vskp_location.name
            my_location.location_type = "block"
            my_location.block_code = block_code
            my_location.block_name = block_name
            my_location.name_not_english = True
            my_location.english_name = english_name
            my_location.display_name = f"{parent_display_name}-{english_name.title()}"
            slug = slugify(english_name)
            my_location.slug = slug
            my_location.save()

            
    logger.info("...END PROCESSING")

if __name__ == '__main__':
    main()
