/**
 * Unit tests: src/lib/validations.js
 * Tests all Zod schemas used for form and API validation.
 */
import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  projectSchema,
  milestoneSchema,
  deliverableSubmissionSchema,
  supervisorLogSchema,
} from '@/lib/validations';

// ─── loginSchema ─────────────────────────────────────────────────────────────
describe('loginSchema', () => {
  it('passes with valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'student@capstonehub.edu',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('fails with invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'abc123' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path[0]).toBe('email');
  });

  it('fails with empty password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path[0]).toBe('password');
  });
});

// ─── registerSchema ───────────────────────────────────────────────────────────
describe('registerSchema', () => {
  const valid = {
    name: 'Alex Chen',
    email: 'alex@capstonehub.edu',
    password: 'secure123',
    role: 'STUDENT',
    department: 'Computer Science',
  };

  it('passes with fully valid data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects names shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'A' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path[0]).toBe('name');
  });

  it('rejects passwords shorter than 6 characters', () => {
    const result = registerSchema.safeParse({ ...valid, password: '123' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path[0]).toBe('password');
  });

  it('rejects invalid roles', () => {
    const result = registerSchema.safeParse({ ...valid, role: 'HACKER' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path[0]).toBe('role');
  });

  it('accepts all valid roles', () => {
    const roles = ['STUDENT', 'SUPERVISOR', 'EXAMINER', 'SPONSOR', 'ADMIN'];
    roles.forEach((role) => {
      expect(registerSchema.safeParse({ ...valid, role }).success).toBe(true);
    });
  });
});

// ─── projectSchema ────────────────────────────────────────────────────────────
describe('projectSchema', () => {
  const valid = {
    title: 'Smart Campus Nav',
    category: 'INDUSTRY_SPONSORED',
    description: 'A multi-floor indoor navigation system using BLE beacons and SVG floor plans.',
    problemStatement: 'Students and visitors struggle to navigate large multi-floor campus buildings without clear wayfinding tools.',
    ipStatus: 'CONFIDENTIAL',
    tags: 'IoT, Navigation, React',
    maxTeamSize: 4,
  };

  it('passes with valid project data', () => {
    const result = projectSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('transforms comma-separated tags into an array', () => {
    const result = projectSchema.safeParse(valid);
    expect(result.data.tags).toEqual(['IoT', 'Navigation', 'React']);
  });

  it('rejects titles shorter than 5 characters', () => {
    const result = projectSchema.safeParse({ ...valid, title: 'Nav' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path[0]).toBe('title');
  });

  it('rejects description shorter than 20 characters', () => {
    const result = projectSchema.safeParse({ ...valid, description: 'Too short.' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path[0]).toBe('description');
  });

  it('rejects invalid IP status', () => {
    const result = projectSchema.safeParse({ ...valid, ipStatus: 'TOP_SECRET' });
    expect(result.success).toBe(false);
  });

  it('rejects maxTeamSize > 6', () => {
    const result = projectSchema.safeParse({ ...valid, maxTeamSize: 10 });
    expect(result.success).toBe(false);
  });
});

// ─── milestoneSchema ──────────────────────────────────────────────────────────
describe('milestoneSchema', () => {
  const valid = {
    projectId: 'smart-campus-nav',
    title: 'BLE Integration',
    description: 'Integrate BLE beacon scanning into the mobile app.',
    dueDate: '2026-12-01',
    weightage: 25,
  };

  it('passes with valid data', () => {
    expect(milestoneSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects weightage below 5', () => {
    expect(milestoneSchema.safeParse({ ...valid, weightage: 2 }).success).toBe(false);
  });

  it('rejects weightage above 100', () => {
    expect(milestoneSchema.safeParse({ ...valid, weightage: 110 }).success).toBe(false);
  });

  it('rejects empty dueDate', () => {
    expect(milestoneSchema.safeParse({ ...valid, dueDate: '' }).success).toBe(false);
  });
});

// ─── deliverableSubmissionSchema ──────────────────────────────────────────────
describe('deliverableSubmissionSchema', () => {
  it('passes with a valid URL', () => {
    const result = deliverableSubmissionSchema.safeParse({
      milestoneId: 'ms_001',
      deliverableUrl: 'https://github.com/capstonehub/smart-campus-nav',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-URL strings', () => {
    const result = deliverableSubmissionSchema.safeParse({
      milestoneId: 'ms_001',
      deliverableUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path[0]).toBe('deliverableUrl');
  });
});

// ─── supervisorLogSchema ──────────────────────────────────────────────────────
describe('supervisorLogSchema', () => {
  const valid = {
    projectId: 'smart-campus-nav',
    meetingDate: '2026-11-01',
    discussionPoints: 'Team discussed BLE integration progress and testing strategy.',
    actionItems: '1. Complete BLE scan module by Friday. 2. Write unit tests.',
    satisfactionRating: 4,
  };

  it('passes with valid data', () => {
    expect(supervisorLogSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects satisfactionRating > 5', () => {
    expect(supervisorLogSchema.safeParse({ ...valid, satisfactionRating: 6 }).success).toBe(false);
  });

  it('rejects satisfactionRating < 1', () => {
    expect(supervisorLogSchema.safeParse({ ...valid, satisfactionRating: 0 }).success).toBe(false);
  });

  it('rejects empty discussionPoints', () => {
    expect(supervisorLogSchema.safeParse({ ...valid, discussionPoints: 'short' }).success).toBe(false);
  });
});
