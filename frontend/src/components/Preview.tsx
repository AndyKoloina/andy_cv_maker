import React from 'react';
import { useResumeStore } from '../store/useResumeStore';

const FrenchPreview = ({ data }: { data: any }) => {
  const experiences = data.experiences || [];
  const education = data.education || [];
  const skills = data.skills || [];

  return (
    <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-12 scale-[0.65] origin-top shrink-0 text-slate-800 text-left">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold uppercase">{data.personalInfo?.firstName || 'PRÉNOM'} {data.personalInfo?.lastName || 'NOM'}</h1>
          <h2 className="text-xl text-blue-600">{data.personalInfo?.headline || 'Titre du profil'}</h2>
        </div>
        <div className="text-right text-sm text-slate-600">
          {data.personalInfo?.email && <p>{data.personalInfo.email}</p>}
          {data.personalInfo?.phone && <p>{data.personalInfo.phone}</p>}
          {data.personalInfo?.city && <p>{data.personalInfo.city}</p>}
        </div>
      </header>
      
      {data.personalInfo?.profile && (
        <>
          <h3 className="font-bold border-b-2 border-slate-800 mb-2">Profil</h3>
          <p className="text-sm mb-6 whitespace-pre-wrap">{data.personalInfo.profile}</p>
        </>
      )}

      <h3 className="font-bold border-b-2 border-slate-800 mb-4">Expériences Professionnelles</h3>
      {experiences.map((exp: any) => (
        <div key={exp.id} className="mb-4">
          <p className="font-bold">{exp.position || 'Poste'} chez {exp.company || 'Entreprise'}</p>
          <p className="text-sm">{exp.description}</p>
        </div>
      ))}

      {education.length > 0 && (
        <>
          <h3 className="font-bold border-b-2 border-slate-800 mb-4 mt-6">Formation</h3>
          {education.map((edu: any) => (
            <div key={edu.id} className="mb-3">
              <p className="font-bold">{edu.degree || 'Diplôme'}</p>
              <p className="text-sm">{edu.school || 'École'}</p>
              {edu.description && <p className="text-xs italic">{edu.description}</p>}
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <h3 className="font-bold border-b-2 border-slate-800 mb-4 mt-6">Compétences</h3>
          <p className="text-sm">{skills.join(', ')}</p>
        </>
      )}
    </div>
  );
};

const CanadianPreview = ({ data }: { data: any }) => {
  const experiences = data.experiences || [];
  const education = data.education || [];
  const skills = data.skills || [];

  return (
    <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-12 scale-[0.65] origin-top shrink-0 text-slate-900 font-serif text-left">
      <div className="text-center border-b-4 border-double border-slate-900 pb-4 mb-8">
        <h1 className="text-3xl font-bold">{data.personalInfo?.firstName || 'FIRST NAME'} {data.personalInfo?.lastName || 'LAST NAME'}</h1>
        <p className="italic text-slate-600 mb-2">{data.personalInfo?.headline || 'Profile Headline'}</p>
        <div className="text-sm space-x-4">
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo?.city && <span>{data.personalInfo.city}</span>}
        </div>
      </div>

      {data.personalInfo?.profile && (
        <>
          <h3 className="font-bold uppercase tracking-widest text-sm mb-3 bg-slate-100 p-1">Professional Summary</h3>
          <p className="text-sm leading-relaxed mb-6 whitespace-pre-wrap">{data.personalInfo.profile}</p>
        </>
      )}

      <h3 className="font-bold uppercase tracking-widest text-sm mb-4 bg-slate-100 p-1">Work Experience</h3>
      {experiences.map((exp: any) => (
        <div key={exp.id} className="mb-6">
          <div className="flex justify-between items-baseline">
            <p className="font-bold text-lg">{exp.company || 'Company'}</p>
          </div>
          <p className="italic mb-2">{exp.position || 'Position'}</p>
          <p className="text-sm leading-relaxed">{exp.description}</p>
        </div>
      ))}

      {education.length > 0 && (
        <>
          <h3 className="font-bold uppercase tracking-widest text-sm mb-4 bg-slate-100 p-1">Education</h3>
          {education.map((edu: any) => (
            <div key={edu.id} className="mb-4">
              <p className="font-bold">{edu.degree || 'Degree'}</p>
              <p className="italic text-sm">{edu.school || 'School'}</p>
              {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <h3 className="font-bold uppercase tracking-widest text-sm mb-4 bg-slate-100 p-1">Skills</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {skills.map((skill: string, index: number) => (
              <span key={index}>• {skill}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const Preview = () => {
  const { data } = useResumeStore();

  return (
    <div className="w-1/2 bg-slate-200 flex justify-center items-start overflow-y-auto p-8">
      {data.metadata?.template === 'CANADIAN' ? (
        <CanadianPreview data={data} />
      ) : (
        <FrenchPreview data={data} />
      )}
    </div>
  );
};