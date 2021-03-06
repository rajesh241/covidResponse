# Generated by Django 3.0.2 on 2020-05-14 04:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0065_auto_20200509_1641'),
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('location_type', models.CharField(blank=True, max_length=256, null=True)),
                ('code', models.CharField(blank=True, max_length=256, null=True)),
                ('state_code', models.CharField(blank=True, max_length=256, null=True)),
                ('district_code', models.CharField(blank=True, max_length=256, null=True)),
                ('state_name', models.CharField(blank=True, max_length=256, null=True)),
                ('district_name', models.CharField(blank=True, max_length=256, null=True)),
            ],
            options={
                'db_table': 'location',
            },
        ),
    ]
