# Generated by Django 5.0.4 on 2024-04-04 16:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_product_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='contInStock',
            new_name='countInStock',
        ),
    ]
