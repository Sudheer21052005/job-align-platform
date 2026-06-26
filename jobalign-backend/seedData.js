// seedData.js — One-time script to populate realistic demo data
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import './config/db.js';
import JobModel from './models/JobModel.js';
import User from './models/User.js';
import Company from './models/CompanyModel.js';

// Wait for MongoDB connection
await new Promise(resolve => setTimeout(resolve, 2000));

async function seed() {
    try {
        // Get the recruiter user
        const recruiter = await User.findOne({ email: 'sudheerprajapti0@gmail.com' });
        if (!recruiter) {
            console.error('Recruiter not found!');
            process.exit(1);
        }
        console.log(`Recruiter found: ${recruiter.email} (${recruiter._id})`);

        // Get the companies we created
        const companies = await Company.find({ userId: recruiter._id });
        console.log(`Found ${companies.length} companies`);

        if (companies.length === 0) {
            console.error('No companies found! Create them first.');
            process.exit(1);
        }

        // Map companies by name
        const companyMap = {};
        companies.forEach(c => { companyMap[c.name] = c._id; });
        console.log('Companies:', Object.keys(companyMap).join(', '));

        // Clear existing jobs for this recruiter
        const deleted = await JobModel.deleteMany({ recruiter: recruiter._id });
        console.log(`Cleared ${deleted.deletedCount} existing jobs`);

        // Realistic job data
        const jobs = [
            {
                title: 'Senior Full Stack Developer',
                description: `We are looking for an experienced Full Stack Developer to join our engineering team at TechNova Solutions. You will be responsible for designing and implementing scalable web applications, working closely with product managers and UX designers.

The ideal candidate will have strong experience with modern JavaScript frameworks, RESTful APIs, and cloud-native development practices. You'll be working on our flagship AI-powered analytics platform that serves thousands of enterprise clients globally.

What We Offer:
• Competitive salary and equity options
• Flexible work-from-home policy
• Health insurance for you and your family
• Annual learning budget of ₹50,000
• MacBook Pro and ergonomic workspace setup`,
                company: companyMap['TechNova Solutions'],
                location: 'Bangalore, India',
                skills: ['React.js', 'Node.js', 'MongoDB', 'AWS', 'TypeScript', 'Docker'],
                positions: 3,
                jobType: 'Full-Time',
                salaryLPA: 18,
                experience: '3-5 years',
                responsibilities: [
                    'Design and develop full-stack web applications using React and Node.js',
                    'Lead code reviews, technical design sessions and architecture discussions',
                    'Optimize application performance for scalability and reliability',
                    'Collaborate with product, design, and data science teams',
                    'Mentor junior developers and contribute to team growth'
                ],
                softSkills: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'],
                degree: ['B.Tech in Computer Science', 'MCA'],
                technicalSkills: ['React.js', 'Node.js', 'MongoDB', 'AWS', 'TypeScript', 'Docker'],
                certificates: ['AWS Certified Developer', 'MongoDB Certified Developer'],
                recruiter: recruiter._id,
                datePosted: new Date('2025-02-20'),
            },
            {
                title: 'UI/UX Designer',
                description: `Join our creative team at InnoVate Labs as a UI/UX Designer to create beautiful, intuitive user interfaces for our mobile and web products.

You will work with cross-functional teams to research user needs, create wireframes, design prototypes, and deliver high-fidelity mockups. We're looking for someone who is passionate about creating exceptional user experiences that balance aesthetics with usability.

Your work will directly impact how thousands of users interact with our products daily. If you love turning complex problems into simple, elegant designs — we want to hear from you.`,
                company: companyMap['InnoVate Labs'],
                location: 'Hyderabad, India',
                skills: ['Figma', 'Adobe XD', 'Sketch', 'HTML/CSS', 'User Research', 'Prototyping'],
                positions: 2,
                jobType: 'Full-Time',
                salaryLPA: 12,
                experience: '2-4 years',
                responsibilities: [
                    'Create wireframes, interactive prototypes and high-fidelity designs',
                    'Conduct user research, interviews and usability testing',
                    'Design responsive web and mobile interfaces following design system guidelines',
                    'Maintain and evolve the company design system and component library',
                    'Present design concepts to stakeholders and iterate based on feedback'
                ],
                softSkills: ['Creativity', 'Attention to Detail', 'Empathy', 'Communication'],
                degree: ['B.Des in Interaction Design', 'Bachelor of Fine Arts'],
                technicalSkills: ['Figma', 'Adobe XD', 'Sketch', 'HTML/CSS', 'Prototyping'],
                certificates: ['Google UX Design Certificate'],
                recruiter: recruiter._id,
                datePosted: new Date('2025-02-18'),
            },
            {
                title: 'DevOps Engineer',
                description: `CloudPeak Technologies is hiring a DevOps Engineer to build and maintain our cloud infrastructure serving Fortune 500 clients.

You will automate CI/CD pipelines, manage Kubernetes clusters, and ensure 99.99% uptime for production services. This role requires deep expertise with AWS services, infrastructure-as-code tools, and container orchestration.

You will work with a team of experienced cloud engineers on projects spanning multi-cloud deployments, microservices architecture, and real-time monitoring systems.`,
                company: companyMap['CloudPeak Technologies'],
                location: 'Pune, India',
                skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Linux', 'Python'],
                positions: 2,
                jobType: 'Full-Time',
                salaryLPA: 20,
                experience: '3-6 years',
                responsibilities: [
                    'Design and maintain automated CI/CD pipelines using Jenkins and GitHub Actions',
                    'Manage Kubernetes clusters and container orchestration at scale',
                    'Implement infrastructure-as-code using Terraform and CloudFormation',
                    'Monitor system performance, set up alerts, and handle incident response',
                    'Automate deployment, scaling, and disaster recovery processes'
                ],
                softSkills: ['Analytical Thinking', 'Problem Solving', 'Communication', 'Adaptability'],
                degree: ['B.Tech in Computer Science', 'B.Tech in IT'],
                technicalSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Linux', 'Python'],
                certificates: ['AWS Solutions Architect', 'Certified Kubernetes Administrator'],
                recruiter: recruiter._id,
                datePosted: new Date('2025-02-22'),
            },
            {
                title: 'React Native Mobile Developer',
                description: `InnoVate Labs is seeking a talented React Native Developer to build and maintain our cross-platform mobile applications for iOS and Android.

You will work with our product and backend teams to deliver smooth, pixel-perfect mobile experiences. The role involves developing new features, fixing bugs, optimizing performance, and ensuring code quality through testing.

We're building mobile-first experiences that are used by over 100,000 users daily — your work will have real impact.`,
                company: companyMap['InnoVate Labs'],
                location: 'Mumbai, India',
                skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'REST APIs', 'Firebase'],
                positions: 2,
                jobType: 'Full-Time',
                salaryLPA: 14,
                experience: '2-4 years',
                responsibilities: [
                    'Develop cross-platform mobile applications using React Native',
                    'Integrate RESTful APIs and third-party libraries',
                    'Write unit and integration tests to ensure code quality',
                    'Optimize app performance for smooth 60fps animations',
                    'Publish and maintain apps on App Store and Google Play'
                ],
                softSkills: ['Self-motivated', 'Detail-oriented', 'Collaborative', 'Fast learner'],
                degree: ['B.Tech in Computer Science', 'BCA'],
                technicalSkills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'Firebase'],
                certificates: ['Meta React Native Specialization'],
                recruiter: recruiter._id,
                datePosted: new Date('2025-02-15'),
            },
            {
                title: 'Data Analyst Intern',
                description: `TechNova Solutions is looking for a Data Analyst Intern to join our analytics team for a 6-month internship. This is a great opportunity for freshers to gain hands-on experience with real-world datasets and business intelligence tools.

You will assist in analyzing large datasets, creating dashboards and reports, and supporting the data science team with exploratory data analysis. Strong skills in Excel, SQL, and Python are preferred.

Stipend: ₹25,000/month + Certificate of Completion + PPO opportunity.`,
                company: companyMap['TechNova Solutions'],
                location: 'Bangalore, India',
                skills: ['SQL', 'Python', 'Excel', 'Power BI', 'Data Visualization', 'Statistics'],
                positions: 5,
                jobType: 'Internship',
                salaryLPA: 3,
                experience: '0-1 years (Freshers welcome)',
                responsibilities: [
                    'Analyze datasets to identify trends, patterns, and business insights',
                    'Create interactive dashboards using Power BI and Tableau',
                    'Write SQL queries to extract and transform data from databases',
                    'Support data science team with data cleaning and EDA',
                    'Prepare weekly and monthly reports for stakeholders'
                ],
                softSkills: ['Curiosity', 'Analytical Thinking', 'Communication', 'Time Management'],
                degree: ['B.Tech/B.E.', 'B.Sc Statistics', 'BCA'],
                technicalSkills: ['SQL', 'Python', 'Excel', 'Power BI'],
                certificates: ['Google Data Analytics Certificate'],
                recruiter: recruiter._id,
                datePosted: new Date('2025-02-23'),
            },
            {
                title: 'Backend Engineer (Java/Spring Boot)',
                description: `CloudPeak Technologies is hiring a Backend Engineer to design and build robust microservices using Java and Spring Boot.

You will be working on our core platform that handles millions of API requests daily. The role requires building high-performance backend services, implementing caching strategies, and designing database schemas.

We offer a collaborative work environment, regular hackathons, and opportunities to contribute to open-source projects.`,
                company: companyMap['CloudPeak Technologies'],
                location: 'Delhi NCR, India',
                skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'Microservices'],
                positions: 3,
                jobType: 'Full-Time',
                salaryLPA: 16,
                experience: '2-5 years',
                responsibilities: [
                    'Design and develop microservices using Java and Spring Boot',
                    'Build RESTful APIs with proper error handling and documentation',
                    'Implement caching with Redis and message queuing with Kafka',
                    'Write comprehensive unit and integration tests',
                    'Participate in on-call rotation and incident management'
                ],
                softSkills: ['Problem Solving', 'Teamwork', 'Ownership', 'Communication'],
                degree: ['B.Tech in Computer Science', 'MCA'],
                technicalSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'Microservices'],
                certificates: ['Oracle Certified Java Professional', 'Spring Professional Certification'],
                recruiter: recruiter._id,
                datePosted: new Date('2025-02-21'),
            },
        ];

        // Insert all jobs
        const createdJobs = await JobModel.insertMany(jobs);
        console.log(`\n✅ Successfully created ${createdJobs.length} jobs:`);
        createdJobs.forEach(j => {
            console.log(`  - ${j.title} (${j.location}) - ${j.salaryLPA} LPA [${j._id}]`);
        });

        console.log('\n🎉 Seed data complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
