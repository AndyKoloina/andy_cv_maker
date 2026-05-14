import { z } from 'zod';

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "L'entreprise est requise"),
  position: z.string().min(1, "Le poste est requis"),
  description: z.string()
});

export const EducationSchema = z.object({
  id: z.string(),
  school: z.string().min(1, "L'école est requise"),
  degree: z.string().min(1, "Le diplôme est requis"),
  description: z.string().optional()
});

export const ResumeSchema = z.object({
  metadata: z.object({
    template: z.enum(['FRENCH', 'CANADIAN']),
    language: z.enum(['fr', 'en'])
  }),
  personalInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    headline: z.string(),
    email: z.string().email("Email invalide").optional().or(z.literal('')),
    phone: z.string().optional(),
    city: z.string().optional(),
    profile: z.string().optional()
  }),
  experiences: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(z.string())
});

export type ResumeData = z.infer<typeof ResumeSchema>;
export type ExperienceData = z.infer<typeof ExperienceSchema>;
export type EducationData = z.infer<typeof EducationSchema>;