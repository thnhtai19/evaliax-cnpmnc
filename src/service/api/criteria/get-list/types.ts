export interface Criteria {
  criteriaId: number;
  name: string;
  description: string;
  weight: number;
  category: "HARDSKILL" | "SOFTSKILL" | string;
}

export interface SearchCriteriaResponse {
  message: string;
  status: number;
  payload: {
    data: Criteria[];
  };
}
