from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal
from django.utils import timezone
from django.db.models import Q


class Player(models.Model):
    user = models.OneToOneField(User, on_delete= models.CASCADE)
    no_of_wins = models.DecimalField(max_digits=5, decimal_places=0, default=Decimal('0'))
    no_of_lose = models.DecimalField(max_digits=5, decimal_places=0, default=Decimal('0'))
    no_of_draws = models.DecimalField(max_digits=5, decimal_places=0, default=Decimal('0'))
    def __str__(self):
    	return self.user.username
 # Mise a jour Player a chaque moment ou un user vient d'etre ajoute

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		Player.objects.create(user=instance)

