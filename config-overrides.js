// const CopyWebpackPlugin = require('copy-webpack-plugin');
//
// module.exports = function override(config, env) {
//     if (!config.plugins) {
//         config.plugins = [];
//     }
//
//     config.plugins.push(
//         (process.env.NODE_ENV === 'production') ?
//             new CopyWebpackPlugin([{from: 'src/lib/legacyLib.js'}]) :
//             new CopyWebpackPlugin([{from: 'src/lib/legacyLib.js', to: 'dist'}])
//     );
//
//     return config;
// }
module.exports = function override(config, env) {
    // New config, e.g. config.plugins.push...
    config.plugins.push('webpack.config.js')
    return config
}