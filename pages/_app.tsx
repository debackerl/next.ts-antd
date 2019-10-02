import React from 'react';
import App, { Container } from 'next/app';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../i18n';

// got to include external stylesheets at global level until https://github.com/zeit/next-plugins/issues/282 is fixed
import 'antd/dist/antd.less';
import '../assets/mdx.less';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <I18nextProvider i18n={i18n}>
          <Component {...pageProps} />
        </I18nextProvider>
      </Container>
    );
  }
}

export default MyApp;
