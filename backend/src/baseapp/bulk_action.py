"""This is the module to define Bulk Actions"""
from django.contrib.auth import get_user_model, authenticate
from baseapp.models import Entity
from core.models import Team
User = get_user_model()

def perform_bulk_action(data):
    ids_json = data.get("ids_json", None)
    if ids_json is None:
        return
    id_array = ids_json.get("ids", None)
    if id_array is None:
        return
    formio_json = data.get("data_json", None)
    if formio_json is None:
        return
    print(id_array)
    bulk_action = data.get("bulk_action", None)
    if bulk_action == "assigntovolunteer":
        print("I am in assign volunteer")
        user_id = formio_json.get("assigntovolunteer", None)
        if user_id is None:
            return
        if user_id == '':
            myuser = None
        else:
            myuser = User.objects.filter(id=user_id).first()
        for each_id in id_array:
            obj = Entity.objects.filter(id=each_id).first()
            if obj is not None:
                if myuser is None:
                    obj.assigned_to_user = None
                else:
                    extra_fields = obj.extra_fields
                    extra_fields['assigned_to_volunteer'] = myuser.name
                    obj.extra_fields = extra_fields
                    obj.assigned_to_user = myuser
                    if myuser.team is not None:
                        obj.assigned_to_group = myuser.team
                obj.save()
    if bulk_action == "assigntogroup":
        print("I am in assign group")
        input_id = formio_json.get("assigntogroup", None)
        if input_id is None:
            return
        if input_id == '':
            myobj = None
        else:
            myobj = Team.objects.filter(id=input_id).first()
        for each_id in id_array:
            obj = Entity.objects.filter(id=each_id).first()
            if obj is not None:
                if myobj is None:
                    obj.assigned_to_group = None
                else:
                    extra_fields = obj.extra_fields
                    extra_fields['assigned_to_group'] = myobj.name
                    obj.extra_fields = extra_fields
                    obj.assigned_to_group = myobj
                obj.save()

    if bulk_action == "assigntoorg":
        print("I am in assign volunteer")
        try:
            entity_json = formio_json.get("assigntoorg", None)
            print(entity_json)
            entity_id = entity_json.get("id", None)
            print(entity_id)
            myentity = Entity.objects.filter(id=entity_id).first()
        except:
            myentity = None
        if myentity is None:
            return
        print(f"myentity is {myentity.id}")
        for each_id in id_array:
            obj = Entity.objects.filter(id=each_id).first()
            if obj is not None:
                extra_fields = obj.extra_fields
                extra_fields['assigned_to_org'] = myentity.title
                obj.extra_fields = extra_fields
                obj.assigned_to_org = myentity
                obj.save()





