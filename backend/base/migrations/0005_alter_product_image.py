# Generated by Django 5.0.4 on 2024-04-13 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_rename_continstock_product_countinstock'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, default='/untitled.png', null=True, upload_to=''),
        ),
    ]