from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from .models import StaffUser, Citzen, StaffUserToken, CitzenToken, CustomUser
from files.views import getFile
from files.models import File 
from django.contrib.auth.hashers import make_password, verify_password, check_password
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@csrf_exempt
def registerStaffUser(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        try:
            print(data)
            document = File.objects.get(id=data['document_id'])
            custom_user = CustomUser.objects.create(
                username=data['username'],
                email=data['email'],
                password=make_password(data['password']),
                first_name=data['first_name'],
                last_name=data['last_name'],
                is_staff=True
            )
            staff_user = StaffUser.objects.create(
                user=custom_user,
                is_valid=False,
                document=document
            )
            return JsonResponse({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    


@csrf_exempt    
def loginStaffUser(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        try:
            user = StaffUser.objects.get(user__username=data['username'])
            if user.is_valid == False:
                return JsonResponse({"error": "User is not valid"}, status=status.HTTP_412_PRECONDITION_FAILED)
            if verify_password(data['password'], user.user.password):
                #token = StaffUserToken.objects.create(user=user, token=make_password(user.username))
                #token.save()
                return JsonResponse({#"token": token.token,
                                     "username": user.user.username
                }, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except StaffUser.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
@csrf_exempt
def CitzenRegister(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        try:
            custom_user = CustomUser.objects.create(
                username=data['username'],
                email=data['email'],
                password=make_password(data['password']),
                first_name=data['first_name'],
                last_name=data['last_name']
            )
            citizen = Citzen.objects.create(user=custom_user)
            return JsonResponse({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
@csrf_exempt    
def CitzenLogin(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        try:
            user = Citzen.objects.get(user__username=data['username'])
            if check_password(data['password'], user.user.password):
                
                return JsonResponse({"username": user.user.username}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except Citzen.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

@csrf_exempt
def add_points(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            print(data)
            points_to_add = data.get('points', 0)
            token = request.headers.get('Authorization')
            if not token:
                return JsonResponse({"error": "Token is required"}, status=400)
            if token.startswith("Bearer "):
                token = token[7:]
            try:
                access_token = AccessToken(token)
                username = access_token['username']
                try:
                    user = Citzen.objects.get(user__username=username)
                except Citzen.DoesNotExist:
                    return JsonResponse({"error": "User does not exist"}, status=404)
                user = Citzen.objects.get(user__username=user)
                user.points += points_to_add
                user.save()
                print(f"Points: {user.points}")
                return JsonResponse({"points": user.points}, status=200)
            except (TokenError, InvalidToken):
                return JsonResponse({"error": "Invalid token"}, status=401)
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

def getPoints(request):
    if request.method == 'GET':
        print(f"Authorization Header: {request.headers.get('Authorization')}")
        try:
            token = request.headers.get('Authorization')
            if not token:
                return JsonResponse({"error": "Token is required"}, status=400)
            if token.startswith("Bearer "):
                token = token[7:]
            try:
                # Decode the token to get the user ID
                access_token = AccessToken(token)
                username = access_token['username']
                print(f"Username: {username}")
                
                # Fetch the user from the database
                try:
                    user = Citzen.objects.get(user__username=username)
                    print(f"User: {user}")
                except Citzen.DoesNotExist:
                    return JsonResponse({"error": "User does not exist"}, status=404)

                
                points = Citzen.objects.get(user__username=user).points
                print(f"Points: {points}")

                return JsonResponse({"points": points}, status=200)
            except (TokenError, InvalidToken):
                return JsonResponse({"error": "Invalid token"}, status=401)

        except Exception as e:
            print(f"Error in getPoints: {e}")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status = status.HTTP_405_METHOD_NOT_ALLOWED)
