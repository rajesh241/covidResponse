"""This is the module to define Bulk Actions"""
from django.contrib.auth import get_user_model, authenticate
from baseapp.models import Entity
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
        myuser = User.objects.filter(id=user_id).first()
        if myuser is None:
            return
        for each_id in id_array:
            obj = Entity.objects.filter(id=each_id).first()
            if obj is not None:
                extra_fields = obj.extra_fields
                extra_fields['assigned_to_volunteer'] = myuser.name
                obj.extra_fields = extra_fields
                obj.assigned_to_user = myuser
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





