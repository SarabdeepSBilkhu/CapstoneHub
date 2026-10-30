import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function seedDemoData() {
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
      department: 'NovaLabs AI R&D',
      bio: 'Engineering Director at NovaLabs sponsoring real-world high-throughput AI challenges.',
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

  // 2. Create Projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Autonomous Multi-Agent Orchestration for Clinical Workflow Triage',
      description: 'An AI-powered hospital triage platform utilizing LLM reasoning agents to prioritize patient queues, assist attending nurses, and cross-reference clinical guidelines with HIPAA-compliant guardrails.',
      problemStatement: 'Emergency rooms encounter acute operational bottlenecks due to manual triage classification delays and asynchronous documentation. This project automates intake triage through local small language models while enforcing strict data confidentiality.',
      category: 'INDUSTRY_SPONSORED',
      status: 'IN_PROGRESS',
      ipStatus: 'CONFIDENTIAL',
      tags: ['Healthcare AI', 'Multi-Agent', 'Next.js', 'FastAPI', 'HIPAA'],
      maxTeamSize: 4,
      isPublicShowcase: true,
      showcaseSummary: 'Deployed triage assistant reducing emergency room intake delays by 38% across simulated synthetic emergency trials.',
      demoUrl: 'https://demo-clinical-triage.mock.internal',
      githubUrl: 'https://github.com/capstonehub-demo/clinical-triage',
      sponsorId: sponsor.id,
      supervisorId: supervisor.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Decentralized Zero-Knowledge Verification for Academic Credential Registry',
      description: 'Cryptographic ledger and verifiable credentials protocol enabling instant diploma validation and transcript verification without exposing personally identifiable student records.',
      problemStatement: 'Degree forgery and time-consuming international educational verification take upwards of 3 weeks for prospective employers. A ZK-rollup based protocol guarantees zero-exposure instant validity proofs.',
      category: 'ACADEMIC_RESEARCH',
      status: 'APPROVED',
      ipStatus: 'OPEN_SOURCE',
      tags: ['Cryptography', 'Zero-Knowledge', 'Web3', 'TypeScript'],
      maxTeamSize: 3,
      isPublicShowcase: true,
      showcaseSummary: 'ZK-credential proof verifier handling up to 1,200 verifications/sec with instant cryptographic finality.',
      supervisorId: supervisor.id,
    },
  });

  // 3. Team & Memberships
  const team1 = await prisma.team.create({
    data: {
      name: 'TriageCore Dynamics',
      projectId: project1.id,
      members: {
        create: [
          { userId: studentLeader.id, isLeader: true },
          { userId: studentPeer.id, isLeader: false },
        ],
      },
    },
  });

  // 4. Milestones
  await prisma.milestone.createMany({
    data: [
      {
        projectId: project1.id,
        title: 'Milestone 1: Problem Definition & Literature Review',
        description: 'Submission of baseline survey paper, clinical dataset ontology, and threat modeling report.',
        dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        weightage: 20,
        status: 'APPROVED',
        deliverableUrl: 'https://drive.mock.internal/reports/m1-literature-review.pdf',
        originalityScore: 94.2,
        feedback: 'Extensive survey of HIPAA compliance and prompt injection boundaries. Approved for development.',
        submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        reviewedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project1.id,
        title: 'Milestone 2: Agent Architecture & Mid-Term Prototype',
        description: 'Working containerized backend running agent loop and Next.js clinical dashboard.',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        weightage: 35,
        status: 'SUBMITTED',
        deliverableUrl: 'https://github.com/capstonehub-demo/clinical-triage/tree/v0.5-alpha',
        originalityScore: 91.8,
        submittedAt: new Date(),
      },
      {
        projectId: project1.id,
        title: 'Milestone 3: Final Clinical Benchmark & Production Evaluation',
        description: 'Complete system deployment, multi-examiner viva defense, and sponsor sign-off.',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        weightage: 45,
        status: 'PENDING',
      },
    ],
  });

  // 5. Supervisor Meeting Logs
  await prisma.supervisorLog.create({
    data: {
      projectId: project1.id,
      supervisorId: supervisor.id,
      meetingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      discussionPoints: 'Reviewed agent prompt chaining accuracy on synthetic MIMIC-III triage samples. Addressed latency spikes in websocket streaming.',
      actionItems: '1. Benchmark latency under 20 concurrent connections. 2. Finalize sponsor NDA documentation before open code publishing.',
      attendanceNotes: 'Alex Chen & Maya Patel present.',
      satisfactionRating: 5,
    },
  });

  // 6. Examiner Rubric Evaluation (Mid-Sem)
  await prisma.evaluation.create({
    data: {
      projectId: project1.id,
      examinerId: examiner.id,
      milestonePhase: 'MID_SEM',
      problemDefinitionScore: 18.5, // out of 20
      methodologyScore: 23.0,       // out of 25
      implementationScore: 22.5,    // out of 25
      originalityScore: 14.0,       // out of 15
      presentationScore: 13.5,      // out of 15
      totalScore: 91.5,
      qualitativeRemarks: 'Exemplary execution. The multi-agent communication pipeline demonstrates solid engineering principles and exceptional adherence to clinical constraints.',
    },
  });

  // 7. Resources & IP Records
  await prisma.resource.createMany({
    data: [
      {
        projectId: project1.id,
        title: 'NovaLabs IP & Confidentiality Agreement',
        fileUrl: 'https://docs.mock.internal/legal/novalabs-ip-agreement.pdf',
        fileType: 'IP_AGREEMENT',
        uploadedBy: sponsor.name,
      },
      {
        projectId: project1.id,
        title: 'Mid-Term Progress Presentation Deck',
        fileUrl: 'https://slides.mock.internal/deck-midterm-triage.pdf',
        fileType: 'PRESENTATION',
        uploadedBy: studentLeader.name,
      },
    ],
  });
}

