from django.shortcuts import render
from .models import RouteReport
from user.models import Citzen
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
# Create your views here.


@csrf_exempt
def AddRouteReport(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            print(data)
            routeName = data['routeName']
            reportTitle = data['reportTitle']
            reportDetails = data['reportDetails']
            username = data['username']
            try:
                user = Citzen.objects.get(username=username)
            except Citzen.DoesNotExist:
                return JsonResponse({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
            
            
            RouteReport.objects.create(
                user=user,
                route_name=routeName,
                report_title=reportTitle,
                report_details=reportDetails,
                status = 'open',
                reason = None
            )
            return JsonResponse({"message": "Report created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
def getReports(request):
    if request.method == 'GET':
        reports = RouteReport.objects.all()
        report_list = []
        for report in reports:
            report_list.append({
                "id": report.id,
                "user": report.user.username,
                "route_name": report.route_name,
                "report_title": report.report_title,
                "report_details": report.report_details,
                "created_at": report.created_at,
                "status": report.status,
                "reason": report.reason
            })
        return JsonResponse(report_list, safe=False, status=status.HTTP_200_OK)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

def getReportById(request, report_id):
    if request.method == 'GET':
        try:
            report = RouteReport.objects.get(id=report_id)
            report_data = {
                "id": report.id,
                "user": report.user.username,
                "route_name": report.route_name,
                "report_title": report.report_title,
                "report_details": report.report_details,
                "created_at": report.created_at,
                "status": report.status,
                "reason": report.reason
            }
            return JsonResponse(report_data, status=status.HTTP_200_OK)
        except RouteReport.DoesNotExist:
            return JsonResponse({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

@csrf_exempt
def closeReport(request, report_id):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            reason = data.get('reason', '').strip()

            if not reason:
                return JsonResponse({"error": "Reason is required to close the report."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                report = RouteReport.objects.get(id=report_id)
                if report.status == 'closed':
                    return JsonResponse({"error": "Report is already closed."}, status=status.HTTP_400_BAD_REQUEST)

                report.status = 'closed'
                report.reason = reason
                report.save()

                return JsonResponse({"message": "Report closed successfully."}, status=status.HTTP_200_OK)
            except RouteReport.DoesNotExist:
                return JsonResponse({"error": "Report not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)