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
  // Step 1: Analyze each resume and generate scores
  const analysisPromises = resumeTexts.map(async (resume) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert recruiter analyzing resumes against job descriptions. 
Your task is to:
1. Extract the candidate's name from the resume (if not found, use "Candidate")
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
            content: `Job Description:\n${jobDescription.slice(0, 5000)}\n\nResume:\n${resume.text.slice(0, 5000)}`,
          },
        ],
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse with error handling
      let analysis: ResumeAnalysis;
      try {
        analysis = JSON.parse(content);
      } catch {
        // If JSON parsing fails, create a fallback response
        analysis = {
          candidateName: 'Candidate',
          score: 50,
          reasoning: 'Unable to parse analysis'
        };
      }

      // Ensure score is within valid range
      analysis.score = Math.max(0, Math.min(100, analysis.score));
      
      return {
        ...analysis,
        fileName: resume.fileName,
      };
    } catch (error) {
      console.error(`Error analyzing resume ${resume.fileName}:`, error);
      // Return a fallback analysis for failed resumes
      return {
        candidateName: 'Candidate',
        fileName: resume.fileName,
        score: 0,
        reasoning: 'Analysis failed'
      };
    }
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
  const topResumeText = resumeTexts.find(r => r.fileName === topCandidate.fileName)?.text || '';

  let genericQuestions: string[] = [];
  let specificQuestions: string[] = [];

  try {
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
          content: `Job Description:\n${jobDescription.slice(0, 5000)}\n\nTop Candidate: ${topCandidate.candidateName}\nTop Candidate Resume:\n${topResumeText.slice(0, 5000)}`,
        },
      ],
      temperature: 0.7,
    });

    const questionsContent = questionsResponse.choices[0].message.content;
    if (questionsContent) {
      try {
        const questions = JSON.parse(questionsContent);
        
        // Extract questions with flexible validation
        if (Array.isArray(questions.genericQuestions)) {
          genericQuestions = questions.genericQuestions.slice(0, 3);
        }
        if (Array.isArray(questions.specificQuestions)) {
          specificQuestions = questions.specificQuestions.slice(0, 3);
        }
      } catch (error) {
        console.error('Failed to parse questions JSON:', error);
      }
    }
  } catch (error) {
    console.error('Error generating screening questions:', error);
  }

  // Ensure we always have 3 questions of each type
  while (genericQuestions.length < 3) {
    genericQuestions.push(`Tell me about your experience relevant to this role.`);
  }
  while (specificQuestions.length < 3) {
    specificQuestions.push(`Can you elaborate on your background mentioned in your resume?`);
  }

  // Ensure exactly 3 questions of each type
  genericQuestions = genericQuestions.slice(0, 3);
  specificQuestions = specificQuestions.slice(0, 3);

  return {
    candidates,
    genericQuestions,
    specificQuestions,
    topCandidateName: topCandidate.candidateName,
  };
}
