import reportDirective from './components/ms-powerbi-report-directive/component';
import reportComponent from './components/ms-powerbi-report/component';
import service from './services/powerbi';

export {
    reportDirective,
    reportComponent,
    service
}

angular.module('powerbi.service', [])
    .service('PowerBiService' /* service.name */, service)
    ;

angular.module('powerbi.components.msPowerbiReportDirective', [
    'powerbi.service'
])
    // Attempt to use name from class, but there is error in Phantom
    // 'TypeError: Attempted to assign to readonly property.'
    .directive('msPowerbiReportDirective' /* reportDirective.name */, () => new reportDirective())
    ;

angular.module('powerbi.components.msPowerbiReport', [
    'powerbi.service'
])
    .component('msPowerbiReport' /* reportComponent.name */, reportComponent)
    ;

angular.module('powerbi.components', [
    'powerbi.components.msPowerbiReportDirective',
    'powerbi.components.msPowerbiReport'
]);

angular.module('powerbi', [
    'powerbi.service',
    'powerbi.components'
]);
