
/*global require*/
'use strict';

require.config({
    shim: {
        bootstrap: {
            deps: [
                'jquery'
            ]
        }
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        requirejs: '../bower_components/requirejs/require',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        modernizr: '../bower_components/modernizr/modernizr'
    },
    packages: [

    ]
});

require([
    'backbone',
    'views/app',
    'routes/app',
    'bootstrap'
], function (Backbone, AppView, Workspace) {
    new AppView();
    if(history && history.pushState) {
        Backbone.history.start({pushState: true, root: "/"});
    }
    //Backbone.history.start({pushstate});
    new Workspace();
});
