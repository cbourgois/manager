angular.module("ovh-api-services").service("OvhApiTelephonyEasyHuntingV6", function ($resource, $cacheFactory) {
    "use strict";

    var cache = $cacheFactory("OvhApiTelephonyEasyHuntingV6");
    var queryCache = $cacheFactory("OvhApiTelephonyEasyHuntingV6Query");

    var interceptor = {
        response: function (response) {
            cache.remove(response.config.url);
            queryCache.removeAll();
            return response.resource;
        }
    };

    var res = $resource("/telephony/:billingAccount/easyHunting/:serviceName", {
        billingAccount: "@billingAccount",
        serviceName: "@serviceName"
    }, {
        query: {
            method: "GET",
            isArray: true,
            cache: cache
        },
        get: {
            method: "GET",
            cache: queryCache
        },
        change: {
            method: "PUT",
            interceptor: interceptor
        },
        soundUpload: {
            method: "POST",
            url: "/telephony/:billingAccount/easyHunting/:serviceName/soundUpload"
        }
    });

    res.resetCache = function () {
        cache.removeAll();
    };

    res.resetQueryCache = function () {
        queryCache.removeAll();
    };

    res.resetAllCache = function () {
        this.resetCache();
        this.resetQueryCache();
    };

    return res;
});
