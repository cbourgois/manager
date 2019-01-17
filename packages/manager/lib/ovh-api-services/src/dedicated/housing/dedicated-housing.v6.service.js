angular.module("ovh-api-services").service("OvhApiDedicatedHousingV6", function ($resource, $cacheFactory) {
    "use strict";

    var otherCache = $cacheFactory("OvhApiDedicatedHousingV6");
    var queryCache = $cacheFactory("OvhApiDedicatedHousingV6Query");

    var dedicatedHousingResource = $resource("/dedicated/housing/:serviceName", {
        serviceName: "@serviceName"
    }, {
        query: { method: "GET", cache: queryCache, isArray: true },
        getServiceInfos: {
            url: "/dedicated/housing/:serviceName/serviceInfos",
            method: "GET",
            cache: otherCache
        }
    });

    dedicatedHousingResource.resetAllCache = function () {
        dedicatedHousingResource.resetOtherCache();
        dedicatedHousingResource.resetQueryCache();
    };

    dedicatedHousingResource.resetOtherCache = function () {
        otherCache.removeAll();
    };

    dedicatedHousingResource.resetQueryCache = function () {
        queryCache.removeAll();
    };

    return dedicatedHousingResource;
});
