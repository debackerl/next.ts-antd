import { RouteType, default as UrlPrettifier } from 'next-url-prettifier';

const routes: RouteType<string>[] = [
  {
    page: 'index',
    // `prettyUrl` is used on client side to construct the URL of your link
    prettyUrl: ({lng}) => {
      switch(lng) {
        case 'fr': return '/fr';
        default: return '/en';
      }
    },
    // `prettyPatterns` is used on server side to find which component/page to display
    prettyPatterns: [
      { pattern: '/en', defaultParams: { lng: 'en' } },
      { pattern: '/fr', defaultParams: { lng: 'fr' } }
    ]
  }, {
    page: 'detail',
    prettyUrl: ({lng, id}) => (`/${lng}/details/${id}`),
    prettyPatterns: [
      { pattern: '/details/:id' }
    ]
  }, {
    page: 'initial-props',
    prettyUrl: ({lng}) => {
      switch(lng) {
        case 'fr': return '/fr/props-initiales';
        default: return '/en/initial-props';
      }
    },
    prettyPatterns: [
      { pattern: '/en/initial-props', defaultParams: { lng: 'en' } },
      { pattern: '/fr/props-initiales', defaultParams: { lng: 'fr' } }
    ]
  }
];

export default routes;
export const Router = new UrlPrettifier(routes);
