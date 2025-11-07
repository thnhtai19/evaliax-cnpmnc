import apiClient from "@/lib/axios";

const URL_BASE = "/assessments";

export interface UpdateAssessmentRequest {
  employeeId: number;
  scores: {
    criteriaId: number;
    score: number;
    comment: string;
  }[];
}

export interface UpdateAssessmentResponse {
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

export function updateAssessment(
  assessmentId: number,
  data: UpdateAssessmentRequest,
): Promise<UpdateAssessmentResponse> {
  const http = apiClient;
  const res = http.put(`${URL_BASE}/${assessmentId}`, data);

  return res.then((res) => res.data);
}
