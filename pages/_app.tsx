import React from 'react';
import App, { Container } from 'next/app';
import { appWithTranslation } from '../i18n';

// got to include external stylesheets at global level until https://github.com/zeit/next-plugins/issues/282 is fixed
import 'antd/dist/antd.less';
import '../assets/mdx.less';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default appWithTranslation(MyApp);
