import { useQuery } from "@tanstack/react-query";
import { Problem } from "../../../generated/prisma/client";

export function useProblem(id: string | undefined) {
  return useQuery({
    queryKey: ["problem", id],
    queryFn: async () => {
      const response = await fetch(`/api/problems/${id}`);
      if (!response.ok) throw new Error("Failed to fetch problem");
      const data = await response.json();
      return data as Problem;
    },
  });
}
