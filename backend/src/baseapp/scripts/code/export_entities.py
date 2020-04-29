"""Blank file which can server as starting point for writing any script file"""
import argparse
import os
import django
import pandas as pd
import boto3
from io import StringIO
import datetime
from django.utils.text import slugify
from commons import logger_fetch
from defines import DJANGO_SETTINGS
os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
django.setup()
from baseapp.models import Entity

AWS_PROFILE_NAME = "libtechIndia"
AWS_DATA_BUCKET = "coast-india"
AWS_REGION = "ap-south-1"

def args_fetch():
    '''
    Paser for the argument list that returns the args list
    '''

    parser = argparse.ArgumentParser(description=('This is blank script',
                                                  'you can copy this base script '))
    parser.add_argument('-l', '--log-level', help='Log level defining verbosity', required=False)
    parser.add_argument('-t', '--test', help='Test Loop',
                        required=False, action='store_const', const=1)
    parser.add_argument('-e', '--export', help='Test Loop',
                        required=False, action='store_const', const=1)
    parser.add_argument('-ti1', '--testInput1', help='Test Input 1', required=False)
    parser.add_argument('-ti2', '--testInput2', help='Test Input 2', required=False)
    args = vars(parser.parse_args())
    return args

def aws_init(use_env=None):
    """Initializes the AWS bucket. It can either pick up AWS credentials from
    the environment variables or it can pick up from the profile in the .aws
    directory location in HOME Directory"""
    aws_access_key_id = os.environ.get('AWS_ACCESS_KEY')
    aws_secret_access_key = os.environ.get('AWS_SECRET_KEY')
    region = os.environ.get('AWS_REGION')
    use_env = os.environ.get('USE_ENVIRONMENT_VARIABLE')
    if use_env is None:
        boto3.setup_default_session(profile_name=AWS_PROFILE_NAME)
    elif use_env == "1":
        boto3.setup_default_session(
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region
        )

    s3_instance = boto3.resource('s3', region_name=AWS_REGION)
    return s3_instance
def put_object_s3(bucket, filename, filedata, content_type):
    """Putting object in amazon S3"""
    bucket.put_object(
        Body=filedata,
        Key=filename,
        ContentType=content_type,
        ACL='public-read'
        )


def upload_s3(logger, filename, data, bucket_name=None):
    """
    This function will upload to amazon S3, it can take data either as
    string or as data frame
       filename: filename along with file path where file needs tobe created
       for example abcd/efg/hij.csv
       data : content can be a string or pandas data frame
       bucket: Optional bucket name, in which file needs to be created else
       will default to the AWS_DATA_BUCKET
    """
    logger.debug(f"Uploading file {filename} to Amazon S3")
    s3_instance = aws_init()
    if bucket_name is None:
        bucket_name = AWS_DATA_BUCKET
    bucket = s3_instance.Bucket(bucket_name)
    if isinstance(data, pd.DataFrame):
        #If the data passed is a pandas dataframe
        data['lastUpdateDate'] = datetime.datetime.now().date()
        csv_buffer = StringIO()
        data.to_csv(csv_buffer, encoding='utf-8-sig', index=False)
        filedata = csv_buffer.getvalue()
        content_type = 'text/csv'
        put_object_s3(bucket, filename, filedata, content_type)
    else:
        content_type = 'text/html'
        filedata = data
        put_object_s3(bucket, filename, filedata, content_type)

    report_url = f"https://{bucket_name}.s3.{AWS_REGION}.amazonaws.com/{filename}"

    return report_url



def main():
    """Main Module of this program"""
    args = args_fetch()
    logger = logger_fetch(args.get('log_level'))
    if args['test']:
        logger.info("Testing")
        objs = Entity.objects.all()
        for obj in objs:
            logger.info(obj.id)
            break
    if args['export']:
        csv_array = []
        columns = ["title", "state", "status", "urgency", "remarks"]
        objs = Entity.objects.filter(record_type = 'helpseekers')
        for obj in objs:
            a = [obj.title, obj.state, obj.status, obj.urgency, obj.remarks]
            csv_array.append(a)
        df = pd.DataFrame(csv_array, columns=columns)
        filename = "export/data.csv"
        file_url = upload_s3(logger, filename, df)
        logger.info(file_url)
            
    logger.info("...END PROCESSING")

if __name__ == '__main__':
    main()
