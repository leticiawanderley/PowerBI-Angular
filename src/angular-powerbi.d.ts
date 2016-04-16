/// <reference path="../typings/browser/ambient/angular/index.d.ts" />

import * as pbi from 'powerbi-client';

export class Controller {
    accessToken: string;
    component: pbi.Embed;
    embedUrl: string;
    options: pbi.IEmbedOptions;
    private powerBiService: PowerBiService;
    private $scope: ng.IScope;
    private $timeout: ng.ITimeoutService;
    static $inject: string[];
    constructor($scope: ng.IScope, $timeout: ng.ITimeoutService, powerBiService: PowerBiService);
    init(element: HTMLElement): void;
    private embed(element: HTMLElement): void;
    remove(component: pbi.Embed): void;
    private debounce(func, wait);
}

export class PowerBiService {
    powerBiCoreService: PowerBiService;
    constructor();
    embed(element: HTMLElement, config: pbi.IPowerBiConfiguration): pbi.Embed;
    remove(component: pbi.Embed): void;
}
