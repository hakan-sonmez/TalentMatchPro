# AI Recruiter Application

## Overview
An AI-powered web application that analyzes candidate resumes against job descriptions, generates match scores, ranks candidates, and creates personalized phone screening questions using OpenAI's GPT-4o-mini model.

## Recent Changes (December 26, 2025)
- Built complete full-stack AI recruiter application
- Implemented resume parsing for PDF and DOCX files
- Integrated OpenAI for intelligent resume analysis and scoring
- Added SSRF protection for job URL fetching
- Implemented proper error handling with 400/500 status codes
- Created responsive frontend with Material Design principles
- Added dark mode support with theme toggle

## Project Architecture

### Frontend
- **Tech Stack**: React, TypeScript, Tailwind CSS, Shadcn UI components
- **Key Pages**:
  - Upload Page: Job URL input and resume file upload (up to 5 files)
  - Analysis Page: Real-time progress indicator during AI processing
  - Results Page: Candidate rankings, scores, categories, and screening questions
- **Features**: 
  - Drag-and-drop file upload
  - URL validation with visual feedback
  - Dark/light theme toggle
  - Responsive design for all screen sizes

### Backend
- **Tech Stack**: Express.js, TypeScript, Multer, OpenAI SDK
- **API Endpoints**:
  - `POST /api/analyze`: Main analysis endpoint accepting job URL and resume files
- **Processing Pipeline**:
  1. Validates job URL (prevents SSRF attacks)
  2. Fetches job description with 10-second timeout
  3. Extracts text from PDF/DOCX resume files
  4. Calls OpenAI to analyze each resume (score 0-100)
  5. Ranks candidates and categorizes:
     - 80+: Interview List
     - 60-79: Backup List
     - <60: Eliminate List
  6. Generates 3 generic + 3 candidate-specific screening questions

### Data Storage
- In-memory storage (MemStorage) for session data
- No database required for MVP
- Results stored temporarily during user session

## User Workflow
1. Enter job description URL
2. Upload 1-5 candidate resumes (PDF, DOCX, or DOC)
3. Click "Analyze Resumes"
4. View AI-generated scores, rankings, and screening questions
5. Start new analysis or review results

## Security Features
- SSRF protection: Blocks private IPs, localhost, internal networks
- File upload validation: Only PDF/DOCX/DOC, max 10MB per file
- Request timeout: 10 seconds for job URL fetching
- Proper error handling: Client errors return 400, server errors return 500
- Input validation: Zod schemas for all requests

## Environment Variables
- `OPENAI_API_KEY`: Required for AI resume analysis (already configured in Replit Secrets)
- `SESSION_SECRET`: Optional session management

## Testing
Since the application requires actual resume files and valid job URLs, manual testing is recommended:

1. Navigate to the application homepage
2. Enter a valid job posting URL (e.g., from LinkedIn, Indeed, company careers page)
3. Upload 1-5 resume files in PDF or DOCX format
4. Click "Analyze Resumes" and wait for AI processing (~15-30 seconds)
5. Review candidate scores, rankings, and screening questions
6. Test dark mode toggle
7. Click "New Analysis" to start over

## Cost Considerations
- Each analysis makes N+1 OpenAI API calls (N = number of resumes)
- Using gpt-4o-mini model for cost efficiency
- Typical cost per 5-resume analysis: ~$0.01-0.02

## Future Enhancements
- Database integration for saving analysis history
- PDF export of candidate reports
- Customizable scoring criteria and weights
- Batch processing for >5 resumes
- Side-by-side candidate comparison view
- Email integration for sending screening invitations
