from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer
from datetime import datetime
from rest_framework import status

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addOrderItem(req):
    user = req.user
    data = req.data
    orderItems = data["orderItems"]
    if orderItems and len(orderItems) == 0:
        message = {"detail": "No Order Items"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    else :
        #     create order
        order = Order.objects.create(
            user = user, paymentMethod = data["paymentMethod"],
            taxPrice = data["taxPrice"], shippingPrice = data["shippingPrice"],
            totalPrice = data["totalPrice"]
        )
        #     create shipping address
        shipping = ShippingAddress.objects.create(
            order = order,
            address = data["shippingAddress"]["address"],
            city = data["shippingAddress"]["city"],
            postalCode = data["shippingAddress"]["postalCode"],
            country = data["shippingAddress"]["country"],
        )
        # create order items and set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i["product"])
            item = OrderItem.objects.create(
                product = product, order = order, name = product.name,
                qty = i["qty"], price = i["price"], image = product.image.url
            )
            #      update count in stock
            product.countInStock -= int(item.qty)
            product.save()
        serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrderById(req, pk):
    user = req.user
    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            message = {"detail": "Not Authorized"}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except:
        message = {"detail": "Order doesn't exist"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(req, pk):
    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response("Order was paid")

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getMyOrders(req):
    user = req.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def getOrders(req):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(req, pk):
    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()
    return Response("Order was delivered!")