// seedFullData.js — Comprehensive seed script for review demo
// Inserts companies, jobs, resumes, and applications directly into MongoDB
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import './config/db.js';
import JobModel from './models/JobModel.js';
import User from './models/User.js';
import Company from './models/CompanyModel.js';
import ResumeModel from './models/ResumeModel.js';
import JobApplication from './models/JobApplication.js';
import bcrypt from 'bcryptjs';

// Wait for MongoDB connection
await new Promise(resolve => setTimeout(resolve, 2000));

async function seed() {
    try {
        // ========================
        // 1. GET EXISTING USERS
        // ========================
        const recruiter = await User.findOne({ email: 'sudheerprajapti0@gmail.com' });
        const jobseeker = await User.findOne({ email: 'spcs0404@gmail.com' });
        if (!recruiter || !jobseeker) {
            console.error('Users not found! Make sure both accounts exist.');
            process.exit(1);
        }
        console.log(`✅ Recruiter: ${recruiter.fullName} (${recruiter._id})`);
        console.log(`✅ JobSeeker: ${jobseeker.fullName} (${jobseeker._id})`);

        // Update profiles with realistic data
        await User.findByIdAndUpdate(recruiter._id, {
            fullName: 'Sudheer Kumar',
            phoneNumber: '9876543210',
            profilePicture: 'https://ui-avatars.com/api/?name=Sudheer+Kumar&background=6C5CE7&color=fff&size=200&bold=true&format=png',
            profile: {
                bio: 'Senior Technical Recruiter with 5+ years of experience in sourcing and hiring top tech talent across India. Passionate about connecting skilled professionals with impactful opportunities.',
                skills: ['Technical Recruiting', 'Talent Acquisition', 'Interview Management', 'HR Analytics']
            }
        });
        console.log('✅ Recruiter profile updated');

        await User.findByIdAndUpdate(jobseeker._id, {
            fullName: 'Sudheer Prajapati',
            phoneNumber: '8765432109',
            profilePicture: 'https://ui-avatars.com/api/?name=Sudheer+Prajapati&background=00B894&color=fff&size=200&bold=true&format=png',
            profile: {
                bio: 'Full Stack Developer with 3 years of experience in React, Node.js, and MongoDB. B.Tech in Computer Science from NIT Warangal. Looking for exciting opportunities in product-based companies.',
                skills: ['React.js', 'Node.js', 'MongoDB', 'TypeScript', 'Python', 'AWS', 'Docker', 'Git']
            }
        });
        console.log('✅ JobSeeker profile updated');

        // ========================
        // 2. CREATE ADDITIONAL FAKE JOBSEEKERS
        // ========================
        const fakeJobseekers = [];
        const fakeUsers = [
            { fullName: 'Ananya Sharma', email: 'ananya.sharma@demo.com', skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'] },
            { fullName: 'Rahul Verma', email: 'rahul.verma@demo.com', skills: ['Python', 'Django', 'AWS', 'Kubernetes'] },
            { fullName: 'Priya Nair', email: 'priya.nair@demo.com', skills: ['React.js', 'TypeScript', 'Node.js', 'GraphQL'] },
            { fullName: 'Vikram Singh', email: 'vikram.singh@demo.com', skills: ['DevOps', 'Terraform', 'Jenkins', 'Linux'] },
        ];

        for (const u of fakeUsers) {
            let existing = await User.findOne({ email: u.email });
            if (!existing) {
                const hashedPw = await bcrypt.hash('Demo@1234', 10);
                existing = await User.create({
                    fullName: u.fullName,
                    email: u.email,
                    password: hashedPw,
                    role: 'jobSeeker',
                    phoneNumber: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
                    profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=${['E17055', '0984E3', '6C5CE7', '00B894'][fakeUsers.indexOf(u)]}&color=fff&size=200&bold=true&format=png`,
                    profile: { bio: `Experienced developer specializing in ${u.skills.join(', ')}`, skills: u.skills }
                });
            }
            fakeJobseekers.push(existing);
        }
        console.log(`✅ Created/found ${fakeJobseekers.length} additional jobseekers`);

        // ========================
        // 3. CREATE COMPANIES
        // ========================
        const companyData = [
            { name: 'TechNova Solutions', description: 'Leading AI-powered SaaS company for enterprise digital transformation.', website: 'https://technova.io', location: 'Bangalore, India', logo: 'https://ui-avatars.com/api/?name=TN&background=6C5CE7&color=fff&size=200&rounded=true&bold=true' },
            { name: 'InnoVate Labs', description: 'Innovation-driven startup building cutting-edge mobile and web experiences.', website: 'https://innovatelabs.co', location: 'Hyderabad, India', logo: 'https://ui-avatars.com/api/?name=IL&background=00B894&color=fff&size=200&rounded=true&bold=true' },
            { name: 'CloudPeak Technologies', description: 'Cloud infrastructure consulting for Fortune 500 companies.', website: 'https://cloudpeak.tech', location: 'Pune, India', logo: 'https://ui-avatars.com/api/?name=CP&background=0984E3&color=fff&size=200&rounded=true&bold=true' },
            { name: 'DataMinds Analytics', description: 'Data engineering and machine learning solutions for fintech and healthcare industries.', website: 'https://dataminds.ai', location: 'Chennai, India', logo: 'https://ui-avatars.com/api/?name=DM&background=E17055&color=fff&size=200&rounded=true&bold=true' },
            { name: 'SecureStack Labs', description: 'Cybersecurity and penetration testing firm providing enterprise security audits.', website: 'https://securestack.io', location: 'Delhi NCR, India', logo: 'https://ui-avatars.com/api/?name=SS&background=636E72&color=fff&size=200&rounded=true&bold=true' },
            { name: 'GreenCode Software', description: 'Sustainable tech company building energy-efficient computing solutions.', website: 'https://greencode.dev', location: 'Mumbai, India', logo: 'https://ui-avatars.com/api/?name=GC&background=00CEC9&color=fff&size=200&rounded=true&bold=true' },
            { name: 'Nexus Digital', description: 'Full-service digital agency specializing in e-commerce and fintech platforms.', website: 'https://nexusdigital.in', location: 'Noida, India', logo: 'https://ui-avatars.com/api/?name=ND&background=A29BFE&color=fff&size=200&rounded=true&bold=true' },
            { name: 'Quantum Leap AI', description: 'Deep tech startup working on quantum computing and advanced AI research.', website: 'https://quantumleap.ai', location: 'Bangalore, India', logo: 'https://ui-avatars.com/api/?name=QL&background=FD79A8&color=fff&size=200&rounded=true&bold=true' },
        ];

        const companyMap = {};
        for (const c of companyData) {
            let existing = await Company.findOne({ name: c.name });
            if (existing) {
                await Company.findByIdAndUpdate(existing._id, { logo: c.logo, description: c.description, website: c.website, location: c.location });
                companyMap[c.name] = existing._id;
            } else {
                const newC = await Company.create({ ...c, userId: recruiter._id });
                companyMap[c.name] = newC._id;
            }
        }
        console.log(`✅ ${Object.keys(companyMap).length} companies ready`);

        // ========================
        // 4. CLEAR EXISTING JOBS & CREATE NEW ONES
        // ========================
        await JobModel.deleteMany({ recruiter: recruiter._id });

        const jobsData = [
            {
                title: 'Senior Full Stack Developer', company: 'TechNova Solutions', location: 'Bangalore, India',
                description: `Join TechNova Solutions as a Senior Full Stack Developer to design and build scalable web applications for our AI-powered analytics platform serving 10,000+ enterprise clients globally.\n\nYou'll work with cutting-edge technologies and a talented engineering team. We offer competitive compensation, flexible remote work, learning stipends, and MacBook Pro setups.\n\nIdeal for engineers who love solving complex problems and mentoring others.`,
                skills: ['React.js', 'Node.js', 'MongoDB', 'AWS', 'TypeScript', 'Docker'],
                positions: 3, jobType: 'Full-Time', salaryLPA: 18, experience: '3-5 years',
                responsibilities: ['Design and develop full-stack web applications', 'Lead code reviews and architecture discussions', 'Optimize performance and scalability', 'Collaborate with product and design teams', 'Mentor junior developers'],
                softSkills: ['Leadership', 'Communication', 'Problem Solving', 'Collaboration'],
                degree: ['B.Tech Computer Science', 'MCA'], technicalSkills: ['React.js', 'Node.js', 'MongoDB', 'AWS'], certificates: ['AWS Certified Developer'],
                datePosted: new Date('2025-02-20'),
            },
            {
                title: 'UI/UX Designer', company: 'InnoVate Labs', location: 'Hyderabad, India',
                description: `Create beautiful, intuitive interfaces for our mobile and web products. Work with cross-functional teams on user research, wireframing, prototyping, and high-fidelity design.\n\nYour work impacts thousands of daily users. We value designers who balance aesthetics with usability.`,
                skills: ['Figma', 'Adobe XD', 'Sketch', 'HTML/CSS', 'User Research', 'Prototyping'],
                positions: 2, jobType: 'Full-Time', salaryLPA: 12, experience: '2-4 years',
                responsibilities: ['Create wireframes and interactive prototypes', 'Conduct user research and usability testing', 'Design responsive web and mobile interfaces', 'Maintain the design system', 'Present designs to stakeholders'],
                softSkills: ['Creativity', 'Attention to Detail', 'Empathy', 'Communication'],
                degree: ['B.Des Interaction Design'], technicalSkills: ['Figma', 'Adobe XD', 'Sketch'], certificates: ['Google UX Design Certificate'],
                datePosted: new Date('2025-02-18'),
            },
            {
                title: 'DevOps Engineer', company: 'CloudPeak Technologies', location: 'Pune, India',
                description: `Build and maintain cloud infrastructure for Fortune 500 clients. Automate CI/CD pipelines, manage Kubernetes clusters, and ensure 99.99% uptime.\n\nDeep expertise with AWS, infrastructure-as-code, and container orchestration required.`,
                skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Linux', 'Python'],
                positions: 2, jobType: 'Full-Time', salaryLPA: 20, experience: '3-6 years',
                responsibilities: ['Design CI/CD pipelines', 'Manage Kubernetes clusters', 'Implement infrastructure-as-code with Terraform', 'Monitor performance and incident response', 'Automate deployment processes'],
                softSkills: ['Analytical Thinking', 'Problem Solving', 'Adaptability'],
                degree: ['B.Tech CS/IT'], technicalSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform'], certificates: ['AWS Solutions Architect', 'CKA'],
                datePosted: new Date('2025-02-22'),
            },
            {
                title: 'React Native Mobile Developer', company: 'InnoVate Labs', location: 'Mumbai, India',
                description: `Build cross-platform mobile apps for iOS and Android used by 100,000+ daily users. Deliver pixel-perfect mobile experiences with smooth animations.\n\nWork closely with product and backend teams on new features.`,
                skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'REST APIs', 'Firebase'],
                positions: 2, jobType: 'Full-Time', salaryLPA: 14, experience: '2-4 years',
                responsibilities: ['Develop cross-platform mobile applications', 'Integrate RESTful APIs', 'Write unit and integration tests', 'Optimize app performance', 'Publish to App Store and Play Store'],
                softSkills: ['Self-motivated', 'Detail-oriented', 'Collaborative'],
                degree: ['B.Tech CS'], technicalSkills: ['React Native', 'TypeScript', 'Redux'], certificates: ['Meta React Native Specialization'],
                datePosted: new Date('2025-02-15'),
            },
            {
                title: 'Data Analyst Intern', company: 'TechNova Solutions', location: 'Bangalore, India',
                description: `6-month internship for freshers. Gain hands-on experience with real-world datasets, dashboards, and BI tools.\n\nStipend: ₹25,000/month + Certificate + PPO opportunity.`,
                skills: ['SQL', 'Python', 'Excel', 'Power BI', 'Data Visualization'],
                positions: 5, jobType: 'Internship', salaryLPA: 3, experience: '0-1 years (Freshers)',
                responsibilities: ['Analyze datasets for trends', 'Create Power BI dashboards', 'Write SQL queries', 'Support data science team', 'Prepare reports'],
                softSkills: ['Curiosity', 'Analytical Thinking', 'Time Management'],
                degree: ['B.Tech/B.E.', 'B.Sc Statistics', 'BCA'], technicalSkills: ['SQL', 'Python', 'Excel', 'Power BI'], certificates: ['Google Data Analytics Certificate'],
                datePosted: new Date('2025-02-23'),
            },
            {
                title: 'Backend Engineer (Java/Spring Boot)', company: 'CloudPeak Technologies', location: 'Delhi NCR, India',
                description: `Design robust microservices handling millions of API requests daily. Build high-performance backends with caching, messaging, and proper database schemas.\n\nCollaborative environment with hackathons and open-source contribution opportunities.`,
                skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'Microservices'],
                positions: 3, jobType: 'Full-Time', salaryLPA: 16, experience: '2-5 years',
                responsibilities: ['Design microservices with Spring Boot', 'Build RESTful APIs with documentation', 'Implement Redis caching and Kafka messaging', 'Write comprehensive tests', 'Participate in on-call rotation'],
                softSkills: ['Problem Solving', 'Teamwork', 'Ownership'],
                degree: ['B.Tech CS', 'MCA'], technicalSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis'], certificates: ['Oracle Certified Java Professional'],
                datePosted: new Date('2025-02-21'),
            },
            {
                title: 'Machine Learning Engineer', company: 'DataMinds Analytics', location: 'Chennai, India',
                description: `Build and deploy ML models for fintech fraud detection and healthcare diagnostics. Work with large datasets and production ML pipelines.\n\nResearch-oriented role with opportunities to publish papers.`,
                skills: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'SQL', 'MLOps'],
                positions: 2, jobType: 'Full-Time', salaryLPA: 22, experience: '3-5 years',
                responsibilities: ['Develop and deploy ML models', 'Build data preprocessing pipelines', 'A/B test model performance', 'Collaborate with data engineers', 'Present findings to stakeholders'],
                softSkills: ['Research Mindset', 'Communication', 'Critical Thinking'],
                degree: ['M.Tech CS/AI', 'MS Data Science'], technicalSkills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'], certificates: ['TensorFlow Developer Certificate'],
                datePosted: new Date('2025-02-19'),
            },
            {
                title: 'Cybersecurity Analyst', company: 'SecureStack Labs', location: 'Delhi NCR, India',
                description: `Perform penetration testing, vulnerability assessments, and security audits for enterprise clients. Help organizations strengthen their security posture.\n\nHands-on role with exposure to diverse tech stacks.`,
                skills: ['Penetration Testing', 'Network Security', 'OWASP', 'Burp Suite', 'Python', 'Linux'],
                positions: 2, jobType: 'Full-Time', salaryLPA: 15, experience: '2-4 years',
                responsibilities: ['Conduct penetration tests and vulnerability assessments', 'Write detailed security audit reports', 'Monitor threat intelligence feeds', 'Implement security best practices', 'Train teams on security awareness'],
                softSkills: ['Attention to Detail', 'Ethical Mindset', 'Problem Solving'],
                degree: ['B.Tech CS', 'B.Tech IT'], technicalSkills: ['Penetration Testing', 'Burp Suite', 'OWASP', 'Python'], certificates: ['CEH', 'OSCP'],
                datePosted: new Date('2025-02-17'),
            },
            {
                title: 'Frontend Developer (Vue.js)', company: 'GreenCode Software', location: 'Mumbai, India',
                description: `Build energy-efficient web applications with Vue.js for our sustainable computing platform. Focus on performance, accessibility, and green coding practices.\n\nFlexible 4-day work week and remote-friendly culture.`,
                skills: ['Vue.js', 'JavaScript', 'TypeScript', 'CSS3', 'Vuex', 'Web Accessibility'],
                positions: 2, jobType: 'Full-Time', salaryLPA: 13, experience: '2-3 years',
                responsibilities: ['Build responsive web apps with Vue.js', 'Optimize bundle sizes and performance', 'Implement accessibility standards (WCAG)', 'Write component tests', 'Collaborate with UX designers'],
                softSkills: ['Creativity', 'Environmental Consciousness', 'Team Player'],
                degree: ['B.Tech CS', 'BCA'], technicalSkills: ['Vue.js', 'TypeScript', 'CSS3', 'Vuex'], certificates: [],
                datePosted: new Date('2025-02-16'),
            },
            {
                title: 'Product Manager', company: 'Nexus Digital', location: 'Noida, India',
                description: `Lead product strategy for our e-commerce and fintech platforms. Define roadmaps, prioritize features, and work with engineering to deliver impactful products.\n\n3+ years PM experience in tech required.`,
                skills: ['Product Strategy', 'Agile', 'Jira', 'SQL', 'User Analytics', 'A/B Testing'],
                positions: 1, jobType: 'Full-Time', salaryLPA: 25, experience: '3-6 years',
                responsibilities: ['Define product roadmap and strategy', 'Prioritize features using data-driven methods', 'Work with engineering and design teams', 'Analyze user metrics and A/B test results', 'Present to leadership and stakeholders'],
                softSkills: ['Strategic Thinking', 'Communication', 'Leadership', 'Stakeholder Management'],
                degree: ['MBA', 'B.Tech + MBA'], technicalSkills: ['Jira', 'SQL', 'Analytics Tools'], certificates: ['Certified Scrum Product Owner'],
                datePosted: new Date('2025-02-14'),
            },
            {
                title: 'AI Research Intern', company: 'Quantum Leap AI', location: 'Bangalore, India',
                description: `Join our research team exploring quantum computing and advanced AI. Work on cutting-edge NLP and computer vision projects.\n\nStipend: ₹40,000/month. Ideal for M.Tech/PhD students.`,
                skills: ['Python', 'PyTorch', 'NLP', 'Computer Vision', 'Research Papers', 'LaTeX'],
                positions: 3, jobType: 'Internship', salaryLPA: 5, experience: '0-1 years',
                responsibilities: ['Implement research papers in NLP and computer vision', 'Run experiments and analyze results', 'Write technical documentation', 'Present findings in team meetings', 'Contribute to conference submissions'],
                softSkills: ['Curiosity', 'Research Mindset', 'Self-Directed Learning'],
                degree: ['M.Tech AI/ML', 'PhD CS'], technicalSkills: ['Python', 'PyTorch', 'NLP'], certificates: [],
                datePosted: new Date('2025-02-24'),
            },
            {
                title: 'QA Automation Engineer', company: 'DataMinds Analytics', location: 'Chennai, India',
                description: `Build and maintain automated testing frameworks for our analytics platform. Ensure product quality through comprehensive test coverage.\n\nExperience with Selenium, Cypress, or Playwright required.`,
                skills: ['Selenium', 'Cypress', 'JavaScript', 'Python', 'CI/CD', 'API Testing'],
                positions: 2, jobType: 'Full-Time', salaryLPA: 11, experience: '2-4 years',
                responsibilities: ['Design and implement automated test frameworks', 'Write end-to-end and API tests', 'Integrate tests into CI/CD pipelines', 'Track and report bugs', 'Perform regression testing'],
                softSkills: ['Thoroughness', 'Analytical Thinking', 'Communication'],
                degree: ['B.Tech CS/IT'], technicalSkills: ['Selenium', 'Cypress', 'API Testing'], certificates: ['ISTQB Certified Tester'],
                datePosted: new Date('2025-02-20'),
            },
            {
                title: 'Cloud Solutions Architect', company: 'CloudPeak Technologies', location: 'Bangalore, India',
                description: `Design multi-cloud architectures for enterprise clients migrating from on-premise to cloud. Lead technical workshops and create reference architectures.\n\nSenior role with client-facing responsibilities.`,
                skills: ['AWS', 'Azure', 'GCP', 'Solution Architecture', 'Microservices', 'Security'],
                positions: 1, jobType: 'Full-Time', salaryLPA: 30, experience: '6-10 years',
                responsibilities: ['Design multi-cloud solution architectures', 'Lead technical workshops with clients', 'Create reference architectures and documentation', 'Evaluate cloud services and make recommendations', 'Mentor engineering teams'],
                softSkills: ['Client Management', 'Strategic Thinking', 'Communication', 'Leadership'],
                degree: ['B.Tech CS', 'M.Tech'], technicalSkills: ['AWS', 'Azure', 'GCP', 'Microservices'], certificates: ['AWS Solutions Architect Professional', 'Azure Solutions Architect'],
                datePosted: new Date('2025-02-13'),
            },
            {
                title: 'Technical Content Writer', company: 'GreenCode Software', location: 'Remote',
                description: `Write technical documentation, blog posts, and API guides for our developer platform. Make complex concepts accessible.\n\nFully remote position. Perfect for developers who love writing.`,
                skills: ['Technical Writing', 'Markdown', 'API Documentation', 'Git', 'SEO'],
                positions: 1, jobType: 'Contract', salaryLPA: 8, experience: '1-3 years',
                responsibilities: ['Write API documentation and developer guides', 'Create technical blog posts', 'Maintain documentation repositories', 'Review and edit technical content', 'Collaborate with engineering on accuracy'],
                softSkills: ['Writing', 'Clarity', 'Attention to Detail', 'Self-Motivated'],
                degree: ['B.Tech CS', 'B.A. English'], technicalSkills: ['Markdown', 'Git', 'API Documentation'], certificates: [],
                datePosted: new Date('2025-02-12'),
            },
            {
                title: 'Full Stack Developer (MERN)', company: 'Nexus Digital', location: 'Noida, India',
                description: `Build e-commerce and fintech platforms using the MERN stack. Fast-paced environment with direct impact on revenue-generating products.\n\n2+ years experience with React and Node.js required.`,
                skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Redux', 'REST APIs'],
                positions: 4, jobType: 'Full-Time', salaryLPA: 10, experience: '2-4 years',
                responsibilities: ['Build full-stack features with MERN stack', 'Design and consume REST APIs', 'Write clean, maintainable code', 'Participate in sprint planning and code reviews', 'Deploy and monitor applications'],
                softSkills: ['Teamwork', 'Adaptability', 'Problem Solving'],
                degree: ['B.Tech CS', 'BCA', 'MCA'], technicalSkills: ['MongoDB', 'Express.js', 'React.js', 'Node.js'], certificates: [],
                datePosted: new Date('2025-02-11'),
            },
        ];

        const createdJobs = [];
        for (const j of jobsData) {
            const companyId = companyMap[j.company];
            if (!companyId) { console.error(`Company not found: ${j.company}`); continue; }
            const newJob = await JobModel.create({ ...j, company: companyId, recruiter: recruiter._id });
            createdJobs.push(newJob);
        }
        console.log(`✅ Created ${createdJobs.length} jobs`);

        // ========================
        // 5. CREATE RESUMES
        // ========================
        await ResumeModel.deleteMany({ user: { $in: [jobseeker._id, ...fakeJobseekers.map(u => u._id)] } });

        const resumesData = [
            {
                user: jobseeker._id, name: 'Sudheer Prajapati',
                content: 'Experienced full stack developer with 3 years building web applications using React, Node.js, and MongoDB. Strong foundation in data structures, algorithms, and system design.',
                email: 'spcs0404@gmail.com', phoneNumber: '8765432109',
                education: ['B.Tech in Computer Science - NIT Warangal (2021)', 'XII - CBSE Board (2017)'],
                experience: ['Full Stack Developer at Wipro (2021-2023) - Built microservices and React dashboards', 'Intern at TCS (2020) - Developed REST APIs using Express.js'],
                technicalSkills: ['React.js', 'Node.js', 'MongoDB', 'TypeScript', 'Python', 'AWS', 'Docker', 'Git', 'Redux', 'Express.js'],
                responsibilities: ['Designed and developed scalable REST APIs', 'Built responsive React UIs with Material-UI', 'Implemented CI/CD pipelines using GitHub Actions', 'Optimized MongoDB queries reducing latency by 40%'],
                certifications: ['AWS Certified Cloud Practitioner', 'MongoDB Certified Developer Associate'],
                softSkills: ['Team Leadership', 'Communication', 'Problem Solving', 'Time Management'],
                jobRecommendations: ['Senior Full Stack Developer', 'React Developer', 'Backend Engineer'],
                resumeRankScore: 82,
                summary: 'Strong full-stack developer with proven experience in MERN stack, cloud deployments, and agile workflows. Well-suited for mid-senior level engineering roles.',
                aiComment: 'Well-structured resume with clear project descriptions. Consider adding quantified achievements and open-source contributions for a stronger impact.',
            },
            {
                user: fakeJobseekers[0]._id, name: 'Ananya Sharma',
                content: 'Java backend developer with expertise in Spring Boot microservices and PostgreSQL. 4 years experience at major product companies.',
                email: 'ananya.sharma@demo.com', phoneNumber: '9812345678',
                education: ['B.Tech in CS - IIT Madras (2020)', 'XII - ISC Board (2016)'],
                experience: ['Software Engineer at Zoho (2020-2024) - Built payment processing microservices', 'Intern at Infosys (2019) - Database optimization and API development'],
                technicalSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'Jenkins'],
                responsibilities: ['Architected payment processing microservices handling 1M+ daily transactions', 'Implemented Redis caching reducing API response times by 60%', 'Set up Kafka event streaming for real-time notifications', 'Mentored 3 junior engineers'],
                certifications: ['Oracle Certified Java Professional', 'Spring Professional Certification'],
                softSkills: ['Architecture Design', 'Mentoring', 'Problem Solving'],
                jobRecommendations: ['Backend Engineer', 'Java Developer', 'System Architect'],
                resumeRankScore: 88,
                summary: 'Highly skilled Java backend engineer with excellent production system experience. Strong candidate for senior backend engineering roles.',
                aiComment: 'Excellent resume with strong quantified achievements. IIT background and Zoho experience make this a Top 10% candidate.',
            },
            {
                user: fakeJobseekers[1]._id, name: 'Rahul Verma',
                content: 'DevOps engineer and Python developer with AWS expertise. 3 years managing cloud infrastructure for startups.',
                email: 'rahul.verma@demo.com', phoneNumber: '9845678901',
                education: ['B.Tech in IT - VIT Vellore (2021)', 'XII - CBSE Board (2017)'],
                experience: ['DevOps Engineer at Freshworks (2021-2024) - Managed AWS infrastructure for 50+ microservices', 'Cloud Intern at Razorpay (2020) - Built CI/CD pipelines'],
                technicalSkills: ['Python', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Django'],
                responsibilities: ['Managed AWS infrastructure serving 10M+ monthly users', 'Built Terraform modules for repeatable infrastructure', 'Implemented GitHub Actions CI/CD for 50+ repos', 'Reduced cloud costs by 25% through optimization'],
                certifications: ['AWS Solutions Architect Associate', 'Certified Kubernetes Administrator'],
                softSkills: ['Infrastructure Thinking', 'Automation Mindset', 'Collaboration'],
                jobRecommendations: ['DevOps Engineer', 'Cloud Engineer', 'SRE'],
                resumeRankScore: 85,
                summary: 'Strong DevOps professional with hands-on AWS and Kubernetes experience. Excellent fit for cloud infrastructure roles.',
                aiComment: 'Resume shows strong practical DevOps experience. AWS certifications add credibility. Recommend highlighting specific project outcomes more.',
            },
            {
                user: fakeJobseekers[2]._id, name: 'Priya Nair',
                content: 'Frontend developer specializing in React and TypeScript. Passionate about UI/UX and web performance optimization.',
                email: 'priya.nair@demo.com', phoneNumber: '9823456789',
                education: ['B.Tech in CS - BITS Pilani (2022)', 'XII - Kerala State Board (2018)'],
                experience: ['Frontend Engineer at Swiggy (2022-2024) - Built restaurant discovery UI serving 5M+ users', 'Intern at Flipkart (2021) - Developed reusable React component library'],
                technicalSkills: ['React.js', 'TypeScript', 'Next.js', 'GraphQL', 'CSS3', 'Tailwind CSS', 'Jest', 'Storybook'],
                responsibilities: ['Built restaurant discovery feature used by 5M+ monthly users', 'Created shared component library reducing dev time by 30%', 'Improved Core Web Vitals scores by 40%', 'Led frontend architecture discussions'],
                certifications: ['Meta Frontend Developer Certificate'],
                softSkills: ['Design Thinking', 'Attention to Detail', 'User Empathy'],
                jobRecommendations: ['Frontend Developer', 'React Developer', 'UI Engineer'],
                resumeRankScore: 86,
                summary: 'Exceptional frontend developer with product company experience. Strong React/TypeScript skills with user-centric approach.',
                aiComment: 'Impressive frontend portfolio. BITS Pilani + Swiggy combination is a strong signal. Consider adding more about system design experience.',
            },
            {
                user: fakeJobseekers[3]._id, name: 'Vikram Singh',
                content: 'Infrastructure and DevOps engineer with expertise in cloud automation and container orchestration.',
                email: 'vikram.singh@demo.com', phoneNumber: '9834567890',
                education: ['B.Tech in CS - DTU Delhi (2020)', 'XII - CBSE Board (2016)'],
                experience: ['Senior DevOps Engineer at Atlassian (2020-2024) - Led cloud migration for Jira Cloud', 'Intern at HCL (2019) - Network automation with Ansible'],
                technicalSkills: ['Terraform', 'Kubernetes', 'AWS', 'GCP', 'Jenkins', 'Ansible', 'Linux', 'Python', 'Go'],
                responsibilities: ['Led migration of Jira Cloud to Kubernetes', 'Built self-service infrastructure platform used by 200+ engineers', 'Designed disaster recovery for multi-region deployments', 'Reduced deployment time from 2 hours to 15 minutes'],
                certifications: ['AWS Solutions Architect Professional', 'CKA', 'HashiCorp Terraform Associate'],
                softSkills: ['Leadership', 'System Thinking', 'Documentation', 'Cross-team Communication'],
                jobRecommendations: ['Cloud Architect', 'DevOps Lead', 'Platform Engineer'],
                resumeRankScore: 91,
                summary: 'Senior DevOps professional with Atlassian experience. Ideal for platform engineering and cloud architecture leadership roles.',
                aiComment: 'Outstanding resume — one of the strongest DevOps profiles. Atlassian experience + triple certifications make this a Top 5% candidate.',
            },
        ];

        const createdResumes = [];
        for (const r of resumesData) {
            const resume = await ResumeModel.create({
                ...r,
                filePath: `https://res.cloudinary.com/demo/resume-${r.name.replace(/\s/g, '-').toLowerCase()}.pdf`,
                analysisTimestamp: new Date(),
                analysisVersion: '1.0',
            });
            createdResumes.push(resume);
        }
        console.log(`✅ Created ${createdResumes.length} resumes`);

        // Link resume to jobseeker user
        await User.findByIdAndUpdate(jobseeker._id, { resume: createdResumes[0]._id });

        // ========================
        // 6. CREATE JOB APPLICATIONS
        // ========================
        await JobApplication.deleteMany({});

        const applications = [
            // Sudheer applies to 3 jobs
            { job: createdJobs[0], user: jobseeker, resume: createdResumes[0], coverLetter: 'I am excited to apply for the Senior Full Stack Developer position at TechNova Solutions. With 3 years of experience in React, Node.js, and MongoDB, I believe I am a strong fit for this role. My experience building scalable microservices at Wipro has prepared me well for the challenges of your AI-powered analytics platform.', status: 'applied' },
            { job: createdJobs[4], user: jobseeker, resume: createdResumes[0], coverLetter: 'As a B.Tech graduate with strong Python and data analysis skills, I am keen to start my analytics career at TechNova Solutions. I have completed the Google Data Analytics Certificate and have hands-on experience with SQL and Power BI.', status: 'on process' },
            { job: createdJobs[14], user: jobseeker, resume: createdResumes[0], coverLetter: 'I am interested in the Full Stack Developer (MERN) position at Nexus Digital. My 3 years of MERN stack experience and passion for building user-facing products align perfectly with this role.', status: 'applied' },

            // Ananya applies to 2 jobs
            { job: createdJobs[5], user: fakeJobseekers[0], resume: createdResumes[1], coverLetter: 'With 4 years of Java/Spring Boot experience at Zoho and expertise in microservices architecture, I am confident I can contribute significantly to CloudPeak Technologies. I have built payment systems handling 1M+ transactions daily.', status: 'accepted' },
            { job: createdJobs[0], user: fakeJobseekers[0], resume: createdResumes[1], coverLetter: 'While my primary expertise is in Java, I have strong experience with React and Node.js from side projects. I am eager to expand into full-stack development at TechNova Solutions.', status: 'on process' },

            // Rahul applies to 2 jobs
            { job: createdJobs[2], user: fakeJobseekers[1], resume: createdResumes[2], coverLetter: 'As a DevOps Engineer at Freshworks managing infrastructure for 10M+ users, I bring hands-on expertise in AWS, Kubernetes, and Terraform. I am excited to apply these skills at CloudPeak Technologies.', status: 'on process' },
            { job: createdJobs[12], user: fakeJobseekers[1], resume: createdResumes[2], coverLetter: 'I am applying for the Cloud Solutions Architect role. My experience managing multi-cloud infrastructure at Freshworks has given me the expertise needed for this senior position.', status: 'applied' },

            // Priya applies to 3 jobs
            { job: createdJobs[0], user: fakeJobseekers[2], resume: createdResumes[3], coverLetter: 'I am a frontend-focused full stack developer with 2 years at Swiggy building high-traffic React applications. I am excited to apply my skills in a senior role at TechNova Solutions.', status: 'applied' },
            { job: createdJobs[8], user: fakeJobseekers[2], resume: createdResumes[3], coverLetter: 'While my primary framework is React, I have experience with Vue.js from personal projects. My frontend optimization skills and Web Vitals expertise make me a strong fit for GreenCode Software.', status: 'rejected' },
            { job: createdJobs[3], user: fakeJobseekers[2], resume: createdResumes[3], coverLetter: 'As a frontend developer who has built mobile-responsive UIs at Swiggy, I am keen to transition into React Native mobile development at InnoVate Labs.', status: 'on process' },

            // Vikram applies to 2 jobs
            { job: createdJobs[2], user: fakeJobseekers[3], resume: createdResumes[4], coverLetter: 'With 4 years as Senior DevOps Engineer at Atlassian leading Jira Cloud migration, I bring deep expertise in Kubernetes and cloud infrastructure. I am excited to apply at CloudPeak Technologies.', status: 'accepted' },
            { job: createdJobs[12], user: fakeJobseekers[3], resume: createdResumes[4], coverLetter: 'The Cloud Solutions Architect role perfectly matches my experience designing multi-region cloud deployments at Atlassian. I hold AWS Professional and CKA certifications.', status: 'on process' },
        ];

        const createdApps = [];
        for (const a of applications) {
            const app = await JobApplication.create({
                job: a.job._id,
                user: a.user._id,
                resume: a.resume._id,
                coverLetter: a.coverLetter,
                status: a.status,
                applicationDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Random date in last 7 days
                recruiterNotes: a.status === 'accepted' ? 'Strong candidate. Excellent technical skills and cultural fit.' :
                    a.status === 'rejected' ? 'Good profile but looking for more direct framework experience.' :
                        a.status === 'on process' ? 'Promising. Schedule technical interview.' : '',
            });
            createdApps.push(app);

            // Add applicant to job's applicants array
            await JobModel.findByIdAndUpdate(a.job._id, { $addToSet: { applicants: a.user._id } });
        }
        console.log(`✅ Created ${createdApps.length} job applications`);

        // ========================
        // 7. SUMMARY
        // ========================
        console.log('\n========================================');
        console.log('🎉 FULL SEED COMPLETE!');
        console.log('========================================');
        console.log(`   Companies: ${Object.keys(companyMap).length}`);
        console.log(`   Jobs:      ${createdJobs.length}`);
        console.log(`   Users:     ${2 + fakeJobseekers.length} (1 recruiter + ${1 + fakeJobseekers.length} jobseekers)`);
        console.log(`   Resumes:   ${createdResumes.length}`);
        console.log(`   Applications: ${createdApps.length}`);
        console.log('========================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
