# Generated by Django 3.0.2 on 2020-05-09 16:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseapp', '0063_entity_updated_by_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entity',
            name='record_type',
            field=models.CharField(blank=True, default='helpseekers', max_length=1024, null=True),
        ),
    ]
