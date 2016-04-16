import * as pbi from 'powerbi-client';
import PowerBiService from '../../services/powerbi';

export class Controller {
    accessToken: string;
    component: pbi.Embed;
    embedUrl: string;
    options: pbi.IEmbedOptions;
    private powerBiService: PowerBiService;
    private $scope: ng.IScope;
    private $timeout: ng.ITimeoutService;
    
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
    
    /**
     * Handler after component is inserted in the DOM. If required attributes are valid embed immediately
     * otherwise, watch attributes and embed when they are valid. 
     */
    init(element: HTMLElement) {
        if(this.validateRequiredAttributes()) {
            this.embed(element);
        }
        
        // TODO: Look for another way to ensure both attributes have changed before calling this.embed.
        // In most cases embedUrl and accessToken will be updated at the same time, but this takes two cycles
        // for the changes to propegate from the parent $scope to this $scope.
        // perhaps we can just use $timeout() directly. 
        const debouncedEmbed = this.debounce(this.embed.bind(this), 100);
        
        this.$scope.$watch(() => this.embedUrl, (embedUrl, oldEmbedUrl) => {
            // Guard against initialization
            if(embedUrl === oldEmbedUrl) {
                return;
            }
            
            if(this.validateRequiredAttributes()) {
                debouncedEmbed(element);
            }
        });
        
        this.$scope.$watch(() => this.accessToken, (accessToken, oldAccessToken) => {
            // Guard against initialization
            if(accessToken === oldAccessToken) {
                return;
            }
            
            if(this.validateRequiredAttributes()) {
                debouncedEmbed(element);
            }
        });
    }
    
    /**
     * Given an HTMLElement, construct an embed configuration based on attributes and pass to service.
     */
    private embed(element: HTMLElement) {
        const config: pbi.IEmbedOptions = {
            type: 'report',
            embedUrl: this.embedUrl,
            accessToken: this.accessToken
        };
        
        angular.extend(config, this.options);
        
        this.component = this.powerBiService.embed(element, config);
    }
    
    /**
     * Handler when component is removed from DOM. Forwards call to service to perform cleanup of references before DOM is modified.
     */
    remove(component: pbi.Embed) {
        this.powerBiService.remove(this.component);
    }
    
    private debounce(func: Function, wait: number): Function {
        let previousTimeoutPromise;
        
        return (...args) => {
            if(previousTimeoutPromise) {
                this.$timeout.cancel(previousTimeoutPromise);
            }
            
            previousTimeoutPromise = this.$timeout(() => func(...args), wait);
        }
    }
    
    /**
     * Ensure required attributes (embedUrl and accessToken are valid before attempting to embed) 
     */
    private validateRequiredAttributes() {
        return (typeof this.embedUrl === 'string' && this.embedUrl.length > 0)
            && (typeof this.accessToken === 'string' && this.accessToken.length > 0);
    }
}

export default class Directive {
    // static name = "powerbiReport";
    restrict = "E";
    replace = true;
    template = '<div class="powerbi-frame"></div>';
    scope = {
        accessToken: "=",
        embedUrl: "=",
        options: "=?"
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