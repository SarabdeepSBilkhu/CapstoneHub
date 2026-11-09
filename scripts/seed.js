const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const hash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const usersData = [
    {
      id: 'usr_sponsor_1',
      email: 'sponsor@novalabs.io',
      name: 'Elena Rostova',
      passwordHash: hash,
      role: 'SPONSOR',
      department: 'Steerpath Smart Infrastructure R&D',
      bio: 'VP of Engineering at Steerpath sponsoring campus indoor IoT navigation platforms.',
    },
    {
      id: 'admin@capstonehub.edu',
      email: 'admin@capstonehub.edu',
      name: 'Dean Arthur Wright',
      passwordHash: hash,
      role: 'ADMIN',
      department: 'Office of Academic Affairs & Capstone Accreditation',
      bio: 'Chief Capstone Director overseeing project approvals, allocations, and showcase standards.',
    },
    {
      id: 'usr_student_1',
      email: 'student@capstonehub.edu',
      name: 'Alex Chen',
      passwordHash: hash,
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      bio: 'Lead Developer specializing in React, Next.js, and Geo-Spatial Graph Algorithms.',
    },
    {
      id: 'usr_student_2',
      email: 'maya@capstonehub.edu',
      name: 'Maya Patel',
      passwordHash: hash,
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      bio: 'Full-stack developer focused on PostgreSQL routing extensions and UI accessibility.',
    },
    {
      id: 'usr_student_3',
      email: 'liam@capstonehub.edu',
      name: 'Liam Vance',
      passwordHash: hash,
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      bio: 'Robotics and mobile developer.',
    },
    {
      id: 'usr_supervisor_1',
      email: 'supervisor@capstonehub.edu',
      name: 'Dr. Robert Martinez',
      passwordHash: hash,
      role: 'SUPERVISOR',
      department: 'Computer Science & Engineering',
      bio: 'Associate Professor of Distributed Systems and Campus IoT Networks.',
    },
    {
      id: 'usr_examiner_1',
      email: 'examiner@capstonehub.edu',
      name: 'Prof. Sarah Jenkins',
      passwordHash: hash,
      role: 'EXAMINER',
      department: 'Information Technology',
      bio: 'Capstone Board Member - Lead Technical Evaluator.',
    },
    {
      id: 'usr_examiner_2',
      email: 'examiner2@capstonehub.edu',
      name: 'Dr. Vivek Sharma',
      passwordHash: hash,
      role: 'EXAMINER',
      department: 'Computer Science & Engineering',
      bio: 'External Assessment Chair & Senior Software Architect.',
    },
    {
      id: 'usr_examiner_3',
      email: 'examiner3@capstonehub.edu',
      name: 'Prof. Claire Dubois',
      passwordHash: hash,
      role: 'EXAMINER',
      department: 'Software Engineering',
      bio: 'Industry Liaison & Evaluation Committee Member.',
    },
  ];

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u,
    });
  }
  console.log(`Seeded ${usersData.length} users.`);

  // 2. Create Teams
  const teamsData = [
    {
      id: 'team_alpha',
      name: 'GeoPath Innovators (Team Alpha)',
      leaderId: 'usr_student_1',
    },
    {
      id: 'team_beta',
      name: 'BeaconPath Tech (Team Beta)',
      leaderId: 'usr_student_3',
    },
  ];

  for (const t of teamsData) {
    await prisma.team.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }

  // Team Members
  const membersData = [
    { teamId: 'team_alpha', userId: 'usr_student_1', isLeader: true },
    { teamId: 'team_alpha', userId: 'usr_student_2', isLeader: false },
    { teamId: 'team_beta', userId: 'usr_student_3', isLeader: true },
  ];

  for (const m of membersData) {
    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: m.teamId, userId: m.userId } },
      update: m,
      create: m,
    });
  }
  console.log('Seeded teams and team members.');

  // 3. Create Primary Showcase Project: Smart Campus Navigation
  const smartCampus = await prisma.project.upsert({
    where: { id: 'smart-campus-nav' },
    update: {
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
      applicationDeadline: new Date('2026-11-15T23:59:59.000Z'),
      isPublicShowcase: true,
      showcaseSummary: 'Sub-meter multi-floor indoor campus wayfinding platform cutting visitor transit confusion by 78% across 45,000 sq. meter university facilities.',
      demoUrl: 'https://smartcampus-nav.demo.internal',
      githubUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation',
      similarityScore: 12.0,
      originalityReportUrl: 'https://storage.mock.internal/reports/similarity-smart-campus-nav.pdf',
      sponsorId: 'usr_sponsor_1',
      supervisorId: 'usr_supervisor_1',
      allocatedTeamId: 'team_alpha',
    },
    create: {
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
      applicationDeadline: new Date('2026-11-15T23:59:59.000Z'),
      isPublicShowcase: true,
      showcaseSummary: 'Sub-meter multi-floor indoor campus wayfinding platform cutting visitor transit confusion by 78% across 45,000 sq. meter university facilities.',
      demoUrl: 'https://smartcampus-nav.demo.internal',
      githubUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation',
      similarityScore: 12.0,
      originalityReportUrl: 'https://storage.mock.internal/reports/similarity-smart-campus-nav.pdf',
      sponsorId: 'usr_sponsor_1',
      supervisorId: 'usr_supervisor_1',
      allocatedTeamId: 'team_alpha',
    },
  });

  // Milestones for Smart Campus Nav
  const milestonesData = [
    {
      id: 'ms_1',
      projectId: 'smart-campus-nav',
      title: 'Project Proposal & Literature Survey',
      description: 'Comprehensive study of indoor positioning technologies (BLE, Wi-Fi RTT, Dead Reckoning) and formal architectural specification.',
      dueDate: new Date('2026-11-05T23:59:59.000Z'),
      weightage: 10,
      status: 'APPROVED',
      deliverableUrl: 'https://drive.mock.internal/proposals/smart-campus-proposal.pdf',
      originalityScore: 96.5,
      feedback: 'Exemplary problem statement formulation and rigorous literature survey of Steerpath case studies. Approved.',
      submittedAt: new Date('2026-11-04T16:00:00.000Z'),
      reviewedAt: new Date('2026-11-05T09:30:00.000Z'),
    },
    {
      id: 'ms_2',
      projectId: 'smart-campus-nav',
      title: 'Requirements and System Design',
      description: 'Entity-relationship diagrams, floor vector JSON schemas, Dijkstra route graph design, and user story maps.',
      dueDate: new Date('2026-11-15T23:59:59.000Z'),
      weightage: 15,
      status: 'APPROVED',
      deliverableUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation/tree/v0.2-design',
      originalityScore: 94.0,
      feedback: 'Detailed schema documentation. Elevator transition nodes correctly modeled.',
      submittedAt: new Date('2026-11-14T20:15:00.000Z'),
      reviewedAt: new Date('2026-11-15T11:00:00.000Z'),
    },
    {
      id: 'ms_3',
      projectId: 'smart-campus-nav',
      title: 'Prototype Development & Core Routing Engine',
      description: 'Working Next.js application with interactive campus SVG map, multi-floor switcher, and shortest path finding.',
      dueDate: new Date('2026-11-30T23:59:59.000Z'),
      weightage: 25,
      status: 'APPROVED',
      deliverableUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation/tree/v0.5-prototype',
      originalityScore: 91.5,
      feedback: 'Interactive routing operates smoothly under 60fps. Ready for live test field trials.',
      submittedAt: new Date('2026-11-28T18:45:00.000Z'),
      reviewedAt: new Date('2026-11-30T10:15:00.000Z'),
    },
    {
      id: 'ms_4',
      projectId: 'smart-campus-nav',
      title: 'Testing & Accessibility Optimization',
      description: 'Field testing across Science & Engineering buildings, wheelchair accessibility audit, and load testing.',
      dueDate: new Date('2026-12-10T23:59:59.000Z'),
      weightage: 20,
      status: 'APPROVED',
      deliverableUrl: 'https://drive.mock.internal/tests/campus-nav-test-report.pdf',
      originalityScore: 95.0,
      feedback: 'Accessibility features pass WCAG 2.1 AA. Voice guidance prototype demonstrated.',
      submittedAt: new Date('2026-12-08T12:00:00.000Z'),
      reviewedAt: new Date('2026-12-09T15:20:00.000Z'),
    },
    {
      id: 'ms_5',
      projectId: 'smart-campus-nav',
      title: 'Final Submission & Production Deployment',
      description: 'End-to-end cloud deployment on Railway, sponsor sign-off documentation, user handbook, and source code archive.',
      dueDate: new Date('2026-12-20T23:59:59.000Z'),
      weightage: 30,
      status: 'APPROVED',
      deliverableUrl: 'https://github.com/capstonehub-demo/smart-campus-navigation/releases/tag/v1.0.0',
      originalityScore: 88.0,
      feedback: 'Outstanding capstone deliverable. Ready for public showcase with sponsor confidentiality clearance.',
      submittedAt: new Date('2026-12-18T14:00:00.000Z'),
      reviewedAt: new Date('2026-12-19T11:00:00.000Z'),
    },
  ];

  for (const m of milestonesData) {
    await prisma.milestone.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }

  // Supervisor Logs for Smart Campus Nav
  const logsData = [
    {
      id: 'log_1',
      projectId: 'smart-campus-nav',
      supervisorId: 'usr_supervisor_1',
      meetingDate: new Date('2026-11-12T14:00:00.000Z'),
      attendees: 'Dr. Robert Martinez, Alex Chen, Maya Patel',
      discussionPoints: 'Discussed vector tile generation vs static SVGs for building level maps. Reviewed Steerpath floorplan formats.',
      problemsIdentified: 'Multi-story transitions at stairwells created non-planar graph intersections.',
      decisions: 'Adopted explicit 3D elevator node connector matrices with directional edge weightings.',
      actionItems: '1. Alex: Implement elevator node weights in Dijkstra search.\n2. Maya: Build floor switcher UI tab.',
      nextMeetingDate: new Date('2026-11-26T14:00:00.000Z'),
      satisfactionRating: 5,
    },
    {
      id: 'log_2',
      projectId: 'smart-campus-nav',
      supervisorId: 'usr_supervisor_1',
      meetingDate: new Date('2026-11-26T14:00:00.000Z'),
      attendees: 'Dr. Robert Martinez, Alex Chen, Maya Patel, Elena Rostova (Sponsor)',
      discussionPoints: 'Demonstrated working 2-floor navigation prototype to Elena Rostova. Verified Steerpath NDA requirements.',
      problemsIdentified: 'Need to ensure proprietary floor plan coordinates are sanitized before public demonstration.',
      decisions: 'Redact sensitive security office coordinates while showcasing student wing navigation.',
      actionItems: '1. Maya: Add NDA and IP disclosure document to project repository.\n2. Alex: Conduct user trial with 15 freshman students.',
      nextMeetingDate: new Date('2026-12-10T14:00:00.000Z'),
      satisfactionRating: 5,
    },
  ];

  for (const l of logsData) {
    await prisma.supervisorLog.upsert({
      where: { id: l.id },
      update: l,
      create: l,
    });
  }

  // 3 Independent Examiner Evaluations
  const evaluationsData = [
    {
      id: 'eval_1',
      projectId: 'smart-campus-nav',
      examinerId: 'usr_examiner_1',
      technicalImplementationScore: 24.0,
      problemUnderstandingScore: 14.5,
      innovationScore: 14.0,
      documentationScore: 14.5,
      presentationScore: 14.0,
      projectOutcomeScore: 14.5,
      totalScore: 95.5,
      comments: 'Exceptional system architecture. Multi-floor routing algorithm performs flawlessly with smooth SVG animations.',
      isSubmitted: true,
      submittedAt: new Date('2026-12-21T10:30:00.000Z'),
    },
    {
      id: 'eval_2',
      projectId: 'smart-campus-nav',
      examinerId: 'usr_examiner_2',
      technicalImplementationScore: 23.5,
      problemUnderstandingScore: 14.0,
      innovationScore: 14.5,
      documentationScore: 14.0,
      presentationScore: 14.5,
      projectOutcomeScore: 14.0,
      totalScore: 94.5,
      comments: 'High practical utility. The inclusion of wheelchair accessible wayfinding demonstrates solid engineering empathy.',
      isSubmitted: true,
      submittedAt: new Date('2026-12-21T11:15:00.000Z'),
    },
    {
      id: 'eval_3',
      projectId: 'smart-campus-nav',
      examinerId: 'usr_examiner_3',
      technicalImplementationScore: 23.0,
      problemUnderstandingScore: 14.5,
      innovationScore: 13.5,
      documentationScore: 14.5,
      presentationScore: 14.0,
      projectOutcomeScore: 14.0,
      totalScore: 93.5,
      comments: 'Very strong code modularity and clean TypeScript types. Deployment on Railway is verified and responsive.',
      isSubmitted: true,
      submittedAt: new Date('2026-12-21T14:00:00.000Z'),
    },
  ];

  for (const ev of evaluationsData) {
    await prisma.evaluation.upsert({
      where: { projectId_examinerId: { projectId: ev.projectId, examinerId: ev.examinerId } },
      update: ev,
      create: ev,
    });
  }

  // Applications
  const appsData = [
    {
      id: 'app_1',
      projectId: 'smart-campus-nav',
      teamId: 'team_alpha',
      proposal: 'Our team has prior experience building indoor graph algorithms with Next.js and PostgreSQL PostGIS. We plan to integrate Steerpath vector layouts with accessible turn-by-turn pathfinding.',
      status: 'ACCEPTED',
      submittedAt: new Date('2026-11-02T10:15:00.000Z'),
    },
    {
      id: 'app_2',
      projectId: 'smart-campus-nav',
      teamId: 'team_beta',
      proposal: 'We propose an alternative BLE beacon triangulation model focusing on hardware sensors and flutter cross-compilation.',
      status: 'REJECTED',
      submittedAt: new Date('2026-11-03T14:30:00.000Z'),
    },
  ];

  for (const a of appsData) {
    await prisma.projectApplication.upsert({
      where: { projectId_teamId: { projectId: a.projectId, teamId: a.teamId } },
      update: a,
      create: a,
    });
  }

  // 4. Other Showcase Projects
  const otherProjects = [
    {
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
      supervisorId: 'usr_supervisor_1',
    },
    {
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
      supervisorId: 'usr_supervisor_1',
    },
    {
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
      supervisorId: 'usr_supervisor_1',
    },
    {
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
      supervisorId: 'usr_supervisor_1',
    },
  ];

  for (const op of otherProjects) {
    await prisma.project.upsert({
      where: { id: op.id },
      update: op,
      create: op,
    });
  }

  console.log('Seeded all showcase projects successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

