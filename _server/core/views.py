from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .models import Person, Group
from django.contrib.auth.models import User

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)

@login_required
def user(req):
    return JsonResponse({"user": model_to_dict(req.user)})

@login_required
def people(req):
    if req.method == "GET":
        people = Person.objects.filter(user=req.user)
        people_data = []
        for person in people:
            person_data = model_to_dict(person)
            person_data["image"] = person.image.url if person.image else None
            people_data.append(person_data)
        return JsonResponse(people_data, safe=False)
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

@login_required
def person(req, person_id):
    if req.method == "GET":
        try:
            person = Person.objects.get(id=person_id, user=req.user)
            person_data = model_to_dict(person)
            
            person_data["image"] = person.image.url if person.image else None
            person_data["groups"] = [
                {"id": group.id, "name": group.name} for group in person.groups.all()
            ]

            return JsonResponse({
                "person": person_data,
                "message": "Person retrieved successfully"
            }, status=200, safe=False)
        except Person.DoesNotExist:
            return JsonResponse({"error": "Person not found"}, status=404)

@login_required
def edit_person(req, person_id):
    if req.method == "PUT":
        try:
            person = Person.objects.get(id=person_id, user=req.user)
        except Person.DoesNotExist:
            return JsonResponse({"error": "Person not found"}, status=404)

        name = req.POST.get("name")
        image = req.FILES.get("image")
        details = req.POST.get("details")
        groups = req.POST.getlist("groups")

        if name:
            person.name = name
        if image:
            person.image = image
        if details:
            try:
                person.notes = json.loads(details)
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid details format"}, status=400)
        if groups:
            try:
                group_instances = Group.objects.filter(id__in=groups, user=req.user)
                person.groups.set(group_instances)
            except Group.DoesNotExist:
                return JsonResponse({"error": "Invalid group ID"}, status=400)

        person.save()

        return JsonResponse({
            "person": model_to_dict(person),
            "message": "Person updated successfully"
        }, status=200)
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

@login_required
def delete_person(req, person_id):
    print(f"Request method: {req.method}")  # Debug log
    if req.method == "DELETE":
        try:
            person = Person.objects.get(id=person_id, user=req.user)

            if person.image:
                image_path = os.path.join(settings.MEDIA_ROOT, str(person.image))
                if os.path.exists(image_path):
                    os.remove(image_path)
            
            for group in person.groups.all():
                group.members.remove(person)

            person.groups.clear()

            person.delete()

            return JsonResponse({"message": "Person deleted successfully"}, status=200)
        except Person.DoesNotExist:
            return JsonResponse({"error": "Person not found"}, status=404)

    return JsonResponse({"error": "Invalid request method"}, status=400)

@login_required
def new_person(req):
    if req.method == "POST":
        name = req.POST.get("name")
        image = req.FILES.get("image")
        details = req.POST.get("details")
        groups = req.POST.getlist("groups")

        if not name:
            return JsonResponse({"error": "Name is required"}, status=400)
        
        try:
            details = json.loads(details) if details else None
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid details format"}, status=400)

        group_instances = []
        if groups:
            try:
                group_instances = Group.objects.filter(id__in=groups, user=req.user)
                if len(group_instances) != len(groups):
                    return JsonResponse({"error": "One or more group IDs are invalid"}, status=400)
            except Group.DoesNotExist:
                return JsonResponse({"error": "Invalid group IDs"}, status=400)

        person = Person.objects.create(
            name= name,
            image= image,
            notes= details,
            user=req.user,
        )

        if group_instances:
            person.groups.add(*group_instances)
        
        person.save()

         # Manually construct the JSON response to handle the image field
        person_data = model_to_dict(person)
        person_data["image"] = person.image.url if person.image else None

        return JsonResponse({
            "person": person_data,
            "message": "Person created successfully"},
            status=201, safe=False
        )
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

@login_required
def groups(req):
    if req.method == "GET":
        user_groups = Group.objects.filter(user=req.user)
        return JsonResponse(list(user_groups.values()), safe=False)
    return JsonResponse({"error": "Invalid request method"}, status=400)

@login_required
def group(req, group_id):
    if req.method == "GET":
        try:
            group = Group.objects.get(id=group_id, user=req.user)
            
            # Serialize the group object
            group_data = model_to_dict(group)
            
            # Serialize the members (related Person objects)
            group_data["members"] = [
                {"id": person.id, "name": person.name, "image": person.image.url if person.image else None}
                for person in group.members.all()
            ]
            
            return JsonResponse({
                "group": group_data,
                "message": "Group retrieved successfully"
            }, status=200, safe=False)
        except Group.DoesNotExist:
            return JsonResponse({"error": "Group not found"}, status=404)

@login_required
def edit_group(req, group_id):
    if req.method == "POST":
        try:
            group = Group.objects.get(id=group_id, user=req.user)
        except Group.DoesNotExist:
            return JsonResponse({"error": "Group not found"}, status=404)

        name = req.POST.get("name")
        members = req.POST.getlist("members")

        if name:
            group.name = name
        if members:
            try:
                member_instances = Person.objects.filter(id__in=members, user=req.user)
                group.members.set(member_instances)
            except Person.DoesNotExist:
                return JsonResponse({"error": "Invalid member ID"}, status=400)

        group.save()

        return JsonResponse({
            "group": model_to_dict(group),
            "message": "Group updated successfully"
        }, status=200, safe=False)
        
    return JsonResponse({"error": "Invalid request method"}, status=400)

@login_required
def delete_group(req, group_id):
    if req.method == "DELETE":
        try:
            group = Group.objects.get(id=group_id, user=req.user)
            for person in group.members.all():
                person.groups.remove(group)
            
            group.members.clear()
            
            group.delete()
            return JsonResponse({"message": "Group deleted successfully"}, status=200)
        except Group.DoesNotExist:
            return JsonResponse({"error": "Group not found"}, status=404)

    return JsonResponse({"error": "Invalid request method"}, status=400)

@login_required
def new_group(req):
    if req.method == "POST":
        data = json.loads(req.body.decode("utf-8"))
        name = data.get("name")
        description = data.get("description")
        members = data.get("members", [])

        if not name:
            return JsonResponse({"error": "Name is required"}, status=400)

        group = Group.objects.create(name=name, user=req.user)

        if members:
            try:
                member_instances = Person.objects.filter(id__in=members, user=req.user)
                group.members.set(member_instances)
            except Person.DoesNotExist:
                return JsonResponse({"error": "Invalid member ID"}, status=400)

        group.save()

        return JsonResponse({
            "group": model_to_dict(group),
            "message": "Group created successfully"},
            status=201, safe=False
        )
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)