import reportDirective from './components/powerbi-report/component';
import componentDirective from './components/powerbi-component/component';
import service from './services/powerbi';
import * as pbi from 'powerbi-client';

export const components = {
    report: reportDirective,
    component: componentDirective
}

export {
    service
}

declare global {
    interface Window {
        ['powerbi-client']: {
            service: {
                Service: pbi.service.Service
            }
        }
    }
}

angular.module('powerbi.global', [])
    .value('PowerBiGlobal', window['powerbi-client'].service.Service)
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
    
angular.module('powerbi.components.powerbiComponent', [
    'powerbi.service'
])
    .directive('powerbiComponent' /* componentDirective.name */, () => new componentDirective())
    ;

angular.module('powerbi.components', [
    'powerbi.components.powerbiReport',
    'powerbi.components.powerbiComponent'
]); 

angular.module('powerbi', [
    'powerbi.service',
    'powerbi.components'
]);
