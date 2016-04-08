//import PowerBiService from './powerbi';

describe('Unit | Services | PowerBiService: ', function () {
    beforeEach(function () {
        module("powerbi.service");
    });

    // TODO: Convert tests to typescript
    // For some reason jasmine typing information isn't being recognized,
    // when this is renamed to .ts it says 'describe', 'beforeEach', etc are not defined
    //let powerBiService: PowerBiService;
    var powerBiService;

    beforeEach(inject(function (PowerBiService) {
        powerBiService = PowerBiService;
    }));
    
    it('service is defined', function () {
        expect(powerBiService).toBeDefined();
    });
});