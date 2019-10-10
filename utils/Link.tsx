import * as React from 'react';
import { RouteLinkParamsType } from 'next-url-prettifier';
import { LinkProps } from 'next/link';
import { Link } from '../i18n';

export type PropsType = {
  children?: any,
  route?: RouteLinkParamsType
} & Partial<LinkProps>;

export default class extends React.Component<PropsType> {
  props: PropsType;

  render() {
    const {href, route, children, ...rest}: PropsType = this.props;
    return href || (route && route.href)
      ? <Link {...{...rest, href, children}} {...route} />
      : children
        ? children
        : null
    ;
  }
}
