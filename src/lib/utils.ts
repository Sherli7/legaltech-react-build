import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 o";
  const units = ["o", "Ko", "Mo", "Go"];
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, idx);
  return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
};

type FileValidationConfig = {
  maxSize: number;
  allowedTypes: string[];
};

export const validateFile = (file: File, config: FileValidationConfig) => {
  const errors: string[] = [];

  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const allowedExtensions = config.allowedTypes.map((t) => t.replace("*.", "").toLowerCase());

  if (!allowedExtensions.includes(extension)) {
    errors.push("Format de fichier non autorisé");
  }

  if (file.size > config.maxSize) {
    errors.push("Fichier trop volumineux");
  }

  return errors;
};
