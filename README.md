# setup
create web.config in /src with this
```
root/src/web.config

<?xml version="1.0" encoding="UTF-8"?>
<configuration>
<system.webServer>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <remove fileExtension=".woff" />
      <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
    </staticContent>
    <rewrite>
      <rules>
        <rule name="Angular" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

Call it in the **angular.json** as an additional asset

```

 "assets": [
              "src/favicon.ico",
              "src/assets",
              "src/web.config"
            ],

```
In the environments.ts for production i have to set the correct baseURL like so - including the protocoll **'https://'** otherwise, it is appended additionally to the actual web url and won't work with the respective backend API:
```
export const environment = {
    production: true,
    baseUrl: 'https://kanban240527backend.azurestaticapps.net/'
};
```

# deploy to Azure
Use Azure Extension and
- rightclick on *Static Web Apps
- ...
- ...
- ...
- ...