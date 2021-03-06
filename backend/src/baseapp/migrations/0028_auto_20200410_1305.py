# Generated by Django 3.0.2 on 2020-04-10 13:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0027_auto_20200410_1302'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entity',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=19, max_digits=22, null=True),
        ),
        migrations.AlterField(
            model_name='entity',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=19, max_digits=22, null=True),
        ),
    ]
