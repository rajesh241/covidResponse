# Generated by Django 3.0.2 on 2020-04-17 10:58

from django.db import migrations
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0034_entity_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='entity',
            name='prefill_json',
            field=django_mysql.models.JSONField(blank=True, default=dict, null=True),
        ),
    ]
