from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal
from django.utils import timezone
from django.db.models import Q
from profil.models import *

class Game(models.Model):
	id_game = models.AutoField(primary_key=True,blank = False)
	player1 = models.ManyToManyField(Player,related_name='player1',blank=False)
	player2 = models.ManyToManyField(Player,related_name='player2',blank=False)
	time = models.DateTimeField(default=timezone.now,blank = False)
	present = models.NullBooleanField(default=False)
	def __str__(self):
		return self.id_game