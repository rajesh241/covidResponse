"""Module for formio related functions"""
from django.conf import settings
import json
from dotty_dict import dotty
from baseapp.formio_to_django_mapping import  mapping_dict
revised_mapping = mapping_dict

#with open('formio_to_django_mapping.json', 'r') as f:
#    revised_mapping = json.load(f)

def get_title(dot):
    formattedAddress = dot.get('contactForm.data.formattedAddress', '')
    if isinstance(formattedAddress, dict):
        formattedAddress = formattedAddress.get('formatted_address', '')
    fullName = dot['contactForm.data.fullName']

    if formattedAddress != '':
        address_for_title = formattedAddress
    else:
        givenAddress = dot.get('contactForm.data.givenAddress', '')
        city = dot.get('contactForm.data.sourceSpecific.city', '')
        district = dot.get('contactForm.data.district', '')
        state = dot.get('contactForm.data.sourceSpecific.state', '')

        address = f"{givenAddress} {city}, {district}, {state}"
        address = address.replace(' ,', ',')
        address = address.replace('  ', ' ')
        address = address.replace(', ,', ',')
        address = address.replace(',,', ',')
        address_for_title = address
    
    title = f"{fullName} {address_for_title}".upper()

    return title

def convert_formio_data_to_django(data):
    '''
    Pass the response from Formio to this function. 
    '''
    #for key, value in data.items():
    #    print(key)
    #dot = dotty(data['submission']['data'])
    dot = dotty(data)
    geo_json = ''
    # Replace the full dict form google with just formatted address for prefilling
    formattedAddress = dot.get('contactForm.data.formattedAddress', '')
    if isinstance(formattedAddress, dict):
        geo_json = formattedAddress.copy()
        formattedAddress = formattedAddress.get('formatted_address', '')
        dot['contactForm.data.formattedAddress'] = formattedAddress

    prefill = {'data': dot.to_dict()}
    
    # Extract mapping

    django_dict = dotty({'prefill_json': prefill})

    formio_data = []
    for fkey in revised_mapping:
        dkey = revised_mapping[fkey]
        try:
            info = dot[fkey]
            django_dict[dkey] = info
        except:
            pass

    res = django_dict.to_dict()
    res['extra_fields']['geo_json'] = geo_json
    res['title'] = get_title(dot)
    print(res)
    return res

def get_title_description(record_type, data):
    about_dict = {}
    about_dict['title'] = ''
    about_dict['description'] = ''
    about_dict['formio_url'] = ''
    try:
        about_dict['latitude'] = data['contactGrid'][0]['contactForm']['data']['fullAddress']['geometry']['location']['lat']
        about_dict['longitude'] = data['contactGrid'][0]['contactForm']['data']['fullAddress']['geometry']['location']['lng']
    except:
        about_dict['a'] = None
    print(about_dict)
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

def help_sought(data):
    '''
    Return a csv for the type of help people are seeking
    '''
    # print(data)
    dot = dotty(data)

    # Extract needs

    needs_json = dot['needsForm.data.needs']
    # needs_json = data['needsForm']['data']['needs'] Works also
    # print(needs_json)
    needs = ''
    for key, value in needs_json.items():
        if value:
            needs += key + ','
    return needs.rstrip(',')
