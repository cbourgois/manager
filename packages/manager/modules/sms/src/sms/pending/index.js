import angular from 'angular';

import controller from './telecom-sms-sms-pending.controller';
import template from './telecom-sms-sms-pending.html';

const moduleName = 'ovhManagerSmsSmsPending';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.sms.pending', {
    url: '/pending',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsPendingCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
