// testAnalyzer.js — Test resume upload, analyzer, and matching endpoints
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib';

const BASE = 'http://localhost:5000/api';

// ============================================
// Step 1: Create a realistic PDF resume
// ============================================
async function createResumePDF(filename) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage([595, 842]); // A4 size

    let y = 800;
    const write = (text, size = 11, f = font) => {
        page.drawText(text, { x: 50, y, size, font: f });
        y -= size + 6;
    };

    write('SUDHEER PRAJAPATI', 18, boldFont);
    write('Full Stack Developer', 13, boldFont);
    y -= 5;
    write('Email: spcs0404@gmail.com | Phone: 8765432109 | Bangalore, India');
    write('LinkedIn: linkedin.com/in/sudheerprajapati | GitHub: github.com/sudheerprajapati');
    y -= 10;

    write('PROFESSIONAL SUMMARY', 13, boldFont);
    write('Experienced Full Stack Developer with 3+ years of expertise in building scalable');
    write('web applications using React.js, Node.js, and MongoDB. Proven track record in');
    write('designing microservices, optimizing database performance, and implementing');
    write('CI/CD pipelines. Passionate about clean code and user-centric design.');
    y -= 10;

    write('TECHNICAL SKILLS', 13, boldFont);
    write('Languages: JavaScript, TypeScript, Python, SQL');
    write('Frontend: React.js, Next.js, Redux, Material-UI, HTML5, CSS3, Tailwind CSS');
    write('Backend: Node.js, Express.js, REST APIs, GraphQL');
    write('Databases: MongoDB, PostgreSQL, Redis');
    write('Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, GitHub Actions, Nginx');
    write('Tools: Git, Jira, Figma, VS Code, Postman');
    y -= 10;

    write('WORK EXPERIENCE', 13, boldFont);
    write('Full Stack Developer - Wipro Technologies (Jun 2021 - Dec 2023)', 11, boldFont);
    write('- Developed and maintained 5+ microservices using Node.js and Express.js');
    write('- Built interactive React dashboards serving 10,000+ daily active users');
    write('- Optimized MongoDB queries, reducing API response time by 40%');
    write('- Implemented JWT-based authentication system with refresh tokens');
    write('- Led migration from monolith to microservices architecture');
    y -= 5;
    write('Software Development Intern - TCS (Jan 2020 - May 2020)', 11, boldFont);
    write('- Developed REST APIs using Express.js handling 500+ requests/minute');
    write('- Created automated testing suite with Jest, achieving 85% code coverage');
    y -= 10;

    write('EDUCATION', 13, boldFont);
    write('B.Tech in Computer Science and Engineering - NIT Warangal (2017-2021)', 11, boldFont);
    write('CGPA: 8.4/10');
    y -= 10;

    write('CERTIFICATIONS', 13, boldFont);
    write('- AWS Certified Cloud Practitioner (2023)');
    write('- MongoDB Certified Developer Associate (2022)');
    write('- Meta Frontend Developer Professional Certificate (2022)');
    y -= 10;

    write('PROJECTS', 13, boldFont);
    write('JobAlign - AI-Powered Job Portal', 11, boldFont);
    write('- Full-stack MERN application with AI-based resume analysis and job matching');
    write('- Integrated Google Gemini API for intelligent resume parsing');
    write('- Implemented role-based access control for recruiters and job seekers');

    const pdfBytes = await pdfDoc.save();
    const filePath = path.join(process.cwd(), 'resumes', filename);
    fs.writeFileSync(filePath, pdfBytes);
    console.log(`📄 Created PDF: ${filePath}`);
    return filePath;
}

// ============================================
// Step 2: Login and get token
// ============================================
async function login(email, password) {
    const res = await axios.post(`${BASE}/auth/login`, { email, password });
    console.log(`🔑 Logged in as: ${res.data.user.fullName} (${res.data.user.role})`);
    return { token: res.data.token, userId: res.data.user.id };
}

// ============================================
// Step 3: Upload resume via API
// ============================================
async function uploadResume(token, pdfPath) {
    const form = new FormData();
    form.append('resume', fs.createReadStream(pdfPath));

    console.log('\n📤 Uploading resume to /api/resumes/upload...');
    try {
        const res = await axios.post(`${BASE}/resumes/upload`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            },
            timeout: 60000 // 60s timeout for AI processing
        });
        console.log(`✅ Resume uploaded! ID: ${res.data.resume._id}`);
        console.log(`   Name: ${res.data.resume.name}`);
        console.log(`   Score: ${res.data.resume.resumeRankScore}`);
        console.log(`   Skills: ${res.data.resume.technicalSkills?.join(', ') || 'N/A'}`);
        console.log(`   AI Comment: ${(res.data.resume.aiComment || '').substring(0, 150)}...`);
        console.log(`   File URL: ${res.data.resume.filePath}`);
        return res.data.resume;
    } catch (err) {
        console.error(`❌ Resume upload failed: ${err.response?.data?.msg || err.message}`);
        if (err.response?.data?.error) console.error(`   Error detail: ${err.response.data.error}`);
        return null;
    }
}

// ============================================
// Step 4: Apply for a job
// ============================================
async function applyForJob(token, jobId, resumeId, coverLetter) {
    console.log(`\n📝 Applying for job ${jobId}...`);
    try {
        const res = await axios.post(`${BASE}/applications/apply/${jobId}`, {
            resumeId,
            coverLetter
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Applied! Application ID: ${res.data.application.id}`);
        return res.data.application;
    } catch (err) {
        console.error(`❌ Application failed: ${err.response?.data?.message || err.message}`);
        return null;
    }
}

// ============================================
// Step 5: Test matching analysis (recruiter)
// ============================================
async function testMatching(recruiterToken, applicationId) {
    console.log(`\n🔍 Running matching analysis for application ${applicationId}...`);
    try {
        const res = await axios.post(`${BASE}/matching/match/${applicationId}`, {}, {
            headers: { Authorization: `Bearer ${recruiterToken}` },
            timeout: 60000 // 60s for AI
        });
        console.log(`✅ Matching analysis complete!`);
        console.log(`   Overall Score: ${res.data.analysis.score}`);
        console.log(`   Summary: ${(res.data.analysis.summary_comment || '').substring(0, 200)}`);
        if (res.data.analysis.degree) console.log(`   Degree Score: ${res.data.analysis.degree}`);
        if (res.data.analysis.experience) console.log(`   Experience Score: ${res.data.analysis.experience}`);
        if (res.data.analysis.technical_skill) console.log(`   Technical Score: ${res.data.analysis.technical_skill}`);
        return res.data;
    } catch (err) {
        console.error(`❌ Matching failed: ${err.response?.data?.message || err.message}`);
        if (err.response?.data?.error) console.error(`   Error detail: ${err.response.data.error}`);
        return null;
    }
}

// ============================================
// Step 6: Fetch match details
// ============================================
async function fetchMatchDetails(token, applicationId) {
    console.log(`\n📊 Fetching match details for application ${applicationId}...`);
    try {
        const res = await axios.get(`${BASE}/matching/details/${applicationId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Match details retrieved!`);
        const md = res.data.matchDetails;
        console.log(`   Overall Score: ${md.overallScore}`);
        console.log(`   Detailed Scores:`, JSON.stringify(md.detailedScores, null, 2));
        console.log(`   Summary: ${md.summaryComment?.substring(0, 200)}`);
        return res.data;
    } catch (err) {
        console.error(`❌ Fetch match details failed: ${err.response?.data?.message || err.message}`);
        return null;
    }
}

// ============================================
// Step 7: Get resumes for user
// ============================================
async function getResumes(token, userId) {
    console.log(`\n📋 Fetching resumes for user ${userId}...`);
    try {
        const res = await axios.get(`${BASE}/resumes/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Found ${res.data.resumes.length} resume(s)`);
        for (const r of res.data.resumes) {
            console.log(`   - ${r.name} | Score: ${r.resumeRankScore} | Skills: ${(r.technicalSkills || []).slice(0, 5).join(', ')}`);
        }
        return res.data.resumes;
    } catch (err) {
        console.error(`❌ Fetch resumes failed: ${err.response?.data?.msg || err.message}`);
        return [];
    }
}

// ============================================
// Step 8: Get applications for user
// ============================================
async function getApplications(token, userId) {
    console.log(`\n📋 Fetching applications for user ${userId}...`);
    try {
        const res = await axios.get(`${BASE}/applications/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Found ${res.data.applications.length} application(s)`);
        for (const a of res.data.applications) {
            console.log(`   - ${a.job?.title || 'Unknown'} | Status: ${a.status} | Applied: ${new Date(a.applicationDate).toLocaleDateString()}`);
        }
        return res.data.applications;
    } catch (err) {
        console.error(`❌ Fetch applications failed: ${err.response?.data?.msg || err.message}`);
        return [];
    }
}

// ============================================
// MAIN TEST
// ============================================
async function main() {
    console.log('═══════════════════════════════════════════');
    console.log('    ANALYZER & MATCHING SYSTEM TEST');
    console.log('═══════════════════════════════════════════\n');

    // 1. Create PDF resume
    const pdfPath = await createResumePDF('sudheer_prajapati_resume.pdf');

    // 2. Login as jobseeker
    const { token: jsToken, userId: jsUserId } = await login('spcs0404@gmail.com', 'Sudheer@2105');

    // 3. Upload resume via API (tests: Cloudinary upload + AI resume analysis)
    const resume = await uploadResume(jsToken, pdfPath);

    // 4. Get all resumes for user
    await getResumes(jsToken, jsUserId);

    // 5. Get existing jobs to apply to
    console.log('\n📋 Fetching available jobs...');
    const jobsRes = await axios.get(`${BASE}/jobseekers/jobs?limit=3`, {
        headers: { Authorization: `Bearer ${jsToken}` }
    });
    const jobs = jobsRes.data.jobs;
    console.log(`   Found ${jobsRes.data.totalJobs} jobs`);

    // 6. Apply to a job with the uploaded resume
    let applicationId = null;
    if (resume && jobs.length > 0) {
        const app = await applyForJob(
            jsToken,
            jobs[0]._id,
            resume._id,
            `I am excited to apply for the ${jobs[0].title} position. With my strong background in full stack development and experience at Wipro Technologies, I believe I can make significant contributions to your team.`
        );
        if (app) applicationId = app.id;
    }

    // 7. Get applications for jobseeker
    await getApplications(jsToken, jsUserId);

    // 8. Login as recruiter and test matching
    const { token: recToken } = await login('sudheerprajapti0@gmail.com', 'Sudheer@2105');

    if (applicationId) {
        // 9. Run matching analysis (tests: AI matching service)
        const matchResult = await testMatching(recToken, applicationId);

        // 10. Fetch match details
        if (matchResult) {
            await fetchMatchDetails(recToken, applicationId);
        }
    }

    // 11. Test matching on existing seeded applications
    console.log('\n\n═══════════════════════════════════════════');
    console.log('    TESTING MATCHING ON SEEDED APPLICATIONS');
    console.log('═══════════════════════════════════════════\n');

    try {
        const allApps = await axios.get(`${BASE}/applications/all-applicants`, {
            headers: { Authorization: `Bearer ${recToken}` }
        });
        console.log(`Total applications: ${allApps.data.applications.length}`);

        // Test matching on the first seeded application that has a resume
        const appWithResume = allApps.data.applications.find(a => a.resume);
        if (appWithResume) {
            console.log(`Testing matching on: ${appWithResume.user?.fullName || 'Unknown'} → ${appWithResume.job?.title || 'Unknown'}`);
            await testMatching(recToken, appWithResume._id);
            await fetchMatchDetails(recToken, appWithResume._id);
        }
    } catch (err) {
        console.error(`❌ Seeded matching test failed: ${err.message}`);
    }

    console.log('\n\n═══════════════════════════════════════════');
    console.log('    ✅ ALL ANALYZER TESTS COMPLETE');
    console.log('═══════════════════════════════════════════\n');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
