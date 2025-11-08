import apiClient from "@/lib/axios";

const URL_BASE = "/criteria";

export interface DeleteCriteriaResponse {
  message: string;
  status: number;
  data: null;
}

export function deleteCriteria(criteriaId: number): Promise<DeleteCriteriaResponse> {
  const http = apiClient;

  // Validate criteriaId
  if (!criteriaId || isNaN(criteriaId)) {
    console.error("Invalid criteriaId:", criteriaId);
    return Promise.reject(new Error("Invalid criteriaId"));
  }

  const url = `${URL_BASE}/${criteriaId}`;
  console.log("Delete criteria URL:", url);

  const res = http.delete(url);

  return res.then((res) => res.data);
}
