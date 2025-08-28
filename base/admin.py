from django.contrib import admin
from .models import Affiliation, Author, Project, Publication, Skill

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'link', 'created_on')
    
