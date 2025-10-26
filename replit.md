# AI Recruiter Application

## Overview
An AI-powered web application that analyzes candidate resumes against job descriptions, generates match scores, ranks candidates, and creates personalized phone screening questions using OpenAI's GPT-4o-mini model. Now includes email delivery of analysis results to hiring managers.

## Recent Changes (December 26, 2025)
- Built complete full-stack AI recruiter application
- Implemented resume parsing for PDF and DOCX files
- Integrated OpenAI for intelligent resume analysis and scoring
- Added SSRF protection for job URL fetching
- Implemented proper error handling with 400/500 status codes
- Created responsive frontend with Material Design principles
- Added dark mode support with theme toggle
- Integrated Resend for automated email delivery of analysis results
- Added hiring manager email input with validation
- Professional HTML email template with candidate rankings and screening questions
- **FIXED**: JSON parsing issue causing all resumes to score 50
- **FIXED**: Switched to gpt-4o-mini for 90% cost savings
- **ADDED**: Enhanced error logging for debugging OpenAI responses

## Project Architecture

### Frontend
- **Tech Stack**: React, TypeScript, Tailwind CSS, Shadcn UI components
- **Key Pages**:
  - Upload Page: Job URL input, hiring manager email (optional), and resume file upload (up to 5 files)
  - Analysis Page: Real-time progress indicator during AI processing
  - Results Page: Candidate rankings, scores, categories, screening questions, and email confirmation
- **Features**: 
  - Drag-and-drop file upload
  - URL and email validation with visual feedback
  - Optional email delivery to hiring managers
  - Dark/light theme toggle
  - Responsive design for all screen sizes

### Backend
- **Tech Stack**: Express.js, TypeScript, Multer, OpenAI SDK (gpt-4o-mini), Resend
- **API Endpoints**:
  - `POST /api/analyze`: Main analysis endpoint accepting job URL, optional hiring manager email, and resume files
- **Processing Pipeline**:
  1. Validates job URL (prevents SSRF attacks)
  2. Fetches job description with 10-second timeout
  3. Extracts text from PDF/DOCX resume files
  4. Calls OpenAI gpt-4o-mini to analyze each resume (score 0-100)
  5. Ranks candidates and categorizes:
     - 80+: Interview List
     - 60-79: Backup List
     - <60: Eliminate List
  6. Generates 3 generic + 3 candidate-specific screening questions using gpt-4o-mini
  7. Sends professional HTML email to hiring manager (if email provided)

### Email Integration
- **Service**: Resend (via Replit connector)
- **Delivery**: Non-blocking - analysis completes even if email fails
- **Template**: Professional HTML format with:
  - Summary statistics (total candidates, category counts)
  - Candidate cards with ranks, scores, and categories
  - Color-coded scores (green/yellow/red)
  - Generic and candidate-specific screening questions
- **Optional**: Email field is optional - analysis works with or without it

### Data Storage
- In-memory storage (MemStorage) for session data
- No database required for MVP
- Results stored temporarily during user session

## User Workflow
1. Enter job description URL
2. (Optional) Enter hiring manager email for automatic results delivery
3. Upload 1-5 candidate resumes (PDF, DOCX, or DOC)
4. Click "Analyze Resumes"
5. View AI-generated scores, rankings, and screening questions
6. If email provided, hiring manager receives comprehensive HTML report
7. Start new analysis or review results

## Security Features
- SSRF protection: Blocks private IPs, localhost, internal networks
- File upload validation: Only PDF/DOCX/DOC, max 10MB per file
- Request timeout: 10 seconds for job URL fetching
- Proper error handling: Client errors return 400, server errors return 500
- Input validation: Zod schemas for all requests
- Email validation: Frontend and backend validation for email format

## Environment Variables
- `OPENAI_API_KEY`: Required for AI resume analysis (already configured in Replit Secrets)
- `SESSION_SECRET`: Optional session management
- Resend API credentials: Managed automatically via Replit connector

## Testing
Since the application requires actual resume files and valid job URLs, manual testing is recommended:

1. Navigate to the application homepage
2. Enter a valid job posting URL (e.g., from LinkedIn, Indeed, company careers page)
3. (Optional) Enter hiring manager email to test email delivery
4. Upload 1-5 resume files in PDF or DOCX format
5. Click "Analyze Resumes" and wait for AI processing (~15-30 seconds)
6. Review candidate scores, rankings, and screening questions
7. If email was provided, check inbox for HTML report
8. Test dark mode toggle
9. Click "New Analysis" to start over

## Cost Considerations
- Each analysis makes N+1 OpenAI API calls (N = number of resumes)
- Using gpt-4o-mini model for cost efficiency
- Email delivery via Resend (check Resend pricing for volume)
- Typical cost per 5-resume analysis: ~$0.01-0.02 (OpenAI only)

## Future Enhancements
- Database integration for saving analysis history
- PDF export of candidate reports
- Customizable scoring criteria and weights
- Batch processing for >5 resumes
- Side-by-side candidate comparison view
- Email customization (templates, branding)
- Email delivery status tracking
- Scheduled report delivery
