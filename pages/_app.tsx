import React from 'react';
import App, { Container } from 'next/app';

// got to include external stylesheets at global level until https://github.com/zeit/next-plugins/issues/282 is fixed
import 'antd/dist/antd.less';

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

export default MyApp;
