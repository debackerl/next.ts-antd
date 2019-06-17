/* eslint-disable */
const withLess = require('@zeit/next-less'); // https://github.com/zeit/next-plugins/tree/master/packages/next-less
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');

// .less file with settings overrides
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
);

module.exports = withLess({
  lessLoaderOptions: {
    // http://lesscss.org/usage/
    javascriptEnabled: true, // allow in-line JS code in .less files (deprecated since less 3.0)
    modifyVars: themeVariables, // insert settings overrides at the end of processed .less files
  },

  webpack: (config, { isServer }) => {
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
});
