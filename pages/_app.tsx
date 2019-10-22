import React from 'react';
import { ConfigProvider } from 'antd';
import { Locale as AntdLocale } from 'antd/lib/locale-provider';
import enUS from 'antd/lib/locale/en_US';
import frFR from 'antd/lib/locale/fr_FR';
import App, { Container, AppContext, AppInitialProps } from 'next/app';
import { appWithTranslation, i18n } from '../i18n';

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

  shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    // render() should be side-effect free, so we change language of i18n here

    const { router } = nextProps;
    const lng = router.query.lng as string;
    i18n.changeLanguage(lng);

    return true;
  }

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
