# Generated by Django 3.0.2 on 2020-04-01 00:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0009_context_icon_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='context',
            name='information_source',
            field=models.CharField(blank=True, max_length=1024, null=True),
        ),
        migrations.AddField(
            model_name='context',
            name='record_subtype',
            field=models.CharField(blank=True, max_length=1024, null=True),
        ),
    ]
