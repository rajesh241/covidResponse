# Generated by Django 3.0.2 on 2020-04-17 04:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0032_auto_20200416_0506'),
    ]

    operations = [
        migrations.RenameField(
            model_name='entity',
            old_name='phone',
            new_name='phone1',
        ),
    ]
