import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type { Assessment, EmployeeAssessmentsResponse } from "@/models/dashboard.type";

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

