import { useQuery } from "@tanstack/react-query";

export function useProblems() {
  return useQuery({
    queryKey: ["problem"],
    queryFn: async () => {
      const response = await fetch("/api/problems");
      if (!response.ok) throw new Error("Failed to fetch problems");
      const data = await response.json();
      return data;
    },
    refetchInterval: 3600000, // every hour just in case we add something new.
    refetchIntervalInBackground: false,
  });
}
