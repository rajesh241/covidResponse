# Generated by Django 3.0.2 on 2020-04-18 16:06

from django.db import migrations
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0040_bulkoperation'),
    ]

    operations = [
        migrations.AddField(
            model_name='bulkoperation',
            name='ids_json',
            field=django_mysql.models.JSONField(blank=True, default=dict, null=True),
        ),
    ]
