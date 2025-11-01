import { useSearchParams } from "react-router-dom";

export const useRouterParam = () => {
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("searchText") || "";
  const page = Number(searchParams.get("page")) || 1;

  return { searchText, page };
};
