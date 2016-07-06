/*! angular-powerbi v1.0.0-beta.5 | (c) 2016 Microsoft Corporation MIT */
import * as pbi from 'powerbi-client';
export default class PowerBiService {
    private powerBiCoreService;
    static $inject: string[];
    constructor(PowerBi: typeof pbi.service.Service);
    embed(element: HTMLElement, config: pbi.IEmbedConfiguration): pbi.Embed;
    reset(element: HTMLElement): void;
}
