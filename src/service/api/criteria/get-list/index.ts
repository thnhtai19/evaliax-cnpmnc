import type { SearchCriteriaParams } from "@/components/criteria/types";
import apiClient from "@/lib/axios";
import type { Criteria } from "./types";

const URL_BASE = "/criteria";

export function getCriteriaList(params: SearchCriteriaParams): Promise<Criteria[]> {
  const http = apiClient;
  // Chỉ gửi các params có giá trị
  const queryParams: Record<string, string | number> = {};
  if (params.page) {
    queryParams.page = params.page;
  }
  if (params.limit) {
    queryParams.limit = params.limit;
  }
  if (params.searchText && params.searchText.trim() !== "") {
    queryParams.searchText = params.searchText.trim();
  }

  const res = http.get(URL_BASE, { params: queryParams });

  return res.then((res) => res.data.data);
}
