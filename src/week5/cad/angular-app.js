(function() {
    var app = angular.module('cadApp', []);

    app.controller('TabsController', function() {
        this.tab = 1;

        this.setTab = function(newValue) {
            this.tab = newValue;
        };

        this.isSet = function(tabNum) {
            return this.tab === tabNum;
        };
    });
})();