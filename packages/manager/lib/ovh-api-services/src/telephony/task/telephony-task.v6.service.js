angular.module("ovh-api-services").service("OvhApiTelephonyTaskV6", function ($resource) {
    "use strict";

    return $resource("/telephony/:billingAccount/task/:taskId", {
        billingAccount: "@billingAccount",
        taskId: "@taskId"
    }, {
        query: {
            method: "GET",
            isArray: true
        },
        get: {
            method: "GET",
            isArray: false
        }
    });
});
