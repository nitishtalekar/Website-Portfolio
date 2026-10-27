import data from "./resume.json";
import type { ResumeData } from "./types";

/** The bundled copy of the resume: the seed for Backbone and the fallback if it is unreachable. Edit resume.json. */
export const resumeData: ResumeData = data;
