import { type CandidateResult, type AnalysisResponse } from "@shared/schema";

// Storage interface for candidate analysis results
export interface IStorage {
  saveAnalysisResult(id: string, result: AnalysisResponse): Promise<void>;
  getAnalysisResult(id: string): Promise<AnalysisResponse | undefined>;
}

export class MemStorage implements IStorage {
  private analysisResults: Map<string, AnalysisResponse>;

  constructor() {
    this.analysisResults = new Map();
  }

  async saveAnalysisResult(id: string, result: AnalysisResponse): Promise<void> {
    this.analysisResults.set(id, result);
  }

  async getAnalysisResult(id: string): Promise<AnalysisResponse | undefined> {
    return this.analysisResults.get(id);
  }
}

export const storage = new MemStorage();
