/*! angular-powerbi v1.0.0-beta.4 | (c) 2016 Microsoft Corporation MIT */
import reportDirective from './components/powerbi-report/component';
import componentDirective from './components/powerbi-component/component';
import service from './services/powerbi';
import * as pbi from 'powerbi-client';
export declare const components: {
    report: typeof reportDirective;
    component: typeof componentDirective;
};
export { service };
declare global  {
    interface Window {
        ['powerbi-client']: {
            service: {
                Service: pbi.service.Service;
            };
        };
    }
}
