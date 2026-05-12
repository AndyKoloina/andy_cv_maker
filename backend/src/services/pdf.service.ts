import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { ResumeData } from '../../../shared/schema';

export class PdfService {
  private static template = `
    <!DOCTYPE html>
    <html>
      <head><script src="https://cdn.tailwindcss.com"></script></head>
      <body class="p-12 text-slate-800">
        <h1 class="text-4xl font-bold uppercase">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
        <h2 class="text-xl text-blue-600 mb-8">{{personalInfo.headline}}</h2>
        <h3 class="font-bold border-b-2 border-slate-800 mb-4">Expériences</h3>
        {{#each experiences}}
          <div class="mb-4">
            <p class="font-bold">{{position}} chez {{company}}</p>
            <p class="text-sm">{{description}}</p>
          </div>
        {{/each}}
      </body>
    </html>
  `;

  static async generate(data: ResumeData): Promise<Buffer> {
    const html = Handlebars.compile(this.template)(data);
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true 
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return Buffer.from(pdf);
  }
}