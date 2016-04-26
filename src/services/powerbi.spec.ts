import * as pbi from 'powerbi-client';
import PowerBiService from './powerbi';

describe('Unit | Services | PowerBiService: ', function () {
    let returnValue = {};
    let embedSpy = jasmine.createSpy("PowerBiService.embed").and.returnValue(returnValue);
    let resetSpy = jasmine.createSpy("PowerBiService.reset");
    let powerBiService: PowerBiService;

    beforeEach(function () {
        angular.mock.module("powerbi.service");
        angular.mock.module(function($provide) {
            $provide.value('PowerBiGlobal', function() {
                this.embed = embedSpy;
                this.reset = resetSpy;
            });
        });
    });
    beforeEach(inject(function (PowerBiService) {
        powerBiService = PowerBiService;
    }));
    
    it('service is defined', function () {
        expect(powerBiService).toBeDefined();
    });
    
    it('calls to .embed call the core service .embed and return the result', function () {
        // Arrange
        const testData = {
            element: {},
            config: {}
        };
        
        // Act
        const actualReturn = powerBiService.embed(<HTMLElement>testData.element, testData.config);
        
        // Assert
        expect(embedSpy).toHaveBeenCalledWith(testData.element, testData.config);
        expect(actualReturn).toEqual(returnValue);
    });
    
    it('calls to .reset call the core service .reset', function () {
        // Arrange
        const testData = {
            element: {}
        };
        
        // Act
        powerBiService.reset(<HTMLElement>testData.element);
        
        // Assert
        expect(resetSpy).toHaveBeenCalledWith(testData.element);
    });
});