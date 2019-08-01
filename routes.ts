import { RouteType, default as UrlPrettifier } from 'next-url-prettifier';

const routes: RouteType<string>[] = [
  {
    page: 'index',
    prettyUrl: '/home'
  }, {
    page: 'detail',
    // `prettyUrl` is used on client side to construct the URL of your link
    prettyUrl: ({id}) => (`/details/${id}`),
    // `prettyPatterns` is used on server side to find which component/page to display
    prettyPatterns: [
      { pattern: '/details/:id' }
    ]
  }
];

export default routes;
export var Router = new UrlPrettifier(routes);
