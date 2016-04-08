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
	var module_1 = __webpack_require__(1);
	angular.module('powerbi.service', [])
	    .service('PowerBiService' /* service.name */, module_1.service);
	angular.module('powerbi.components.msPowerbiReport', [
	    'powerbi.service'
	])
	    .directive('msPowerbiReportDirective' /* reportDirective.name */, function () { return new module_1.reportDirective(); });
	angular.module('powerbi.components', [
	    'powerbi.components.msPowerbiReport'
	]);
	angular.module('powerbi', [
	    'powerbi.service',
	    'powerbi.components'
	]);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var component_1 = __webpack_require__(2);
	exports.reportDirective = component_1.default;
	var powerbi_1 = __webpack_require__(3);
	exports.service = powerbi_1.default;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var Controller = (function () {
	    function Controller($scope, $timeout, powerBiService) {
	        this.$scope = $scope;
	        this.$timeout = $timeout;
	        this.powerBiService = powerBiService;
	    }
	    Controller.prototype.init = function (element) {
	        if (this.async) {
	            this.asyncEmbed(element);
	        }
	        else {
	            this.embed(element);
	        }
	    };
	    Controller.prototype.asyncEmbed = function (element) {
	        var _this = this;
	        var debouncedEmbed = this.debounce(this.embed.bind(this), 500);
	        if (this.embedUrl || this.accessToken) {
	            this.embed(element);
	        }
	        else {
	            this.$scope.$watch(function () { return _this.embedUrl; }, function (embedUrl, oldEmbedUrl) {
	                // Guard against initialization
	                if (embedUrl === oldEmbedUrl) {
	                    return;
	                }
	                if (embedUrl && embedUrl.length > 0) {
	                    debouncedEmbed(element);
	                }
	            });
	            this.$scope.$watch(function () { return _this.accessToken; }, function (accessToken, oldAccessToken) {
	                // Guard against initialization
	                if (accessToken === oldAccessToken) {
	                    return;
	                }
	                if (accessToken && accessToken.length > 0) {
	                    debouncedEmbed(element);
	                }
	            });
	        }
	    };
	    Controller.prototype.embed = function (element) {
	        // TODO: Take from powerbi-config first, then from specific attributes for backwards compatibility
	        var config = {
	            type: 'powerbi-report',
	            embedUrl: this.embedUrl,
	            accessToken: this.accessToken,
	            filterPaneEnabled: this.filterPaneEnabled
	        };
	        this.component = this.powerBiService.embed(element, config);
	    };
	    Controller.prototype.remove = function (component) {
	        this.powerBiService.remove(this.component);
	    };
	    // TODO: Look for alternative ways to prevent multiple attribute changes to cause multiple embeds for the same report
	    // By design the embedUrl and accessToken would always change at the same time, so this would always happen.
	    // Can't use simple isEmbedded flag becuase we want to re-use element and changing state of this is complicated
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
	        // static name = "msPowerbiReportDirective";
	        this.restrict = "E";
	        this.replace = true;
	        this.templateUrl = "/src/components/ms-powerbi-report/template.html";
	        this.scope = {
	            accessToken: "=",
	            async: "=?",
	            embedUrl: "=",
	            filter: "=?",
	            filterPaneEnabled: "=?"
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
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var PowerBiService = (function () {
	    function PowerBiService() {
	        this.powerBiCoreService = new window.Powerbi();
	    }
	    PowerBiService.prototype.embed = function (element, config) {
	        return this.powerBiCoreService.embed(element, config);
	    };
	    PowerBiService.prototype.remove = function (component) {
	        this.powerBiCoreService.remove(component);
	    };
	    return PowerBiService;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = PowerBiService;


/***/ }
/******/ ]);
//# sourceMappingURL=angular-powerbi.js.map