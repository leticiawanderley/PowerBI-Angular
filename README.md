# angular-powerbi

Angular module which wraps PowerBI-JavaScript as service and adds a collection of components for each embedded type (Report, Dashboard, Tile, etc) which you can use to easily embed Power BI visuals within your Angular applications.

## Contents

`angular-powerbi.js` includes the following:

1. Service: **PowerBiService**

	(Handles messaging communication between host frame/window and embedded powerbi visual iframes/windows)

2. Web Components

	The two component behave exactly the same, just one of them uses the new syntax for Angular 1.5 which will help for migration to Angular2.  We also will have a dedicated library for angular2: [PowerBI-Angular2](https://github.com/Microsoft/PowerBI-Angular2)

	1. Directive (Angular 1.4x)
	
		`<ms-powerbi-report-directive embed-url="vm.report.embedUrl" access-token="vm.report.accessToken"></ms-powerbi-report-directive>`

	2. Component (Angular 1.5x) **COMING SOON**

		`<ms-powerbi-report embed-url="vm.report.embedUrl" access-token="vm.report.accessToken"></ms-powerbi-report>`
    
## Getting started

1. Include the `angular-powerbi.js` file within your app:

	`<script src="angular-powerbi.js"></script>`

2. Include the 'powerbi' module as a dependency of your app:

	```
	app.module('app', [
		'powerbi'
	]);
	```

3. Fetch data to embed a visual from the server (embedUrl and accessToken) and make it available on controller scope.

	This would likely require using a factory or service to fetch report data from your local server.	
	Example where the report is resolved when entering route:

	Route:	
	`return ReportsService.findById('63f50faa-f1fe-40ed-ab33-67fb09b80251');`

	ReportsService:
	```
	findById(id: string): ng.IPromise<PowerBi.IReport> {
        return this.$http.get(`${this.baseUrl}/api/reports/${id}`)
            .then(response => response.data);
    }
	```

	If you need a sample server to test you can use the following:
		
	C# Sample Server: (COMING SOON)
	Nodejs Sample Server: (COMING SOON)

4. Insert the component in your template where you want to embed the visual:
	
	`<ms-powerbi-report-directive embed-url="vm.report.embedUrl" access-token="vm.report.accessToken" filter-pane-enabled="false"></ms-powerbi-report-directive>`

## Other options

If the properties bound to the attributes on the component are not correct by the time an instance the component is created the visual will not embed.  In order to instruct the component to defer loading until the attributes are valid you can set the attribute `async="true"`. This will watch for changes on the `embed-url` and `access-token` attributes which are required, and if they are both valid strings it will attempt to embed.

`<ms-powerbi-report-directive embed-url="vm.model.embedUrl" access-token="vm.model.accessToken" async="true"></ms-powerbi-report-directive>`