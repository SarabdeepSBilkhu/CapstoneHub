import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function seedDemoData() {
  try {
    const existingCount = await prisma.user.count();
    if (existingCount > 0) {
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Demo Users across all 5 roles
    const studentLeader = await prisma.user.create({
      data: {
        email: 'student@capstonehub.edu',
        name: 'Alex Chen',
        passwordHash: hashedPassword,
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        bio: 'Final year CSE undergraduate focusing on Distributed Systems & AI.',
      },
    });

    const studentPeer = await prisma.user.create({
      data: {
        email: 'maya@capstonehub.edu',
        name: 'Maya Patel',
        passwordHash: hashedPassword,
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        bio: 'Full-stack developer interested in Cloud & Security.',
      },
    });

    const supervisor = await prisma.user.create({
      data: {
        email: 'supervisor@capstonehub.edu',
        name: 'Dr. Robert Martinez',
        passwordHash: hashedPassword,
        role: 'SUPERVISOR',
        department: 'Computer Science & Engineering',
        bio: 'Professor specializing in Machine Learning Systems and Scalable Software Architecture.',
      },
    });

    const examiner = await prisma.user.create({
      data: {
        email: 'examiner@capstonehub.edu',
        name: 'Prof. Sarah Jenkins',
        passwordHash: hashedPassword,
        role: 'EXAMINER',
        department: 'Information Technology',
        bio: 'Academic Evaluator and Capstone Committee Senior Member.',
      },
    });

    const sponsor = await prisma.user.create({
      data: {
        email: 'sponsor@novalabs.io',
        name: 'Elena Rostova',
        passwordHash: hashedPassword,
        role: 'SPONSOR',
        department: 'Steerpath Smart Infrastructure R&D',
        bio: 'VP of Engineering at Steerpath sponsoring campus indoor IoT navigation platforms.',
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: 'admin@capstonehub.edu',
        name: 'Dean Arthur Wright',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        department: 'Academic Dean Office',
        bio: 'Chief Capstone Director & Accreditation Coordinator.',
      },
    });

    // 2. Create Team
    const team1 = await prisma.team.create({
      data: {
        name: 'GeoPath Innovators (Team Alpha)',
        leaderId: studentLeader.id,
        members: {
          create: [
            { userId: studentLeader.id, isLeader: true },
            { userId: studentPeer.id, isLeader: false },
          ],
        },
      },
    });

    // 3. Create Smart Campus Navigation Project
    const project1 = await prisma.project.create({
      data: {
        id: 'smart-campus-nav',
        title: 'Smart Campus Navigation System',
        description: 'An industry-sponsored indoor and outdoor navigation platform that helps students, faculty, and visitors locate classrooms, research laboratories, offices, and campus facilities with sub-meter wayfinding.',
        problemStatement: 'Large university campuses encounter acute orientation bottlenecks, causing incoming students and visitors to lose time locating specialized auditoriums, testing halls, and labs. Traditional GPS breaks down indoors, necessitating multi-floor vector mapping, Wi-Fi RTT/BLE beacon triangulation, and accessible turn-by-turn routing.',
        objectives: '1. Deliver floor-level vector maps with Dijkstra shortest-path wayfinding.\n2. Implement accessible routing (wheelchair accessible elevators).\n3. Provide responsive Next.js web application with live SVG campus overlays.\n4. Ensure sponsor IP compliance with Steerpath NDA requirements.',
        requiredSkills: ['Next.js', 'React', 'PostgreSQL', 'Tailwind CSS', 'Maps API / Leaflet', 'Graph Algorithms', 'TypeScript'],
        expectedOutcomes: 'A production web app supporting 5 multi-story buildings, step-by-step turn guidance, search autocompletion, and an administrative map editor.',
        category: 'INDUSTRY_SPONSORED',
        status: 'COMPLETED',
        ipStatus: 'CONFIDENTIAL',
        tags: ['Indoor Navigation', 'Next.js', 'PostgreSQL', 'Maps API', 'React', 'TypeScript', 'Campus IoT'],
        maxTeamSize: 4,
        isPublicShowcase: true,
        showcaseSummary: 'Sub-meter multi-floor indoor campus wayfinding platform cutting visitor transit confusion by 78% across 45,000 sq. meter university facilities.',
        demoUrl: 'https://smartcampus-nav.demo.internal',
        githubUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation',
        similarityScore: 12.0,
        originalityReportUrl: 'https://storage.mock.internal/reports/similarity-smart-campus-nav.pdf',
        sponsorId: sponsor.id,
        supervisorId: supervisor.id,
        allocatedTeamId: team1.id,
      },
    });

    // 4. Milestones
    await prisma.milestone.createMany({
      data: [
        {
          projectId: project1.id,
          title: 'Project Proposal & Literature Survey',
          description: 'Comprehensive study of indoor positioning technologies and formal architectural specification.',
          dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          weightage: 10,
          status: 'APPROVED',
          deliverableUrl: 'https://drive.mock.internal/proposals/smart-campus-proposal.pdf',
          originalityScore: 96.5,
          feedback: 'Exemplary problem statement formulation and rigorous literature survey. Approved.',
          submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          reviewedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
        {
          projectId: project1.id,
          title: 'Requirements and System Design',
          description: 'Entity-relationship diagrams, floor vector JSON schemas, Dijkstra route graph design.',
          dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          weightage: 15,
          status: 'APPROVED',
          deliverableUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation/tree/v0.2-design',
          originalityScore: 94.0,
          feedback: 'Detailed schema documentation. Elevator transition nodes correctly modeled.',
          submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // 5. Supervisor Meeting Logs
    await prisma.supervisorLog.create({
      data: {
        projectId: project1.id,
        supervisorId: supervisor.id,
        meetingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        attendees: 'Dr. Robert Martinez, Alex Chen, Maya Patel',
        discussionPoints: 'Discussed vector tile generation vs static SVGs for building level maps. Reviewed Steerpath floorplan formats.',
        problemsIdentified: 'Multi-story transitions at stairwells created non-planar graph intersections.',
        decisions: 'Adopted explicit 3D elevator node connector matrices with directional edge weightings.',
        actionItems: '1. Alex: Implement elevator node weights in Dijkstra search.\n2. Maya: Build floor switcher UI tab.',
        satisfactionRating: 5,
      },
    });

    // 6. Rubric Evaluation
    await prisma.evaluation.create({
      data: {
        projectId: project1.id,
        examinerId: examiner.id,
        technicalImplementationScore: 24.0,
        problemUnderstandingScore: 14.5,
        innovationScore: 14.0,
        documentationScore: 14.5,
        presentationScore: 14.0,
        projectOutcomeScore: 14.5,
        totalScore: 95.5,
        comments: 'Exceptional system architecture. Multi-floor routing algorithm performs flawlessly with smooth SVG animations.',
        isSubmitted: true,
        submittedAt: new Date(),
      },
    });
  } catch (error) {
    console.warn('Database seed skipped or already applied:', error);
  }
}
