import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';

export const Editor = () => {
  const { data, updateInfo, addExperience, updateExperience } = useResumeStore();
  const [loading, setLoading] = useState(false);

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
      link.download = 'CV.pdf';
      link.click();
    } catch (error) {
      alert("Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 p-8 overflow-y-auto bg-white shadow-lg z-10">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Éditeur</h1>
      
      <div className="space-y-4 mb-8">
        <input className="w-full p-3 border rounded" placeholder="Prénom" value={data.personalInfo.firstName} onChange={(e) => updateInfo({ firstName: e.target.value })} />
        <input className="w-full p-3 border rounded" placeholder="Nom" value={data.personalInfo.lastName} onChange={(e) => updateInfo({ lastName: e.target.value })} />
        <input className="w-full p-3 border rounded" placeholder="Titre" value={data.personalInfo.headline} onChange={(e) => updateInfo({ headline: e.target.value })} />
      </div>

      <div className="space-y-4">
        <button onClick={addExperience} className="bg-slate-200 px-3 py-1 rounded">+ Expérience</button>
        {data.experiences.map((exp:any) => (
          <div key={exp.id} className="p-4 border rounded bg-slate-50 space-y-3">
            <input className="w-full p-2 border rounded" placeholder="Poste" value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} />
            <input className="w-full p-2 border rounded" placeholder="Entreprise" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
            <textarea className="w-full p-2 border rounded" placeholder="Description" value={exp.description} onChange={(e) => updateExperience(exp.id, { description: e.target.value })} />
          </div>
        ))}
      </div>

      <button onClick={handleDownload} disabled={loading} className="w-full bg-blue-600 text-white font-bold p-4 rounded mt-8">
        {loading ? 'Génération...' : 'Télécharger PDF'}
      </button>
    </div>
  );
};