import type { BackendProfile } from "../api/profile.api";
import type { CandidateProfileCompletion } from "../types";

interface ProfileField {
  label: string;
  filled: boolean;
}

export function calculateProfileCompletion(
  profile: BackendProfile
): CandidateProfileCompletion {
  const fields: ProfileField[] = [
    {
      label: "Personal details",
      filled: Boolean(profile.name && profile.email),
    },
    {
      label: "Phone number",
      filled: Boolean(profile.phone),
    },
    {
      label: "Profile picture",
      filled: Boolean(profile.profilePicture),
    },
    {
      label: "Resume",
      filled: Boolean(profile.resumeUrl),
    },
  ];

  const completed = fields
    .filter((field) => field.filled)
    .map((field) => field.label);

  const remaining = fields
    .filter((field) => !field.filled)
    .map((field) => field.label);

  const percentage = Math.round((completed.length / fields.length) * 100);

  return { percentage, completed, remaining };
}
