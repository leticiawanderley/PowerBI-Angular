/// <reference path="../typings/browser/ambient/angular/index.d.ts" />

import {
    IEmbedOptions as PowerBiIEmbedConfig,
    Embed as PowerBiComponent,
} from 'powerbi-client';

export class Controller {
    accessToken: string;
    async: boolean;
    component: PowerBiComponent;
    embedUrl: string;
    filter: string;
    filterPaneEnabled: boolean;
    powerBiService: PowerBiService;
    $scope: ng.IScope;
    $timeout: ng.ITimeoutService;
    static $inject: string[];
    constructor($scope: ng.IScope, $timeout: ng.ITimeoutService, powerBiService: PowerBiService);
    init(element: HTMLElement): void;
    asyncEmbed(element: HTMLElement): void;
    embed(element: HTMLElement): void;
    remove(component: PowerBiComponent): void;
    private debounce(func, wait);
}

export class Directive {
    restrict: string;
    replace: boolean;
    templateUrl: string;
    scope: {
        accessToken: string;
        async: string;
        embedUrl: string;
        filter: string;
        filterPaneEnabled: string;
    };
    controller: typeof Controller;
    bindToController: boolean;
    controllerAs: string;
    link($scope: ng.IScope, element: HTMLElement, attributes: any, controller: Controller, transcludeFn: any): void;
}

export class PowerBiService {
    powerBiCoreService: PowerBiService;
    constructor();
    embed(element: HTMLElement, config: PowerBiIEmbedConfig): PowerBiComponent;
    remove(component: PowerBiComponent): void;
}
