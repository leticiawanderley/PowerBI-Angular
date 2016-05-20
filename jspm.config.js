SystemJS.config({
  transpiler: "plugin-typescript",
  packages: {
    "angular-powerbi": {
      "main": "dist/angular-powerbi.js",
      "meta": {
        "*.js": {
          "loader": "plugin-typescript"
        }
      }
    }
  },
  map: {
    "angular-powerbi": "local:angular-powerbi@0.1.0"
  }
});

SystemJS.config({
  packageConfigPaths: [
    "github:*/*.json",
    "npm:@*/*.json",
    "npm:*.json",
    "local:*.json"
  ],
  map: {
    "angular": "npm:angular@1.5.5",
    "os": "github:jspm/nodelibs-os@0.2.0-alpha",
    "plugin-typescript": "github:frankwallis/plugin-typescript@4.0.5",
    "powerbi-client": "npm:powerbi-client@2.0.0-beta.6",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha"
  },
  packages: {
    "github:frankwallis/plugin-typescript@4.0.5": {
      "map": {
        "typescript": "npm:typescript@1.8.9"
      }
    },
    "github:jspm/nodelibs-os@0.2.0-alpha": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    }
  }
});
