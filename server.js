import express from 'express';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';
import { Router } from './routes';
import nextI18next from './i18n';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT) || 3000;
const app = next({dev});
const handle = app.getRequestHandler();

async function main() {
  await app.prepare();
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));

  Router.forEachPrettyPattern((page, pattern, defaultParams) => server.get(pattern, (req, res) =>
    app.render(req, res, `/${page}`, Object.assign({}, defaultParams, req.query, req.params))
  ));

  server.get('*', (req, res) => handle(req, res));
  server.listen(port);
}

main();
