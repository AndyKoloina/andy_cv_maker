import { z } from 'zod';

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "L'entreprise est requise"),
  position: z.string().min(1, "Le poste est requis"),
  description: z.string()
});

export const ResumeSchema = z.object({
  metadata: z.object({
    template: z.enum(['FRENCH', 'CANADIAN']),
    language: z.enum(['fr', 'en'])
  }),
  personalInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    headline: z.string()
  }),
  experiences: z.array(ExperienceSchema)
});

export type ResumeData = z.infer<typeof ResumeSchema>;
export type ExperienceData = z.infer<typeof ExperienceSchema>;