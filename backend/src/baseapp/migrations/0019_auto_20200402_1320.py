# Generated by Django 3.0.2 on 2020-04-02 13:20

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('baseapp', '0018_feebdack'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Feebdack',
            new_name='Feedback',
        ),
    ]
