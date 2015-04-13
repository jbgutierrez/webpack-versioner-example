var path    = require('path'),
    webpack = require('webpack'),
    config  = require('webpack-versioner')(__dirname);

function contextFor(channel, externals) {
    return {
        context: path.join(__dirname, 'modules'),
        name: channel,
        entry: {
            router: './router'
        },
        output: {
            path: path.join(__dirname, 'builds'),
            filename: channel + "-v." + config.version + ".js",
            chunkFilename: path.join("chunks", channel + ".[chunkhash].chunk.js")
        },
        module: {
            loaders: [
                { test: /\.coffee$/, loader: 'coffee-loader' },
                { test: /\.json$/, loader: 'json-loader' }
            ]
        },
        resolve: {
            extensions: ["", ".coffee"],
            alias: config.alias
        },
        externals: externals,
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                children: true,
                minChunks: function(module, count){
                    return (count > 2 && module.size() < 128) ||
                            ~module._source._value.indexOf('promote: true');
                }
            }),
            new webpack.DefinePlugin({
                ENV: JSON.stringify(channel)
            })
        ]
    }
}

module.exports = [
    contextFor('mobile', {
        "jquery": "Zepto"
    }),
    contextFor('desktop', {
        "jquery": "jQuery"
    })
]
