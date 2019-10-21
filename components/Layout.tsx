import * as React from 'react';
import { withTranslation, WithTranslation } from '../i18n';
import Link from '../components/Link';
import Head from 'next/head';

type Props = {
  title?: string
} & WithTranslation;

const Layout: React.FunctionComponent<Props> = ({
  t,
  children,
  title = 'This is the default title',
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link pageName="index">
          <a>{t('home')}</a>
        </Link>{' '}
        |{' '}
        <Link pageName="about">
          <a>{t('about')}</a>
        </Link>{' '}
        |{' '}
        <Link pageName="initial-props">
          <a>With Initial Props</a>
        </Link>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
    </footer>
  </div>
);

export default withTranslation('common')(Layout);
