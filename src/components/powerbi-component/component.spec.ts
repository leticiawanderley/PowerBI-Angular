import PowerBiService from '../../services/powerbi';

describe('Unit | Component | powerbi-component: ', function() {

    beforeEach(function() {
        angular.mock.module("powerbi.components.powerbiComponent");
        angular.mock.module(function($provide) {
            // TODO: Look at using $provide.factory to allow creation of spy objects instead.
            $provide.service('PowerBiService', function() {
                this.embed = jasmine.createSpy("PowerBiService.embed");
                this.reset = jasmine.createSpy("PowerBiService.reset");
            });
        });
    });

    let $compile: ng.ICompileService;
    let $rootScope: ng.IRootScopeService;
    let $timeout: ng.ITimeoutService;
    let $scope;
    let angularElement: ng.IAugmentedJQuery;
    let powerBiServiceMock: PowerBiService;

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, PowerBiService: PowerBiService) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        powerBiServiceMock =PowerBiService;
        
        $scope = $rootScope.$new();
        $scope.testData = {
            type: "report",
            accessToken: "fakeToken",
            embedUrl: "fakeEmbedUrl"
        };
    }));

    it('renders', function() {
        // Arrange

        // Act 
        angularElement = $compile('<powerbi-component options="testData"></powerbi-component>')($scope);
        $scope.$digest();

        // Assert
        expect($(angularElement).length).toEqual(1);
    });

    it('calls the internal powerBiService.embed when component is constructed', function() {
        // Arrange
        const expectedConfig = {
            type: 'report',
            embedUrl: $scope.testData.embedUrl,
            accessToken: $scope.testData.accessToken
        };
        
        // Act 
        angularElement = $compile('<powerbi-component options="testData"></powerbi-component>')($scope);
        $scope.$digest();

        // Assert
        expect(powerBiServiceMock.embed).toHaveBeenCalledWith(angularElement[0], expectedConfig);
    });
    
    it('defers calling internal powerBiService.embed until other required attributes are set such as embed-url and access-token', function () {
        // Arrange
        $scope.testData.type = null;
        
        // Act (render component but set attributes to invalid state)
        angularElement = $compile('<powerbi-component options="testData"></powerbi-component>')($scope);
        $scope.$digest();

        // Assert
        expect(powerBiServiceMock.embed).not.toHaveBeenCalled();
        
        // Act (Set attributes to valid state)
        $scope.testData.type = "report";
        $scope.$digest();
        
        // Assert
        expect(powerBiServiceMock.embed).toHaveBeenCalled();
    });
    
    it('calls the internal powerBiService.reset before component is removed from DOM ($scope is destroyed)', function () {
        // Arrange
        $scope.isReportVisible = true;
        
        // Act 
        angularElement = $compile('<div ng-if="isReportVisible"><powerbi-component options="testData"></powerbi-component></div>')($scope);
        $scope.$digest();
        
        $scope.isReportVisible = false;
        $scope.$digest();
        
        // Assert
        expect(powerBiServiceMock.reset).toHaveBeenCalled();
    });
});