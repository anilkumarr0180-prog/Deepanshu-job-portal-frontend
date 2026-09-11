import { useState } from "react";
import toast from "react-hot-toast";
import { analyzeMatchApi } from "../api/ai.api";
import type { MatchAnalysisInput, MatchAnalysisResult } from "../types/ai.types";

export function useAiMatchScore() {
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchAnalysisResult | null>(null);

  const analyzeMatch = async (payload: MatchAnalysisInput) => {
    setIsLoading(true);
    try {
      const result = await analyzeMatchApi(payload);
      setMatchResult(result);
      toast.success("AI match score calculated!");
      return result;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to calculate match score with AI. Please try again.";
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setMatchResult(null);
    setIsLoading(false);
  };

  return {
    analyzeMatch,
    matchResult,
    isLoading,
    reset,
  };
}
