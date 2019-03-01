import angular from 'angular';

import controller from './controller';

const moduleName = 'managerPci';

angular.module(moduleName, [])
  .controller('CloudProjectCtrl', controller);

export default moduleName
