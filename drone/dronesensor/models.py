from __future__ import unicode_literals

from django.db import models
import random
from datetime import datetime  


# Create your models here.

class PointManager(models.Manager):
	def create_point(self, latitude,longitude, temperature): 
		book = self.create(latitude=latitude, longitude=longitude, temperature=temperature)
		return book 

class Point(models.Model):
	
	latitude = models.FloatField()
	longitude = models.FloatField()
	temperature = models.FloatField()
	creation_date = models.DateTimeField(default=datetime.now, blank=True)
	objects = PointManager()

	



	

