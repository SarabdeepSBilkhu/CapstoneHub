import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid academic/work email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'SUPERVISOR', 'EXAMINER', 'SPONSOR', 'ADMIN']),
  department: z.string().min(2, 'Department is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.enum(['INDUSTRY_SPONSORED', 'ACADEMIC_RESEARCH', 'ENTREPRENEURSHIP_CAPSTONE']),
  description: z.string().min(20, 'Please provide an adequate description'),
  problemStatement: z.string().min(30, 'Problem statement must be detailed'),
  ipStatus: z.enum(['OPEN_SOURCE', 'CONFIDENTIAL', 'PATENT_PENDING', 'SPONSOR_OWNED']),
  tags: z.string().transform((val) => val.split(',').map((t) => t.trim()).filter(Boolean)),
  maxTeamSize: z.number().min(1).max(6).default(4),
  supervisorId: z.string().optional(),
});

export const milestoneSchema = z.object({
  projectId: z.string(),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  weightage: z.number().min(5).max(100),
});

export const deliverableSubmissionSchema = z.object({
  milestoneId: z.string(),
  deliverableUrl: z.string().url('Must provide a valid URL (GitHub, Drive, Document)'),
});

export const supervisorLogSchema = z.object({
  projectId: z.string(),
  meetingDate: z.string().min(1, 'Meeting date is required'),
  discussionPoints: z.string().min(10, 'Please detail the discussion points'),
  actionItems: z.string().min(10, 'Please list the agreed action items'),
  attendanceNotes: z.string().optional(),
  satisfactionRating: z.number().min(1).max(5),
});

export const rubricEvaluationSchema = z.object({
  projectId: z.string(),
  milestonePhase: z.enum(['MID_SEM', 'END_SEM', 'FINAL_VIVA']),
  problemDefinitionScore: z.number().min(0).max(20),
  methodologyScore: z.number().min(0).max(25),
  implementationScore: z.number().min(0).max(25),
  originalityScore: z.number().min(0).max(15),
  presentationScore: z.number().min(0).max(15),
  qualitativeRemarks: z.string().min(5, 'Please provide qualitative feedback'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type SupervisorLogInput = z.infer<typeof supervisorLogSchema>;
export type RubricEvaluationInput = z.infer<typeof rubricEvaluationSchema>;
