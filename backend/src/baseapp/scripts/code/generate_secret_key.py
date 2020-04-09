"""Blank file which can server as starting point for writing any script file"""
import argparse
import random
from commons import logger_fetch

def args_fetch():
    '''
    Paser for the argument list that returns the args list
    '''

    parser = argparse.ArgumentParser(description=('This module will',
                                                  'Generate the secret key'))
    parser.add_argument('-l', '--log-level', help='Log level defining verbosity', required=False)
    args = vars(parser.parse_args())
    return args


def main():
    """Main Module of this program"""
    args = args_fetch()
    logger = logger_fetch(args.get('log_level'))
    secret_key = ''.join(random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)') for i in range(50))
    logger.info(secret_key)
    logger.info("...END PROCESSING")

if __name__ == '__main__':
    main()
