import os
import sys
import csv
import requests
from bs4 import BeautifulSoup
import urllib.parse as urlparse
import pandas as pd
fileDir = os.path.dirname(os.path.realpath(__file__))
rootDir=fileDir+"/../../../"
sys.path.insert(0, rootDir)
from config.defines import djangoSettings
from commons import loggerFetch
import django
from django.core.wsgi import get_wsgi_application
from django.core.files.base import ContentFile
from django.utils import timezone
from django.db.models import F,Q,Sum,Count
os.environ.setdefault("DJANGO_SETTINGS_MODULE", djangoSettings)
django.setup()

from nrega.models import Location

def argsFetch():
  '''
  Paser for the argument list that returns the args list
  '''
  import argparse

  parser = argparse.ArgumentParser(description='These scripts will initialize the Database for the district and populate relevant details')
  parser.add_argument('-l', '--log-level', help='Log level defining verbosity', required=False)
  parser.add_argument('-i', '--import', help='import Json Data', required=False,action='store_const', const=1)
  parser.add_argument('-e', '--export', help='import Json Data', required=False,action='store_const', const=1)
  parser.add_argument('-t', '--test', help='Test Loop', required=False,action='store_const', const=1)
  parser.add_argument('-c', '--crawl', help='crawl Locations ', required=False,action='store_const', const=1)
  parser.add_argument('-lt', '--locationType', help='Location Type to be crawled can take values of state,district,block,panchayat', required=False)
  parser.add_argument('-sc', '--stateCode', help='restricts the crawling to the specified stateCode', required=False)
  args = vars(parser.parse_args())
  return args

def getStateShortCodeDict():
  p={}
  p['02']='AP'
  p['03']='AR'
  p['04']='AS'
  p['05']='BH'
  p['33']='CH'
  p['11']='GJ'
  p['12']='HR'
  p['13']='HP'
  p['14']='JK'
  p['34']='JH'
  p['15']='KN'
  p['16']='KL'
  p['17']='MP'
  p['18']='MH'
  p['20']='MN'
  p['21']='MG'
  p['22']='MZ'
  p['23']='NL'
  p['24']='OR'
  p['26']='PB'
  p['27']='RJ'
  p['28']='SK'
  p['29']='TN'
  p['30']='TR'
  p['31']='UP'
  p['35']='UT'
  p['32']='WB'
  p['01']='AN'
  p['07']='DN'
  p['08']='DN'
  p['10']='GO'
  p['19']='LK'
  p['25']='PC'
  p['06']='CH'
  p['36']='TS'
  return p
def main():
  args = argsFetch()
  logger = loggerFetch(args.get('log_level'))
  if args['test']:
    myStates=Location.objects.filter(locationType='state')
    for eachState in myStates:
      totalDistricts=len(Location.objects.filter(locationType='district',stateCode=eachState.code))
      totalBlocks=len(Location.objects.filter(locationType='block',stateCode=eachState.code))
      totalPanchayats=len(Location.objects.filter(locationType='panchayat',stateCode=eachState.code))
      logger.info(f"{eachState.code}-{eachState.name}:{totalDistricts}-{totalBlocks}-{totalPanchayats}")
  if args['export']:
    logger.info("Exporting Locations")
    df = pd.DataFrame(list(Location.objects.all().values("name","locationType","stateCode","districtCode","blockCode","panchayatCode","stateName","districtName","blockName","panchayatName")))
    df.to_csv("/tmp/locations.csv")
  if args['crawl']:
    logger.info("Crawling Locations")
    locationType=args['locationType']
    if locationType == 'panchayat':
      stateCode=args['stateCode']
      if stateCode is None:
        myBlocks=Location.objects.filter(locationType = 'block')
      else:
        myBlocks=Location.objects.filter(locationType = 'block',stateCode=stateCode)
      for eachBlock in myBlocks:
        eachDistrict=eachBlock.parentLocation
        eachState=eachDistrict.parentLocation
        url=eachBlock.nicURL
        logger.info(url)
        r=requests.get(url)
        if r.status_code == 200:
          myhtml=r.content
          mysoup=BeautifulSoup(myhtml,"lxml")
          myTable=mysoup.find("table",id="ctl00_ContentPlaceHolder1_gvpanch")
          if myTable is None:
            myTable=mysoup.find("table",id="ContentPlaceHolder1_gvpanch")
          if myTable is not None:
            links=myTable.findAll("a")
            for link in links:
              href=link['href']
              if "Panchayat_Code" in href:
                parsed = urlparse.urlparse(href)
                params=urlparse.parse_qs(parsed.query)
                urlPrefix="http://%s/netnrega/" % (eachState.crawlIP)
                code=params['Panchayat_Code'][0]
                name=params['Panchayat_name'][0]
                logger.info(f"{code} - {name}")
                myLocation=Location.objects.filter(code=code).first()
                if myLocation is None:
                  myLocation=Location.objects.create(code=code,name=name)
                myLocation.parentLocation=eachBlock
                myLocation.stateName=eachState.name
                myLocation.stateCode=eachState.code
                myLocation.isNIC=eachState.isNIC
                myLocation.stateShortCode=eachState.stateShortCode
                myLocation.districtName=eachDistrict.name
                myLocation.districtCode=eachDistrict.code
                myLocation.blockName=eachBlock.name
                myLocation.blockCode=eachBlock.code
                myLocation.panchayatName=name
                myLocation.panchayatCode=code
                myLocation.locationType='panchayat'
                myLocation.crawlIP=eachState.crawlIP
                myLocation.nicURL=urlPrefix+href
                myLocation.displayName="%s-%s" % (eachBlock.displayName,name.title())
                myLocation.save()


    if locationType == 'block':
      myDistricts=Location.objects.filter(locationType = 'district')
      for eachDistrict in myDistricts:
        eachState=eachDistrict.parentLocation
        url=eachDistrict.nicURL
        logger.info(url)
        r=requests.get(url)
        if r.status_code == 200:
          myhtml=r.content
          mysoup=BeautifulSoup(myhtml,"lxml")
          myTable=mysoup.find("table",id="gvdpc")
          if myTable is not None:
            links=myTable.findAll("a")
            for link in links:
              href=link['href']
              if "Block_Code" in href:
                parsed = urlparse.urlparse(href)
                params=urlparse.parse_qs(parsed.query)
                urlPrefix="http://%s/netnrega/" % (eachState.crawlIP)
                code=params['Block_Code'][0]
                name=params['block_name'][0]
                logger.info(f"{code} - {name}")
                myLocation=Location.objects.filter(code=code).first()
                if myLocation is None:
                  myLocation=Location.objects.create(code=code,name=name)
                myLocation.parentLocation=eachDistrict
                myLocation.stateName=eachState.name
                myLocation.stateCode=eachState.code
                myLocation.isNIC=eachState.isNIC
                myLocation.stateShortCode=eachState.stateShortCode
                myLocation.districtName=eachDistrict.name
                myLocation.districtCode=eachDistrict.code
                myLocation.blockName=name
                myLocation.blockCode=code
                myLocation.locationType='block'
                myLocation.crawlIP=eachState.crawlIP
                myLocation.nicURL=urlPrefix+href
                myLocation.displayName="%s-%s" % (eachDistrict.displayName,name.title())
                myLocation.save()


    if locationType == 'district':
      myStates=Location.objects.filter(locationType = 'state')
      for eachState in myStates:
        url=eachState.nicURL
        logger.info(url)
        r=requests.get(url)
        if r.status_code == 200:
          myhtml=r.content
          mysoup=BeautifulSoup(myhtml,"lxml")
          myTable=mysoup.find("table",id="gvdist")
          if myTable is not None:
            links=myTable.findAll("a")
            for link in links:
              href=link['href']
              if "district_code" in href:
                parsed = urlparse.urlparse(href)
                params=urlparse.parse_qs(parsed.query)
                urlPrefix="http://%s/netnrega/" % (eachState.crawlIP)
                code=params['district_code'][0]
                name=params['district_name'][0]
                logger.info(f"{code} - {name}")
                myLocation=Location.objects.filter(code=code).first()
                if myLocation is None:
                  myLocation=Location.objects.create(code=code,name=name)
                myLocation.parentLocation=eachState
                myLocation.stateName=eachState.name
                myLocation.stateCode=eachState.code
                myLocation.stateShortCode=eachState.stateShortCode
                myLocation.isNIC=eachState.isNIC
                myLocation.districtName=name
                myLocation.districtCode=code
                myLocation.locationType='district'
                myLocation.crawlIP=eachState.crawlIP
                myLocation.nicURL=urlPrefix+href
                myLocation.displayName="%s-%s" % (eachState.displayName,name.title())
                myLocation.save()

    if locationType == 'state':
      p=getStateShortCodeDict()
      parentLocation=Location.objects.filter(code="0").first()
      baseURL="https://nrega.nic.in/Netnrega/stHome.aspx"
      r=requests.get(baseURL)
      if r.status_code == 200:
        myhtml=r.content
        mysoup=BeautifulSoup(myhtml,"lxml")
        links=mysoup.findAll("a")
        for link in links:
          href=link['href']
          if "state_code" in href:
            logger.info(href)
            parsed = urlparse.urlparse(href)
            crawlIP=parsed.netloc
            params=urlparse.parse_qs(parsed.query)
            logger.info(link.text.lstrip().rstrip())
            code=params['state_code'][0]
            name=params['state_name'][0]
            logger.info(f"{name}-{code}")
            myLocation=Location.objects.filter(code=code).first()
            if myLocation is None:
              myLocation=Location.objects.create(code=code,name=name)
            slug=myLocation.slug
            myLocation.parentLocation=parentLocation
            myLocation.crawlIP=crawlIP
            myLocation.stateName=name
            myLocation.stateCode=code
            myLocation.displayName=name.title()
            myLocation.locationType='state'
            myLocation.nicURL=href+"&lflag=eng"
            myLocation.stateShortCode=p[code]
            if ( (code == '02') or ( code == '36')):
              myLocation.isNIC=False
            else:
              myLocation.isNIC=True
            myLocation.save()
  if args['import']:
    logger.info("Importing Locations")
    df=pd.read_csv("../data/locations.csv")
    locationTypes=["country","state","district","block","panchayat"]
    columnList=list(df.columns)
    columnList.pop(0)
    columnList.remove("code")
    columnList.remove("id")
    columnList.remove("parentLocation_id")
    columnList.remove("slug")

    for lt in locationTypes:
      df1=df[df['locationType']==lt]
      logger.info(df1.shape)
      for index, row in df1.iterrows():
        code=row['code']
        myLocation=Location.objects.filter(code=code).first()
        if myLocation is None:
          myLocation=Location.objects.create(code=code)
        for field in columnList:
          value=row[field]
          logger.info(f"{field}  -   {value}")
          

      exit(0)
  logger.info("...END PROCESSING") 
  exit(0)

if __name__ == '__main__':
  main()
