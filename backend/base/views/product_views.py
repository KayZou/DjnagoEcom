from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.response import Response
from base.models import Product, Review
from base.serializers import ProductSerializer
from rest_framework import status

@api_view(["GET"])
def getProducts(request):
    query = request.query_params.get("search")
    # print(query)
    if query == None:
        query=""
    products = Product.objects.filter(name__icontains=query)
    page  =request.query_params.get("page")
    paginator = Paginator(products, 100)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    if page == None:
        page = 1
    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({"products": serializer.data, "page": page, "pages":paginator.num_pages})


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

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createProductReview(req, pk):
    user = req.user
    product = Product.objects.get(_id=pk)
    data = req.data
    alreadyExists = product.review_set.filter(user=user).exists()
    if(alreadyExists):
        content = {"detail": "Product already reviewed"}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    elif data["rating"]==0:
        content=  {"detail": "Please select a rating!"}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data["rating"],
            comment=data["comment"]
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        total = 0
        for i in reviews:
            total += i.rating
        product.rating = total / len(reviews)
        product.save()
        return Response("Review was added!")
