/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
    var app = new EmberApp(defaults, {
        // Add options here
        fingerprint: {
            exclude: [
                'public/img/leaflet/layers-2x.png',
                'public/img/leaflet/layers.png',
                'public/img/leaflet/marker-icon-2x.png',
                'public/img/leaflet/marker-icon.png',
                'public/img/leaflet/marker-shadow.png'
            ]
        }
    });

    // Use `app.import` to add additional libraries to the generated
    // output files.
    //
    // If you need to use different assets in different
    // environments, specify an object as the first parameter. That
    // object's keys should be the environment name and the values
    // should be the asset to use in that environment.
    //
    // If the library that you are including contains AMD or ES6
    // modules that you would like to import into your application
    // please specify an object with the list of modules as keys
    // along with the exports of each module as its value.

    app.import('vendor/leaflet.new/leaflet-src.js');
    app.import('vendor/leaflet.new/leaflet.css');
    //app.import('vendor/proj4/proj4js-compressed.js');
    //app.import('vendor/proj4/proj4.js');
    //app.import('vendor/proj4leaflet/proj4leaflet.js');

    app.import('bower_components/moment/moment.js');

    return app.toTree();
};
