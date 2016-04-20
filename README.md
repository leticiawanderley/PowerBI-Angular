# angular-powerbi

Angular module which wraps PowerBI-JavaScript as service and adds a collection of components for each embedded type (Currently only Report is supported) which you can use to easily embed Power BI visuals within your Angular applications.

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
		<powerbi-component component="vm.report"></powerbi-component>
		```
    
## Getting started

1. Install:

	```
	npm install -save angular-powerbi
	```

1. Include the `angular-powerbi.js` file within your app:

	```
	<script src="angular-powerbi.js"></script>
	```

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
	`return ReportsService.findById('5dac7a4a-4452-46b3-99f6-a25915e0fe55');`

	ReportsService:
	```
	findById(id: string): ng.IPromise<PowerBi.IReport> {
		return this.$http.get(`${this.baseUrl}/api/reports/${id}`)
			.then(response => response.data);
	}
	```

	If you need a sample server to test you can use the following:
	
	- Live example: http://powerbipaasapi.azurewebsites.net/
	- C# Sample Server: (COMING SOON)
	- Nodejs Sample Server: (COMING SOON)

4. Insert the component in your template where you want to embed the visual:
	
	```
	<powerbi-report embed-url="vm.report.embedUrl" access-token="vm.report.accessToken" options="vm.reportOptions"></powerbi-report>
	```
	
	
	