import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { ZodError } from "zod";
import { storage } from "./storage";
import { analysisRequestSchema, analysisResponseSchema } from "@shared/schema";
import { extractTextFromFile } from "./lib/fileParser";
import { fetchJobDescription } from "./lib/webScraper";
import { analyzeResumes } from "./lib/analyzer";
import { sendAnalysisEmail } from "./lib/emailService";

// Configure multer for file uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5, // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and DOC files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Resume analysis endpoint
  app.post('/api/analyze', upload.array('resumes', 5), async (req, res) => {
    try {
      // Validate request body
      let jobUrl: string;
      let hiringManagerEmail: string | undefined;
      try {
        const parsed = analysisRequestSchema.parse(req.body);
        jobUrl = parsed.jobUrl;
        hiringManagerEmail = parsed.hiringManagerEmail;
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ 
            error: 'Invalid request',
            message: 'Job URL is required and must be a valid URL',
            details: error.errors 
          });
        }
        throw error;
      }
      
      // Ensure files were uploaded
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ 
          error: 'No resume files uploaded',
          message: 'Please upload at least one resume file' 
        });
      }

      if (files.length > 5) {
        return res.status(400).json({ 
          error: 'Too many files',
          message: 'Maximum 5 resumes allowed' 
        });
      }

      // Step 1: Fetch job description from URL
      let jobDescription: string;
      try {
        jobDescription = await fetchJobDescription(jobUrl);
      } catch (error) {
        return res.status(400).json({
          error: 'Failed to fetch job description',
          message: error instanceof Error ? error.message : 'Could not retrieve content from the provided URL'
        });
      }

      // Step 2: Extract text from all resume files
      let resumeTexts: { fileName: string; text: string }[];
      try {
        resumeTexts = await Promise.all(
          files.map(async (file) => ({
            fileName: file.originalname,
            text: await extractTextFromFile(file.buffer, file.mimetype),
          }))
        );
      } catch (error) {
        return res.status(400).json({
          error: 'Failed to parse resume files',
          message: error instanceof Error ? error.message : 'Could not extract text from one or more resume files'
        });
      }

      // Step 3: Analyze resumes using OpenAI
      let analysisResult;
      try {
        analysisResult = await analyzeResumes(resumeTexts, jobDescription);
      } catch (error) {
        console.error('OpenAI analysis error:', error);
        return res.status(500).json({
          error: 'AI analysis failed',
          message: 'Failed to analyze resumes. Please try again.'
        });
      }

      // Step 4: Send email (always to default recipient, optionally to second recipient)
      let emailSent = false;
      try {
        emailSent = await sendAnalysisEmail(hiringManagerEmail, analysisResult);
        console.log(`Email sent successfully: ${emailSent}`);
      } catch (error) {
        console.error('Failed to send email:', error);
      }

      // Add emailSent flag to response
      const finalResult = {
        ...analysisResult,
        emailSent,
      };

      // Validate response (relaxed validation)
      try {
        const validatedResult = analysisResponseSchema.parse(finalResult);
        res.json(validatedResult);
      } catch (error) {
        // If validation fails, return partial results with warning
        console.warn('Analysis result validation failed, returning partial results:', error);
        res.json(finalResult);
      }
    } catch (error) {
      console.error('Unexpected error analyzing resumes:', error);
      
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
