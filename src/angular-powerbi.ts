import { reportDirective, service }  from './module';

angular.module('powerbi.service', [])
    .service('PowerBiService' /* service.name */, service)
    ;

angular.module('powerbi.components.msPowerbiReport', [
        'powerbi.service'
])
    .directive('msPowerbiReportDirective' /* reportDirective.name */, () => new reportDirective())
    ;

angular.module('powerbi.components', [
    'powerbi.components.msPowerbiReport'
]);

angular.module('powerbi', [
    'powerbi.service',
    'powerbi.components'
]);
