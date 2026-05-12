import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, ExperienceData } from '../../../shared/schema';

interface Store {
  data: ResumeData;
  updateInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  addExperience: () => void;
  updateExperience: (id: string, exp: Partial<ExperienceData>) => void;
}

export const useResumeStore = create<Store>()(
  persist(
    (set) => ({
      data: {
        metadata: { template: 'CANADIAN', language: 'fr' },
        personalInfo: { firstName: '', lastName: '', headline: '' },
        experiences: []
      },
      updateInfo: (info) => set((state) => ({ 
        data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } } 
      })),
      addExperience: () => set((state) => ({
        data: {
          ...state.data,
          experiences: [...state.data.experiences, { id: crypto.randomUUID(), company: '', position: '', description: '' }]
        }
      })),
      updateExperience: (id, exp) => set((state) => ({
        data: {
          ...state.data,
          experiences: state.data.experiences.map((e: any) => e.id === id ? { ...e, ...exp } : e)
        }
      }))
    }),
    { name: 'cv-storage' }
  )
);