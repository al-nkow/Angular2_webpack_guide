// Обычно конфигурация разделяется для development, production, и test
// Но у этих файлов есть общая часть - выделим ее в этот файл

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/main.ts'
    },

    // как определять файлы когда у них отсутствуют расширения
    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
                // loaders: [{
                //     loader: 'awesome-typescript-loader', // typescript в es5
                //     options: { configFileName: helpers.root('src', 'tsconfig.json') }
                // } , 'angular2-template-loader'] // загружает темплейты и стили у компонентов
            },
            {
                test: /\.html$/,
                loader: 'html-loader' // для шаблонов компонентов
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
                // собирает в бандл картинки и шрифты
            },
            {
                test: /\.css$/, // styleUrl в компонентах
                // здесь исключены все файлы стилей в компонентах!
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw-loader' // берет css и загружает его как строку
                // (возвращает из импорта строкой)
            }
        ]
    },

    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        ),

        // Where Webpack finds that app has shared dependencies with vendor,
        // it removes them from app. - то есть удаляет повторяющийся код
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        // вебпак сам подключит в index.html все сгенерированные js и css файлы
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};
