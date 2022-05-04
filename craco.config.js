const CracoLessPlugin = require('craco-less');
const themes = require('./theme');
const { getThemeVariables } = require('antd/dist/theme');
module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        dark: true,
                        compact: true,
                        modifyVars: {
                            ...getThemeVariables({
                                compact: true, // 开启紧凑模式
                                dark: false,
                            }),
                            ...themes
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};