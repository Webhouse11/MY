import JSZip from 'jszip';
import { Article, Advertisement, SiteSettings, Comment, NewsletterSubscriber } from '../types';

export interface ExportDataPayload {
  articles: Article[];
  ads: Advertisement[];
  settings: SiteSettings;
  comments: Comment[];
  subscribers: NewsletterSubscriber[];
}

export async function generateAndDownloadProjectZip(dataPayload?: ExportDataPayload): Promise<void> {
  const zip = new JSZip();

  try {
    // 1. Gather files safely with relative globs
    // @ts-ignore
    const sourceModules = import.meta.glob(
      '../**/*.{ts,tsx,css,json,html}',
      { query: '?raw', import: 'default' }
    );

    for (const [path, resolver] of Object.entries(sourceModules)) {
      try {
        const content = await (resolver as () => Promise<string>)();
        // Convert relative path like '../components/...' to 'src/components/...'
        const cleanPath = path.replace(/^\.\.\//, 'src/');
        if (content) {
          zip.file(cleanPath, content);
        }
      } catch (err) {
        console.warn(`Could not read file ${path}:`, err);
      }
    }
  } catch (err) {
    console.error('Glob error:', err);
  }

  // 2. Add package.json
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: "clementtrends-blog",
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: {
          dev: "vite --port=3000 --host=0.0.0.0",
          build: "vite build",
          preview: "vite preview",
          lint: "tsc --noEmit"
        },
        dependencies: {
          "@tailwindcss/vite": "^4.1.14",
          "@vitejs/plugin-react": "^5.0.4",
          "firebase": "^12.17.1",
          "jszip": "^3.10.1",
          "lucide-react": "^0.546.0",
          "motion": "^12.23.24",
          "react": "^19.0.1",
          "react-dom": "^19.0.1",
          "vite": "^6.2.3"
        },
        devDependencies: {
          "@types/node": "^22.14.0",
          "tailwindcss": "^4.1.14",
          "typescript": "~5.8.2"
        }
      },
      null,
      2
    )
  );

  // 3. Add .gitignore
  zip.file(
    '.gitignore',
    `node_modules
dist
dist-ssr
*.local
.env
.DS_Store
`
  );

  // 4. Add Live Database Snapshot
  if (dataPayload) {
    const backupContent = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        siteName: dataPayload.settings.siteName,
        totalArticles: dataPayload.articles.length,
        totalAds: dataPayload.ads.length,
        totalSubscribers: dataPayload.subscribers.length,
        totalComments: dataPayload.comments.length,
        data: dataPayload
      },
      null,
      2
    );
    zip.file('backup-database.json', backupContent);
  }

  // 5. Add comprehensive README.md with GitHub upload instructions
  zip.file(
    'README.md',
    `# ClementTrends - Modern Digital Publication & CMS

ClementTrends is a high-performance, responsive news, tech, finance, and culture publication with an integrated Editorial CMS, Google Cloud Firestore persistence, dynamic advertising monetization, and SEO optimization.

## 🚀 How to Run Locally

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the local development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Build for production**:
   \`\`\`bash
   npm run build
   \`\`\`

---

## 📦 How to Upload to GitHub

1. Open your terminal in this project root directory.
2. Initialize and push your repository:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit - ClementTrends Blog & CMS"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   \`\`\`

---

## 🌐 How to Deploy to Vercel / Netlify

1. Connect your GitHub repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Set build settings:
   - **Framework Preset**: Vite
   - **Build Command**: \`npm run build\`
   - **Output Directory**: \`dist\`
   - **Node Version**: 18.x or 20.x

---

## 🔒 Editorial CMS Access
- **URL**: Navigate to \`/#admin\`
- **Shortcut**: Press \`Alt + A\` on the live site.
- **Default PIN**: \`1234\` (configurable in Site & Author Settings).
`
  );

  // Generate the zip blob
  const blob = await zip.generateAsync({ type: 'blob' });

  // Trigger immediate browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const timestamp = new Date().toISOString().slice(0, 10);
  a.download = `clementtrends-source-code-${timestamp}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
