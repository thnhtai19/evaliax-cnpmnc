export interface UpdateCriteriaRequest {
  name: string;
  description: string;
  weight: number;
  category: "HARDSKILL" | "SOFTSKILL";
}

export interface UpdateCriteriaResponse {
  message: string;
  status: number;
  data: {
    id: number;
    name: string;
    description: string;
    weight: number;
    category: "HARDSKILL" | "SOFTSKILL";
  };
}

