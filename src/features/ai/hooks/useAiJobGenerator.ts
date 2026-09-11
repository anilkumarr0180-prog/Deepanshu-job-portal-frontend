import { useState } from "react";
import toast from "react-hot-toast";
import { generateJobDescriptionApi } from "../api/ai.api";
import type {
  GenerateJobDescriptionInput,
  GeneratedJobDescription,
} from "../types/ai.types";

export function useAiJobGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedJobDescription | null>(null);

  const generateJob = async (input: GenerateJobDescriptionInput) => {
    setIsLoading(true);
    try {
      const data = await generateJobDescriptionApi(input);
      setGeneratedData(data);
      toast.success("Job description drafted with AI!");
      return data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to generate job description with AI. Please try again.";
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setGeneratedData(null);
    setIsLoading(false);
  };

  return {
    generateJob,
    generatedData,
    isLoading,
    reset,
  };
}
