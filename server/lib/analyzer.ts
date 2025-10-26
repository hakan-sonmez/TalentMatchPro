import OpenAI from 'openai';
import { type CandidateResult, type AnalysisResponse } from '@shared/schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ResumeAnalysis {
  candidateName: string;
  score: number;
  reasoning: string;
}

export async function analyzeResumes(
  resumeTexts: { fileName: string; text: string }[],
  jobDescription: string
): Promise<AnalysisResponse> {
  try {
    // Step 1: Analyze each resume and generate scores
    const analysisPromises = resumeTexts.map(async (resume) => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert recruiter analyzing resumes against job descriptions. 
Your task is to:
1. Extract the candidate's name from the resume
2. Score the resume from 0-100 based on how well it matches the job requirements
3. Provide brief reasoning for the score

Return ONLY valid JSON in this exact format:
{
  "candidateName": "Full Name",
  "score": 85,
  "reasoning": "Brief explanation"
}`,
          },
          {
            role: 'user',
            content: `Job Description:\n${jobDescription}\n\nResume:\n${resume.text}`,
          },
        ],
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const analysis: ResumeAnalysis = JSON.parse(content);
      return {
        ...analysis,
        fileName: resume.fileName,
      };
    });

    const analyses = await Promise.all(analysisPromises);

    // Step 2: Sort by score and assign ranks and categories
    const sortedAnalyses = analyses.sort((a, b) => b.score - a.score);

    const candidates: CandidateResult[] = sortedAnalyses.map((analysis, index) => {
      let category: 'interview' | 'backup' | 'eliminate';
      if (analysis.score >= 80) {
        category = 'interview';
      } else if (analysis.score >= 60) {
        category = 'backup';
      } else {
        category = 'eliminate';
      }

      return {
        candidateName: analysis.candidateName,
        fileName: analysis.fileName,
        score: analysis.score,
        category,
        rank: index + 1,
      };
    });

    // Step 3: Generate screening questions
    const topCandidate = candidates[0];

    const questionsResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert recruiter creating phone screening questions.
Generate exactly 6 questions:
- 3 generic questions applicable to all candidates for this role
- 3 specific questions tailored to the top candidate's experience

Return ONLY valid JSON in this exact format:
{
  "genericQuestions": ["question 1", "question 2", "question 3"],
  "specificQuestions": ["question 1", "question 2", "question 3"]
}`,
        },
        {
          role: 'user',
          content: `Job Description:\n${jobDescription}\n\nTop Candidate: ${topCandidate.candidateName}\nTop Candidate Resume:\n${resumeTexts.find(r => r.fileName === topCandidate.fileName)?.text}`,
        },
      ],
      temperature: 0.7,
    });

    const questionsContent = questionsResponse.choices[0].message.content;
    if (!questionsContent) {
      throw new Error('No questions response from OpenAI');
    }

    const questions: {
      genericQuestions: string[];
      specificQuestions: string[];
    } = JSON.parse(questionsContent);

    return {
      candidates,
      genericQuestions: questions.genericQuestions,
      specificQuestions: questions.specificQuestions,
      topCandidateName: topCandidate.candidateName,
    };
  } catch (error) {
    console.error('Error analyzing resumes:', error);
    throw new Error(`Failed to analyze resumes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
