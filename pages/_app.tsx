import React from 'react';
import { ConfigProvider } from 'antd';
import { Locale as AntdLocale } from 'antd/lib/locale-provider';
import enUS from 'antd/es/locale/en_US';
import frFR from 'antd/es/locale/fr_FR';
import App, { Container, AppContext, AppInitialProps } from 'next/app';
import { appWithTranslation } from '../i18n';

// got to include external stylesheets at global level until https://github.com/zeit/next-plugins/issues/282 is fixed
import 'antd/dist/antd.less';
import '../assets/mdx.less';

function getAntdLocale(language: string): AntdLocale {
  switch(language) {
    case 'fr': return frFR;
    default: return enUS;
  }
}

type Props = {};

class MyApp extends App<Props> {
  /*static async getInitialProps(appContext: AppContext): Promise<AppInitialProps & Props> {
    const appProps = await App.getInitialProps(appContext);
    return { ...appProps };
  }*/

  render() {
    const { Component, router, pageProps } = this.props;
    const lng = router.query.lng as string;

    return (
      <Container>
        <ConfigProvider locale={getAntdLocale(lng)}>
          <Component {...pageProps} />
        </ConfigProvider>
      </Container>
    );
  }
}

export default appWithTranslation(MyApp);
