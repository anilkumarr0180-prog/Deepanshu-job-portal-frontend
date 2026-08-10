/**
 * Recursively removes empty strings (""), null, and undefined values from payload objects.
 * Empty arrays ([]) are preserved.
 * Empty nested objects resulting from cleaning are omitted.
 *
 * @template T
 * @param {T} obj - The input object to clean.
 * @returns {Partial<T>} The cleaned payload object with empty primitives removed.
 */
export function removeEmptyFields<T>(obj: T): Partial<T> {
  if (obj === null || obj === undefined) {
    return {} as Partial<T>;
  }

  if (typeof obj !== "object") {
    return obj as unknown as Partial<T>;
  }

  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== "" && item !== null && item !== undefined)
      .map((item) =>
        typeof item === "object" && item !== null
          ? removeEmptyFields(item)
          : item
      ) as unknown as Partial<T>;
  }

  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value === "" || value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      const cleanedArray = value
        .filter((item) => item !== "" && item !== null && item !== undefined)
        .map((item) =>
          typeof item === "object" && item !== null
            ? removeEmptyFields(item)
            : item
        );
      cleaned[key] = cleanedArray;
    } else if (typeof value === "object") {
      const cleanedNested = removeEmptyFields(value);
      if (Object.keys(cleanedNested).length > 0) {
        cleaned[key] = cleanedNested;
      }
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned as Partial<T>;
}
