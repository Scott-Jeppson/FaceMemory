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
    pass

@login_required
def person(req, person_id):
    pass

@login_required
def edit_person(req, person_id):
    pass

@login_required
def delete_person(req, person_id):
    pass

@login_required
def new_person(req):
    if req.method == "POST":
        name = req.POST.get("name")
        image = req.FILES.get("image")
        details = req.POST.get("details")
        group = req.POST.get("group")

        if not name:
            return JsonResponse({"error": "Name is required"}, status=400)
        
        try:
            details = json.loads(details) if details else None
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid details format"}, status=400)

        group_instance = None
        if group:
            try:
                group_instance = Group.objects.get(id=group, user=req.user)
            except Group.DoesNotExist:
                return JsonResponse({"error": "Invalid group ID"}, status=400)

        person = Person.objects.create(
            name= name,
            image= image,
            notes= details,
            user=req.user,
        )

        if group_instance:
            group_instance.members.add(person)

        return JsonResponse({
            "person": {
                "id": person.id,
                "name": person.name,
                "image": person.image.url if person.image else None,
                "notes": person.notes,
            },
            "message": "Person created successfully"
        }, status=201)
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
    pass

@login_required
def edit_group(req, group_id):
    pass

@login_required
def delete_group(req, group_id):
    pass

@login_required
def new_group(req):
    pass

@login_required
def add_person_to_group(req, group_id):
    pass

@login_required
def remove_person_from_group(req, group_id):
    pass