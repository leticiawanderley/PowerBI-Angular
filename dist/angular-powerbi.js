/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var component_1 = __webpack_require__(1);
	exports.reportDirective = component_1.default;
	var powerbi_1 = __webpack_require__(2);
	exports.service = powerbi_1.default;
	angular.module('powerbi.global', [])
	    .value('PowerBiGlobal', window.Powerbi);
	angular.module('powerbi.service', [
	    'powerbi.global'
	])
	    .service('PowerBiService' /* service.name */, powerbi_1.default);
	angular.module('powerbi.components.powerbiReport', [
	    'powerbi.service'
	])
	    .directive('powerbiReport' /* reportDirective.name */, function () { return new component_1.default(); });
	angular.module('powerbi.components', [
	    'powerbi.components.powerbiReport'
	]);
	angular.module('powerbi', [
	    'powerbi.service',
	    'powerbi.components'
	]);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var Controller = (function () {
	    function Controller($scope, $timeout, powerBiService) {
	        this.$scope = $scope;
	        this.$timeout = $timeout;
	        this.powerBiService = powerBiService;
	    }
	    /**
	     * Handler after component is inserted in the DOM. If required attributes are valid embed immediately
	     * otherwise, watch attributes and embed when they are valid.
	     */
	    Controller.prototype.init = function (element) {
	        var _this = this;
	        if (this.validateRequiredAttributes()) {
	            this.embed(element);
	        }
	        // TODO: Look for another way to ensure both attributes have changed before calling this.embed.
	        // In most cases embedUrl and accessToken will be updated at the same time, but this takes two cycles
	        // for the changes to propegate from the parent $scope to this $scope.
	        // perhaps we can just use $timeout() directly. 
	        var debouncedEmbed = this.debounce(this.embed.bind(this), 100);
	        this.$scope.$watch(function () { return _this.embedUrl; }, function (embedUrl, oldEmbedUrl) {
	            // Guard against initialization
	            if (embedUrl === oldEmbedUrl) {
	                return;
	            }
	            if (_this.validateRequiredAttributes()) {
	                debouncedEmbed(element);
	            }
	        });
	        this.$scope.$watch(function () { return _this.accessToken; }, function (accessToken, oldAccessToken) {
	            // Guard against initialization
	            if (accessToken === oldAccessToken) {
	                return;
	            }
	            if (_this.validateRequiredAttributes()) {
	                debouncedEmbed(element);
	            }
	        });
	    };
	    /**
	     * Given an HTMLElement, construct an embed configuration based on attributes and pass to service.
	     */
	    Controller.prototype.embed = function (element) {
	        var config = {
	            type: 'report',
	            embedUrl: this.embedUrl,
	            accessToken: this.accessToken
	        };
	        angular.extend(config, this.options);
	        this.component = this.powerBiService.embed(element, config);
	    };
	    /**
	     * Handler when component is removed from DOM. Forwards call to service to perform cleanup of references before DOM is modified.
	     */
	    Controller.prototype.remove = function (component) {
	        this.powerBiService.remove(this.component);
	    };
	    Controller.prototype.debounce = function (func, wait) {
	        var _this = this;
	        var previousTimeoutPromise;
	        return function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i - 0] = arguments[_i];
	            }
	            if (previousTimeoutPromise) {
	                _this.$timeout.cancel(previousTimeoutPromise);
	            }
	            previousTimeoutPromise = _this.$timeout(function () { return func.apply(void 0, args); }, wait);
	        };
	    };
	    /**
	     * Ensure required attributes (embedUrl and accessToken are valid before attempting to embed)
	     */
	    Controller.prototype.validateRequiredAttributes = function () {
	        return (typeof this.embedUrl === 'string' && this.embedUrl.length > 0)
	            && (typeof this.accessToken === 'string' && this.accessToken.length > 0);
	    };
	    Controller.$inject = [
	        '$scope',
	        '$timeout',
	        'PowerBiService'
	    ];
	    return Controller;
	}());
	exports.Controller = Controller;
	var Directive = (function () {
	    function Directive() {
	        // static name = "powerbiReport";
	        this.restrict = "E";
	        this.replace = true;
	        this.template = '<div class="powerbi-frame"></div>';
	        this.scope = {
	            accessToken: "=",
	            embedUrl: "=",
	            options: "=?"
	        };
	        this.controller = Controller;
	        this.bindToController = true;
	        this.controllerAs = "vm";
	    }
	    Directive.prototype.link = function ($scope, element, attributes, controller, transcludeFn) {
	        controller.init(element[0]);
	        $scope.$on('$destroy', function () {
	            controller.remove(controller.component);
	        });
	    };
	    return Directive;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Directive;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var PowerBiService = (function () {
	    function PowerBiService(PowerBi) {
	        this.powerBiCoreService = new PowerBi();
	    }
	    PowerBiService.prototype.embed = function (element, config) {
	        return this.powerBiCoreService.embed(element, config);
	    };
	    PowerBiService.prototype.remove = function (component) {
	        this.powerBiCoreService.remove(component);
	    };
	    PowerBiService.$inject = [
	        'PowerBiGlobal'
	    ];
	    return PowerBiService;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = PowerBiService;


/***/ }
/******/ ]);
//# sourceMappingURL=angular-powerbi.js.map