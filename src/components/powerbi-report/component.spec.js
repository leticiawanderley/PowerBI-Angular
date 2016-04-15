describe('Unit | Component | powerbi-report: ', function() {

    beforeEach(function() {
        module("powerbi.components.powerbiReport");
        module(function($provide) {
            // TODO: Look at using $provide.factory to allow creation of spy objects instead.
            $provide.service('PowerBiService', function() {
                this.embed = jasmine.createSpy("PowerBiService.embed");
                this.remove = jasmine.createSpy("PowerBiService.remove");
            });
        });
    });

    var $compile;
    var $rootScope;
    var $timeout;
    var $scope;
    var powerBiServiceMock;

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, PowerBiService) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        powerBiServiceMock =PowerBiService;
        
        $scope = $rootScope.$new();
        $scope.testData = {
            accessToken: "fakeToken",
            embedUrl: "fakeEmbedUrl"
        };
    }));

    it('renders', function() {
        // Arrange

        // Act 
        angularElement = $compile('<powerbi-report access-token="testData.accessToken" embed-url="testData.embedUrl"></powerbi-report>')($scope);
        $scope.$digest();

        // Assert
        expect($(angularElement).length).toEqual(1);
    });

    it('calls the internal powerBiService.embed when component is constructed', function() {
        // Arrange
        var expectedConfig = {
            type: 'report',
            embedUrl: $scope.testData.embedUrl,
            accessToken: $scope.testData.accessToken,
            filterPaneEnabled: undefined,
            overwrite: true
        };
        
        // Act 
        angularElement = $compile('<powerbi-report access-token="testData.accessToken" embed-url="testData.embedUrl"></powerbi-report>')($scope);
        $scope.$digest();

        // Assert
        expect(powerBiServiceMock.embed).toHaveBeenCalledWith(angularElement[0], expectedConfig);
    });
    
    it('defers calling internal powerBiService.embed if attribute async="true" is set until other required attributes are set such as embed-url and access-token', function () {
        // Arrange
        $scope.testData.accessToken = null;
        $scope.testData.embedUrl = null;
        
        // Act (render component but set attributes to invalid state)
        angularElement = $compile('<powerbi-report access-token="testData.accessToken" embed-url="testData.embedUrl" async="true"></powerbi-report>')($scope);
        $scope.$digest();

        // Assert
        expect(powerBiServiceMock.embed).not.toHaveBeenCalled();
        
        // Act (Set attributes to valid state)
        $scope.testData.accessToken = "fakeAccessToken1";
        $scope.testData.embedUrl = "fakeEmbedUrl1";
        $scope.$digest();
        $timeout.flush();
        
        // Assert
        expect(powerBiServiceMock.embed).toHaveBeenCalled();
    });
    
    it('calls the internal powerBiService.remove when components is removed from DOM ($scope is destroyed)', function () {
        // Arrange
        $scope.isReportVisible = true;
        
        // Act 
        angularElement = $compile('<div ng-if="isReportVisible"><powerbi-report access-token="testData.accessToken" embed-url="testData.embedUrl"></powerbi-report></div>')($scope);
        $scope.$digest();
        
        $scope.isReportVisible = false;
        $scope.$digest();
        
        // Assert
        expect(powerBiServiceMock.remove).toHaveBeenCalled();
    });
});