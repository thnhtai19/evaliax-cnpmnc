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

export async function getDashboardData(employeeId: number): Promise<DashboardData> {
  const response = await apiClient.get<DashboardResponse>(`/users/dashboard/${employeeId}`);
  return response.data.data;
}

export function useDashboardData(employeeId: number | undefined) {
  return useQuery({
    queryKey: ["dashboard-data", employeeId],
    queryFn: () => getDashboardData(employeeId!),
    enabled: !!employeeId,
  });
}

