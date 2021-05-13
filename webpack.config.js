// const path = require('path');
//
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
// const webpack = require('webpack')
//
// // const nodeModulesLoader = environment.loaders.get('nodeModules');
// //
// // if (!Array.isArray(nodeModulesLoader.exclude)) {
// //     nodeModulesLoader.exclude =
// //         nodeModulesLoader.exclude == null ? [] : [nodeModulesLoader.exclude];
// // }
// // nodeModulesLoader.exclude.push(/@ckeditor\/ckeditor5-custom-build/);
//
// module.exports = {
//     mode: 'development',
//
//     entry: path.resolve(__dirname, './src/index.js'),
//     resolve: {
//         extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
//     },
//
//     output: {
//         path: path.resolve(__dirname, 'build'),
//         filename: 'bundle.js',
//         publicPath: '/',
//     },
//     devServer: {
//         contentBase: path.resolve(__dirname, 'build'),
//         compress: false,
//         port: 9000,
//         historyApiFallback: true,
//     },
//
//     plugins: [
//         new CKEditorWebpackPlugin( {
//             // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
//             // language: 'ru'
//         } ),
//         new webpack.HotModuleReplacementPlugin(),
//     ],
//
//
//     module: {
//         rules: [
//             {
//                 test: /\.ts(x?)$/,
//                 exclude: /node_modules/,
//                 use: [
//                     {
//                         loader: "ts-loader"
//                     }
//                 ]
//             },
//             {
//                 test: /\.(js|jsx)$/,
//                 exclude: /node_modules/,
//                 use: ['babel-loader'],
//             },
//             {
//                 test: /\.css$/i,
//                 use: ["style-loader", "css-loader"],
//             },
//             {
//                 test: /\.(png|jpe?g|gif)$/i,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                     },
//                 ],
//             },
//             {
//                 test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
//                 use: [ 'raw-loader' ]
//             },
//             {
//                 test: /\.(graphql|gql)$/,
//                 exclude: /node_modules/,
//                 loader: 'graphql-tag/loader',
//             },
//             {
//                 test: /\.m?js$/,
//                 exclude: /(node_modules|bower_components)/,
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         presets: ['@babel/preset-env']
//                     }
//                 }
//             },
//             {
//                 test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
//                 use: [
//                     {
//                         loader: 'style-loader',
//                         options: {
//                             injectType: 'singletonStyleTag',
//                             attributes: {
//                                 'data-cke': true
//                             }
//                         }
//                     },
//                     {
//                         loader: 'postcss-loader',
//                         options: styles.getPostCssConfig( {
//                             themeImporter: {
//                                 themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
//                             },
//                             minify: true
//                         } )
//                     },
//                 ]
//             }
//         ]
//     }
//
//     // module: {
//     //     rules: [
//     //         {
//     //             test: /\.m?js$/,
//     //             exclude: /node_modules/,
//     //             use: {
//     //                 loader: "babel-loader",
//     //                 options: {
//     //                     presets: ['@babel/preset-env']
//     //                 }
//     //             }
//     //         }
//     //     ]
//     // }
//
// };
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {

    entry: {
        main: './src/index.js'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        // libraryTarget: 'umd',
        // libraryExport: 'default'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                            attributes: {
                                'data-cke': true
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig( {
                            themeImporter: {
                                themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                            },
                            minify: true
                        } )
                    },
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{from: './src/lib/legacyLib.js'}]),
        new CKEditorWebpackPlugin( {
            // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
            // language: 'ru'
        } ),
    ]
};