# Generated by Django 3.0.2 on 2020-05-06 17:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0061_entityhistory_modified'),
        ('core', '0017_auto_20200503_1702'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Group',
            new_name='Team',
        ),
    ]