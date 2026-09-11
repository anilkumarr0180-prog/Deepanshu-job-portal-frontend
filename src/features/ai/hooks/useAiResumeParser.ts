import { useState } from "react";
import toast from "react-hot-toast";
import { parseResumeApi } from "../api/ai.api";
import type { ParsedResume } from "../types/ai.types";

export function useAiResumeParser() {
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);

  const parseResume = async (resumeUrl: string) => {
    setIsParsing(true);
    try {
      const data = await parseResumeApi({ resumeUrl });
      setParsedData(data);
      toast.success("Resume parsed successfully with AI!");
      return data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to parse resume with AI. Please make sure the PDF contains readable text.";
      toast.error(errorMessage);
      return null;
    } finally {
      setIsParsing(false);
    }
  };

  const reset = () => {
    setParsedData(null);
    setIsParsing(false);
  };

  return {
    parseResume,
    parsedData,
    isParsing,
    reset,
  };
}
