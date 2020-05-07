# Generated by Django 3.0.2 on 2020-05-06 17:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0020_organization'),
    ]

    operations = [
        migrations.AddField(
            model_name='team',
            name='organization',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Organization'),
        ),
    ]