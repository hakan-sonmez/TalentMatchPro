import { getUncachableResendClient } from './resendClient';
import type { AnalysisResponse } from '@shared/schema';

export async function sendAnalysisEmail(
  toEmail: string,
  analysisResults: AnalysisResponse
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();

    const { candidates, genericQuestions, specificQuestions, topCandidateName } = analysisResults;

    // Separate candidates by category
    const interviewList = candidates.filter(c => c.category === 'interview');
    const backupList = candidates.filter(c => c.category === 'backup');
    const eliminateList = candidates.filter(c => c.category === 'eliminate');

    // Build HTML email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2563eb;
      font-size: 28px;
      margin-bottom: 10px;
    }
    h2 {
      color: #1e40af;
      font-size: 22px;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }
    h3 {
      color: #374151;
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .summary {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .summary-stat {
      display: inline-block;
      margin-right: 30px;
      font-size: 16px;
    }
    .summary-stat strong {
      color: #2563eb;
      font-size: 24px;
    }
    .candidate-card {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 12px;
    }
    .candidate-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .candidate-rank {
      background-color: #2563eb;
      color: white;
      font-weight: bold;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }
    .candidate-name {
      font-weight: 600;
      font-size: 18px;
      color: #111827;
    }
    .candidate-score {
      font-size: 24px;
      font-weight: bold;
      margin-left: auto;
    }
    .score-high { color: #059669; }
    .score-medium { color: #d97706; }
    .score-low { color: #dc2626; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .badge-interview {
      background-color: #d1fae5;
      color: #065f46;
    }
    .badge-backup {
      background-color: #fef3c7;
      color: #92400e;
    }
    .badge-eliminate {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .question-list {
      list-style: none;
      padding: 0;
    }
    .question-list li {
      background-color: #f9fafb;
      border-left: 3px solid #2563eb;
      padding: 12px 16px;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h1>🎯 Resume Analysis Results</h1>
    <p>Your AI-powered candidate analysis is complete. Here are the results:</p>
    
    <div class="summary">
      <div class="summary-stat">
        <strong>${candidates.length}</strong><br>
        Total Candidates
      </div>
      <div class="summary-stat">
        <strong>${interviewList.length}</strong><br>
        Interview Ready
      </div>
      <div class="summary-stat">
        <strong>${backupList.length}</strong><br>
        Backup Options
      </div>
      <div class="summary-stat">
        <strong>${eliminateList.length}</strong><br>
        Not Recommended
      </div>
    </div>

    <h2>📋 Interview List (Score: 80+)</h2>
    ${interviewList.length > 0 ? interviewList.map(c => `
      <div class="candidate-card">
        <div class="candidate-header">
          <span class="candidate-rank">${c.rank}</span>
          <div>
            <div class="candidate-name">${c.candidateName}</div>
            <div style="font-size: 14px; color: #6b7280;">${c.fileName}</div>
            <span class="badge badge-interview">Interview List</span>
          </div>
          <span class="candidate-score score-high">${c.score}</span>
        </div>
      </div>
    `).join('') : '<p style="color: #6b7280;">No candidates in this category</p>'}

    <h2>📌 Backup List (Score: 60-79)</h2>
    ${backupList.length > 0 ? backupList.map(c => `
      <div class="candidate-card">
        <div class="candidate-header">
          <span class="candidate-rank">${c.rank}</span>
          <div>
            <div class="candidate-name">${c.candidateName}</div>
            <div style="font-size: 14px; color: #6b7280;">${c.fileName}</div>
            <span class="badge badge-backup">Backup List</span>
          </div>
          <span class="candidate-score score-medium">${c.score}</span>
        </div>
      </div>
    `).join('') : '<p style="color: #6b7280;">No candidates in this category</p>'}

    <h2>❌ Eliminate List (Score: <60)</h2>
    ${eliminateList.length > 0 ? eliminateList.map(c => `
      <div class="candidate-card">
        <div class="candidate-header">
          <span class="candidate-rank">${c.rank}</span>
          <div>
            <div class="candidate-name">${c.candidateName}</div>
            <div style="font-size: 14px; color: #6b7280;">${c.fileName}</div>
            <span class="badge badge-eliminate">Eliminate</span>
          </div>
          <span class="candidate-score score-low">${c.score}</span>
        </div>
      </div>
    `).join('') : '<p style="color: #6b7280;">No candidates in this category</p>'}

    <h2>❓ Phone Screening Questions</h2>
    
    <h3>Generic Questions (All Candidates)</h3>
    <ul class="question-list">
      ${genericQuestions.map(q => `<li>${q}</li>`).join('')}
    </ul>

    <h3>Specific Questions for ${topCandidateName}</h3>
    <ul class="question-list">
      ${specificQuestions.map(q => `<li>${q}</li>`).join('')}
    </ul>

    <div class="footer">
      <p>Generated by AI Recruiter - Powered by OpenAI GPT-4o-mini</p>
    </div>
  </div>
</body>
</html>
    `;

    await client.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Resume Analysis Complete - ${candidates.length} Candidates Reviewed`,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
