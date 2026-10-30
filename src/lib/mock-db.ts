// In-memory mock store that provides zero-setup, flawless local testing
// and mirrors the full Smart Campus Navigation System 10-step lifecycle.
import bcrypt from 'bcryptjs';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'STUDENT' | 'SUPERVISOR' | 'EXAMINER' | 'SPONSOR' | 'ADMIN';
  department: string;
  bio?: string;
}

export interface MockApplication {
  id: string;
  projectId: string;
  teamId: string;
  teamName: string;
  leaderName: string;
  proposal: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  submittedAt: string;
}

export interface MockMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  weightage: number;
  status: 'PENDING' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REVISION_REQUESTED';
  deliverableUrl?: string;
  originalityScore?: number;
  feedback?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export interface MockSupervisorLog {
  id: string;
  projectId: string;
  supervisorId: string;
  meetingDate: string;
  attendees: string;
  discussionPoints: string;
  problemsIdentified?: string;
  decisions?: string;
  actionItems: string;
  nextMeetingDate?: string;
  satisfactionRating: number;
}

export interface MockEvaluation {
  id: string;
  projectId: string;
  examinerId: string;
  examinerName: string;
  examinerDepartment: string;
  technicalImplementationScore: number; // max 25
  problemUnderstandingScore: number;    // max 15
  innovationScore: number;              // max 15
  documentationScore: number;           // max 15
  presentationScore: number;            // max 15
  projectOutcomeScore: number;          // max 15
  totalScore: number;                   // max 100
  comments: string;
  isSubmitted: boolean;
  submittedAt?: string;
}

export interface MockProject {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  objectives?: string;
  requiredSkills: string[];
  expectedOutcomes?: string;
  category: 'INDUSTRY_SPONSORED' | 'ACADEMIC_RESEARCH' | 'ENTREPRENEURSHIP_CAPSTONE';
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'ALLOCATED' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'ARCHIVED';
  ipStatus: 'OPEN_SOURCE' | 'CONFIDENTIAL' | 'PATENT_PENDING' | 'SPONSOR_OWNED';
  tags: string[];
  maxTeamSize: number;
  applicationDeadline?: string;
  isPublicShowcase: boolean;
  showcaseSummary?: string;
  demoUrl?: string;
  githubUrl?: string;
  similarityScore?: number;
  originalityReportUrl?: string;
  sponsorId?: string;
  supervisorId?: string;
  allocatedTeamId?: string;
  sponsor?: any;
  supervisor?: any;
  allocatedTeam?: any;
  applications: MockApplication[];
  milestones: MockMilestone[];
  supervisorLogs: MockSupervisorLog[];
  evaluations: MockEvaluation[];
}

class MemoryStore {
  users: MockUser[] = [];
  projects: MockProject[] = [];
  initialized = false;

  async init() {
    if (this.initialized) return;

    const hash = await bcrypt.hash('password123', 10);

    // 5 Roles across the scenario:
    // 1. Sponsor (Steerpath / Elena Rostova)
    const sponsor: MockUser = {
      id: 'usr_sponsor_1',
      email: 'sponsor@novalabs.io',
      name: 'Elena Rostova',
      passwordHash: hash,
      role: 'SPONSOR',
      department: 'Steerpath Smart Infrastructure R&D',
      bio: 'VP of Engineering at Steerpath sponsoring campus indoor IoT navigation platforms.',
    };

    // 2. Admin (Dean Arthur Wright)
    const admin: MockUser = {
      id: 'admin@capstonehub.edu',
      email: 'admin@capstonehub.edu',
      name: 'Dean Arthur Wright',
      passwordHash: hash,
      role: 'ADMIN',
      department: 'Office of Academic Affairs & Capstone Accreditation',
      bio: 'Chief Capstone Director overseeing project approvals, allocations, and showcase standards.',
    };

    // 3. Students
    // Team Alpha Leader
    const student1: MockUser = {
      id: 'usr_student_1',
      email: 'student@capstonehub.edu',
      name: 'Alex Chen',
      passwordHash: hash,
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      bio: 'Lead Developer specializing in React, Next.js, and Geo-Spatial Graph Algorithms.',
    };

    // Team Alpha Peer
    const student2: MockUser = {
      id: 'usr_student_2',
      email: 'maya@capstonehub.edu',
      name: 'Maya Patel',
      passwordHash: hash,
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      bio: 'Full-stack developer focused on PostgreSQL routing extensions and UI accessibility.',
    };

    // Team Beta Leader
    const student3: MockUser = {
      id: 'usr_student_3',
      email: 'liam@capstonehub.edu',
      name: 'Liam Vance',
      passwordHash: hash,
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      bio: 'Robotics and mobile developer.',
    };

    // 4. Supervisor (Dr. Robert Martinez)
    const supervisor: MockUser = {
      id: 'usr_supervisor_1',
      email: 'supervisor@capstonehub.edu',
      name: 'Dr. Robert Martinez',
      passwordHash: hash,
      role: 'SUPERVISOR',
      department: 'Computer Science & Engineering',
      bio: 'Associate Professor of Distributed Systems and Campus IoT Networks.',
    };

    // 5. Three Independent Examiners (Step 8 Rubrics)
    const examiner1: MockUser = {
      id: 'usr_examiner_1',
      email: 'examiner@capstonehub.edu',
      name: 'Prof. Sarah Jenkins',
      passwordHash: hash,
      role: 'EXAMINER',
      department: 'Information Technology',
      bio: 'Capstone Board Member - Lead Technical Evaluator.',
    };

    const examiner2: MockUser = {
      id: 'usr_examiner_2',
      email: 'examiner2@capstonehub.edu',
      name: 'Dr. Vivek Sharma',
      passwordHash: hash,
      role: 'EXAMINER',
      department: 'Computer Science & Engineering',
      bio: 'External Assessment Chair & Senior Software Architect.',
    };

    const examiner3: MockUser = {
      id: 'usr_examiner_3',
      email: 'examiner3@capstonehub.edu',
      name: 'Prof. Claire Dubois',
      passwordHash: hash,
      role: 'EXAMINER',
      department: 'Software Engineering',
      bio: 'Industry Liaison & Evaluation Committee Member.',
    };

    this.users = [
      sponsor,
      admin,
      student1,
      student2,
      student3,
      supervisor,
      examiner1,
      examiner2,
      examiner3,
    ];

    // Primary End-to-End Project Example: "Smart Campus Navigation System"
    const smartCampusProject: MockProject = {
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
      applicationDeadline: '2026-11-15T23:59:59.000Z',
      isPublicShowcase: true,
      showcaseSummary: 'Sub-meter multi-floor indoor campus wayfinding platform cutting visitor transit confusion by 78% across 45,000 sq. meter university facilities.',
      demoUrl: 'https://smartcampus-nav.demo.internal',
      githubUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation',
      similarityScore: 12.0,
      originalityReportUrl: 'https://storage.mock.internal/reports/similarity-smart-campus-nav.pdf',
      sponsorId: sponsor.id,
      supervisorId: supervisor.id,
      allocatedTeamId: 'team_alpha',
      sponsor,
      supervisor,
      allocatedTeam: {
        id: 'team_alpha',
        name: 'GeoPath Innovators (Team Alpha)',
        members: [
          { id: 'tm_1', isLeader: true, user: student1 },
          { id: 'tm_2', isLeader: false, user: student2 },
        ],
      },
      applications: [
        {
          id: 'app_1',
          projectId: 'smart-campus-nav',
          teamId: 'team_alpha',
          teamName: 'GeoPath Innovators (Team Alpha)',
          leaderName: 'Alex Chen',
          proposal: 'Our team has prior experience building indoor graph algorithms with Next.js and PostgreSQL PostGIS. We plan to integrate Steerpath vector layouts with accessible turn-by-turn pathfinding.',
          status: 'ACCEPTED',
          submittedAt: '2026-11-02T10:15:00.000Z',
        },
        {
          id: 'app_2',
          projectId: 'smart-campus-nav',
          teamId: 'team_beta',
          teamName: 'BeaconPath Tech (Team Beta)',
          leaderName: 'Liam Vance',
          proposal: 'We propose an alternative BLE beacon triangulation model focusing on hardware sensors and flutter cross-compilation.',
          status: 'REJECTED',
          submittedAt: '2026-11-03T14:30:00.000Z',
        },
      ],
      milestones: [
        {
          id: 'ms_1',
          projectId: 'smart-campus-nav',
          title: 'Project Proposal & Literature Survey',
          description: 'Comprehensive study of indoor positioning technologies (BLE, Wi-Fi RTT, Dead Reckoning) and formal architectural specification.',
          dueDate: '2026-11-05T23:59:59.000Z',
          weightage: 10,
          status: 'APPROVED',
          deliverableUrl: 'https://drive.mock.internal/proposals/smart-campus-proposal.pdf',
          originalityScore: 96.5,
          feedback: 'Exemplary problem statement formulation and rigorous literature survey of Steerpath case studies. Approved.',
          submittedAt: '2026-11-04T16:00:00.000Z',
          reviewedAt: '2026-11-05T09:30:00.000Z',
        },
        {
          id: 'ms_2',
          projectId: 'smart-campus-nav',
          title: 'Requirements and System Design',
          description: 'Entity-relationship diagrams, floor vector JSON schemas, Dijkstra route graph design, and user story maps.',
          dueDate: '2026-11-15T23:59:59.000Z',
          weightage: 15,
          status: 'APPROVED',
          deliverableUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation/tree/v0.2-design',
          originalityScore: 94.0,
          feedback: 'Detailed schema documentation. Elevator transition nodes correctly modeled.',
          submittedAt: '2026-11-14T20:15:00.000Z',
          reviewedAt: '2026-11-15T11:00:00.000Z',
        },
        {
          id: 'ms_3',
          projectId: 'smart-campus-nav',
          title: 'Prototype Development & Core Routing Engine',
          description: 'Working Next.js application with interactive campus SVG map, multi-floor switcher, and shortest path finding.',
          dueDate: '2026-11-30T23:59:59.000Z',
          weightage: 25,
          status: 'APPROVED',
          deliverableUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation/tree/v0.5-prototype',
          originalityScore: 91.5,
          feedback: 'Interactive routing operates smoothly under 60fps. Ready for live test field trials.',
          submittedAt: '2026-11-28T18:45:00.000Z',
          reviewedAt: '2026-11-30T10:15:00.000Z',
        },
        {
          id: 'ms_4',
          projectId: 'smart-campus-nav',
          title: 'Testing & Accessibility Optimization',
          description: 'Field testing across Science & Engineering buildings, wheelchair accessibility audit, and load testing.',
          dueDate: '2026-12-10T23:59:59.000Z',
          weightage: 20,
          status: 'APPROVED',
          deliverableUrl: 'https://drive.mock.internal/tests/campus-nav-test-report.pdf',
          originalityScore: 95.0,
          feedback: 'Accessibility features pass WCAG 2.1 AA. Voice guidance prototype demonstrated.',
          submittedAt: '2026-12-08T12:00:00.000Z',
          reviewedAt: '2026-12-09T15:20:00.000Z',
        },
        {
          id: 'ms_5',
          projectId: 'smart-campus-nav',
          title: 'Final Submission & Production Deployment',
          description: 'End-to-end cloud deployment on Railway, sponsor sign-off documentation, user handbook, and source code archive.',
          dueDate: '2026-12-20T23:59:59.000Z',
          weightage: 30,
          status: 'APPROVED',
          deliverableUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation/releases/tag/v1.0.0',
          originalityScore: 88.0, // (12% similarity)
          feedback: 'Outstanding capstone deliverable. Ready for public showcase with sponsor confidentiality clearance.',
          submittedAt: '2026-12-18T14:00:00.000Z',
          reviewedAt: '2026-12-19T11:00:00.000Z',
        },
      ],
      supervisorLogs: [
        {
          id: 'log_1',
          projectId: 'smart-campus-nav',
          supervisorId: supervisor.id,
          meetingDate: '2026-11-12T14:00:00.000Z',
          attendees: 'Dr. Robert Martinez, Alex Chen, Maya Patel',
          discussionPoints: 'Discussed vector tile generation vs static SVGs for building level maps. Reviewed Steerpath floorplan formats.',
          problemsIdentified: 'Multi-story transitions at stairwells created non-planar graph intersections.',
          decisions: 'Adopted explicit 3D elevator node connector matrices with directional edge weightings.',
          actionItems: '1. Alex: Implement elevator node weights in Dijkstra search.\n2. Maya: Build floor switcher UI tab.',
          nextMeetingDate: '2026-11-26T14:00:00.000Z',
          satisfactionRating: 5,
        },
        {
          id: 'log_2',
          projectId: 'smart-campus-nav',
          supervisorId: supervisor.id,
          meetingDate: '2026-11-26T14:00:00.000Z',
          attendees: 'Dr. Robert Martinez, Alex Chen, Maya Patel, Elena Rostova (Sponsor)',
          discussionPoints: 'Demonstrated working 2-floor navigation prototype to Elena Rostova. Verified Steerpath NDA requirements.',
          problemsIdentified: 'Need to ensure proprietary floor plan coordinates are sanitized before public demonstration.',
          decisions: 'Redact sensitive security office coordinates while showcasing student wing navigation.',
          actionItems: '1. Maya: Add NDA and IP disclosure document to project repository.\n2. Alex: Conduct user trial with 15 freshman students.',
          nextMeetingDate: '2026-12-10T14:00:00.000Z',
          satisfactionRating: 5,
        },
      ],
      evaluations: [
        {
          id: 'eval_1',
          projectId: 'smart-campus-nav',
          examinerId: examiner1.id,
          examinerName: 'Prof. Sarah Jenkins',
          examinerDepartment: 'Information Technology',
          technicalImplementationScore: 24.0, // out of 25
          problemUnderstandingScore: 14.5,    // out of 15
          innovationScore: 14.0,              // out of 15
          documentationScore: 14.5,           // out of 15
          presentationScore: 14.0,            // out of 15
          projectOutcomeScore: 14.5,          // out of 15
          totalScore: 95.5,                   // Sum: 95.5
          comments: 'Exceptional system architecture. Multi-floor routing algorithm performs flawlessly with smooth SVG animations.',
          isSubmitted: true,
          submittedAt: '2026-12-21T10:30:00.000Z',
        },
        {
          id: 'eval_2',
          projectId: 'smart-campus-nav',
          examinerId: examiner2.id,
          examinerName: 'Dr. Vivek Sharma',
          examinerDepartment: 'Computer Science & Engineering',
          technicalImplementationScore: 23.5,
          problemUnderstandingScore: 14.0,
          innovationScore: 14.5,
          documentationScore: 14.0,
          presentationScore: 14.5,
          projectOutcomeScore: 14.0,
          totalScore: 94.5,
          comments: 'High practical utility. The inclusion of wheelchair accessible wayfinding demonstrates solid engineering empathy.',
          isSubmitted: true,
          submittedAt: '2026-12-21T11:15:00.000Z',
        },
        {
          id: 'eval_3',
          projectId: 'smart-campus-nav',
          examinerId: examiner3.id,
          examinerName: 'Prof. Claire Dubois',
          examinerDepartment: 'Software Engineering',
          technicalImplementationScore: 23.0,
          problemUnderstandingScore: 14.5,
          innovationScore: 13.5,
          documentationScore: 14.5,
          presentationScore: 14.0,
          projectOutcomeScore: 14.0,
          totalScore: 93.5,
          comments: 'Very strong code modularity and clean TypeScript types. Deployment on Railway is verified and responsive.',
          isSubmitted: true,
          submittedAt: '2026-12-21T14:00:00.000Z',
        },
      ],
    };

    // ── Project 2: AI-Powered Mental Health Chatbot (Academic Research) ──────
    const mentalHealthProject: MockProject = {
      id: 'ai-mental-health-bot',
      title: 'MindBridge – AI Mental Health Support Chatbot',
      description: 'A privacy-first, NLP-driven chatbot that provides 24/7 mental health first-aid, mood journaling, and guided CBT exercises for university students, with an escalation path to human counsellors.',
      problemStatement: 'University mental health services are overwhelmed and under-resourced, with average wait times exceeding 3 weeks. Students in distress need immediate, anonymous, stigma-free support that bridges the gap before professional intervention.',
      objectives: '1. Train a fine-tuned LLM (GPT-3.5 base) on validated CBT scripts.\n2. Build privacy-preserving mood-tracking with zero PII retention.\n3. Integrate a live escalation widget that alerts the student welfare office.\n4. Deploy on university intranet with end-to-end encryption.',
      requiredSkills: ['Python', 'FastAPI', 'LangChain', 'PostgreSQL', 'React', 'TypeScript', 'OpenAI API', 'NLP'],
      expectedOutcomes: 'Chatbot achieving >82% user-rated helpfulness in blind trials; mood-tracking dashboard for counsellors; full HIPAA-adjacent data policy.',
      category: 'ACADEMIC_RESEARCH',
      status: 'COMPLETED',
      ipStatus: 'OPEN_SOURCE',
      tags: ['AI/ML', 'NLP', 'Mental Health', 'LangChain', 'FastAPI', 'React', 'Privacy'],
      maxTeamSize: 3,
      isPublicShowcase: true,
      showcaseSummary: 'Fine-tuned CBT chatbot reducing student crisis escalation time by 64%, serving 1,200+ sessions in a 6-week campus pilot with zero PII retained.',
      demoUrl: 'https://mindbridge.demo.internal',
      githubUrl: 'https://github.com/capstonehub-demo/mindbridge-chatbot',
      similarityScore: 8.5,
      originalityReportUrl: 'https://storage.mock.internal/reports/similarity-mindbridge.pdf',
      sponsorId: undefined,
      supervisorId: supervisor.id,
      allocatedTeamId: 'team_gamma',
      sponsor: undefined,
      supervisor,
      allocatedTeam: {
        id: 'team_gamma',
        name: 'NeuralMinds (Team Gamma)',
        members: [
          { id: 'tm_g1', isLeader: true,  user: { ...student2, name: 'Priya Nair',   email: 'priya@capstonehub.edu'   } },
          { id: 'tm_g2', isLeader: false, user: { ...student3, name: 'Omar Khalid',  email: 'omar@capstonehub.edu'   } },
        ],
      },
      applications: [],
      milestones: [
        { id: 'ms_g1', projectId: 'ai-mental-health-bot', title: 'Literature Review & Ethics Clearance', description: 'Systematic review of CBT chatbot literature and IRB ethics approval.', dueDate: '2026-10-20T23:59:59.000Z', weightage: 10, status: 'APPROVED', originalityScore: 97.0, feedback: 'Ethics document thorough. IRB approved.', submittedAt: '2026-10-18T12:00:00.000Z', reviewedAt: '2026-10-20T09:00:00.000Z' },
        { id: 'ms_g2', projectId: 'ai-mental-health-bot', title: 'LLM Fine-Tuning & CBT Script Dataset', description: 'Dataset curation and GPT-3.5 fine-tuning pipeline.', dueDate: '2026-11-10T23:59:59.000Z', weightage: 25, status: 'APPROVED', originalityScore: 91.0, feedback: 'Model shows strong empathetic response framing.', submittedAt: '2026-11-08T16:00:00.000Z', reviewedAt: '2026-11-10T11:00:00.000Z' },
        { id: 'ms_g3', projectId: 'ai-mental-health-bot', title: 'Full-Stack Integration & Campus Pilot', description: '6-week live pilot, counsellor dashboard, escalation webhook.', dueDate: '2026-12-18T23:59:59.000Z', weightage: 40, status: 'APPROVED', originalityScore: 89.0, feedback: 'Outstanding pilot results. 82% helpfulness score achieved.', submittedAt: '2026-12-16T14:00:00.000Z', reviewedAt: '2026-12-18T10:00:00.000Z' },
      ],
      supervisorLogs: [
        { id: 'log_g1', projectId: 'ai-mental-health-bot', supervisorId: supervisor.id, meetingDate: '2026-11-05T10:00:00.000Z', attendees: 'Dr. Robert Martinez, Priya Nair, Omar Khalid', discussionPoints: 'Reviewed fine-tuning dataset quality and bias mitigation strategies.', problemsIdentified: 'Dataset skewed toward Western CBT framing.', decisions: 'Add culturally diverse session transcripts from WHO dataset.', actionItems: '1. Omar: Augment dataset with WHO-approved scripts.\n2. Priya: Test response parity across demographic prompt sets.', satisfactionRating: 4 },
      ],
      evaluations: [
        { id: 'eval_g1', projectId: 'ai-mental-health-bot', examinerId: examiner1.id, examinerName: 'Prof. Sarah Jenkins', examinerDepartment: 'Information Technology', technicalImplementationScore: 22.5, problemUnderstandingScore: 15.0, innovationScore: 14.5, documentationScore: 13.5, presentationScore: 13.5, projectOutcomeScore: 14.0, totalScore: 93.0, comments: 'Impressive empathetic response quality. Privacy architecture is textbook.', isSubmitted: true, submittedAt: '2026-12-22T09:00:00.000Z' },
        { id: 'eval_g2', projectId: 'ai-mental-health-bot', examinerId: examiner2.id, examinerName: 'Dr. Vivek Sharma', examinerDepartment: 'Computer Science & Engineering', technicalImplementationScore: 23.0, problemUnderstandingScore: 14.5, innovationScore: 15.0, documentationScore: 13.0, presentationScore: 13.5, projectOutcomeScore: 13.5, totalScore: 92.5, comments: 'LangChain pipeline is elegant. Escalation webhook latency should be under 500ms in production.', isSubmitted: true, submittedAt: '2026-12-22T10:00:00.000Z' },
      ],
    };

    // ── Project 3: Blockchain Academic Credential Verification (Industry) ────
    const blockchainProject: MockProject = {
      id: 'blockchain-credentials',
      title: 'CertChain – Blockchain Academic Credential Verification',
      description: 'A tamper-proof, Ethereum-based credentialing system that lets employers instantly verify degrees, transcripts, and certifications without contacting the university registry.',
      problemStatement: 'Diploma fraud costs employers billions annually. Verification requests take 2–6 weeks through traditional registry channels, creating bottlenecks in hiring and international student mobility.',
      objectives: '1. Issue verifiable credentials (VCs) anchored on Polygon PoS for low gas fees.\n2. Build an employer-facing verification portal with QR-code scanning.\n3. Integrate with the university SIS via REST API.\n4. Achieve sub-5-second credential lookup on mainnet.',
      requiredSkills: ['Solidity', 'Hardhat', 'Ethers.js', 'Next.js', 'TypeScript', 'PostgreSQL', 'IPFS', 'REST API'],
      expectedOutcomes: 'Smart contract deployed on Polygon testnet, verifiable credential issuance for 50 pilot graduates, employer portal with <5s verification SLA.',
      category: 'INDUSTRY_SPONSORED',
      status: 'COMPLETED',
      ipStatus: 'PATENT_PENDING',
      tags: ['Blockchain', 'Solidity', 'Polygon', 'Verifiable Credentials', 'Next.js', 'IPFS', 'Smart Contracts'],
      maxTeamSize: 4,
      isPublicShowcase: true,
      showcaseSummary: 'Polygon-anchored VC system reducing credential fraud risk to near-zero; 50 pilot degrees issued with employer verification in under 3 seconds.',
      demoUrl: 'https://certchain.demo.internal',
      githubUrl: 'https://github.com/capstonehub-demo/certchain',
      similarityScore: 15.2,
      originalityReportUrl: 'https://storage.mock.internal/reports/similarity-certchain.pdf',
      sponsorId: 'usr_sponsor_2',
      supervisorId: supervisor.id,
      allocatedTeamId: 'team_delta',
      sponsor: { id: 'usr_sponsor_2', name: 'Marcus Webb', department: 'TrustLayer Inc. – Blockchain Infrastructure' },
      supervisor,
      allocatedTeam: {
        id: 'team_delta',
        name: 'CryptoGrad (Team Delta)',
        members: [
          { id: 'tm_d1', isLeader: true,  user: { ...student1, name: 'Riya Shah',    email: 'riya@capstonehub.edu'   } },
          { id: 'tm_d2', isLeader: false, user: { ...student2, name: 'Jake Torres',  email: 'jake@capstonehub.edu'   } },
          { id: 'tm_d3', isLeader: false, user: { ...student3, name: 'Ananya Iyer',  email: 'ananya@capstonehub.edu' } },
        ],
      },
      applications: [],
      milestones: [
        { id: 'ms_d1', projectId: 'blockchain-credentials', title: 'Smart Contract Architecture & Testnet Deploy', description: 'ERC-1155-based VC contract on Polygon Mumbai testnet.', dueDate: '2026-11-08T23:59:59.000Z', weightage: 20, status: 'APPROVED', originalityScore: 88.0, feedback: 'Gas-optimised contract. Audit passed.', submittedAt: '2026-11-06T15:00:00.000Z', reviewedAt: '2026-11-08T10:00:00.000Z' },
        { id: 'ms_d2', projectId: 'blockchain-credentials', title: 'SIS Integration & Issuance Pipeline', description: 'REST API bridge between SIS Oracle DB and IPFS/chain issuance.', dueDate: '2026-11-28T23:59:59.000Z', weightage: 30, status: 'APPROVED', originalityScore: 85.0, feedback: 'Reliable pipeline. IPFS pinning latency acceptable at ~1.2s.', submittedAt: '2026-11-26T17:00:00.000Z', reviewedAt: '2026-11-28T10:00:00.000Z' },
        { id: 'ms_d3', projectId: 'blockchain-credentials', title: 'Employer Portal & Pilot Rollout', description: '50 real graduate credentials issued; employer QR-verification portal launched.', dueDate: '2026-12-19T23:59:59.000Z', weightage: 35, status: 'APPROVED', originalityScore: 84.8, feedback: 'Verification SLA met at 2.8s average. Excellent sponsor feedback.', submittedAt: '2026-12-17T14:00:00.000Z', reviewedAt: '2026-12-19T10:00:00.000Z' },
      ],
      supervisorLogs: [
        { id: 'log_d1', projectId: 'blockchain-credentials', supervisorId: supervisor.id, meetingDate: '2026-11-15T11:00:00.000Z', attendees: 'Dr. Robert Martinez, Riya Shah, Jake Torres, Marcus Webb (TrustLayer)', discussionPoints: 'Reviewed Polygon gas cost projections and IPFS pinning reliability.', problemsIdentified: 'IPFS gateway occasionally returns stale content after 24h.', decisions: 'Pin to two independent gateways (Pinata + Infura) for redundancy.', actionItems: '1. Jake: Configure dual-pin pipeline.\n2. Ananya: Draft employer verification UX flow.', satisfactionRating: 5 },
      ],
      evaluations: [
        { id: 'eval_d1', projectId: 'blockchain-credentials', examinerId: examiner1.id, examinerName: 'Prof. Sarah Jenkins', examinerDepartment: 'Information Technology', technicalImplementationScore: 24.0, problemUnderstandingScore: 14.0, innovationScore: 15.0, documentationScore: 14.0, presentationScore: 13.5, projectOutcomeScore: 14.5, totalScore: 95.0, comments: 'Blockchain integration is production-grade. Smart contract audit passing is a strong differentiator.', isSubmitted: true, submittedAt: '2026-12-21T15:00:00.000Z' },
        { id: 'eval_d2', projectId: 'blockchain-credentials', examinerId: examiner3.id, examinerName: 'Prof. Claire Dubois', examinerDepartment: 'Software Engineering', technicalImplementationScore: 23.5, problemUnderstandingScore: 14.5, innovationScore: 14.0, documentationScore: 14.5, presentationScore: 14.0, projectOutcomeScore: 13.5, totalScore: 94.0, comments: 'Real-world pilot with 50 graduates is outstanding validation. Patent pending justifies IP classification.', isSubmitted: true, submittedAt: '2026-12-21T16:30:00.000Z' },
      ],
    };

    // ── Project 4: EcoTrack – Campus Carbon Footprint Monitor (Entrepreneurship) ─
    const ecoTrackProject: MockProject = {
      id: 'ecotrack-campus',
      title: 'EcoTrack – Real-Time Campus Carbon Footprint Dashboard',
      description: 'An IoT-powered sustainability platform that aggregates energy, water, and waste sensor data across campus buildings and presents actionable decarbonisation insights on a live dashboard accessible to students, facilities managers, and the university board.',
      problemStatement: 'Universities have ambitious net-zero targets but lack granular, real-time data to identify which buildings, labs, or events are carbon hotspots. Manual reporting is infrequent and inaccurate.',
      objectives: '1. Integrate MQTT-based IoT sensor feeds for electricity, HVAC, and water meters.\n2. Compute per-building CO₂ equivalent scores using IPCC emission factors.\n3. Build a Next.js live dashboard with 5-minute refresh and historical trend charts.\n4. Provide actionable alerts when consumption exceeds baseline thresholds.',
      requiredSkills: ['Next.js', 'MQTT', 'IoT', 'TimescaleDB', 'Chart.js', 'TypeScript', 'Python', 'REST API'],
      expectedOutcomes: 'Live dashboard for 12 campus buildings, automated anomaly alerts, 3-month trend reports, and a published carbon-reduction recommendations report.',
      category: 'ENTREPRENEURSHIP_CAPSTONE',
      status: 'COMPLETED',
      ipStatus: 'OPEN_SOURCE',
      tags: ['IoT', 'Sustainability', 'Next.js', 'MQTT', 'TimescaleDB', 'Carbon', 'Dashboard', 'Green Tech'],
      maxTeamSize: 3,
      isPublicShowcase: true,
      showcaseSummary: 'Real-time IoT carbon dashboard across 12 campus buildings; identified 3 HVAC anomalies saving an estimated ₹18L annually; adopted by university Estates Office.',
      demoUrl: 'https://ecotrack.demo.internal',
      githubUrl: 'https://github.com/capstonehub-demo/ecotrack',
      similarityScore: 9.1,
      originalityReportUrl: 'https://storage.mock.internal/reports/similarity-ecotrack.pdf',
      sponsorId: undefined,
      supervisorId: supervisor.id,
      allocatedTeamId: 'team_epsilon',
      sponsor: undefined,
      supervisor,
      allocatedTeam: {
        id: 'team_epsilon',
        name: 'GreenByte Collective (Team Epsilon)',
        members: [
          { id: 'tm_e1', isLeader: true,  user: { ...student1, name: 'Kavya Reddy',  email: 'kavya@capstonehub.edu'  } },
          { id: 'tm_e2', isLeader: false, user: { ...student3, name: 'Sam Liu',      email: 'sam@capstonehub.edu'    } },
        ],
      },
      applications: [],
      milestones: [
        { id: 'ms_e1', projectId: 'ecotrack-campus', title: 'IoT Sensor Integration & MQTT Broker Setup', description: 'Connect 12 building smart meters via MQTT to TimescaleDB.', dueDate: '2026-11-10T23:59:59.000Z', weightage: 25, status: 'APPROVED', originalityScore: 93.0, feedback: 'Sensor pipeline stable. TimescaleDB hypertables well-partitioned.', submittedAt: '2026-11-08T15:00:00.000Z', reviewedAt: '2026-11-10T09:00:00.000Z' },
        { id: 'ms_e2', projectId: 'ecotrack-campus', title: 'CO₂ Computation Engine & Alert System', description: 'IPCC emission factor calculations, threshold alerting via email/webhook.', dueDate: '2026-11-25T23:59:59.000Z', weightage: 30, status: 'APPROVED', originalityScore: 90.9, feedback: 'Emission factors correctly localised to Indian grid average. Alert latency <30s.', submittedAt: '2026-11-23T17:00:00.000Z', reviewedAt: '2026-11-25T10:00:00.000Z' },
        { id: 'ms_e3', projectId: 'ecotrack-campus', title: 'Live Dashboard & Estates Office Adoption', description: 'Next.js dashboard deployed, adopted by Estates Office for live monitoring.', dueDate: '2026-12-15T23:59:59.000Z', weightage: 30, status: 'APPROVED', originalityScore: 90.9, feedback: 'Dashboard adopted by Estates Office. Outstanding real-world impact.', submittedAt: '2026-12-13T14:00:00.000Z', reviewedAt: '2026-12-15T09:00:00.000Z' },
      ],
      supervisorLogs: [
        { id: 'log_e1', projectId: 'ecotrack-campus', supervisorId: supervisor.id, meetingDate: '2026-11-18T09:00:00.000Z', attendees: 'Dr. Robert Martinez, Kavya Reddy, Sam Liu, Facilities Manager (guest)', discussionPoints: 'Demonstrated live sensor feed from Engineering Block B HVAC. Facilities team highly engaged.', problemsIdentified: 'Occasional packet loss from older sub-metering sensors.', decisions: 'Implement exponential backoff reconnect in MQTT client; cache last-known-good reading.', actionItems: '1. Sam: Implement MQTT reconnect strategy.\n2. Kavya: Add "data gap" indicator on dashboard.', satisfactionRating: 5 },
      ],
      evaluations: [
        { id: 'eval_e1', projectId: 'ecotrack-campus', examinerId: examiner2.id, examinerName: 'Dr. Vivek Sharma', examinerDepartment: 'Computer Science & Engineering', technicalImplementationScore: 22.0, problemUnderstandingScore: 15.0, innovationScore: 14.5, documentationScore: 14.0, presentationScore: 14.5, projectOutcomeScore: 15.0, totalScore: 95.0, comments: 'Real-world Estates Office adoption is rare at undergraduate level. Excellent societal impact.', isSubmitted: true, submittedAt: '2026-12-22T11:00:00.000Z' },
        { id: 'eval_e2', projectId: 'ecotrack-campus', examinerId: examiner3.id, examinerName: 'Prof. Claire Dubois', examinerDepartment: 'Software Engineering', technicalImplementationScore: 21.5, problemUnderstandingScore: 14.5, innovationScore: 14.0, documentationScore: 14.5, presentationScore: 14.0, projectOutcomeScore: 14.5, totalScore: 93.0, comments: 'TimescaleDB choice is excellent for time-series workloads. Carbon calculation methodology is rigorous.', isSubmitted: true, submittedAt: '2026-12-22T13:00:00.000Z' },
      ],
    };

    // ── Project 5: SecureVote – Tamper-Proof Online Student Elections (Academic) ─
    const secureVoteProject: MockProject = {
      id: 'securevote-elections',
      title: 'SecureVote – Tamper-Proof Online Student Union Elections',
      description: 'A cryptographically secure, auditable e-voting platform for student union elections, using blind signatures and zero-knowledge proofs to guarantee ballot privacy while enabling public verifiability.',
      problemStatement: 'Student elections run via paper ballots or unaudited Google Forms are vulnerable to tampering, stuffing, and results disputes. A verifiable yet anonymous e-voting system is needed that students and auditors can independently verify without revealing individual votes.',
      objectives: '1. Implement blind-signature-based anonymous ballot issuance.\n2. Build a ZK-proof tallying engine (Groth16 via snarkjs).\n3. Publish verifiable election artifacts to IPFS for public audit.\n4. Deploy a user-friendly Next.js voting portal with < 2s ballot submission.',
      requiredSkills: ['Cryptography', 'snarkjs', 'ZK-Proofs', 'Node.js', 'Next.js', 'TypeScript', 'IPFS', 'PostgreSQL'],
      expectedOutcomes: 'Cryptographically verifiable election with 400+ student voter pilot; public audit trail on IPFS; zero contested results.',
      category: 'ACADEMIC_RESEARCH',
      status: 'COMPLETED',
      ipStatus: 'OPEN_SOURCE',
      tags: ['Cryptography', 'ZK-Proofs', 'E-Voting', 'IPFS', 'Next.js', 'snarkjs', 'Security', 'Governance'],
      maxTeamSize: 3,
      isPublicShowcase: true,
      showcaseSummary: '400-voter cryptographically verifiable election pilot with zero contested results; ZK-proof audit artifacts published on IPFS; adopted by Student Union.',
      demoUrl: 'https://securevote.demo.internal',
      githubUrl: 'https://github.com/capstonehub-demo/securevote',
      similarityScore: 7.8,
      originalityReportUrl: 'https://storage.mock.internal/reports/similarity-securevote.pdf',
      sponsorId: undefined,
      supervisorId: supervisor.id,
      allocatedTeamId: 'team_zeta',
      sponsor: undefined,
      supervisor,
      allocatedTeam: {
        id: 'team_zeta',
        name: 'CipherBallot (Team Zeta)',
        members: [
          { id: 'tm_z1', isLeader: true,  user: { ...student1, name: 'Arjun Mehta',   email: 'arjun@capstonehub.edu'   } },
          { id: 'tm_z2', isLeader: false, user: { ...student2, name: 'Sasha Petrov',  email: 'sasha@capstonehub.edu'  } },
        ],
      },
      applications: [],
      milestones: [
        { id: 'ms_z1', projectId: 'securevote-elections', title: 'ZK-Proof Circuit Design & snarkjs Integration', description: 'Groth16 circuit for ballot validity proof; trusted setup ceremony.', dueDate: '2026-11-12T23:59:59.000Z', weightage: 30, status: 'APPROVED', originalityScore: 95.0, feedback: 'Circuit constraints well-specified. Trusted setup ceremony conducted correctly.', submittedAt: '2026-11-10T16:00:00.000Z', reviewedAt: '2026-11-12T10:00:00.000Z' },
        { id: 'ms_z2', projectId: 'securevote-elections', title: 'Voting Portal & 400-Student Pilot', description: 'Live election with Student Union; IPFS audit trail published.', dueDate: '2026-12-12T23:59:59.000Z', weightage: 40, status: 'APPROVED', originalityScore: 92.2, feedback: 'Pilot ran flawlessly. IPFS audit trail independently verified by external auditor.', submittedAt: '2026-12-10T15:00:00.000Z', reviewedAt: '2026-12-12T09:00:00.000Z' },
      ],
      supervisorLogs: [
        { id: 'log_z1', projectId: 'securevote-elections', supervisorId: supervisor.id, meetingDate: '2026-11-20T10:00:00.000Z', attendees: 'Dr. Robert Martinez, Arjun Mehta, Sasha Petrov, Student Union President (guest)', discussionPoints: 'Reviewed ZK proof generation time (3.2s) and UX implications.', problemsIdentified: 'Proof generation on mobile devices takes >8s — unusable UX.', decisions: 'Offload proof generation to server-side worker; client submits encrypted ballot only.', actionItems: '1. Arjun: Implement server-side proof worker.\n2. Sasha: Add progress spinner and ballot receipt UI.', satisfactionRating: 4 },
      ],
      evaluations: [
        { id: 'eval_z1', projectId: 'securevote-elections', examinerId: examiner1.id, examinerName: 'Prof. Sarah Jenkins', examinerDepartment: 'Information Technology', technicalImplementationScore: 25.0, problemUnderstandingScore: 15.0, innovationScore: 15.0, documentationScore: 14.0, presentationScore: 13.5, projectOutcomeScore: 14.0, totalScore: 96.5, comments: 'One of the most technically sophisticated capstones I have evaluated. ZK proofs applied correctly and auditably.', isSubmitted: true, submittedAt: '2026-12-23T10:00:00.000Z' },
        { id: 'eval_z2', projectId: 'securevote-elections', examinerId: examiner2.id, examinerName: 'Dr. Vivek Sharma', examinerDepartment: 'Computer Science & Engineering', technicalImplementationScore: 24.5, problemUnderstandingScore: 14.5, innovationScore: 14.5, documentationScore: 14.0, presentationScore: 14.0, projectOutcomeScore: 14.0, totalScore: 95.5, comments: 'Server-side proof delegation is the right call. Excellent fallback design.', isSubmitted: true, submittedAt: '2026-12-23T11:30:00.000Z' },
      ],
    };

    this.projects = [smartCampusProject, mentalHealthProject, blockchainProject, ecoTrackProject, secureVoteProject];
    this.initialized = true;
  }
}

const globalStore = globalThis as unknown as { __capstoneStore?: MemoryStore };
export const mockDb = globalStore.__capstoneStore || new MemoryStore();
if (process.env.NODE_ENV !== 'production') globalStore.__capstoneStore = mockDb;
