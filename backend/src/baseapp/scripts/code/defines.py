"""File to hold constants"""
import os
import sys
import json
import uuid
from pathlib import Path

HOME_DIR = str(Path.home())
FILE_DIR = os.path.dirname(os.path.realpath(__file__))
ROOT_DIR = FILE_DIR+"/../../../"
sys.path.insert(0, ROOT_DIR)
DJANGO_SETTINGS = "base.settings"
JSON_CONFIG_FILE = "./state_short_code.json"
with open(JSON_CONFIG_FILE) as config_file:
    STATE_SHORT_CODE_DICT = json.load(config_file)
MS_TRANSLATE_JSON = f"{HOME_DIR}/.libtech/microsoft_translate.json"
with open(MS_TRANSLATE_JSON) as config_file:
    MS_TRANSLATE_CONFIG = json.load(config_file)
MS_TRANSLATE_KEY = MS_TRANSLATE_CONFIG.get("key")
MS_TRANS_URL = 'https://api.cognitive.microsofttranslator.com/transliterate'
MS_REQUEST_HEADERS = {
    'Ocp-Apim-Subscription-Key': MS_TRANSLATE_KEY,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
    }
