import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { ResumeData } from '../../../shared/schema';

const FRENCH_TEMPLATE = `
  <!DOCTYPE html>
  <html>
    <head><script src="https://cdn.tailwindcss.com"></script></head>
    <body class="p-12 text-slate-800">
      <header class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-4xl font-bold uppercase">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
          <h2 class="text-xl text-blue-600">{{personalInfo.headline}}</h2>
        </div>
        <div class="text-right text-sm text-slate-600">
          {{#if personalInfo.email}}<p>{{personalInfo.email}}</p>{{/if}}
          {{#if personalInfo.phone}}<p>{{personalInfo.phone}}</p>{{/if}}
          {{#if personalInfo.city}}<p>{{personalInfo.city}}</p>{{/if}}
        </div>
      </header>
      
      {{#if personalInfo.profile}}
        <h3 class="font-bold border-b-2 border-slate-800 mb-2">Profil</h3>
        <p class="text-sm mb-6">{{personalInfo.profile}}</p>
      {{/if}}

      <h3 class="font-bold border-b-2 border-slate-800 mb-4">Expériences Professionnelles</h3>
      {{#each experiences}}
        <div class="mb-4">
          <p class="font-bold">{{position}} chez {{company}}</p>
          <p class="text-sm">{{description}}</p>
        </div>
      {{/each}}

      {{#if education.length}}
        <h3 class="font-bold border-b-2 border-slate-800 mb-4 mt-6">Formation</h3>
        {{#each education}}
          <div class="mb-3">
            <p class="font-bold">{{degree}}</p>
            <p class="text-sm">{{school}}</p>
            {{#if description}}<p class="text-xs italic">{{description}}</p>{{/if}}
          </div>
        {{/each}}
      {{/if}}

      {{#if skills.length}}
        <h3 class="font-bold border-b-2 border-slate-800 mb-4 mt-6">Compétences</h3>
        <p class="text-sm">{{#each skills}}{{#if @index}}, {{/if}}{{this}}{{/each}}</p>
      {{/if}}
    </body>
  </html>
`;

const CANADIAN_TEMPLATE = `
  <!DOCTYPE html>
  <html>
    <head><script src="https://cdn.tailwindcss.com"></script></head>
    <body class="p-12 text-slate-900 font-serif">
      <div class="text-center border-b-4 border-double border-slate-900 pb-4 mb-8">
        <h1 class="text-3xl font-bold">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
        <p class="italic text-slate-600 mb-2">{{personalInfo.headline}}</p>
        <div class="text-sm space-x-4">
          {{#if personalInfo.email}}<span>{{personalInfo.email}}</span>{{/if}}
          {{#if personalInfo.phone}}<span>{{personalInfo.phone}}</span>{{/if}}
          {{#if personalInfo.city}}<span>{{personalInfo.city}}</span>{{/if}}
        </div>
      </div>

      {{#if personalInfo.profile}}
        <h3 class="font-bold uppercase tracking-widest text-sm mb-3 bg-slate-100 p-1">Professional Summary</h3>
        <p class="text-sm leading-relaxed mb-6">{{personalInfo.profile}}</p>
      {{/if}}

      <h3 class="font-bold uppercase tracking-widest text-sm mb-4 bg-slate-100 p-1">Work Experience</h3>
      {{#each experiences}}
        <div class="mb-6">
          <div class="flex justify-between items-baseline">
            <p class="font-bold text-lg">{{company}}</p>
          </div>
          <p class="italic mb-2">{{position}}</p>
          <p class="text-sm leading-relaxed">{{description}}</p>
        </div>
      {{/each}}

      {{#if education.length}}
        <h3 class="font-bold uppercase tracking-widest text-sm mb-4 bg-slate-100 p-1">Education</h3>
        {{#each education}}
          <div class="mb-4">
            <p class="font-bold">{{degree}}</p>
            <p class="italic text-sm">{{school}}</p>
            {{#if description}}<p class="text-sm mt-1">{{description}}</p>{{/if}}
          </div>
        {{/each}}
      {{/if}}

      {{#if skills.length}}
        <h3 class="font-bold uppercase tracking-widest text-sm mb-4 bg-slate-100 p-1">Skills</h3>
        <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {{#each skills}}
            <span>• {{this}}</span>
          {{/each}}
        </div>
      {{/if}}
    </body>
  </html>
`;

const TEMPLATES = {
  FRENCH: FRENCH_TEMPLATE,
  CANADIAN: CANADIAN_TEMPLATE
};

export class PdfService {
  static async generate(data: ResumeData): Promise<Buffer> {
    const templateSource = TEMPLATES[data.metadata.template] || TEMPLATES.FRENCH;
    const html = Handlebars.compile(templateSource)(data);
    
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