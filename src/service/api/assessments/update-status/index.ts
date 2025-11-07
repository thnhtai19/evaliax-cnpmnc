import apiClient from "@/lib/axios";

const URL_BASE = "/assessments";

export interface UpdateStatusRequest {
  status: string;
}

export interface UpdateStatusResponse {
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

export function updateAssessmentStatus(assessmentId: number, data: UpdateStatusRequest): Promise<UpdateStatusResponse> {
  const http = apiClient;
  const res = http.patch(`${URL_BASE}/${assessmentId}/status`, data);

  return res.then((res) => res.data);
}
