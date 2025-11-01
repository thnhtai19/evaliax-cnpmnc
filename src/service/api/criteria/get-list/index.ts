import type { SearchCriteriaParams } from "@/components/criteria/types";
import apiClient from "@/lib/axios";
import type { SearchCriteriaResponse } from "./types";

const URL_BASE = "/criteria";

export function getCriteriaList(params: SearchCriteriaParams): Promise<SearchCriteriaResponse> {
  const http = apiClient;
  const res = http.get(URL_BASE, { params: params });

  return res.then((res) => res.data.payload);
}
