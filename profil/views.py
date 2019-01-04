from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from profil.models import Player
from django.contrib.auth.models import User
import math


# Create your views here.
@login_required
def index(request):
	player = Player.objects.get(user__username = request.user)
	rate_of_win = round(player.no_of_wins / player.no_of_games,2)*100
	return render(request, "profil.html", {"player":player, "rate": rate_of_win})