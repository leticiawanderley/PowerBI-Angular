// TODO: Find way to remove this. The declaration file should be able to specify that inclusion of this library enables access to the global variable. 
declare global {
    interface Window {
        Powerbi: typeof pbi.PowerBi;
    }
}

import * as pbi from 'powerbi-client';

export default class PowerBiService {
    // static name = "PowerBiService";
    private powerBiCoreService: pbi.PowerBi;
    
    constructor() {
        this.powerBiCoreService = new window.Powerbi();
    }
    
    embed(element: HTMLElement, config: pbi.IPowerBiConfiguration): pbi.Embed {
        return this.powerBiCoreService.embed(<pbi.IPowerBiElement>element, config);
    }
    
    remove(component: pbi.Embed): void {
        this.powerBiCoreService.remove(component);
    }
}