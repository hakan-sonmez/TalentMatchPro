import { z } from "zod";

// Candidate analysis result schema
export const candidateResultSchema = z.object({
  candidateName: z.string(),
  fileName: z.string(),
  score: z.number().min(0).max(100),
  category: z.enum(['interview', 'backup', 'eliminate']),
  rank: z.number(),
});

export type CandidateResult = z.infer<typeof candidateResultSchema>;

// Analysis request schema
export const analysisRequestSchema = z.object({
  jobUrl: z.string().url(),
  hiringManagerEmail: z.string().email().optional(),
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;

// Analysis response schema - relaxed validation
export const analysisResponseSchema = z.object({
  candidates: z.array(candidateResultSchema),
  genericQuestions: z.array(z.string()).min(1).max(3),
  specificQuestions: z.array(z.string()).min(1).max(3),
  topCandidateName: z.string(),
  emailSent: z.boolean().optional(),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
