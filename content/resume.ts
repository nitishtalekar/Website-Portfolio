import data from "./resume.json";
import type { Resume } from "./types";

/** The single source of truth. Edit resume.json; this only gives it a type. */
export const resume: Resume = data;
