# angular-powerbi
[![Build Status](https://img.shields.io/travis/Microsoft/PowerBI-Angular.svg?branch=dev)](https://travis-ci.org/Microsoft/PowerBI-Angular)
[![npm version](https://img.shields.io/npm/v/angular-powerbi.svg)](https://www.npmjs.com/package/angular-powerbi)
[![downloads total](https://img.shields.io/npm/dt/powerbi-angular.svg)](https://www.npmjs.com/package/angular-powerbi)
[![downloads monthly](https://img.shields.io/npm/dm/powerbi-angular.svg)](https://www.npmjs.com/package/angular-powerbi)
[![GitHub tag](https://img.shields.io/github/tag/Microsoft/PowerBI-Angular.svg)](https://github.com/Microsoft/powerbi-angular/tags)

Angular module which wraps PowerBI-JavaScript as service and adds a collection of components for each embedded type (Currently only Report is supported) which you can use to easily embed Power BI visuals within your Angular applications.

## Demo

http://azure-samples.github.io/powerbi-angular-client

Source: https://github.com/Azure-Samples/powerbi-angular-client

## Contents

`angular-powerbi.js` includes the following:

- Service: **PowerBiService**

	(Handles messaging communication between host frame/window and embedded powerbi visual iframes/windows)

- Web Components

	1. Report Specific Component
	
		```
		<powerbi-report embed-url="vm.report.embedUrl" access-token="vm.report.accessToken"></powerbi-report>
		```
		
	2. Generic Component
	
		```
		<powerbi-component options="vm.report"></powerbi-component>
		```
    
## Getting started

1. Install:

	```
	npm install -save angular-powerbi
	```

1. Include the `powerbi.js` and the `angular-powerbi.js` file within your app:

	Below we're using absolute urls to npmcdn but you could also use relative urls to local files in `node_modules` or bundle the two scripts with the rest of your vendor scripts.

	```
	<script src="https://npmcdn.com/powerbi-client@2.0.0"></script>
	<script src="https://npmcdn.com/angular-powerbi@1.0.0"></script>
	```

2. Include the 'powerbi' module as a dependency of your app:

	```
	app.module('app', [
	  'powerbi'
	]);
	```

3. Fetch embed data from the server (embedUrl and accessToken) and make it available on controller scope.

	This would likely require using a factory or service to fetch report data from your local server.	
	Example where the report is resolved when entering route:

	Route:	
	`return ReportsService.findById('5dac7a4a-4452-46b3-99f6-a25915e0fe55');`

	ReportsService:
	```
	findById(id: string): ng.IPromise<PowerBi.IReport> {
		return this.$http.get(`${this.baseUrl}/api/reports/${id}`)
			.then(response => response.data);
	}
	```

	If you need a sample server to test you can use the following:
	
	- Live example: https://powerbiembedapi.azurewebsites.net/
	- C# Sample Server: https://github.com/Azure-Samples/powerbi-dotnet-server-aspnet-web-api
	- Nodejs Sample Server: [https://github.com/Azure-Samples/powerbi-node-server-express](https://github.com/Azure-Samples/powerbi-node-server-express)

4. Insert the component in your template where you want to embed the visual:
	
	```
	<powerbi-report embed-url="vm.report.embedUrl" access-token="vm.report.accessToken" options="vm.reportOptions"></powerbi-report>
	```

5. Add filters:

    In order to add filters to the directive you need to make them available to thee directive's scope by sending them through ```options```.

    The filters have to be structured as explained [here](https://powerbi.microsoft.com/en-us/blog/intro-pbi-js-api/).

    For example, to add an advanced filter that filters the users by age, when they are 50 years old or older, or younger than 20 years old, 
    you should do:
    ```
    const advancedFilter: pbi.models.IAdvancedFilter = {$schema: "http://powerbi.com/product/schema#advanced",
      target: {
        table: "Users",
        column: "Age"
      },
      logicalOperator: "Or",
      conditions: [
        {
          operator: "GreaterThanOrEqual",
          value: 50
        },
        {
          operator: "LessThan",
          value: 20
        }
      ]
    }

    ```
    Then you should add your filters to an array and this array to the object that is sent to the directive.
    ```
    var filters = [];
    filters.push(advancedFilter);
    vm.reportOptions = {
      "filters": filters
    }
    ```
	
	