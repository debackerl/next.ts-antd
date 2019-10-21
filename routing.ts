import pathToRegexp from 'path-to-regexp';
import * as querystring from 'querystring';

export type ParamsType = Record<string, string | string[]>;

export type RouteFunction = (params: any, variables: any) => string;

export type Route<P extends ParamsType> = {
  path: string,
  defaultParams?: Partial<P>
};

export type Page<P extends ParamsType, K extends string> = {
  selector: (variables: P, routes: Record<K, RouteFunction>) => RouteFunction,
  routes: Record<K, Route<P>>
};

export type RouteIterator = (pageName: string, path: string, defaultParams: any) => void;

export type Registry<R extends Record<string, any>> = {
  toUrl<N extends keyof R>(pageName: N, params: Partial<R[N]>, context?: any): string,
  forEachRoute(iterator: RouteIterator): void
};

// extracts type of PageName from type of a Registry
export type PageNameType<T> = T extends Registry<Record<infer K, any>> ? K : never;

export type RoutesType<T> = T extends Registry<infer R> ? R : never;

function load<R extends Record<string, any>>(pages: { [K in keyof R]: Page<R[K], string> }): Registry<R> {
  let serializersByPageName: Record<string, (params: any, context: any) => string> = {};

  for(let pageName in pages) {
    if(pageName) {
      const page = pages[pageName];

      let routesSerializer: Record<string, (params: any, variables: any) => string> = {};
      for(let routeName in page.routes) {
        if(routeName) {
          const path = page.routes[routeName].path;
          let keys: pathToRegexp.Key[] = [];
          /*const regexp =*/ pathToRegexp(path, keys);
          const toPath = pathToRegexp.compile(path);

          const keysSet = new Set<string>();
          for(let k of keys) {
            if(typeof(k.name) === 'string') keysSet.add(k.name);
          }

          routesSerializer[routeName] = function(params: any, variables: any): string {
            let url = toPath(variables);

            let extraParams: ParamsType = null;
            for(let key in params) {
              if(key && !keysSet.has(key)) {
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

      serializersByPageName[pageName] = function(params: any, context?: any): string {
        const variables = context ? Object.assign({}, context, params) : params;
        const route = page.selector(variables, routesSerializer);
        return route(params, variables);
      };
    }
  }

  return {
    toUrl: function<N extends keyof R>(pageName: N, params: Partial<R[N]>, context?: any): string {
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
    selector: function(variables: { id: string }, routes) { return routes.default; },
    routes: {
      default: { path: '/details/:id' }
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
