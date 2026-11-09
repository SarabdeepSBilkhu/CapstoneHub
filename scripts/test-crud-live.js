const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runCrudVerification() {
  console.log('====================================================');
  console.log('CAPSTONEHUB FULL CRUD & DATABASE ALTERATION TEST');
  console.log('====================================================\n');

  const testProjectId = 'crud-test-' + Date.now();
  let createdMilestoneId = null;
  let createdAppId = null;

  try {
    // ----------------------------------------------------
    // 1. SPONSOR: Create Project (C)
    // ----------------------------------------------------
    console.log('--- 1. SPONSOR: CREATE PROJECT ---');
    const sponsor = await prisma.user.findUnique({ where: { email: 'sponsor@novalabs.io' } });
    if (!sponsor) throw new Error('Sponsor user not found in DB');

    const createdProject = await prisma.project.create({
      data: {
        id: testProjectId,
        title: 'Autonomous Campus Drone Delivery System',
        description: 'Drone payload logistics across university airspace.',
        problemStatement: 'Need for rapid autonomous specimen transit between campus laboratories.',
        requiredSkills: ['PX4', 'ROS2', 'Next.js', 'Python'],
        category: 'INDUSTRY_SPONSORED',
        status: 'PENDING_APPROVAL',
        ipStatus: 'CONFIDENTIAL',
        tags: ['Drone', 'Robotics', 'IoT'],
        maxTeamSize: 4,
        sponsorId: sponsor.id,
      },
    });
    console.log('✓ Project inserted into DB with ID:', createdProject.id);
    console.log('✓ DB Status:', createdProject.status, '| Sponsor:', createdProject.sponsorId);

    // Verify alteration in DB
    const check1 = await prisma.project.findUnique({ where: { id: testProjectId } });
    if (!check1 || check1.status !== 'PENDING_APPROVAL') throw new Error('DB verification failed for step 1');

    // ----------------------------------------------------
    // 2. ADMIN: Approve Project (U)
    // ----------------------------------------------------
    console.log('\n--- 2. ADMIN: APPROVE PROJECT ---');
    const approvedProject = await prisma.project.update({
      where: { id: testProjectId },
      data: { status: 'APPROVED' },
    });
    console.log('✓ Project status updated to:', approvedProject.status);

    const check2 = await prisma.project.findUnique({ where: { id: testProjectId } });
    if (check2.status !== 'APPROVED') throw new Error('DB verification failed for step 2');

    // ----------------------------------------------------
    // 3. STUDENT: Apply as Cohort (C)
    // ----------------------------------------------------
    console.log('\n--- 3. STUDENT: APPLY AS COHORT ---');
    const student = await prisma.user.findUnique({ where: { email: 'student@capstonehub.edu' } });

    // Create a new team for this project application
    const team = await prisma.team.create({
      data: {
        id: 'team_drone_' + Date.now(),
        name: 'AeroSky Innovators (Team Drone)',
        leaderId: student.id,
        members: {
          create: {
            userId: student.id,
            isLeader: true,
          },
        },
      },
    });

    const application = await prisma.projectApplication.create({
      data: {
        projectId: testProjectId,
        teamId: team.id,
        proposal: 'Team proposes autonomous obstacle avoidance using stereo depth cameras and Next.js telemetry.',
        status: 'PENDING',
      },
    });
    createdAppId = application.id;
    console.log('✓ Application created in DB with ID:', application.id);
    console.log('✓ Application status in DB:', application.status);

    const check3 = await prisma.projectApplication.findUnique({ where: { id: createdAppId } });
    if (!check3 || check3.status !== 'PENDING') throw new Error('DB verification failed for step 3');

    // ----------------------------------------------------
    // 4. ADMIN / SUPERVISOR: Allocate Team (U)
    // ----------------------------------------------------
    console.log('\n--- 4. ADMIN / SUPERVISOR: ALLOCATE TEAM ---');
    await prisma.projectApplication.update({
      where: { id: createdAppId },
      data: { status: 'ACCEPTED' },
    });

    const allocatedProject = await prisma.project.update({
      where: { id: testProjectId },
      data: {
        allocatedTeamId: team.id,
        status: 'ALLOCATED',
      },
    });
    console.log('✓ Application status updated to: ACCEPTED');
    console.log('✓ Project allocated to team:', allocatedProject.allocatedTeamId, '| Status:', allocatedProject.status);

    const check4 = await prisma.project.findUnique({ where: { id: testProjectId } });
    if (check4.status !== 'ALLOCATED' || check4.allocatedTeamId !== team.id) throw new Error('DB verification failed for step 4');

    // ----------------------------------------------------
    // 5. SUPERVISOR: Create Milestone (C)
    // ----------------------------------------------------
    console.log('\n--- 5. SUPERVISOR: CREATE MILESTONE ---');
    const milestone = await prisma.milestone.create({
      data: {
        projectId: testProjectId,
        title: 'Stage 1: Drone Airspace Navigation Architecture',
        description: 'Flight simulation and fail-safe return-to-home protocol documentation.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        weightage: 25,
        status: 'PENDING',
      },
    });
    createdMilestoneId = milestone.id;
    console.log('✓ Milestone created in DB with ID:', milestone.id);
    console.log('✓ Milestone status:', milestone.status, '| Weightage:', milestone.weightage + '%');

    // ----------------------------------------------------
    // 6. STUDENT: Submit Deliverable (U)
    // ----------------------------------------------------
    console.log('\n--- 6. STUDENT: SUBMIT DELIVERABLE ---');
    const submittedMilestone = await prisma.milestone.update({
      where: { id: createdMilestoneId },
      data: {
        deliverableUrl: 'https://github.com/capstonehub-demo/drone-nav/releases/tag/v0.1',
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });
    console.log('✓ Deliverable URL recorded in DB:', submittedMilestone.deliverableUrl);
    console.log('✓ Milestone status updated to:', submittedMilestone.status);

    const check6 = await prisma.milestone.findUnique({ where: { id: createdMilestoneId } });
    if (check6.status !== 'SUBMITTED' || !check6.deliverableUrl) throw new Error('DB verification failed for step 6');

    // ----------------------------------------------------
    // 7. SUPERVISOR: Review Deliverable & Log Meeting (U & C)
    // ----------------------------------------------------
    console.log('\n--- 7. SUPERVISOR: REVIEW MILESTONE & LOG MEETING ---');
    const reviewedMilestone = await prisma.milestone.update({
      where: { id: createdMilestoneId },
      data: {
        status: 'APPROVED',
        feedback: 'Waypoint telemetry benchmark passes precision requirements. Approved for live outdoor test.',
        reviewedAt: new Date(),
      },
    });
    console.log('✓ Milestone approved with supervisor feedback in DB');

    const supervisor = await prisma.user.findUnique({ where: { email: 'supervisor@capstonehub.edu' } });
    const log = await prisma.supervisorLog.create({
      data: {
        projectId: testProjectId,
        supervisorId: supervisor.id,
        meetingDate: new Date(),
        attendees: 'Dr. Robert Martinez, Alex Chen, Maya Patel',
        discussionPoints: 'Discussed geofencing safety margins around university hospital helipad.',
        problemsIdentified: 'GPS drift near high-voltage power lines.',
        decisions: 'Incorporate optical flow sensor fusion for low-altitude stabilization.',
        actionItems: '1. Alex: Integrate optical flow daemon.\n2. Maya: Log telemetry to TimescaleDB.',
        satisfactionRating: 5,
      },
    });
    console.log('✓ Supervisor meeting log created in DB with ID:', log.id);
    console.log('✓ Action items recorded:', log.actionItems);

    const checkLog = await prisma.supervisorLog.findUnique({ where: { id: log.id } });
    if (!checkLog || checkLog.satisfactionRating !== 5) throw new Error('DB verification failed for meeting log');

    // ----------------------------------------------------
    // 8. EXAMINER: Submit Rubric Evaluation (C/U)
    // ----------------------------------------------------
    console.log('\n--- 8. EXAMINER: 6-CRITERIA RUBRIC SUBMISSION ---');
    const examiner = await prisma.user.findUnique({ where: { email: 'examiner@capstonehub.edu' } });

    const evaluation = await prisma.evaluation.upsert({
      where: {
        projectId_examinerId: {
          projectId: testProjectId,
          examinerId: examiner.id,
        },
      },
      update: {
        technicalImplementationScore: 24.5,
        problemUnderstandingScore: 14.5,
        innovationScore: 14.0,
        documentationScore: 14.5,
        presentationScore: 14.0,
        projectOutcomeScore: 14.5,
        totalScore: 96.0,
        comments: 'Outstanding live autonomous flight demonstration and robust fail-safe routines.',
        isSubmitted: true,
        submittedAt: new Date(),
      },
      create: {
        projectId: testProjectId,
        examinerId: examiner.id,
        technicalImplementationScore: 24.5,
        problemUnderstandingScore: 14.5,
        innovationScore: 14.0,
        documentationScore: 14.5,
        presentationScore: 14.0,
        projectOutcomeScore: 14.5,
        totalScore: 96.0,
        comments: 'Outstanding live autonomous flight demonstration and robust fail-safe routines.',
        isSubmitted: true,
        submittedAt: new Date(),
      },
    });
    console.log('✓ Evaluation recorded in DB for Examiner:', examiner.name);
    console.log('✓ Total Score:', evaluation.totalScore, '/ 100 | Submitted:', evaluation.isSubmitted);

    const checkEval = await prisma.evaluation.findUnique({
      where: { projectId_examinerId: { projectId: testProjectId, examinerId: examiner.id } },
    });
    if (!checkEval || checkEval.totalScore !== 96.0) throw new Error('DB verification failed for evaluation');

    // ----------------------------------------------------
    // 9. ADMIN: Publish to Public Showcase (U)
    // ----------------------------------------------------
    console.log('\n--- 9. ADMIN: PUBLISH TO PUBLIC SHOWCASE ---');
    const publishedProject = await prisma.project.update({
      where: { id: testProjectId },
      data: {
        isPublicShowcase: true,
        status: 'COMPLETED',
        showcaseSummary: 'Autonomous campus specimen drone network reducing cross-lab delivery times from 45 mins to 4 mins.',
        demoUrl: 'https://drone-nav.demo.internal',
        githubUrl: 'https://github.com/capstonehub-demo/drone-nav',
      },
    });
    console.log('✓ Project published to showcase in DB | Status:', publishedProject.status);

    const checkPub = await prisma.project.findUnique({ where: { id: testProjectId } });
    if (!checkPub.isPublicShowcase || checkPub.status !== 'COMPLETED') throw new Error('DB verification failed for showcase publish');

    // ----------------------------------------------------
    // 10. ADMIN: Delete Project (D) - With Full Cascade
    // ----------------------------------------------------
    console.log('\n--- 10. ADMIN: DELETE PROJECT & VERIFY CASCADE DELETION ---');
    await prisma.project.delete({
      where: { id: testProjectId },
    });
    console.log('✓ Project deleted from DB with ID:', testProjectId);

    // Verify Project is gone
    const checkDeletedProject = await prisma.project.findUnique({ where: { id: testProjectId } });
    if (checkDeletedProject !== null) throw new Error('Project still exists in DB after deletion!');
    console.log('✓ Project record is confirmed NULL in DB');

    // Verify Cascade deleted related records
    const checkDeletedMilestone = await prisma.milestone.findUnique({ where: { id: createdMilestoneId } });
    const checkDeletedLog = await prisma.supervisorLog.findUnique({ where: { id: log.id } });
    const checkDeletedEval = await prisma.evaluation.findUnique({
      where: { projectId_examinerId: { projectId: testProjectId, examinerId: examiner.id } },
    });
    const checkDeletedApp = await prisma.projectApplication.findUnique({ where: { id: createdAppId } });

    if (checkDeletedMilestone !== null || checkDeletedLog !== null || checkDeletedEval !== null || checkDeletedApp !== null) {
      throw new Error('Cascade deletion failed! Child records were orphaned.');
    }
    console.log('✓ All child records (milestones, logs, evaluations, applications) cascade-deleted from DB');

    console.log('\n====================================================');
    console.log('ALL CRUD OPERATIONS FOR ALL ROLES VERIFIED IN DATABASE!');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ CRUD Verification Error:', err);
    // Cleanup if test project still exists
    try {
      await prisma.project.delete({ where: { id: testProjectId } });
    } catch {}
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCrudVerification();
