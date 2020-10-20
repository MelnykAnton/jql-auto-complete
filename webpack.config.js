var path = require('path');
var webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	entry: __dirname + '/src/JQLAutocompleteInput.jsx',

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: 'jql-autocomplete-input'
	},

    plugins: [
        new BundleAnalyzerPlugin(),
        new webpack.optimize.UglifyJsPlugin( {
            minimize : true,
            sourceMap : false,
            mangle: true,
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        alias: {
            'react': path.resolve(__dirname, './node_modules/react') ,
            'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
            'styled-components': path.resolve(__dirname, './node_modules/styled-components'),
            'prop-types': path.resolve(__dirname, './node_modules/prop-types'),
        }
    },

	module: {
		rules : [
            {
                test: /\.(js|jsx)$/,
                use: ["babel-loader"],
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
            }
		],
    },
    externals: {
        react: {
            commonjs: "react",
            commonjs2: "react",
            amd: "React",
            root: "React"
        },
        "react-dom": {
            commonjs: "react-dom",
            commonjs2: "react-dom",
            amd: "ReactDOM",
            root: "ReactDOM"
        },
        "styled-components": {
            commonjs: "styled-components",
            commonjs2: "styled-components",
            amd: "styled-components",
            root: "styled-components"
        },
        "prop-types": {
            commonjs: "prop-types",
            commonjs2: "prop-types",
            amd: "prop-types",
            root: "prop-types"
        },
    }
};
