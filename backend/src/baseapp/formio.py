"""Module for formio related functions"""
from django.conf import settings

def get_title_description(record_type, data):
    print(data)
    about_dict = {}
    about_dict['title'] = ''
    about_dict['description'] = ''
    about_dict['formio_url'] = ''
    if record_type == "helpseekers":
        about_dict['formio_url'] = f"{settings.FORMIO_URL}/forms/v1/helpseekers"
        try:
            about_dict['title'] = data['contactGrid'][0]['contactForm']['data']['fullName']
        except:
            about_dict['title'] = ""
    elif record_type == "supportnetwork":
        about_dict['formio_url'] = f"{settings.FORMIO_URL}/forms/v1/supportnetwork"
        try:
            about_dict['title'] = data['aboutContainer']['orgName2']
        except:
            about_dict['title'] = ""
    return about_dict

def create_submission_data(data):
    submission = {'data': data}
    return submission
    
def helpseeker_v1_prefilling(data):
    '''
    Extracts key information from form response for the help seekers
    form, v1. 
    
    Relevant info can be found in request as well as submission keys.  
    For submission key to be populated, submission action needs to be enabled
    even if there is no active storage into MongoDB.
    
    Help seekers form has info in the following categories: Contact info, where from & Needs 
    # There is repetitive info.  Create a submissions dict
    # to hold key info.
    '''
    submission = {'data': data}
    return submission
    # Contact information is in a grid.  Grids allow multiple contacts
    # For some reason, the grid has repetitive info, including those outside it
    # What I need is stored in this location.
    submission['data']['contactGrid'] = []
    print(data['contacts'])
    for contact in data['contacts']:
        submission['data']['contactGrid'].append({'contactForm': {'data': contact}})
        #submission['data']['contactGrid'] = [{'contactForm': {'data': {'contactGrid': {'data': data['contacts']}}}}]
        
    
    submission['data']['needsContainer'] = {'needsForm': {'data': {'needs': data['needs']}}}

    # Apart from the needs form, this container also has notes.
    submission['data']['needsContainer']['notes'] = data['needs']['notes']

    # Information on where the group is from
    submission['data']['fromContainer'] = data['whereFrom']

    
    return submission

