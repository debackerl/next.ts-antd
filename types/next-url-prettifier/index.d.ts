declare module 'next-url-prettifier' {
  //import { LinkProps as NextLinkPropsType } from 'next/link';

  export type ParamType = any;
  export type PatternType = string;

  export interface RouteLinkParamsType {
    href?: string,
    as?: string
  }

  declare type NextLinkPropsType = {
    href: Url;
    as?: Url | undefined;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    onError?: (error: Error) => void;
    /**
     * @deprecated since version 8.1.1-canary.20
     */
    prefetch?: boolean;
  };

  export type LinkPropsType = {
    children?: any,
    route?: RouteLinkParamsType
  } & Partial<NextLinkPropsType>;

  export class Link extends React.Component<LinkPropsType> {
    props: LinkPropsType;
    render();
  }

  export interface PrettyPatternType {
    pattern: PatternType,
    defaultParams?: ParamType
  }

  export interface RouteType<PageNameType extends string> {
    page: PageNameType,
    prettyUrl?: string | ((params: ParamType) => string),
    prettyPatterns?: PatternType | (PatternType | PrettyPatternType)[],
    prettyUrlPatterns?: PatternType | (PatternType | PrettyPatternType)[]
  }

  export type PatternFunctionType<PageNameType extends string> =
    (page: PageNameType, pattern: PatternType, defaultParams: ParamType) => any;

  export type UrlPrettifierOptionsType = {
    paramsToQueryString?: (ParamType) => string
  }

  export default class UrlPrettifier<T extends string> {
    constructor(routes: RouteType<T>[], options: UrlPrettifierOptionsType = {}): void;
    getPrettyUrl(pageName: T, params: ParamType): RouteLinkParamsType;
    linkPage(pageName: T, params: ParamType): RouteLinkParamsType;
    getPrettyUrlPatterns(route: RouteType<T>): PrettyPatternType[];
    getPrettyPatterns(route: RouteType<T>): PrettyPatternType[];
    forEachPrettyPattern(apply: PatternFunctionType<T>): void;
    forEachPattern(apply: PatternFunctionType<T>): void;
  }
}
