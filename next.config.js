/* eslint-disable */
const withLess = require('@zeit/next-less'); // https://github.com/zeit/next-plugins/tree/master/packages/next-less
const withMdxEnhanced = require('next-mdx-enhanced');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const remarkSlug = require('remark-slug');
const remarkAlign = require('remark-align');
const remarkGemojiToEmoji = require('remark-gemoji-to-emoji');
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  // When enabled two HTML files (client.html and server.html) will be outputted to <distDir>/analyze/. One will be for the server bundle, one for the browser bundle.
});

// .less file with settings overrides
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
);

const withMdx = withMdxEnhanced({
  layoutPath: 'layouts',
  defaultLayout: true,
  remarkPlugins: [remarkSlug, remarkAlign, remarkGemojiToEmoji]
});

module.exports = withBundleAnalyzer(withMdx(withLess({
  pageExtensions: ['mdx', 'tsx', 'jsx', 'ts', 'js'],

  lessLoaderOptions: {
    // http://lesscss.org/usage/
    javascriptEnabled: true, // allow in-line JS code in .less files (deprecated since less 3.0)
    modifyVars: themeVariables, // insert settings overrides at the end of processed .less files
  },

  webpack: (config, { isServer }) => {
    // https://webpack.js.org/plugins/ignore-plugin/
    // https://gist.github.com/stramel/bfcf2c8d2572f92a344bfc6247a51f08
    config.plugins.push(new webpack.IgnorePlugin(/(?:\/tests|__mocks)/));;

    // https://webpack.js.org/plugins/context-replacement-plugin/
    // https://github.com/moment/moment/issues/2416
    config.plugins.push(new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|nl|fr/));

    // https://www.npmjs.com/package/duplicate-package-checker-webpack-plugin
    config.plugins.push(new DuplicatePackageCheckerPlugin({ strict: true }));

    // https://github.com/zeit/next.js/issues/4101
    config.resolve.alias['@ant-design/icons/lib/dist$'] = path.join(__dirname, 'assets/icons.ts');

    if(isServer) {
      const antStyles = /antd\/.*?\/style.*?/;

      const origExternals = [...config.externals];

      config.externals = [
        (context, request, callback) => {
          // handling resource loading in 'dev' mode

          if(request.match(antStyles)) {
            // catches requests for resources like 'antd/lib/XXX/style'
            return callback();
          }

          if(typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ];

      config.module.rules.unshift({ // push first
        test: antStyles,
        use: 'null-loader',
      });
    }

    return config;
  },
})));
