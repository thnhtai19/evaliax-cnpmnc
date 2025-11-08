import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

// Type definitions
export interface Employee {
  id: number;
  name: string;
  email: string;
}

export interface EmployeeReport {
  employee: Employee;
  averageScore: number;
  totalAssessments: number;
}

export interface EmployeeReportApiResponse {
  message: string;
  status: number;
  data: EmployeeReport[];
}

export async function getEmployeeReports(
  startDate?: string,
  endDate?: string,
  sort: "asc" | "desc" = "desc"
): Promise<EmployeeReport[]> {
  const params: Record<string, string> = {
    sort,
  };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await apiClient.get<EmployeeReportApiResponse>("/assessments/employee-average", {
    params,
  });
  return response.data.data;
}

export function useEmployeeReports(
  startDate?: string,
  endDate?: string,
  sort: "asc" | "desc" = "desc"
) {
  return useQuery({
    queryKey: ["employee-reports", startDate, endDate, sort],
    queryFn: () => getEmployeeReports(startDate, endDate, sort),
  });
}

