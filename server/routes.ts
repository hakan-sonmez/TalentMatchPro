import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { analysisRequestSchema, analysisResponseSchema } from "@shared/schema";
import { extractTextFromFile } from "./lib/fileParser";
import { fetchJobDescription } from "./lib/webScraper";
import { analyzeResumes } from "./lib/analyzer";

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
      const { jobUrl } = analysisRequestSchema.parse(req.body);
      
      // Ensure files were uploaded
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No resume files uploaded' });
      }

      if (files.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 resumes allowed' });
      }

      // Step 1: Fetch job description from URL
      const jobDescription = await fetchJobDescription(jobUrl);

      // Step 2: Extract text from all resume files
      const resumeTexts = await Promise.all(
        files.map(async (file) => ({
          fileName: file.originalname,
          text: await extractTextFromFile(file.buffer, file.mimetype),
        }))
      );

      // Step 3: Analyze resumes using OpenAI
      const analysisResult = await analyzeResumes(resumeTexts, jobDescription);

      // Validate response
      const validatedResult = analysisResponseSchema.parse(analysisResult);

      // Return the analysis results
      res.json(validatedResult);
    } catch (error) {
      console.error('Error analyzing resumes:', error);
      
      if (error instanceof Error) {
        res.status(500).json({ 
          error: 'Failed to analyze resumes',
          message: error.message 
        });
      } else {
        res.status(500).json({ error: 'Failed to analyze resumes' });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
