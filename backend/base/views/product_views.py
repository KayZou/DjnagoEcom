from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product
from base.serializers import ProductSerializer
from rest_framework import status

@api_view(["GET"])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getProduct(req, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(req, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response("Product deleted successfully!")

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(req):
    data = req.data
    user = req.user
    product = Product.objects.create(
        user = user,
        name = 'Product Name',
        price = 0,
        brand = 'Product Brand',
        category = 'Product Category',
        countInStock = 0,
        description = 'Product Description',
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateProduct(req, pk):
    data = req.data
    product = Product.objects.get(_id=pk)
    product.name = data["name"]
    product.price = data["price"]
    product.brand = data["brand"]
    product.category = data["category"]
    product.countInStock = data["countInStock"]
    product.description = data["description"]
    product.save()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def uploadImage(req):
    data = req.data
    product_id = data["_id"]
    product = Product.objects.get(_id=product_id)
    product.image = req.FILES.get("image")
    product.save()
    return Response("Image was uploaded!")