describe('Integration | Component | ms-powerbi-report: ', function() {

    beforeEach(function() {
        module("templates");
        module("powerbi");
    });

    var $compile;
    var $rootScope;
    var $scope;

    beforeEach(inject(function(_$compile_, _$rootScope_, PowerBiService) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        
        $scope = $rootScope.$new();
        $scope.testData = {
            accessToken: "fakeToken",
            embedUrl: "fakeEmbedUrl"
        };
    }));

    it('calls the internal powerBiService.embed which injects iframe into element', function() {
        // Arrange
        
        // Act 
        angularElement = $compile('<ms-powerbi-report-directive access-token="testData.accessToken" embed-url="testData.embedUrl" async="true"></ms-powerbi-report-directive>')($scope);
        $scope.$digest();

        // Assert
        expect($(angularElement).find('iframe').length).toBe(1);
    });
});