import * as pbi from 'powerbi-client';
import PowerBiService from '../../services/powerbi';

export class Controller {
    component: pbi.Embed;
    options: pbi.IEmbedConfiguration;
    validationMap: any;
    private powerBiService: PowerBiService;
    private $scope: ng.IScope;
    
    static $inject = [
        '$scope',
        'PowerBiService'
    ]
    
    constructor($scope: ng.IScope, powerBiService: PowerBiService) {
        this.$scope = $scope;
        this.powerBiService = powerBiService;
        
        this.validationMap = {
            'report': this.validateReportOptions
        };
    }
    
    /**
     * Handler after component is inserted in the DOM. If required attributes are valid embed immediately
     * otherwise, watch attributes and embed when they are valid. 
     */
    init(element: HTMLElement) {
        if(this.validateOptions(this.options)) {
            this.embed(element, this.options);
        }

        this.$scope.$watch(() => this.options, (options, oldOptions) => {
            // Guard against initialization
            if(options === oldOptions) {
                return;
            }
            
            if(this.validateOptions(this.options)) {
                this.embed(element, this.options);
            }
            else if (this.component) {
                this.reset(element);
            }
        }, true);
    }
    
    /**
     * Given an HTMLElement, construct an embed configuration based on attributes and pass to service.
     */
    private embed(element: HTMLElement, options: pbi.IEmbedConfiguration) {
        this.component = this.powerBiService.embed(element, options);
    }
    
    /**
     * Handler when component is removed from DOM. Forwards call to service to perform cleanup of references before DOM is modified.
     */
    reset(element: HTMLElement) {
        this.powerBiService.reset(element);
        this.component = null;
    }
    
    /**
     * Ensure required options (embedUrl and accessToken are valid before attempting to embed) 
     */
    private validateOptions(options: pbi.IEmbedConfiguration) {
        if (!this.options
            || !(typeof options.embedUrl === 'string' && options.embedUrl.length > 0)
            || !(typeof options.accessToken === 'string' && options.accessToken.length > 0)
        ) {
            return false;
        }
        
        if(this.validationMap.hasOwnProperty(options.type) && typeof this.validationMap[options.type] === "function") {
            return this.validationMap[options.type](options);
        }
        else {
            return false;
        }
    }
    
    private validateReportOptions(options: pbi.IEmbedConfiguration) {
        return true;
    }
}

export default class Directive {
    // static name = "powerbiComponent";
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
    
    link($scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: any, controller: Controller, transcludeFn: any) {
        controller.init(element[0]);
        
        $scope.$on('$destroy', () => {
            controller.reset(element[0]);
        });
    }
}