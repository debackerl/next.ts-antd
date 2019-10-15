import * as React from 'react';
import { default as NextLink, LinkProps } from 'next/link';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import pathToRegexp from 'path-to-regexp';
import * as querystring from 'querystring';

export type ParamsType = Record<string, string | string[]>;

export type Route<P extends ParamsType> = {
  path: string,
  defaultParams?: Partial<P>
};

export type Page<P extends ParamsType, K extends string> = {
  toUrl: (params: P, routes: Record<K, (params: any) => string>) => string,
  routes: Record<K, Route<P>>
};

export type RouteIterator = (pageName: string, path: string, defaultParams: any) => void;

export type Registry<R extends Record<string, any>> = {
  toUrl<N extends keyof R>(pageName: N, params: R[N]): string,
  forEachRoute(iterator: RouteIterator): void
};

// extracts type of PageName from type of a Registry
export type PageNameType<T> = T extends Registry<Record<infer K, any>> ? K : never;

export type RoutesType<T> = T extends Registry<infer R> ? R : never;

function load<R extends Record<string, any>>(pages: { [K in keyof R]: Page<R[K], string> }): Registry<R> {
  let serializersByPageName: Record<string, (params: any) => string> = {};

  for(let pageName in pages) {
    if(pageName) {
      const page = pages[pageName];

      let routesSerializer: Record<string, (params: any) => string> = {};
      for(let routeName in page.routes) {
        if(routeName) {
          const path = page.routes[routeName].path;
          let keys: pathToRegexp.Key[] = [];
          const regexp = pathToRegexp(path, keys);
          const toPath = pathToRegexp.compile(path);

          routesSerializer[routeName] = function(params: any): string {
            let url = toPath(params);

            let extraParams: ParamsType = null;
            for(let key in params) {
              if(key && !(key in keys)) {
                const value = params[key];
                if(!extraParams) extraParams = {};
                extraParams[key] = value;
              }
            }

            if(extraParams) url += '?' + querystring.stringify(extraParams);

            return url;
          }
        }
      }

      serializersByPageName[pageName] = function(params: any) {
        return page.toUrl(params, routesSerializer);
      };
    }
  }

  return {
    toUrl: function<N extends keyof R>(pageName: N, params: R[N]): string {
      const serializer = serializersByPageName[pageName as string];
      if(!serializer) return null;

      return serializer(params);
    },

    forEachRoute: function(iterator: RouteIterator): void {
      for(let pageName in pages) {
        if(pageName) {
          const page = pages[pageName];

          for(let routeName in page.routes) {
            if(routeName) {
              const route = page.routes[routeName];

              iterator(pageName, route.path, route.defaultParams);
            }
          }
        }
      }
    }
  };
}



export const registry = load({
  "index": {
    toUrl: function(params: { lng: string }) {
      switch(params.lng) {
        case 'fr': return '/fr';
        default: return '/en';
      }
    },
    routes: {
      en: { path: '/en', defaultParams: { lng: 'en' } },
      fr: { path: '/fr', defaultParams: { lng: 'fr' } }
    }
  },

  "detail" : {
    toUrl: function(params: { id: string }, routes) { return routes.default(params); },
    routes: {
      default: { path: '/details/:id' }
    }
  },

  "initial-props": {
    toUrl: function(params: { lng: string }) {
      switch(params.lng) {
        case 'fr': return '/fr/props-initiales';
        default: return '/en/initial-props';
      }
    },
    routes: {
      en: { path: '/en/initial-props', defaultParams: { lng: 'en' } },
      fr: { path: '/fr/props-initiales', defaultParams: { lng: 'fr' } }
    }
  }
});

export type Routes = RoutesType<typeof registry>;
export type PageName = keyof Routes;

export type LinkPropsType<N extends PageName> = {
  children?: any,
  pageName?: N,
  params?: Routes[N]
} & Partial<LinkProps> & WithRouterProps;

// if there is href, use it
// otherwise if there is pageName, use it
// otherwise, assume we stay on current page but change some parameters only
class BareLink<N extends PageName> extends React.Component<LinkPropsType<N>> {
  render() {
    const { children, href, pageName, params, router, ...rest } = this.props;

    if(href) {
      return <NextLink href={href} children={children} {...rest} />;
    } else {
      const url = registry.toUrl(pageName || router.route.slice(1) as N, Object.assign({}, router.query, params) as Routes[N]);
      // if no matching route has been found, url will be null
      return <NextLink href={`/${pageName}`} as={url} children={children} {...rest} />;
    }
  }
}

export const Link = withRouter(BareLink);
