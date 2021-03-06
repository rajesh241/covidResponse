# Generated by Django 3.0.2 on 2020-05-20 08:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0024_auto_20200519_1103'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='can_endorse',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='can_fund',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='organization',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Organization'),
        ),
    ]
