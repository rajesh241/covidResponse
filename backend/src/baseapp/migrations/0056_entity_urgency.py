# Generated by Django 3.0.2 on 2020-04-23 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0055_auto_20200422_0858'),
    ]

    operations = [
        migrations.AddField(
            model_name='entity',
            name='urgency',
            field=models.CharField(blank=True, max_length=1024, null=True),
        ),
    ]
