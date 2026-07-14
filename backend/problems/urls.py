from django.urls import path
from . import views

urlpatterns = [
    path('problems/', views.ProblemList.as_view(), name='problem-list-create'),
    path('problems/<str:pk>/', views.AttemptListCreate.as_view(), name='problem-attempt-list-create'),
]
