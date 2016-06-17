
from django.http import HttpResponse, HttpResponseRedirect
#from django.template import loader
from django.shortcuts import get_object_or_404, render
from django.http import Http404
from django.core.urlresolvers import reverse
from django.views import generic
from django.utils import timezone



#from .models import 


from django.http import HttpResponse


def index(request):
	context = {}
	return render(request, 'dronesensor/index.html', context)