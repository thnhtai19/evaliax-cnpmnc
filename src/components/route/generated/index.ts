export const generateSearchCriteria = (asPath: string, params: Record<string, string>) => {
  const url = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    url.set(key, value);
  });
  return `${asPath}?${url.toString()}`;
};
