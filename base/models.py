from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    # image = models.ImageField(upload_to="project_images/", blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Affiliation(models.Model):
    department = models.CharField()
    university = models.CharField()
    city = models.CharField()
    state = models.CharField()
    country = models.CharField()
    zip_code = models.CharField(max_length=10)

class Authors(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

class Publication(models.Model):
    title = models.CharField(max_length=100)
    authors = models.ForeignKey(Authors, on_delete=models.CASCADE)
    journal = models.CharField()
    date = models.DateField()
    doi = models.CharField()

class Skill(models.Model):
    skill = models.CharField()
