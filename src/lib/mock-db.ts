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

    this.projects = [smartCampusProject];
    this.initialized = true;
  }
}

const globalStore = globalThis as unknown as { __capstoneStore?: MemoryStore };
export const mockDb = globalStore.__capstoneStore || new MemoryStore();
if (process.env.NODE_ENV !== 'production') globalStore.__capstoneStore = mockDb;
