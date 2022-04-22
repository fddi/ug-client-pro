const { name } = require('./package');
module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.output = {
                ...webpackConfig.output,
                ...{
                    library: `${name}-[name]`,
                    libraryTarget: 'umd',
                    jsonpFunction: `webpackJsonp_${name}`,
                    globalObject: 'window'
                },
            }
            return webpackConfig;
        }
    },
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.headers = {
            'Access-Control-Allow-Origin': '*',
        };
        devServerConfig.historyApiFallback = true;
        devServerConfig.hot = false;
        devServerConfig.watchContentBase = false;
        devServerConfig.liveReload = false;
        return devServerConfig;
    }
};