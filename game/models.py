from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal
from django.utils import timezone
from django.db.models import Q


class Game(models.Model):
    id_game = models.AutoField(primary_key=True, blank=False)
    white_player = models.CharField(max_length=10, default=None)
    black_player = models.CharField(max_length=10, default=None)
    winner = models.CharField(max_length=10, default=None)
    history = models.TextField(blank = True)
    note = models.CharField(max_length=150, blank = True)
    time = models.DateTimeField(default=timezone.now, blank=False)
    present = models.NullBooleanField(default=False) 
    def __repr__(self):
    	return self.id_game