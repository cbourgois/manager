angular.module("ovh-api-services").service("OvhApiOrderCartServiceOption", function ($injector) {

    "use strict";
    return {
        Microsoft: function () {
            return $injector.get("OvhApiOrderCartServiceOptionMicrosoft");
        },
        MicrosoftExchange: function () {
            return $injector.get("OvhApiOrderCartServiceOptionMicrosoftExchange");
        },
        v6: function () {
            return $injector.get("OvhApiOrderCartServiceOptionV6");
        }
    };
});
