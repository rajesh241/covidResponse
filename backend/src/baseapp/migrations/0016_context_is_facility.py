# Generated by Django 3.0.2 on 2020-04-01 20:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0015_context_feedback_form'),
    ]

    operations = [
        migrations.AddField(
            model_name='context',
            name='is_facility',
            field=models.BooleanField(default=False),
        ),
    ]
