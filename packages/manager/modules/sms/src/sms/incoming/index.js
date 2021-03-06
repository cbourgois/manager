import angular from 'angular';

import controller from './telecom-sms-sms-incoming.controller';
import template from './telecom-sms-sms-incoming.html';

const moduleName = 'ovhManagerSmsSmsIncoming';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.sms.incoming', {
    url: '/incoming',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsIncomingCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
