# Smart Advisor Blueprint - Project Charter

## Team Information
**Project Manager:** Kanishkar Manoj (@kanishkarmanoj)
**Team Size:** 6 members
**Semester:** Fall 2025

## Project Vision
**Problem Statement:** Civil Engineering students often struggle to select the most suitable courses and professors each semester. Unlike many other majors, they lack a clear, official flowchart for course progression, and critical information is scattered across different platforms (university portals, Rate My Professor, word-of-mouth). This makes it difficult to build a schedule that aligns with their specific degree plan and learning style, leading to suboptimal course selections that can impact academic performance and student satisfaction.

**Target Users:** Undergraduate Civil Engineering majors at our university.

**Success Metrics:**
* **User Adoption:** Onboard 25 Civil Engineering students to use the platform by the end of the semester.
* **Completion Rate:** 80% of new users complete their profile setup (transcript + preferences).
* **Satisfaction Score:** Achieve an average user satisfaction rating of 4 out of 5 stars from our target users.
* **Functionality:** All Minimum Viable Product (MVP) features are deployed and functional for the Civil Engineering curriculum.

## Technical Architecture
**Tech Stack:**
- Frontend: React
- Backend: Python with Flask
- Database: PostgreSQL
- Deployment: Vercel (Frontend), Render (Backend & Database)

**Key Features (MVP):**
1.  **User Profile Creation:** Allow a Civil Engineering student to sign up and input their preferences and unofficial transcript data.
2.  **Core Recommendation Engine:** Display a list of recommended courses and professors for the upcoming semester based on the user's profile.
3.  **Interactive Course Browser:** Create a intuitive UI for students to easily view, save, or dismiss course/professor recommendations.

## Communication Plan
**Primary Channel:** Discord #smart-advisors
**Meeting Schedule:** Weekly Wednesdays at 5:00 PM
**Progress Updates:** Weekly GitHub issues using update template

## Timeline & Milestones
**Week 1-2:** Project setup, initial planning
**Week 3-4:** Core architecture, basic setup
**Week 5-8:** Feature development sprint 1
**Week 9-12:** Feature development sprint 2
**Week 13-14:** Testing, polish, deployment
**Week 15-16:** Demo preparation, documentation

## Team Roles
*This is an initial plan and is subject to change as the project progresses.*
- **Kanishkar Manoj:** Project Manager & Full Stack
- **Akilan:** Frontend
- **Shreyak:** Frontend
- **Nick:** Backend & Database
- **Shawn:** Data Engineer
- **Rick:** UI/UX Design

## Risk Assessment
**Technical Risks:** Rate My Professor might block scrapers; scraped data may be inconsistent; the initial recommendation model may not be accurate.
**Timeline Risks:** Scope creep from adding new features; team member availability may decrease during midterms/exams.
**Mitigation Plans:** Have a backup plan for manual data entry if scraping fails; start with a simple, rule-based model before implementing complex ML; stick strictly to the MVP features defined in this charter.