import { useCallback, useEffect, useState } from "react";
import type { SearchCriteriaParams } from "../types";
import { useRouterParam } from "./useRouterParam";
import { useQuery } from "@tanstack/react-query";
import { getCriteriaList } from "@/service/api/criteria/get-list";

export const useSearchCriteria = () => {
  const { searchText, page } = useRouterParam();

  const [searchParams, setSearchParams] = useState<SearchCriteriaParams>({
    page: page,
  });

  const queryFn = useCallback(() => {
    return getCriteriaList(searchParams);
  }, [searchParams]);

  useEffect(() => {
    const request: SearchCriteriaParams = {
      page: page,
      limit: 5,
    };
    if (searchText && searchText.trim() !== "") {
      request.searchText = searchText.trim();
    }

    setSearchParams(request);
  }, [searchText, page]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["criteria", searchParams],
    queryFn: queryFn,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return { data, isLoading, error };

  // const { } = useQuery([
  //     key:[]
  // ])
};
