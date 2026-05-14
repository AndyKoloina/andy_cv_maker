import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, ExperienceData, EducationData } from '../../../shared/schema';

interface Store {
  data: ResumeData;
  updateInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateMetadata: (meta: Partial<ResumeData['metadata']>) => void;
  addExperience: () => void;
  updateExperience: (id: string, exp: Partial<ExperienceData>) => void;
  addEducation: () => void;
  updateEducation: (id: string, edu: Partial<EducationData>) => void;
  updateSkills: (skills: string[]) => void;
}

const initialState: ResumeData = {
  metadata: { template: 'CANADIAN', language: 'fr' },
  personalInfo: { 
    firstName: '', 
    lastName: '', 
    headline: '', 
    email: '', 
    phone: '', 
    city: '', 
    profile: '' 
  },
  experiences: [],
  education: [],
  skills: []
};

export const useResumeStore = create<Store>()(
  persist(
    (set) => ({
      data: initialState,
      updateInfo: (info) => set((state) => ({ 
        data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } } 
      })),
      updateMetadata: (meta) => set((state) => ({
        data: { ...state.data, metadata: { ...state.data.metadata, ...meta } }
      })),
      addExperience: () => set((state) => ({
        data: {
          ...state.data,
          experiences: [...(state.data.experiences || []), { id: crypto.randomUUID(), company: '', position: '', description: '' }]
        }
      })),
      updateExperience: (id, exp) => set((state) => ({
        data: {
          ...state.data,
          experiences: (state.data.experiences || []).map((e) => e.id === id ? { ...e, ...exp } : e)
        }
      })),
      addEducation: () => set((state) => ({
        data: {
          ...state.data,
          education: [...(state.data.education || []), { id: crypto.randomUUID(), school: '', degree: '', description: '' }]
        }
      })),
      updateEducation: (id, edu) => set((state) => ({
        data: {
          ...state.data,
          education: (state.data.education || []).map((e) => e.id === id ? { ...e, ...edu } : e)
        }
      })),
      updateSkills: (skills) => set((state) => ({
        data: { ...state.data, skills }
      }))
    }),
    { 
      name: 'cv-storage',
      // Ensure that when we load from storage, we merge with initialState to get missing keys
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        data: {
          ...initialState,
          ...(persistedState as any)?.data,
          metadata: {
            ...initialState.metadata,
            ...(persistedState as any)?.data?.metadata
          },
          personalInfo: {
            ...initialState.personalInfo,
            ...(persistedState as any)?.data?.personalInfo
          },
          experiences: (persistedState as any)?.data?.experiences || [],
          education: (persistedState as any)?.data?.education || [],
          skills: (persistedState as any)?.data?.skills || []
        }
      })
    }
  )
);