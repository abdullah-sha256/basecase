from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProblemListCreate.as_view(), name='problem-list-create'),
]
