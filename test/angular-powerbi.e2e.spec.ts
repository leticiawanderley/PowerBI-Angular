describe('Integration | Component | powerbi-report: ', function () {

  beforeEach(function () {
    angular.mock.module("powerbi");
  });

  let $compile: ng.ICompileService;
  let $rootScope: ng.IRootScopeService;
  let $scope: any;
  let angularElement: ng.IAugmentedJQuery;

  /* tslint:disable-next-line:variable-name */
  beforeEach(inject(function (_$compile_: ng.ICompileService, _$rootScope_: ng.IRootScopeService) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    $scope = $rootScope.$new();
    $scope.testData = {
      accessToken: "fakeToken",
      embedUrl: "fakeEmbedUrl",
      id: "fakeReportId"
    };
  }));

  it('calls the internal powerBiService.embed which injects iframe into element', function () {
    // Arrange

    // Act 
    angularElement = $compile('<powerbi-report access-token="testData.accessToken" embed-url="testData.embedUrl" report-id="testData.id"></powerbi-report>')($scope);
    $scope.$digest();

    // Assert
    expect($(angularElement).find('iframe').length).toBe(1);
  });
});
