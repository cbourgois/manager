angular.module("ovh-api-services").service("OvhApiOrderDedicatedNashaNewV6", function ($resource, $cacheFactory) {
    "use strict";

    // Cache to invalidate
    var queryCache = $cacheFactory("OvhApiOrderDedicatedNashaNewV6Query");
    var cache = $cacheFactory("OvhApiOrderDedicatedNashaNewV6");
    var interceptor = {
        response: function (response) {
            queryCache.removeAll();
            return response.data;
        }
    };

    var resource = $resource("/order/dedicated/nasha/new/:duration", {
        duration: "@duration"
    }, {
        query: {
            method: "GET",
            isArray: true,
            cache: queryCache,
            params: {
                datacenter: "@datacenter",
                model: "@model"
            }
        },
        get: {
            method: "GET",
            cache: cache,
            isArray: false,
            params: {
                datacenter: "@datacenter",
                model: "@model"
            }
        },
        create: {
            method: "POST",
            interceptor: interceptor
        }

    });

    resource.resetCache = function () {
        cache.removeAll();
    };

    resource.resetQueryCache = function () {
        queryCache.removeAll();
    };

    return resource;
});
