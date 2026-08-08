from django.urls import path
from . import views

urlpatterns = [
    path('problems/', views.ProblemList.as_view(), name='problem-list-create'),
    path('problems/<str:pk>/', views.AttemptListCreate.as_view(), name='problem-attempt-list-create'),
    path('attempts/<int:pk>/', views.AttemptComplete.as_view(), name='attempt-complete'),
    path('attempts/<int:pk>/grade/', views.AttemptGrade.as_view(), name='attempt-grade'),
    path('plan/today/', views.TodayPlan.as_view(), name='plan-today'),
    path('config/', views.ClientConfig.as_view(), name='client-config'),
    path('stats/', views.Stats.as_view(), name='stats'),
]
