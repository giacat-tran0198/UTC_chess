from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from profil.models import Player
from django.contrib.auth.models import User


# Create your views here.
@login_required
def index(request):
	player = Player.objects.get(user__username = request.user)
	rate_of_win = player.no_of_wins / player.no_of_games
	return render(request, "profil.html", {"player":player, "rate": rate_of_win})