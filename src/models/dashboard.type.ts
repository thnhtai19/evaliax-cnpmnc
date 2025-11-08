export interface Criteria {
    criteriaId: number;
    criteriaName: string;
    description: string;
    weight: number;
    category: string;
  }
  
  export interface CriteriaScore {
    criteria: Criteria;
    score: number;
    comment: string;
  }
  
  export interface Supervisor {
    id: number;
    name: string;
    email: string;
  }
  
  export interface Employee {
    id: number;
    name: string;
    email: string;
  }
  
  export interface Assessment {
    assessmentId: number;
    supervisor: Supervisor;
    employee: Employee;
    status: string;
    totalScore: number;
    criteriaScores: CriteriaScore[];
    createdAt: string;
  }
  
  export interface EmployeeAssessmentsResponse {
    message: string;
    status: number;
    data: Assessment[];
  }

  export interface MonthlyStat {
    year: number;
    month: number;
    totalAssessments: number;
    avgScore: number;
  }

  export interface DashboardData {
    employeeId: number;
    employeeName: string;
    overallAvgScore: number;
    totalAssessments: number;
    monthlyStats: MonthlyStat[];
  }

  export interface DashboardResponse {
    message: string;
    status: number;
    data: DashboardData;
  }
  
  