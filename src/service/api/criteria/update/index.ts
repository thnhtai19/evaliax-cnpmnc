import apiClient from "@/lib/axios";
import type { UpdateCriteriaRequest, UpdateCriteriaResponse } from "./types";

const URL_BASE = "/criteria";

export function updateCriteria(criteriaId: number, data: UpdateCriteriaRequest): Promise<UpdateCriteriaResponse> {
  const http = apiClient;

  const url = `${URL_BASE}/${criteriaId}`;
  const res = http.patch<UpdateCriteriaResponse>(url, data);

  return res.then((res) => res.data);
}

