#!/bin/bash
#First we will kill the process if it is older than 3 hours
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo DIR
cd $DIR/../backend/venv
source bin/activate
#export PYTHONPATH="${PYTHONPATH}:/home/crawler/repo/libtechIndiaCrawler/"
export PYTHONPATH="${PYTHONPATH}:$HOME/repo/covidResponse/backend/"
python $DIR/../backend/src/baseapp/scripts/code/export_entities.py -e
