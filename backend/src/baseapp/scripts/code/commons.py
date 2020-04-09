"""This module has common functions which are used
throughout the library"""
import logging
import requests
from defines import MS_TRANS_URL, MS_REQUEST_HEADERS
def logger_fetch(level=None):
    """Initialization of Logger, which can be used by all functions"""
    logger = logging.getLogger(__name__)
    default_log_level = "debug"
    if not level:
        level = default_log_level

    log_format = ('%(asctime)s:[%(name)s|%(module)s|%(funcName)s'
                  '|%(lineno)s|%(levelname)s]: %(message)s')
    if level:
        numeric_level = getattr(logging, level.upper(), None)
        if not isinstance(numeric_level, int):
            raise ValueError('Invalid log level: %s' % level)
        logger.setLevel(numeric_level)
    console_logger = logging.StreamHandler()
    formatter = logging.Formatter(log_format)
    console_logger.setFormatter(formatter)
    logger.addHandler(console_logger)
    return logger

def is_english(s):
    """This function will return
    true if the given string has only English characters
    false if it has not English characters"""
    try:
        s.encode(encoding='utf-8').decode('ascii')
    except UnicodeDecodeError:
        return False
    else:
        return True

def ms_transliterate_word(logger, word, lang_code=None, script_code=None):
    """This function will transliterate the incoming word
    to english. Defaults to Hindi"""
    if lang_code is None:
        lang_code = 'hi'
    if script_code is None:
        script_code = 'Deva'
    params = {
        'api-version' : '3.0',
        'language' : lang_code,
        'fromScript' : script_code,
        'toScript' : 'Latn'
    }
    body = [{
        'text': word
    }]

    request = requests.post(MS_TRANS_URL, headers=MS_REQUEST_HEADERS, params=params, json=body)
    if request.status_code == 200:
        response = request.json()
        trans = response[0]['text']
    else:
        logger.info(f"Transliterate error with {request.status_code} for {word}")
        trans = None
    return trans
