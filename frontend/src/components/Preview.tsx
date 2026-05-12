import React from 'react';
import { useResumeStore } from '../store/useResumeStore';

export const Preview = () => {
  const { data } = useResumeStore();

  return (
    <div className="w-1/2 bg-slate-200 flex justify-center items-start overflow-y-auto p-8">
      <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-12 scale-[0.65] origin-top shrink-0">
        <header className="mb-8 border-b-2 border-slate-200 pb-4">
          <h1 className="text-4xl font-bold uppercase">{data.personalInfo.firstName || 'PRÉNOM'} {data.personalInfo.lastName || 'NOM'}</h1>
          <h2 className="text-xl text-blue-600 font-medium mt-1">{data.personalInfo.headline || 'Titre du profil'}</h2>
        </header>
        <section>
          <h3 className="font-bold text-lg uppercase mb-4 text-slate-500">Expériences</h3>
          {data.experiences.map((exp:any) => (
            <div key={exp.id} className="mb-6">
              <h4 className="font-bold text-slate-800">{exp.position || 'Poste'}</h4>
              <p className="text-blue-600 text-sm font-medium mb-2">{exp.company || 'Entreprise'}</p>
              <p className="text-sm text-slate-600">{exp.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};