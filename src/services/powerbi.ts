import * as pbi from 'powerbi-client';

export default class PowerBiService {
    // static name = "PowerBiService";
    private powerBiCoreService: pbi.PowerBi;
    
    static $inject = [
        'PowerBiGlobal'
    ];
    
    constructor(PowerBi: typeof pbi.PowerBi) {
        this.powerBiCoreService = new PowerBi();
    }
    
    embed(element: HTMLElement, config: pbi.IPowerBiConfiguration): pbi.Embed {
        return this.powerBiCoreService.embed(<pbi.IPowerBiElement>element, config);
    }
    
    reset(element: HTMLElement): void {
        this.powerBiCoreService.reset(element);
    }
}