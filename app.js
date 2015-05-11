requirejs.config({
    waitSeconds : 120,
    baseUrl: 'lib',
    paths: {
        app: '../app',
        async : '../lib/async'
    }
});

// Start loading the main app file.
requirejs(['app/main']);