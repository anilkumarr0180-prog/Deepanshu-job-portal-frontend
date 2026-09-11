// ==========================================
// 1. RECRUITER: JOB GENERATOR TYPES
// ==========================================
export interface GenerateJobDescriptionInput {
  jobTitle: string;
  skills: string[];
  experienceLevel?: "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  jobType?: "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote" | "Hybrid";
  additionalNotes?: string;
}

export interface GeneratedJobDescription {
  title: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  suggestedTags: string[];
}

// ==========================================
// 2. CANDIDATE: RESUME PARSER TYPES
// ==========================================
export interface ParsedResume {
  personalInfo: {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    headline: string | null;
    summary: string | null;
    portfolioUrls: string[];
  };
  totalYearsExperience: number;
  skills: {
    technical: string[];
    soft: string[];
  };
  experience: Array<{
    company: string;
    role: string;
    duration: string | null;
    description: string | null;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string | null;
    year: string | null;
  }>;
  certifications: string[];
}

// ==========================================
// 3. ATS MATCH SCORE TYPES
// ==========================================
export interface MatchAnalysisInput {
  jobId?: string;
  candidateProfile: {
    skills: string[];
    experienceYears?: number;
    summary?: string;
  };
  jobRequirements: {
    title: string;
    requiredSkills: string[];
    description: string;
  };
}

export interface MatchAnalysisResult {
  overallScore: number;
  grade: "STRONG_FIT" | "POTENTIAL_FIT" | "BORDERLINE" | "NOT_RECOMMENDED";
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  actionableFeedback: string[];
  suggestedInterviewQuestions: string[];
}
