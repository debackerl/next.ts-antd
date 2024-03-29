import express from 'express';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';
import { PatternType, ParamType } from 'next-url-prettifier';
import { registry } from './routing';
import nextI18next, { languages } from './i18n';
import Negotiator from 'negotiator';
import * as bcp47 from 'bcp47';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT) || 3000;

function localeDetector(allowed: Array<string>): (req: express.Request) => string {
  const allowedMap = new Set<string>(allowed);

  return (req: express.Request) => {
    const negotiator = new Negotiator(req);
    const languages = negotiator.languages();
    let locale = allowed[0];
    for(const lang of languages) {
      const parsed = bcp47.parse(lang);
      if(parsed) {
        const code = parsed.langtag.language.language;
        if(code && allowedMap.has(code)) {
          locale = code;
          break;
        }
      }
    }
    return locale;
  };
}

async function main() {
  const app = next({dev});
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = express();
  server.use(nextI18NextMiddleware(nextI18next));

  server.get('/favicon.ico', function(req, res) {
    res.status(404).send('Not found');
  });

  // detect language and redirect
  const detectLocale = localeDetector(languages);
  server.get('/', (req, res) => {
    const lng = detectLocale(req);
    res.redirect(301, '/' + lng);
  });

  // resolve pretty routes
  registry.forEachRoute((pageName: string, pattern: PatternType, defaultParams: ParamType) => server.get(pattern, async (req, res) => {
    const query = Object.assign({}, defaultParams, req.params, req.query);

    // good to switch language here so we can still load it async before rendering the page
    if(query.lng) await req.i18n.changeLanguage(query.lng);

    app.render(req, res, `/${pageName}`, query);
  }));

  // resolve next.js routes
  server.get('*', (req, res) => handle(req, res));

  server.listen(port);

  console.log('Started.');
}

main();
