import React from 'react';
import { ConfigProvider } from 'antd';
import { Locale as AntdLocale } from 'antd/lib/locale-provider';
import enUS from 'antd/lib/locale/en_US';
import frFR from 'antd/lib/locale/fr_FR';
import App, { Container } from 'next/app';
import { appWithTranslation, withTranslation, WithTranslation } from '../i18n';

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

class MyApp extends App<Props & WithTranslation> {
  /*static async getInitialProps(appContext: AppContext): Promise<AppInitialProps & Props> {
    const appProps = await App.getInitialProps(appContext);
    return { ...appProps };
  }*/

  get language(): string {
    const { router } = this.props;
    return router.query.lng as string;
  }

  shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    // render() should be side-effect free, so we change language of i18n here
    // careful: props references the router singleton, which is mutable and always returns last version

    const i18n = this.props.i18n;
    if(this.language !== i18n.language) {
      i18n.changeLanguage(this.language);
    }

    return true;
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ConfigProvider locale={getAntdLocale(this.language)}>
          <Component {...pageProps} />
        </ConfigProvider>
      </Container>
    );
  }
}

export default appWithTranslation(withTranslation([])(MyApp));
