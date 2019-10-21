import * as React from 'react';
import { default as NextLink, LinkProps } from 'next/link';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import { registry, PageName, Routes } from '../routing';

export type LinkPropsType<N extends PageName> = {
  children?: any,
  pageName?: N,
  params?: Routes[N]
} & Partial<LinkProps> & WithRouterProps;

const defaultParams = {};

// if there is href, use it
// otherwise if there is pageName, use it
// otherwise, assume we stay on current page but change some parameters only
class BareLink<N extends PageName> extends React.Component<LinkPropsType<N>> {
  render() {
    const { children, href, pageName, params, router, ...rest } = this.props;

    if(href) {
      return <NextLink href={href} children={children} {...rest} />;
    } else {
      const url = registry.toUrl(pageName || router.route.slice(1) as N, params || defaultParams, router.query);
      // if no matching route has been found, url will be null
      return <NextLink href={`/${pageName}`} as={url} children={children} {...rest} />;
    }
  }
}

export default withRouter(BareLink);
