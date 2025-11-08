import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type { Assessment, EmployeeAssessmentsResponse, DashboardResponse, DashboardData } from "@/models/dashboard.type";

export async function getEmployeeAssessments(): Promise<Assessment[]> {
  const response = await apiClient.get<EmployeeAssessmentsResponse>("/assessments/employee");
  return response.data.data;
}

export function useEmployeeAssessments() {
  return useQuery({
    queryKey: ["employee-assessments"],
    queryFn: getEmployeeAssessments,
  });
}

export async function getDashboardData(
  employeeId: number,
  startDate?: string,
  endDate?: string
): Promise<DashboardData> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const queryString = params.toString();
  const url = `/users/dashboard/${employeeId}${queryString ? `?${queryString}` : ""}`;
  
  const response = await apiClient.get<DashboardResponse>(url);
  return response.data.data;
}

export function useDashboardData(
  employeeId: number | undefined,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["dashboard-data", employeeId, startDate, endDate],
    queryFn: () => getDashboardData(employeeId!, startDate, endDate),
    enabled: !!employeeId,
  });
}

