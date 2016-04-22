module.exports = function () {
    return {
        files: [
            {pattern: 'lib/glance-selector.js', instrument: false},
            {pattern: 'src/client.js', instrument: false},
            {pattern: 'test/specs/helpers/*.js', instrument: false},
            'src/**/*.js',
            'test/**/*.js',
            '!test/**/*-specs.js',
            'test/**/*.html'
        ],

        tests: [
            'test/**/*-specs.js'
        ],

        preprocessors: {
            '**/*.js': file => require('babel-core').transform(
                file.content,
                {sourceMap: true, presets: ['es2015']})
        },
        env: {
            type: 'node'
        },

        testFramework: "mocha",

        bootstrap: function () {
            require('./test/test-helper');
        },

        workers: {
            initial: 6,
            regular: 6
        }
    };
};