# Generated by Django 3.0.2 on 2020-04-01 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0014_context_backend_remarks'),
    ]

    operations = [
        migrations.AddField(
            model_name='context',
            name='feedback_form',
            field=models.TextField(blank=True, null=True),
        ),
    ]
