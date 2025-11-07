import apiClient from "@/lib/axios";

const URL_BASE = "/assessments";

export interface CreateAssessmentRequest {
  employeeId: number;
  scores: {
    criteriaId: number;
    score: number;
    comment: string;
  }[];
}

export interface CreateAssessmentResponse {
  message: string;
  status: number;
  data: {
    assessmentId: number;
    supervisor: {
      id: number;
      name: string;
      email: string;
    };
    employee: {
      id: number;
      name: string;
      email: string;
    };
    status: string;
    totalScore: number;
    criteriaScores: {
      criteria: {
        criteriaId: number;
        name: string;
        description: string;
        weight: number;
        category: string;
      };
      score: number;
      comment: string;
    }[];
  };
}

export function createAssessment(data: CreateAssessmentRequest): Promise<CreateAssessmentResponse> {
  const http = apiClient;
  const res = http.post(URL_BASE, data);

  return res.then((res) => res.data);
}
