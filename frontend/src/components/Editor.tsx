import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';

export const Editor = () => {
  const { 
    data, 
    updateInfo, 
    updateMetadata, 
    addExperience, 
    updateExperience,
    addEducation,
    updateEducation,
    updateSkills
  } = useResumeStore();
  const [loading, setLoading] = useState(false);

  // Safety defaults for persisted state
  const experiences = data.experiences || [];
  const education = data.education || [];
  const skills = data.skills || [];

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${data.metadata?.template || 'FRENCH'}.pdf`;
      link.click();
    } catch (error) {
      alert("Erreur lors de la génération du PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSkills = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
    updateSkills(newSkills);
  };

  return (
    <div className="w-1/2 p-8 overflow-y-auto bg-white shadow-lg z-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Éditeur</h1>
        <div className="flex space-x-2">
          <select 
            className="p-2 border rounded text-sm"
            value={data.metadata?.template || 'FRENCH'}
            onChange={(e) => updateMetadata({ template: e.target.value as any })}
          >
            <option value="FRENCH">Modèle Français</option>
            <option value="CANADIAN">Modèle Canadien</option>
          </select>
          <select 
            className="p-2 border rounded text-sm"
            value={data.metadata?.language || 'fr'}
            onChange={(e) => updateMetadata({ language: e.target.value as any })}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
      
      <section className="mb-8 text-left">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Informations Personnelles</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input className="p-3 border rounded" placeholder="Prénom" value={data.personalInfo?.firstName || ''} onChange={(e) => updateInfo({ firstName: e.target.value })} />
          <input className="p-3 border rounded" placeholder="Nom" value={data.personalInfo?.lastName || ''} onChange={(e) => updateInfo({ lastName: e.target.value })} />
        </div>
        <input className="w-full p-3 border rounded mb-4" placeholder="Titre du profil" value={data.personalInfo?.headline || ''} onChange={(e) => updateInfo({ headline: e.target.value })} />
        <div className="grid grid-cols-3 gap-3 mb-4">
          <input className="p-2 border rounded text-sm" placeholder="Email" value={data.personalInfo?.email || ''} onChange={(e) => updateInfo({ email: e.target.value })} />
          <input className="p-2 border rounded text-sm" placeholder="Téléphone" value={data.personalInfo?.phone || ''} onChange={(e) => updateInfo({ phone: e.target.value })} />
          <input className="p-2 border rounded text-sm" placeholder="Ville" value={data.personalInfo?.city || ''} onChange={(e) => updateInfo({ city: e.target.value })} />
        </div>
        <textarea className="w-full p-3 border rounded h-24" placeholder="Résumé / Profil professionnel" value={data.personalInfo?.profile || ''} onChange={(e) => updateInfo({ profile: e.target.value })} />
      </section>

      <section className="mb-8 text-left">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold">Expériences</h2>
          <button onClick={addExperience} className="bg-slate-200 px-3 py-1 rounded text-sm hover:bg-slate-300 transition-colors">+ Ajouter</button>
        </div>
        <div className="space-y-4">
          {experiences.map((exp: any) => (
            <div key={exp.id} className="p-4 border rounded bg-slate-50 space-y-3 shadow-sm text-left">
              <div className="grid grid-cols-2 gap-3">
                <input className="p-2 border rounded" placeholder="Poste" value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} />
                <input className="p-2 border rounded" placeholder="Entreprise" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
              </div>
              <textarea className="w-full p-2 border rounded h-20" placeholder="Description" value={exp.description} onChange={(e) => updateExperience(exp.id, { description: e.target.value })} />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 text-left">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold">Formation</h2>
          <button onClick={addEducation} className="bg-slate-200 px-3 py-1 rounded text-sm hover:bg-slate-300 transition-colors">+ Ajouter</button>
        </div>
        <div className="space-y-4">
          {education.map((edu: any) => (
            <div key={edu.id} className="p-4 border rounded bg-slate-50 space-y-3 shadow-sm text-left">
              <div className="grid grid-cols-2 gap-3">
                <input className="p-2 border rounded" placeholder="Diplôme" value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} />
                <input className="p-2 border rounded" placeholder="École" value={edu.school} onChange={(e) => updateEducation(edu.id, { school: e.target.value })} />
              </div>
              <input className="w-full p-2 border rounded" placeholder="Détails" value={edu.description} onChange={(e) => updateEducation(edu.id, { description: e.target.value })} />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 text-left">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Compétences</h2>
        <input 
          className="w-full p-3 border rounded" 
          placeholder="React, TypeScript, Node.js..." 
          value={skills.join(', ')} 
          onChange={handleSkillsChange}
        />
        <p className="text-xs text-slate-500 mt-2">Séparez les compétences par des virgules</p>
      </section>

      <button onClick={handleDownload} disabled={loading} className="w-full bg-blue-600 text-white font-bold p-4 rounded mt-4 shadow-md hover:bg-blue-700 transition-colors sticky bottom-0">
        {loading ? 'Génération...' : 'Télécharger PDF'}
      </button>
    </div>
  );
};