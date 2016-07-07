
from django.http import HttpResponse, HttpResponseRedirect
#from django.template import loader
from django.shortcuts import get_object_or_404, render
from django.http import Http404
from django.core.urlresolvers import reverse
from django.views import generic
from django.utils import timezone
import random 
from .models import Point
from django.db import models
from django.core import serializers


#from .models import 


from django.http import HttpResponse


def index(request):
	context = {}
	return render(request, 'dronesensor/index.html', context)

#def update_current_position(request):

	#def get_latest(self):
		#return Question.objects.latest(field_name=None)

def get_test(request):									

	point_new = Point.objects.create_point(latitude = random.uniform(-30.39,-30.99), longitude = random.uniform(150.64,151.64), temperature = random.uniform(-50,50))
	point_new.save()
	data = serializers.serialize("json", [Point.objects.latest('creation_date'),])
	return HttpResponse(data,content_type='application/json')

	