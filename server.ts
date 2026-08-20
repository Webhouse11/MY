import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_ARTICLES } from './src/data/seedData';
import { Article } from './src/types';

function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function findArticleBySlugOrId(slugOrId: string): Article | undefined {
  if (!slugOrId) return undefined;
  const clean = slugOrId.trim().toLowerCase();
  return INITIAL_ARTICLES.find(
    a => a.slug.toLowerCase() === clean || a.id.toLowerCase() === clean
  );
}

function injectArticleMetaTags(html: string, article: Article, fullUrl: string): string {
  const title = `${article.title} | ClementTrends`;
  const desc = article.excerpt || article.seo?.metaDescription || 'Read the full article and insights on ClementTrends.';
  const image = article.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';

  let updated = html;

  // Title
  if (/<title>.*?<\/title>/i.test(updated)) {
    updated = updated.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  } else {
    updated = updated.replace('<head>', `<head>\n    <title>${escapeHtml(title)}</title>`);
  }

  // Description
  if (/<meta\s+name="description"[^>]*>/i.test(updated)) {
    updated = updated.replace(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(desc)}" />`);
  } else {
    updated = updated.replace('</head>', `    <meta name="description" content="${escapeHtml(desc)}" />\n  </head>`);
  }

  // Open Graph Title
  if (/<meta\s+property="og:title"[^>]*>/i.test(updated)) {
    updated = updated.replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  } else {
    updated = updated.replace('</head>', `    <meta property="og:title" content="${escapeHtml(title)}" />\n  </head>`);
  }

  // Open Graph Description
  if (/<meta\s+property="og:description"[^>]*>/i.test(updated)) {
    updated = updated.replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(desc)}" />`);
  } else {
    updated = updated.replace('</head>', `    <meta property="og:description" content="${escapeHtml(desc)}" />\n  </head>`);
  }

  // Open Graph Image
  if (/<meta\s+property="og:image"[^>]*>/i.test(updated)) {
    updated = updated.replace(
      /<meta\s+property="og:image"[^>]*>/i,
      `<meta property="og:image" content="${escapeHtml(image)}" />\n    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />\n    <meta property="og:image:type" content="image/jpeg" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="${escapeHtml(article.title)}" />`
    );
  } else {
    updated = updated.replace(
      '</head>',
      `    <meta property="og:image" content="${escapeHtml(image)}" />\n    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n  </head>`
    );
  }

  // Open Graph URL
  if (/<meta\s+property="og:url"[^>]*>/i.test(updated)) {
    updated = updated.replace(/<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeHtml(fullUrl)}" />`);
  }

  // Open Graph Type
  if (/<meta\s+property="og:type"[^>]*>/i.test(updated)) {
    updated = updated.replace(/<meta\s+property="og:type"[^>]*>/i, `<meta property="og:type" content="article" />`);
  }

  // Twitter Card
  if (/<meta\s+name="twitter:card"[^>]*>/i.test(updated)) {
    updated = updated.replace(/<meta\s+name="twitter:card"[^>]*>/i, `<meta name="twitter:card" content="summary_large_image" />`);
  }

  // Twitter Title
  if (/<meta\s+name="twitter:title"[^>]*>/i.test(updated)) {
    updated = updated.replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  }

  // Twitter Description
  if (/<meta\s+name="twitter:description"[^>]*>/i.test(updated)) {
    updated = updated.replace(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(desc)}" />`);
  }

  // Twitter Image
  if (/<meta\s+name="twitter:image"[^>]*>/i.test(updated)) {
    updated = updated.replace(/<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(image)}" />\n    <meta name="twitter:image:alt" content="${escapeHtml(article.title)}" />`);
  }

  // Canonical link
  if (/<link\s+rel="canonical"[^>]*>/i.test(updated)) {
    updated = updated.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(fullUrl)}" />`);
  }

  return updated;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Direct Article Metadata API endpoint for external clients and bots
  app.get('/api/article-meta/:slug', (req, res) => {
    const article = findArticleBySlugOrId(req.params.slug);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    return res.json({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      coverImage: article.coverImage,
      author: article.author.name,
      publishedAt: article.publishedAt,
      category: article.category
    });
  });

  let vite: any;
  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
  }

  // Handle all HTML document requests (including /?article=slug, /article/:slug, etc.)
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    // Skip API routes or static files
    if (url.startsWith('/api/') || url.match(/\.(js|css|json|png|jpg|jpeg|gif|svg|ico|woff2|woff|ttf|map)$/)) {
      return next();
    }

    try {
      let htmlTemplate = '';
      if (!isProd) {
        const indexPath = path.join(process.cwd(), 'index.html');
        htmlTemplate = fs.readFileSync(indexPath, 'utf-8');
        htmlTemplate = await vite.transformIndexHtml(url, htmlTemplate);
      } else {
        const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
        if (fs.existsSync(distIndexPath)) {
          htmlTemplate = fs.readFileSync(distIndexPath, 'utf-8');
        } else {
          htmlTemplate = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
        }
      }

      // Check if this request targets an article
      // 1. query param: ?article=... or ?p=... or ?post=...
      // 2. path: /article/:slug or /post/:slug or /p/:slug
      let targetSlug = (req.query.article as string) || (req.query.p as string) || (req.query.post as string) || '';
      
      if (!targetSlug) {
        const pathMatch = url.match(/^\/(article|post|p)\/([^/?#]+)/i);
        if (pathMatch && pathMatch[2]) {
          targetSlug = decodeURIComponent(pathMatch[2]);
        }
      }

      let renderedHtml = htmlTemplate;
      if (targetSlug) {
        const foundArticle = findArticleBySlugOrId(targetSlug);
        if (foundArticle) {
          const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
          const host = req.headers['x-forwarded-host'] || req.headers.host || 'clementtrends.com.ng';
          const fullUrl = `${proto}://${host}/?article=${encodeURIComponent(foundArticle.slug)}`;
          renderedHtml = injectArticleMetaTags(htmlTemplate, foundArticle, fullUrl);
        }
      }

      res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(renderedHtml);
    } catch (err) {
      if (vite) {
        vite.ssrFixStacktrace(err);
      }
      console.error('Error rendering HTML page:', err);
      next(err);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
