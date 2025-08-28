from django.shortcuts import render
from django.http import JsonResponse
from.models import Project

def home(request):
    # projects = Project.objects.all()
    # context = {'projects', projects}
    return render(request, 'base/home.html')

def projects_api(request):
    projects = Project.objects.values("title", "description", "ascii_image", "link")
    return JsonResponse(list(projects), safe=False)
