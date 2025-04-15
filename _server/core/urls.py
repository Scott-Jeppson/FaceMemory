from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('user/', view=views.user, name="current_user"),
    path('people/', view=views.people, name="people"),
    path('people/<int:person_id>/', view=views.person, name="person"),
    path('people/<int:person_id>/edit/', view=views.edit_person, name="edit_person"),
    path('people/<int:person_id>/delete/', view=views.delete_person, name="delete_person"),
    path('people/new/', view=views.new_person, name="new_person"),
    path('groups/', view=views.groups, name="groups"),
    path('groups/<int:group_id>/', view=views.group, name="group"),
    path('groups/<int:group_id>/edit/', view=views.edit_group, name="edit_group"),
    path('groups/<int:group_id>/delete/', view=views.delete_group, name="delete_group"),
    path('groups/new/', view=views.new_group, name="new_group"),
    path('groups/<int:group_id>/edit/add_person/', view=views.add_person_to_group, name="add_person_to_group"),
    path('groups/<int:group_id>/edit/remove_person/', view=views.remove_person_from_group, name="remove_person_from_group"),
]