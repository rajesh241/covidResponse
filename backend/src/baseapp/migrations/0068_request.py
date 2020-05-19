# Generated by Django 3.0.2 on 2020-05-18 18:46

from django.db import migrations, models
import django.db.models.deletion
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0022_auto_20200518_1825'),
        ('baseapp', '0067_entity_route'),
    ]

    operations = [
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mode', models.CharField(blank=True, max_length=1024, null=True)),
                ('amount_needed', models.BigIntegerField(blank=True, null=True)),
                ('amount_pledged', models.BigIntegerField(blank=True, null=True)),
                ('total_endorsed', models.BigIntegerField(blank=True, null=True)),
                ('endorsed_by', models.TextField(blank=True, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('needed_by', models.DateField(blank=True, null=True)),
                ('data_json', django_mysql.models.JSONField(blank=True, default=dict, null=True)),
                ('prefill_json', django_mysql.models.JSONField(blank=True, default=dict, null=True)),
                ('extra_fields', django_mysql.models.JSONField(blank=True, default=dict, null=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('organization', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='org_group', to='core.Organization')),
            ],
            options={
                'db_table': 'request',
            },
        ),
    ]