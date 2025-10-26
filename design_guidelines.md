# Design Guidelines: AI Recruiter Web Application

## Design Approach
**Selected System**: Material Design
**Justification**: This enterprise recruiting tool requires clear data hierarchy, strong visual feedback for interactive elements, and robust components for file uploads, scoring displays, and multi-state categorization. Material Design excels at information-dense applications with its emphasis on elevation, clear boundaries, and systematic organization.

## Typography System

**Font Family**: Roboto (via Google Fonts CDN)
- Primary: Roboto (400, 500, 700 weights)
- Monospace: Roboto Mono for scores and numerical data

**Hierarchy**:
- Page Titles: text-3xl font-bold (Dashboard, Results)
- Section Headers: text-xl font-semibold (Upload Resumes, Candidate Rankings)
- Card Titles/Candidate Names: text-lg font-medium
- Body Text: text-base font-normal
- Helper Text/Labels: text-sm font-normal
- Scores/Metrics: text-2xl font-bold (monospace)
- Badges/Tags: text-xs font-medium uppercase tracking-wide

## Layout System

**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16 (p-2, m-4, gap-6, etc.)

**Container Structure**:
- Main container: max-w-6xl mx-auto px-6 py-8
- Section spacing: mb-12 between major sections
- Card padding: p-6 for content cards
- Form groups: space-y-4

**Grid System**:
- Resume upload cards: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Results table: Full-width responsive table
- Question cards: space-y-4 stacked layout

## Component Library

### 1. Navigation/Header
- Fixed top header with application title
- Breadcrumb navigation showing current step
- Progress indicator showing: Upload → Analysis → Results
- Height: h-16 with shadow-md elevation

### 2. File Upload Zone
- Large dropzone area (min-h-64) with dashed border
- Icon: Upload cloud icon from Heroicons
- Drag-and-drop active state with border emphasis
- File counter: "0/5 resumes uploaded"
- Individual file cards showing:
  - Document icon
  - Filename (truncated with ellipsis)
  - File size
  - Remove button (small icon button)
- Grid layout for uploaded files: grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4

### 3. URL Input Section
- Full-width input field with clear label
- Prefix icon (link icon from Heroicons)
- Helper text below: "Paste the job description URL"
- Validation feedback area

### 4. Action Buttons
- Primary CTA: "Analyze Resumes" - Large button w-full md:w-auto px-8 py-3
- Secondary actions: Outlined buttons
- Icon buttons for remove/delete actions
- All buttons: rounded-lg with shadow-sm

### 5. Results Dashboard - Score Cards
Each candidate card displays:
- Card elevation: shadow-lg rounded-xl p-6
- Top section: Candidate name (text-lg font-semibold) + Score badge
- Score display: Large circular or rectangular badge
  - Score number: text-3xl font-bold (monospace)
  - "/100" label below
- Category badge positioned at top-right:
  - "INTERVIEW LIST" / "BACKUP LIST" / "ELIMINATE LIST"
  - Badges: px-3 py-1 rounded-full text-xs font-medium uppercase
- File name reference below name
- Expand/collapse icon for viewing details

### 6. Ranked List Table
- Responsive table with alternating row treatment
- Columns: Rank | Name | Score | Category | Actions
- Rank column: Uses medal icons (🥇🥈🥉) for top 3, numbers for rest
- Score column: Bold monospace numbers
- Category column: Inline badges matching card design
- Actions: "View Details" link button
- Mobile: Stack into cards on small screens

### 7. Screening Questions Section
- Two distinct subsections with clear headers
- "Generic Questions" card:
  - Numbered list (1-3)
  - Each question in text-base
  - Space between questions: space-y-3
- "Top Candidate Questions" card:
  - Shows candidate name prominently
  - Numbered list (1-3)
  - Same styling as generic questions
- Both sections: Elevated cards with p-6 padding

### 8. Status Indicators
- Loading states: Spinner icon with "Analyzing resumes..." text
- Progress bar during analysis
- Success checkmarks when complete
- Error states with warning icons and clear messaging

### 9. Icon System
**Primary Library**: Heroicons (via CDN)
- Upload: cloud-arrow-up
- Link/URL: link
- Document: document-text
- Remove/Delete: x-mark or trash
- Success: check-circle
- Warning: exclamation-triangle
- Expand: chevron-down
- Info: information-circle

## Information Architecture

**Step 1 - Upload Page**:
1. Header with app title + progress indicator
2. Job URL input section (prominent placement)
3. Resume upload zone (large, central focus)
4. Uploaded files preview grid
5. Analyze button (sticky bottom or prominent placement)

**Step 2 - Analysis (Transition)**:
- Full-screen loading overlay or modal
- Progress indicator
- Status message
- Animated analyzing state

**Step 3 - Results Page**:
1. Header with summary metrics (e.g., "5 candidates analyzed")
2. Quick stats row: Interview-ready count, Backup count, Eliminated count
3. Ranked candidate list/table (primary focus)
4. Screening questions section below rankings
5. Actions: "Start New Analysis" button

## Responsive Behavior

**Desktop (lg: 1024px+)**:
- Side-by-side layouts for upload + preview
- Full table view for results
- Multi-column grids

**Tablet (md: 768px-1023px)**:
- 2-column grids where applicable
- Condensed table or card-hybrid view

**Mobile (< 768px)**:
- Single column stacking
- Full-width buttons
- Cards replace tables
- Simplified navigation

## Data Visualization

**Score Representation**:
- Use circular progress indicators or horizontal bars
- Clear numerical display alongside visual representation
- Consistent scale (0-100) across all displays

**Category Differentiation**:
- Distinct badge shapes or styles for each category
- Icons optional (✓ for interview, ⌚ for backup, ✗ for eliminate)
- Consistent positioning across all views

## Forms & Inputs

**File Upload**:
- Accept: .pdf, .docx, .doc
- Clear file type restrictions shown
- Individual file size limits displayed
- Overall progress during multiple uploads

**URL Input**:
- Full-width on mobile, max-w-2xl on desktop
- Clear placeholder text
- Validation on blur
- Error states inline

**Accessibility**:
- All form inputs: Proper labels with for attributes
- Error messages: Connected via aria-describedby
- Focus states: Clear ring offset
- Keyboard navigation: Logical tab order

## Polish & Details

**Elevation System**:
- Cards: shadow-md to shadow-lg
- Modals: shadow-2xl
- Hover states: Slight shadow increase
- Active states: Shadow decrease

**Borders**:
- Input fields: border-2
- Cards: border or shadow only
- Dividers: border-t where needed for section separation

**Spacing Consistency**:
- Section margins: mb-8 to mb-12
- Card gaps: gap-4 to gap-6
- Form elements: space-y-4
- List items: space-y-3

**Empty States**:
- Upload zone when empty: Prominent icon + instructional text
- No results: Clear messaging with actionable next steps

This comprehensive design creates a professional, efficient recruiting tool that prioritizes clarity, quick scanning, and confident decision-making while maintaining Material Design's systematic visual language.