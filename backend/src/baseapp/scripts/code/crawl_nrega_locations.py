"""This module is for crawling all nrega locations"""
import os
import argparse
import urllib.parse as urlparse
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup
import django
from django.utils.text import slugify
from commons import logger_fetch, is_english, ms_transliterate_word
from defines import DJANGO_SETTINGS, STATE_SHORT_CODE_DICT
os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
django.setup()
from nrega.models import Location


def args_fetch():
    '''
    Paser for the argument list that returns the args list
    '''

    parser = argparse.ArgumentParser(description=('This script will crawl',
                                                  'nrega locations from nic'))
    parser.add_argument('-l', '--log-level', help='Log level defining verbosity', required=False)
    parser.add_argument('-c', '--crawl', help='crawl',
                        required=False, action='store_const', const=1)
    parser.add_argument('-f', '--fixfilepath', help='fix broken file paths',
                        required=False, action='store_const', const=1)
    parser.add_argument('-lt', '--location_type', help='location type', required=False)
    args = vars(parser.parse_args())
    return args


def main():
    """Main Module of this program"""
    args = args_fetch()
    logger = logger_fetch(args.get('log_level'))
    if args['fixfilepath']:
        location_type = args['location_type']
        logger.info("fixing broken file paths")
        objs = Location.objects.all()
        objs = Location.objects.filter(location_type = location_type)
        j = len(objs)
        for obj in objs:
            logger.info(f"processing j - {j}")
            j=j-1
            base_file_path = obj.parent_location.s3_filepath
            s3_filepath = f"{base_file_path[:-14]}/{obj.slug}/DATA/reports/"
            obj.s3_filepath = s3_filepath
            obj.save()

    if args['crawl']:
        scheme = 'nrega'
        location_type = args['location_type']
        logger.info(f"Crawling data for {location_type}")
        copy_from_parent = ["state_code", "state_name", "district_code", "district_name",
                            "block_code", "block_name", "panchayat_code", "panchayat_name",
                            "crawl_ip", "state_short_code"]
        if location_type == 'state':
            parent_location_type = 'country'
            code_param = 'state_code'
            name_param = 'state_name'
        elif location_type == 'district':
            parent_location_type = 'state'
            code_param = 'district_code'
            name_param = 'district_name'
        elif location_type == 'block':
            parent_location_type = 'district'
            code_param = 'Block_Code'
            name_param = 'block_name'
        elif location_type == 'panchayat':
            parent_location_type = 'block'
            code_param = 'Panchayat_Code'
            name_param = 'Panchayat_name'
        queryset = Location.objects.filter(location_type=parent_location_type)
        queryset = Location.objects.filter(location_type=parent_location_type,
                                          id__gt=1395)

        queryset = Location.objects.filter(location_type=parent_location_type,
                                           id=500)
        #queryset = Location.objects.filter(location_type=parent_location_type)[:1]
        for parent_location in queryset:
            urls_to_process = []
            base_url = parent_location.nic_url
            parent_file_path = parent_location.s3_filepath
            parent_display_name = parent_location.display_name
            logger.info(f"parent file path is {parent_file_path}")
            base_filepath = parent_file_path.rstrip('/DATA/reports/')
            logger.info(f"base_filepath is {base_filepath}")
            myhtml = None
            logger.info(f"Current Processing {base_url}")
            if 'http://nrega.nic.in' in base_url:
                base_url = base_url.replace("http","https")
            res = requests.get(base_url)
            if res.status_code == 200:
                myhtml = res.content
            if myhtml is not None:
                mysoup = BeautifulSoup(myhtml, "lxml")
                links = mysoup.findAll("a")
                for link in links:
                    href = link['href']
                    if code_param in href:
                        urls_to_process.append(href)

            for href in urls_to_process:
                parsed = urlparse.urlparse(href)
                crawl_ip = parsed.netloc
                params = urlparse.parse_qs(parsed.query)
                 #   setattr(my_location,  key.lower(), value)
                code = params[code_param][0]
                name = params[name_param][0]
                logger.info(f"{name}-{code}")
                if is_english(name):
                    name_not_english = False
                    english_name = name
                else:
                    name_not_english = True
                    #this part of script needs correction, currently it defaults to hindi
                    english_name = ms_transliterate_word(logger, name)
                my_location = Location.objects.filter(code=code, scheme=scheme).first()
                if my_location is None:
                    my_location = Location.objects.create(code=code, name=name, scheme=scheme)
                for item in copy_from_parent:
                    value = getattr(parent_location, item)
                    setattr(my_location, item, value)
                setattr(my_location, code_param.lower(), code)
                setattr(my_location, name_param.lower(), name)
                my_location.parent_location = parent_location
                if location_type == "state":
                    logger.info(f"href is {href}")
                    my_location.nic_url = href+"&lflag=eng"
                    my_location.display_name = name.title()
                    my_location.crawl_ip = crawl_ip
                    my_location.state_short_code = STATE_SHORT_CODE_DICT.get(code,
                                                                             "")
                else:
                    my_location.nic_url = urljoin(base_url, href)
                    my_location.display_name = f"{parent_display_name}-{english_name.title()}"
                my_location.location_type = location_type
                my_location.name_not_english = name_not_english
                my_location.english_name = english_name
                slug = slugify(english_name)
                my_location.slug = slug
                if my_location.state_code in ['02', '36']:
                    my_location.is_nic = False
                else:
                    my_location.is_nic = True
                filepath = f"{base_filepath}/{slug}/DATA/reports/"
                logger.info(f"file paht is {filepath}")
                my_location.s3_filepath = filepath
                my_location.save()

    logger.info("...END PROCESSING")

if __name__ == '__main__':
    main()
