import { Request, Response } from 'express';
import { ResumeSchema } from '../../../shared/schema';
import { PdfService } from '../services/pdf.service';
import { CacheService } from '../services/cache.service';
// import { DbService } from '../services/db.service'; // À utiliser si authentifié

export const generateResume = async (req: Request, res: Response) => {
  try {
    const data = ResumeSchema.parse(req.body);
    
    const cached = await CacheService.getPdf(data);
    if (cached) {
      res.setHeader('Content-Type', 'application/pdf');
      return res.end(cached);
    }

    const pdf = await PdfService.generate(data);
    await CacheService.setPdf(data, pdf);
    
    // Si l'utilisateur était connecté, on ferait : await DbService.saveResume(req.user.id, data);

    res.setHeader('Content-Type', 'application/pdf');
    res.end(pdf);
  } catch (error) {
    res.status(400).json({ error: "Génération échouée ou données invalides" });
  }
};