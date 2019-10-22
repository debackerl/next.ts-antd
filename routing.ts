import pathToRegexp from 'path-to-regexp';
import * as querystring from 'querystring';

export type ParamsType = Record<string, string | string[]>;

export type RouteFunction = (params: any, variables: any) => SerializedRoute;

export type Route<P extends ParamsType> = {
  /** Url Pattern identifying this route. */
  path: string,
  /** Value of parameters to pass to the Page if not overriden in the query string. */
  defaultParams?: Partial<P>
};

export type Page<P extends ParamsType, K extends string> = {
  /**
   * Returns the appropriate route given `variables`.
   * @param variables Provides all parameters and context variables.
   */
  selector: (variables: P, routes: Record<K, RouteFunction>) => RouteFunction,

  /** Definition of routes leading to the current page, indexed by a unique id. */
  routes: Record<K, Route<P>>
};

export type RouteIterator = (pageName: string, path: string, defaultParams: any) => void;

export type Registry<R extends Record<string, any>> = {
  /**
   * Serializes a route to a given page.
   * @param pageName Name of the page to reference.
   * @param params Parameters which must be passed, either in the route or as query string.
   * @param context Context variables which may be used to fill missing keys in the route.
   * @returns Returns object contains `href` Url as understook by Link.js, and `as` Url to display in the browser.
  */
  serialize<N extends keyof R>(pageName: N, params: Partial<R[N]>, context?: any): SerializedRoute,

  /**
   * Iterates over all routes present in this Registry.
   * @param iterator The iterator to call once per route.
   */
  forEachRoute(iterator: RouteIterator): void
};

export type SerializedRoute = {
  /** Path interpreted by Next.js */
  href: string,
  /** Path to be displayed by the browser. */
  as: string
};

// extracts type of PageName from type of a Registry
export type PageNameType<T> = T extends Registry<Record<infer K, any>> ? K : never;

export type RoutesType<T> = T extends Registry<infer R> ? R : never;

function load<R extends Record<string, any>>(pages: { [K in keyof R]: Page<R[K], string> }): Registry<R> {
  let serializersByPageName: Record<string, (params: any, context: any) => SerializedRoute> = {};

  for(let pageName in pages) {
    if(pageName) {
      const page = pages[pageName];

      let routesSerializer: Record<string, (params: any, variables: any) => SerializedRoute> = {};
      for(let routeName in page.routes) {
        if(routeName) {
          const route = page.routes[routeName];
          const path = route.path;
          let keys: pathToRegexp.Key[] = [];
          /*const regexp =*/ pathToRegexp(path, keys);
          const toPath = pathToRegexp.compile(path);

          const keysSet = new Set<string>();
          for(let k of keys) {
            if(typeof(k.name) === 'string') keysSet.add(k.name);
          }

          routesSerializer[routeName] = function(params: any, variables: any): SerializedRoute {
            let href = '/' + pageName;
            let as = toPath(variables);

            let qsParams: ParamsType = null;
            for(let key in params) {
              if(key && !keysSet.has(key)) {
                const value = params[key];

                if(!route.defaultParams || value !== route.defaultParams[key]) {
                  if(!qsParams) qsParams = {};
                  qsParams[key] = value;
                }
              }
            }

            if(qsParams) {
              as += '?' + querystring.stringify(qsParams);
            }

            if(route.defaultParams) {
              if(!qsParams) qsParams = {};
              qsParams = Object.assign({}, route.defaultParams, qsParams);
            }

            if(keys.length) {
              if(!qsParams) qsParams = {};
              for(let k of keys) {
                qsParams[k.name] = variables[k.name];
              }
            }

            if(qsParams) {
              href += '?' + querystring.stringify(qsParams);
            }

            return { href, as };
          }
        }
      }

      serializersByPageName[pageName] = function(params: any, context?: any): SerializedRoute {
        const variables = context ? Object.assign({}, context, params) : params;
        const route = page.selector(variables, routesSerializer);
        return route(params, variables);
      };
    }
  }

  return {
    serialize: function<N extends keyof R>(pageName: N, params: Partial<R[N]>, context?: any): SerializedRoute {
      const serializer = serializersByPageName[pageName as string];
      if(!serializer) return null;

      return serializer(params, context);
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
    selector: function(variables: { lng: string }, routes) { return routes.default; },
    routes: {
      default: { path: '/:lng' }
    }
  },

  "about": {
    selector: function(variables: { lng: string }, routes) {
      switch(variables.lng) {
        case 'fr': return routes.fr;
        default: return routes.en;
      }
    },
    routes: {
      en: { path: '/en/about', defaultParams: { lng: 'en' } },
      fr: { path: '/fr/a-propos', defaultParams: { lng: 'fr' } }
    }
  },

  "detail" : {
    selector: function(variables: { lng: string, id: string }, routes) { return routes.default; },
    routes: {
      default: { path: '/:lng/details/:id' }
    }
  },

  "initial-props": {
    selector: function(variables: { lng: string }, routes) {
      switch(variables.lng) {
        case 'fr': return routes.fr;
        default: return routes.en;
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
