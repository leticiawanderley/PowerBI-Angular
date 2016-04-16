import reportDirective from './components/powerbi-report/component';
import service from './services/powerbi';

export {
    reportDirective,
    service
}

angular.module('powerbi.global', [])
    .value('PowerBiGlobal', window.Powerbi)
    ;

angular.module('powerbi.service', [
    'powerbi.global'
])
    .service('PowerBiService' /* service.name */, service)
    ;

angular.module('powerbi.components.powerbiReport', [
    'powerbi.service'
])
    // Attempt to use name from class, but there is error in Phantom
    // 'TypeError: Attempted to assign to readonly property.'
    .directive('powerbiReport' /* reportDirective.name */, () => new reportDirective())
    ;

angular.module('powerbi.components', [
    'powerbi.components.powerbiReport'
]);

angular.module('powerbi', [
    'powerbi.service',
    'powerbi.components'
]);
