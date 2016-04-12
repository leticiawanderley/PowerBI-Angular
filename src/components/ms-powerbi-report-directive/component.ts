import * as pbi from 'powerbi-client';
import PowerBiService from '../../services/powerbi';

export class Controller {
    accessToken: string;
    async: boolean;
    component: pbi.Embed;
    embedUrl: string;
    filter: string;
    filterPaneEnabled: boolean;
    powerBiService: PowerBiService;
    $scope: ng.IScope;
    $timeout: ng.ITimeoutService;
    
    static $inject = [
        '$scope',
        '$timeout',
        'PowerBiService'
    ]
    
    constructor($scope: ng.IScope, $timeout: ng.ITimeoutService, powerBiService: PowerBiService) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.powerBiService = powerBiService;
    }
    
    init(element: HTMLElement) {
        if(this.async) {
            this.asyncEmbed(element);
        }
        else {
            this.embed(element);
        }
    }
    
    asyncEmbed(element: HTMLElement) {
        const debouncedEmbed = this.debounce(this.embed.bind(this), 500);
        
        if(this.embedUrl || this.accessToken) {
            this.embed(element);
        }
        else {
            this.$scope.$watch(() => this.embedUrl, (embedUrl, oldEmbedUrl) => {
                // Guard against initialization
                if(embedUrl === oldEmbedUrl) {
                    return;
                }
                
                if(embedUrl && embedUrl.length > 0) {
                    debouncedEmbed(element);
                }
            });
            
            this.$scope.$watch(() => this.accessToken, (accessToken, oldAccessToken) => {
                // Guard against initialization
                if(accessToken === oldAccessToken) {
                    return;
                }
                
                if(accessToken && accessToken.length > 0) {
                    debouncedEmbed(element);
                }
            });
        }
    }
    
    embed(element: HTMLElement) {
        // TODO: Take from powerbi-config first, then from specific attributes for backwards compatibility
        const config: pbi.IEmbedOptions = {
            type: 'report',
            embedUrl: this.embedUrl,
            accessToken: this.accessToken,
            filterPaneEnabled: this.filterPaneEnabled
        };
        
        this.component = this.powerBiService.embed(element, config);
    }
    
    remove(component: pbi.Embed) {
        this.powerBiService.remove(this.component);
    }
    
    // TODO: Look for alternative ways to prevent multiple attribute changes to cause multiple embeds for the same report
    // By design the embedUrl and accessToken would always change at the same time, so this would always happen.
    // Can't use simple isEmbedded flag becuase we want to re-use element and changing state of this is complicated
    
    private debounce(func: Function, wait: number): Function {
        let previousTimeoutPromise;
        
        return (...args) => {
            if(previousTimeoutPromise) {
                this.$timeout.cancel(previousTimeoutPromise);
            }
            
            previousTimeoutPromise = this.$timeout(() => func(...args), wait);
        }
    }
}

export default class Directive {
    // static name = "msPowerbiReportDirective";
    restrict = "E";
    replace = true;
    templateUrl = "/src/components/ms-powerbi-report-directive/template.html";
    scope = {
        accessToken: "=",
        async: "=?",
        embedUrl: "=",
        filter: "=?",
        filterPaneEnabled: "=?"
    };
    controller = Controller;
    bindToController = true;
    controllerAs = "vm";
    
    link($scope: ng.IScope, element: HTMLElement, attributes: any, controller: Controller, transcludeFn: any) {
        controller.init(element[0]);
        
        $scope.$on('$destroy', () => {
            controller.remove(controller.component);
        });
    }
}