# Generated by Django 3.0.2 on 2020-04-17 04:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0033_auto_20200417_0412'),
    ]

    operations = [
        migrations.AddField(
            model_name='entity',
            name='phone',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]
