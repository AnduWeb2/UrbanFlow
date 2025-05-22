from django.shortcuts import render
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from user.models import Citzen, CustomUser
from rest_framework import status
from .models import FavoriteRoute
from rest_framework.decorators import api_view


# Create your views here.
@csrf_exempt
def addFavorite(request):
    if request.method == 'POST':
        
        try:
            data = JSONParser().parse(request)
            print(data) 
            route_id = data['route_id']
            route_name = data['route_name']
            username = data['username']
            user = CustomUser.objects.get(username=username)
            print(user)
            if FavoriteRoute.objects.filter(route_id=route_id, user__username=username).exists():
                return JsonResponse({"error": "Favorite already exists"}, status=408)
            FavoriteRoute.objects.create(route_id=route_id, route_name=route_name, user=user)
            return JsonResponse({"message": "Favorite added successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    
        
@api_view(['GET'])
def getFavorites(request):
    if request.method == 'GET':
        try:
            token = request.headers.get('Authorization')
            if not token:
                return JsonResponse({"error": "Token is required"}, status=400)
            #if token.startswith("Bearer "):
               # token = token[7:]
            user = request.user
            if not user:
                return JsonResponse({"error": "Invalid token"}, status=401)
            favorites = FavoriteRoute.objects.filter(user=user)
            favorites_list = [
                {
                    "route_id": favorite.route_id,
                    "route_name": favorite.route_name,
                } for favorite in favorites
            ]

            return JsonResponse({"favorites": favorites_list}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
@api_view(['DELETE'])
@csrf_exempt
def deleteFavorite(request, route_id):
    if request.method == 'DELETE':
        try:
            token = request.headers.get('Authorization')
            if not token:
                return JsonResponse({"error": "Token is required"}, status=400)
            
            user = request.user
            if not user:
                return JsonResponse({"error": "Invalid token"}, status=401)
            favorite = FavoriteRoute.objects.filter(route_id=route_id, user=user)
            if not favorite.exists():
                return JsonResponse({"error": "Favorite not found"}, status=404)
            favorite.delete()
            return JsonResponse({"message": "Favorite deleted successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)