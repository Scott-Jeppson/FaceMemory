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
        data = json.loads(req.body)

        if not data.get("name"):
            return JsonResponse({"error": "Name is required"}, status=400)
        if not req.user:
            return JsonResponse({"error": "User not found"}, status=401)

        person = Person.objects.create(
            name=data.get("name"),
            image=data.get("image"),
            notes=data.get("details"),
            user=req.user,
        )
        return JsonResponse({"person": model_to_dict(person)}, status=201)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

@login_required
def groups(req):
    pass

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