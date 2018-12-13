from django.urls import path
from . import views
app_name = "game"
urlpatterns = [
    path('',views.index, name ='index'),
    path('save_game/',views.save_game,name='save'),
]