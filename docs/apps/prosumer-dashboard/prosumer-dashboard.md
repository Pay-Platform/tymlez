# Prosumer Dashboard

Design Document
by Alex 2021-10-06

<!-- vscode-markdown-toc -->

- 1. [Glossary](#Glossary)
- 2. [Languages](#Languages)
- 3. [Stekeholders](#Stekeholders)
- 4. [Concerns](#Concerns)
- 5. [Viewpoints](#Viewpoints)
  - 5.1. [Aggregate data from External Data Source](#AggregatedatafromExternalDataSource)
  - 5.2. [Provide data via API](#ProvidedataviaAPI)
  - 5.3. [Browse data in Dashboard](#BrowsedatainDashboard)
    - 5.3.1. [Non-realtime](#Non-realtime)
    - 5.3.2. [Realtime](#Realtime)
  - 5.4. [Cache](#Cache)
    - 5.4.1. [InMemory cache and Fake cache reader](#InMemorycacheandFakecachereader)
    - 5.4.2. [Redis cache](#Rediscache)
  - 5.5. [Database](#Database)
- 6. [Elements](#Elements)
  - 6.1. [Client Web SPA](#ClientWebSPA)
    - 6.1.1. [UI](#UI)
    - 6.1.2. [Data-access layer](#Data-accesslayer)
  - 6.2. [Server side components and object model](#Serversidecomponentsandobjectmodel)
    - 6.2.1. [Prosumer Db](#ProsumerDb)
    - 6.2.2. [Records](#Records)
    - 6.2.3. [History DB](#HistoryDB)
    - 6.2.4. [Vocabularies](#Vocabularies)
  - 6.3. [API](#API)
    - 6.3.1. [Dashboard Prosumer Controllers](#DashboardProsumerControllers)
    - 6.3.2. [dashboard.controller.ts](#dashboard.controller.ts)
    - 6.3.3. [site.controller.ts](#site.controller.ts)
    - 6.3.4. [site/generation.controller.ts](#sitegeneration.controller.ts)
  - 6.4. [Aggregator](#Aggregator)
- 7. [Rationale](#Rationale)
- 8. [Questions](#Questions)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## 1. <a name='Glossary'></a>Glossary

`Aggregator` is a background job (daemon/service) on the server for getting data from external data source, process it and save in database and cache.

`Asset` is an item of the site. Site has several assets.

`API` is the `prosumer-dashboard` application in `tymlez-platform/services/platform-middleware`. It provides data for dashboard web UI.

`Cache` is a temporal storage of the data. It's used for real-time charts. It could be redis or in-memory storage for single instance configuration. Data expired in the cache.

`Consumer` is a part of the site consumption of specific type.

`Dashboard` is Web UI where user login and browser the data. Dashboard is the `prosumer-dashboard` application in `tymlez-platform/clients/tymlez-web` SPA.

`Database` is a postgresql database to save collected data for long period of time.

`External Data Source` is 3rd-party system(s) like smart meters that can provide us real-time data of generated, stored and consumed energy.

`Generator` is asset of the site to generate energy.

`Site` is a location of the user. User has several sites. Site has `lat`, `lng` coordinates and some address.

`Source` is an abstract description of source of consumed energy. It answers the questions: where is energy from and who consumed it. A site has several sources.

`Storage` is an asset of the site for saving energy. It has capacity.

`User` or `customer` or `prosumer` is a user in terms of whole platform. It's in user table. User can login and browse the data related to him only.

## 2. <a name='Languages'></a>Languages

UML (PlantUML)

## 3. <a name='Stekeholders'></a>Stekeholders

Eoin and Dan need some working demo of consumer dashboard for presentation to potential clients.

## 4. <a name='Concerns'></a>Concerns

We need to impement full-stack web solution for the user.

- collect, aggregate and save information about energy
  - generated
  - consumed
  - stored
- present that information for the custom via Web application.

There are screenshots provided as a reference. Those screenshots are not exact design.

By those screenshots, we see 3 pages:

- `dashboard (multi-site)` page of the user with general info and data for all his sites; default/main page
- `site` page shows data of specific site. Each site has 4 sections/tabs:
  - Generation
  - Consumption
  - Circuit (to show site consumption info by consumers)
  - Storage
- `generation-source-type` page shows info about all generators of specific sourceType

**TODO: Describe all the widgets of all pages/tabs!**

Add menu items to open main page of dashboard.

There should be navigation by `Details` button from main page to specific site page
and from site page to generation-source-type page.

There is login functionality should be used.
Only authenticated user can see the dashboard.
A user authorized to see only data of his sites/assets.

```puml
object User
object Site
object Asset
object Storage {
  capacity
}
object Generator
object Source {
  sourceType
  origin
}
object Consumer

map "ConsumerType" as consumerType {
 1 => Lighting
 2 => Fridges
 3 => Freezers
 4 => HVAC
 5 => Owen
}

map "SourceCategory" as sourceCategory {
 1 => GE
 2 => Fossil Fuel
}

map "SourceType" as sourceType {
 1 => Solar, GE
 2 => Wind, GE
 3 => Coil, Fossil Fuel
}

map "Origin" as origin {
 1 => purchased
 2 => self-generated
}

object Record {
  timestamp
  duration: seconds
  value: kWh
  site
}
object StorageRecord {
  filter and group parameters
}
object GenerationRecord {
  filter and group parameters
}
object ConsumptionRecord {
  filter and group parameters
}

User *-- "0..*" Site
Site *-- "0..*" Asset
Asset <|-- Storage
Asset <|-- Generator
Site *-- "0..*" Source
Site *-- "0..*" Consumer
Source "from" --> Generator
Consumer "of" --> consumerType
Source::sourceType "of" --> sourceType
Generator "of" --> sourceType
sourceCategory *-- sourceType

Record <|-- StorageRecord
Record <|-- GenerationRecord
Record <|-- ConsumptionRecord

StorageRecord "to" --> Storage
GenerationRecord "from" --> Generator
ConsumptionRecord "from" --> Source
ConsumptionRecord "by" --> Consumer
Source::origin "of" --> origin
```

A user may have several sites.

`Site`

- generates energy from `GeneratorAsset`
- saves energy to `StorageAsset`
- consumes energy by `Consumers` from `Sources`

Consumption is a flow from the source to the consumer.

A site may have several assets, sources and consumers.

There are 2 types of assets:

- `Generator`
- `Storage`

`Source` has:

- sourceType/sourceCategory
- origin
- generatorId (optional; for self-generated origin only)

`Origin`:

- purchased
- self-generated

`SourceCategory`:

- GE (Green Energy)
- Fossil Fuel

`SourceType` belongs to `SourceCategory`:

- Solar to GE
- Wind to GE
- Coal to Fossil Fuel

Assets and sources has metrics. Metrics values are in kWh.
Metrics data is provided in form of `Records`:

- `StorageRecord` about energy saved to the `StorageAsset`
- `GenerationRecord` about energy generated from the `GeneratorAsset`
- `ConsumptionRecord` about energy consumed from the `Source` by the `Consumer`

Records are in terms of specific timestamp and has value for specific duration.

We need to display the records in form of charts and tables.
There are static widgets and dynamic widgets.

- Dynamic widgets are some charts. They show real-time data and update each 5 seconds automatically. Both the data and its presentation on the page. There are records with 5 seconds duration.
- Static widgets are 24HR widgets and History data widgets. Data for static widget is stored in database and updated each hour. It should not be updated on the page automatically. There are records with 1 hour duration.

There are a lot of features on screenshots, but avoid implement these:

- any storage related widgets on generation-source-type page.
- Site status is always online.
- Dynamic widgets update is 5 seconds only. There is no other period selection.
- There is no settings button in the top-right coner.
- There is no export button/function.
- avoid Aggregator and Fake Data Source; post some fake history data instead by migration
- avoid any cache; just provide I\*CacheReader implementation with fake data

We should deploy the application on https://dev.platform.tymlez.com
to show those pages/widgets with test data of test users/sites/assets.
Real-time and collected/history data. Collected history data for several days, at least.

## 5. <a name='Viewpoints'></a>Viewpoints

Use Cases:

```puml
left to right direction
"Browse data \n in Dashboard" as (Browse)
:User: --> (Login)
:User: --> (Browse)
(Browse) --> (Aggregate data from \n External Data Source)
(Browse) --> (Provide data via API)
```

### 5.1. <a name='AggregatedatafromExternalDataSource'></a>Aggregate data from External Data Source

**NOTE:** Don't implement this use-case for now. Just put test data to history db and provide fake random data via cache reader interfaces.

The data is coming into our system from External Data Source.
It needs to:

- aggregate it per hour and save in database
- provide for realtime widgets via cache interface

There is a collector for 1 hour aggregation.

```puml
control "Aggregator" as a
collections "External Data Source" as ds
participant "1 hour collector" as hr
database Cache as c
database Database as db

a -> a: each 5 seconds
activate a
a -> ds: Get Data
ds -> a
a -> hr: Aggregate data
a -> c: Save data
deactivate a

a -> a: each hour
activate a
a -> hr: Save data
hr -> db: Save aggregated data \n and start new hour
deactivate a
```

```puml
package Generation {
  [Generation History DB Repo]
  [GenerationRecord]
  [GenerationInMemoryCache] -- IGenerationCacheWriter
  [GenerationInMemoryCache] -- IGenerationCacheReader
  [GenerationInMemoryCache] ..> [GenerationRecord] : uses
}
package Prosumer {
  [Prosumer Service]
}
package "Fake Data Source" {
  [FakeDatSource] --> [Prosumer Service] : load info
}
package Generation {
  package Aggregator {
    [FakeDatSource] ..> [GenerationRecord] : uses
    [FakeDatSource] --> [GenerationAggregator] : process records
    [GenerationAggregator] ..> [GenerationRecord] : uses
    [GenerationAggregator] --> IGenerationCacheWriter : save realtime records
    [GenerationAggregator] --> [GenerationCollector] : aggregate records
    [GenerationCollector] ..> [GenerationRecord] : uses
    [GenerationCollector] --> [Generation History DB Repo] : save history records \n each 1 hour
  }
}
```

**TODO: describe aggregator and fake data source**

### 5.2. <a name='ProvidedataviaAPI'></a>Provide data via API

There should be HTTP API provided from server side.
The dashboard SPA uses that API to get data for the widgets.

```puml
actor User
boundary Dashboard
control API
database Database
database Cache

User -> Dashboard: Open
Dashboard -> API: HTTP
activate API
API -> Database: Get data
Database -> API
API -> Cache: or/and Get data
Cache -> API
API -> Dashboard
deactivate API
```

HTTP controllers should be as BFF (Backend For Frontend).
Controllers are in the hierarchy of the pages/tabs.

- api/
  - dashboard.controller.ts
  - site.controller.ts
  - site/
    - generation.controller.ts
    - consumption.controller.ts
    - storage.controller.ts
    - circuit.controller.ts

Controllers compose DTO objects.
DTO objects are defined in `prosumer-dashboard` application in `packages/platform-api-interfaces`. See DTO.

Controllers don't get data directly from orm/db/cache.
Controllers uses services from business scopes:

- common/
  - Record.ts
  - ICache.ts
- prosumer/
  - prosumer.service.ts
  - entities/
    - \*.entity.ts
- generation/
  - history-entities/
    - GenerationHistoryRecord.entity.ts
  - generation.service.ts
  - GenerationRecord.ts
  - FakeGenerationCacheReader.ts
- consumtion/
  - history-entities/
    - ConsumptionHistoryRecord.entity.ts
  - consumption.service.ts
  - ConsumptionRecord.ts
  - FakeConsumptionCacheReader.ts
- storage/
  - history-entities/
    - StorageHistoryRecord.entity.ts
  - storage.service.ts
  - StorageRecord.ts
  - FakeStorageCacheReader.ts

```puml
top to bottom direction
package Interfaces {
  [Dto Interfaces]
  [Vocabularies]
}
package Prosumer {
  [Prosumer Service] --> [Prosumer DB Repos] : load data
  [Prosumer DB Repos] ..> [Prosumer DB Entities] : uses
}
package Generation {
  [FakeGenerationCacheReader] -- IGenerationCacheReader
  [FakeGenerationCacheReader] ..> [GenerationRecord] : uses
  [Generation Service] --> [IGenerationCacheReader] : load data
  [Generation Service] --> [Generation History DB Repo] : load data
  [Generation History DB Repo] ..> [Generation History DB Entities] : uses
}
note top of Generation
  It's the same for all business scopes:
  * Generation
  * Consumption
  * Storage
end note

package API {
  [Dto] --|> [Dto Interfaces]
  [**Any BFF** Controller] ..> [Dto] : compose
  [**Any BFF** Controller] --> [Prosumer Service] : load data
  [**Any BFF** Controller] --> [Generation Service] : load data
  [**Any BFF** Controller] ..> [Prosumer DB Entities] : uses
  [**Any BFF** Controller] ..> [Generation History DB Entities] : uses
  [**Any BFF** Controller] ..> [GenerationRecord] : uses
}
```

### 5.3. <a name='BrowsedatainDashboard'></a>Browse data in Dashboard

There should be react SPA with virtual pages.
A page may have several tabs/widgets as components/sub-components.
Some components are shared among pages.
Widgets types:

- history static
- realtime dynamic

There are common data structures defined in `packages/platform-api-interfaces` in `prosumer-dashboard` application:

- vocabularies
- dto/
  - dashboard.ts
  - site.ts
  - site/
    - generation.ts
    - consumption.ts
    - storage.ts
    - circuit.ts

#### 5.3.1. <a name='Non-realtime'></a>Non-realtime

Non-realtime widgets get the data from appropriate simple data-access hooks within the widget:

```puml
Widget --> useApi : use records \n from
useApi --> "prosumer-dashboard api \n based on axios" as api: async call
api --> "server API": HTTP GET
```

There is HTTP API to provide data for static widgets and GET HTTP pulling for dynamic widgets.
Put HTTP API to api/prosumer-dashboard.ts of the application.
Data-source layer for the components should be done by hooks.
Place such a hook within the appropriate component.
If there are several components share the same data/api-methods/hook, then use it in parent component, and provide data into the components as properties.

#### 5.3.2. <a name='Realtime'></a>Realtime

Realtime widgets uses more complicated data-access layer.
There is a provider with a context.

```tsx
<DataProvider>
  <Widget />
</DataProvider>
```

There are several approaches of listener implementation.
See below.
For now, we use HTTP pulling.

HTTP pulling:

```puml
Widget --> useDataProvider : use records \n from
useDataProvider --> Context : get current recordset
useDataProvider <-- Context
Widget <-- useDataProvider

DataProvider --> DataProvider: each 5 seconds
DataProvider --> "prosumer-dashboard api \n based on axios" as api: async call
api --> "server API": HTTP GET
api <-- "server API"
DataProvider <-- api
DataProvider --> Context : save
```

EventSource API:

```puml
Widget --> useDataProvider : use records \n from
useDataProvider --> Context : get current recordset
useDataProvider <-- Context
Widget <-- useDataProvider

DataProvider --> "prosumer-dashboard api \n based on EventSource" as api: async call
api --> "server API": HTTP Subscribe
api <-- "server API": each 5 seconds

DataProvider <-- api
DataProvider --> Context : save
```

### 5.4. <a name='Cache'></a>Cache

There are 3 separated caches for:

- Generation records
- Storage records
- Consumption records

#### 5.4.1. <a name='InMemorycacheandFakecachereader'></a>InMemory cache and Fake cache reader

We are not going to implement InMemory cache now. We just implement FakeGenerationCacheReader, FakeConsumptionCacheReader, and FakeStorageCacheReader, as implementation of IGenerationCacheReader, IConsumptionCacheReader, and IStorageCacheReader respectively. It provides sin(timestamp) data in range 0.1 to 1.0 with period (20 points) \* (5 seconds) = 100 second.

```puml
interface IGenerationCacheWriter {
  save(record:GenerationRecord)
}
interface IGenerationCacheReader {
  getRecords(siteId:UUID, lastTimestamp:number):Array<GenerationRecord>
}

class GenerationInMemoryCache {
  save(record:GenerationRecord)
  getRecords(siteId:UUID, lastTimestamp:number):Array<GenerationRecord>
}

class FakeGenerationCacheReader {
  getRecords(siteId:UUID, lastTimestamp:number):Array<GenerationRecord>
}

IGenerationCacheWriter <|-- GenerationInMemoryCache
IGenerationCacheReader <|-- GenerationInMemoryCache
IGenerationCacheReader <|-- FakeGenerationCacheReader
```

```puml
interface IConsumptionCacheWriter {
  save(record:ConsumptionRecord)
}
interface IConsumptionCacheReader {
  getRecords(siteId:UUID, lastTimestamp:number):Array<ConsumptionRecord>
}

class ConsumptionInMemoryCache {
  save(record:ConsumptionRecord)
  getRecords(siteId:UUID, lastTimestamp:number):Array<ConsumptionRecord>
}

class FakeConsumptionCacheReader {
  getRecords(siteId:UUID, lastTimestamp:number):Array<ConsumptionRecord>
}

IConsumptionCacheWriter <|-- ConsumptionInMemoryCache
IConsumptionCacheReader <|-- ConsumptionInMemoryCache
IConsumptionCacheReader <|-- FakeConsumptionCacheReader
```

```puml
interface IStorageCacheWriter {
  save(record:StorageRecord)
}
interface IStorageCacheReader {
  getRecords(siteId:UUID, lastTimestamp:number):Array<StorageRecord>
}

class StorageInMemoryCache {
  save(record:StorageRecord)
  getRecords(siteId:UUID, lastTimestamp:number):Array<StorageRecord>
}

class FakeStorageCacheReader {
  getRecords(siteId:UUID, lastTimestamp:number):Array<StorageRecord>
}

IStorageCacheWriter <|-- StorageInMemoryCache
IStorageCacheReader <|-- StorageInMemoryCache
IStorageCacheReader <|-- FakeStorageCacheReader
```

#### 5.4.2. <a name='Rediscache'></a>Redis cache

We are not going to implement Redis cache now.

### 5.5. <a name='Database'></a>Database

Use postgresql.
Put db changes in migrations.
Define MikroORM entities.
Then create tables for them in migrations.
Put test data for Prosumer DB into separated migration.
Put test data for History DB into migrations.

## 6. <a name='Elements'></a>Elements

### 6.1. <a name='ClientWebSPA'></a>Client Web SPA

#### 6.1.1. <a name='UI'></a>UI

We use `tymlez-platform` monorepo.
Let's have development branch as `main` branch of `tymlez-platform`.
Create `apps/prosumer-dashboard` application in `clients/tymlez-web`.
There are 3 pages:

- `dashboard (multi-site)` (main page) with url `/prosumer-dashboard`
- `site` with url `/prosumer-dashboard/site/{siteId}`
- `generation-source-type` with url `/prosumer-dashboard/site/{siteId}/generation-source-type/{sourceType}`

Put menu items Dashboard And Multi-Site under Prosumer section in side-menu of tymlez-ui. That item should direct to the pages.

There are react pages/components:

- dashboard (multi-site) page
  - SitesNumber
  - Generation24
  - Consumption24
  - CurrentlyStored
  - OverviewPlot
  - SitesLocation
  - GECompliance
  - TopConsumers
  - SitesList
- site page
  - SiteDetails
    - SiteInfo
    - SiteLocation
  - CircuitTab
    - ConsumersRealtime
    - ConsumersHistory
      - ConsumersHistoryPlot
      - ConsumersHistoryTable
  - ConsumptionTab
  - GenerationTab
    - GenerationRealtime
    - GenerationHistory
      - GenerationHistoryPlot
      - GenerationHistoryTable
  - StorageTab
    - StorageRealtime
      - StorageRealtimePlot
      - StorageRealtimeSummary
    - StorageHistory
      - StorageHistoryPlot
      - StorageHistoryTable
- generation-source-type page
  - SiteDetails
    - SiteInfo
    - SiteLocation
  - HistoryGeneratedStoredPlot (don't implement)
  - AveragesGeneratedStoredBar (don't implement)
  - GenerationAssets
  - StoredAssets (don't implement)

#### 6.1.2. <a name='Data-accesslayer'></a>Data-access layer

- for dashboard page
  ```puml
  "dashboard page" --> "useDashboard hook" : use
  "useDashboard hook" --> dashboardApi : getDashboard()
  dashboardApi --> API : HTTP GET dashboard
  dashboardApi <-- API
  "useDashboard hook" <-- dashboardApi
  "useDashboard hook" --> "useDashboard hook" : group sitesGeneration24 \n and sitesAssets arrays \n by siteId
  "useDashboard hook" --> "dashboard page" : provides data \n for components
  ```
- for site page

  ```puml
  "site page" --> "useSiteInfo hook" : use
  "useSiteInfo hook" --> dashboardApi : getSiteInfo(siteId)
  dashboardApi --> API : HTTP GET site/{siteId}/info
  dashboardApi <-- API
  "useSiteInfo hook" <-- dashboardApi
  "useSiteInfo hook" --> "site page" : provides data \n for components
  ```

- for Generation Tab

  ```puml
  "GenerationHistory" --> "useSiteGenerationHistory hook" : use
  "useSiteGenerationHistory hook" --> dashboardApi : getSiteGenerationHistory(from, to)
  dashboardApi --> API : HTTP GET site/{siteId}/generation/history?from=...&to=...
  dashboardApi <-- API
  "useSiteGenerationHistory hook" <-- dashboardApi
  "useSiteGenerationHistory hook" --> "useSiteGenerationHistory hook" : aggregate by sourceType \n and calculate %
  "useSiteGenerationHistory hook" --> "GenerationHistory" : provides data \n for components
  ```

  ```tsx
  <GenerationRelatimeProvider siteId={siteId}>
    <GenerationRealtime />
  </GenerationRelatimeProvider>
  ```

  ```puml
  GenerationRealtime --> useGenerationRealtime : use records \n from
  useGenerationRealtime --> Context : get current recordset
  useGenerationRealtime <-- Context
  GenerationRealtime <-- useGenerationRealtime

  GenerationRealtimeProvider --> GenerationRealtimeProvider: each 5 seconds
  GenerationRealtimeProvider --> dashboardApi: async getSiteGenerationRealtime(\nsiteId[, lastTimestamp])
  dashboardApi --> API: HTTP GET \nsite/{siteId}/generation/relatime/{lastTimeout}
  dashboardApi <-- API
  GenerationRealtimeProvider <-- dashboardApi
  GenerationRealtimeProvider --> Context : save
  ```

### 6.2. <a name='Serversidecomponentsandobjectmodel'></a>Server side components and object model

User's id is provided via authentication function.

Use MikroORM entities to work with data within database.
Enitites has string UUID ID's.
UUID's are generated by PostgreSQL automatically.

There are 3 main parts on the server:

```puml
package Common {
  [Prosumer DB]
  [History DB]
  [GenerationInMemoryCache] -- IGenerationCacheWriter
  [GenerationInMemoryCache] -- IGenerationCacheReader
  [GenerationInMemoryCache] ..> [GenerationRecord] : uses
}
package Client {
  [Dto Interfaces]
}
package API {
  [ProsumerDashboardControllers] --> [History DB] : load data
  [ProsumerDashboardControllers] --> [Prosumer DB] : load info
  [ProsumerDashboardControllers] --> [Dto Interfaces] : compose
  [ProsumerDashboardControllers] --> IGenerationCacheReader : load data
}
package Aggregator {
  [FakeDatSource] ..> [GenerationRecord] : uses
  [FakeDatSource] --> [GenerationAggregator] : process records
  [FakeDatSource] --> [Prosumer DB] : load info
  [GenerationAggregator] ..> [GenerationRecord] : uses
  [GenerationAggregator] --> IGenerationCacheWriter : save realtime records
  [GenerationAggregator] --> [GenerationCollector] : aggregate records
  [GenerationCollector] ..> [GenerationRecord] : uses
  [GenerationCollector] --> [History DB] : save history records \n each 1 hour
}
```

- Common
  - Prosumer DB module with MikroORM entities provides info about user/site objects
  - GenerationInMemoryCache provides realtime data. It implements both interfaces:
    - IGenerationCacheReader
    - IGenerationCacheWriter
  - History DB module with MikroORM entities provides historical data
- API
  - ProsumerDashboardControllers as HTTP layer; get data from; compose Dto and provide to the client
- Aggregator
  - Records are data structures for processing and aggregation metrics data.
  - FakeDataSource is random generator of
  - Records data structures
  - Collector

InMemory implementation of Cache reader and writer are the same implementation. So, it's in Common part.

#### 6.2.1. <a name='ProsumerDb'></a>Prosumer Db

```puml
package "Prosumer Db" {
  class Site {
    userId
    title:string
    address:string
    lat:number
    lng:number
  }
  class Storage {
    siteId
    capacity:number
  }
  class Generator {
    siteId
    sourceType: string
  }
  class Consumer {
    siteId
    consumerType: string
  }
  class Source {
    siteId
    sourceType: string
    origin: string
    generatorId
  }

  Site *-- "siteId" Storage
  Site *-- "siteId" Generator
  Site *-- "siteId" Consumer
  Site *-- "siteId" Source
  Source --> Generator
}
```

#### 6.2.2. <a name='Records'></a>Records

Records classes are used in aggregator for ETL, pure in code, not in database.

```puml
package Records {
  abstract class Record {
    timestamp:number
    duration:number
    value:value
  }

  class StorageRecord {
    origin: string
    storage:Storage
  }
  class GenerationRecord {
    generator:Generator
  }
  class ConsumptionRecord {
    source:Source
    consumer:Consumer
  }
  Record <|-- StorageRecord
  Record <|-- GenerationRecord
  Record <|-- ConsumptionRecord
}
```

#### 6.2.3. <a name='HistoryDB'></a>History DB

We save records for non-realtime widgets in database.
These tables should be full, so, we should avoid joins with Prosumer tables, to be able to move records to another storage.

- All data for static widgets should be provided as single dataset, so, prosumer and records data should be merged on server side.
- For dynamic realtime widgets prosumer and records are loaded separately and merged/updated on client side, in data access layer.

```puml
package "History Db" {
  abstract class HistoryRecord {
    timestamp:number
    duration:number
    value:value
    userId
    siteId
  }
  class StorageHistoryRecord {
    storageId

    origin: string
  }
  class GenerationHistoryRecord {
    generatorId

    sourceType: string
    sourceCategory: string
  }
  class ConsumptionHistoryRecord {
    sourceId
    consumerId

    sourceType: string
    sourceCategory: string
    consumerType: string
    origin: string
  }

  HistoryRecord <|-- StorageHistoryRecord
  HistoryRecord <|-- GenerationHistoryRecord
  HistoryRecord <|-- ConsumptionHistoryRecord
}
```

History entities have extra (non-normalized) fields, to make history records full, to be able to switch to another OLAP storage later.

#### 6.2.4. <a name='Vocabularies'></a>Vocabularies

There are also hardcoded vocabulary structures. We should represent them as enums and maps. Later, we can move those into DB tables and provide admin web UI. PK should be that string or the field should have unique index.

```ts
export enum ConsumerType {
  Lighting = 'Lighting',
  Fridges = 'Fridges',
  Freezers = 'Freezers',
  HVAC = 'HVAC',
  Owen = 'Owen',
}

export enum SourceCategory {
  GE = 'GE',
  'Fossil Fuel' = 'Fossil Fuel',
}

export enum SourceType {
  Solar = 'Solar',
  Wind = 'Wind',
  Coal = 'Coal',
}

export const SourceTypeCategory: Record<SourceType, SourceCategory> = {
  Solar: SourceCategory.GE,
  Wind: SourceCategory.GE,
  Coal: SourceCategory['Fossil Fuel'],
};

export enum Origin {
  Purchased = 'Purchased',
  'Self-generated' = 'Self-generated',
}
```

### 6.3. <a name='API'></a>API

Based URI is `/api/v1/prosumer-dashboard/`.

#### 6.3.1. <a name='DashboardProsumerControllers'></a>Dashboard Prosumer Controllers

- dashboard.controller.ts
- site.controller.ts
- site/
  - generation.controller.ts
  - consumtion.controller.ts
  - storage.controller.ts
  - circuit.controller.ts

#### 6.3.2. <a name='dashboard.controller.ts'></a>dashboard.controller.ts

- GET URI: `dashboard`. Load all data of logged-in user for dashboard page.
  `DashboardDto` example:

  ```json
  {
    sitesNum: 7,
    stored: 200,
    generation24: [generation history records for 24 hours],
    consumption24: [consumption history records for 24 hours],
    sites: [{
      siteid: 1,
      title: 'Gold Cost',
      address: '...',
      lat: 1234.567,
      lng: 1234.567,
      status: 'online',
    }, ...],
    sitesGeneration24: [{
      siteId:'a', timestamp: 12345678, value: 12
    }, ...],
    topConsumers: [{
      consumerType:'Lighting', geValue: 12, nonGEValue: 30,
    }, ...],
  }
  ```

  - sitesGeneration24 has values from history for last 24 hours grouped by siteId.
  - topConsumers has top 4 consumerTypes of all the sites. Sort desc by value. Value := geValue + nonGEValue; % := geValue \* 100 / (geValue + nonGEValue). Value of consumed energy from history for last 24 hours. Plus field with percent of GE in that values of consumption, per consumerType.

#### 6.3.3. <a name='site.controller.ts'></a>site.controller.ts

- GET URI: `site/{siteId}/info`. Load common site info for site page.

  ```json
  SiteAssetDto {
    title: string;
    value: number;
  }
  SiteDto {
    id: string;
    title: string;
    address: string;
    lat: number;
    lng: number;
    status: 'online' | 'offline';
    assets: Array<SiteAssetDto>;
  }
  ```

  example:

  ```json
  {
    id: 'some-uuid',
    title: 'Gold Coast',
    assets: [{title: 'Solar', value: 20}, ...]
    address: '...', lat: 12.12, lng: 23.23
  }
  ```

#### 6.3.4. <a name='sitegeneration.controller.ts'></a>site/generation.controller.ts

- GET URI: `site/{siteId}/generation/realtime/` or
- GET URI: `site/{siteId}/generation/realtime/{lastTimestamp}`.
  Load/update realtime generation info of the site.
  `SiteGenerationRealtimeDto` example:
  ```json
  {
    series: {
      "Solar": [{timestamp: 12345, value: 34}, ...],
      "Wind": [{timestamp: 12345, value: 34}, ...],
      "Coal": [{timestamp: 12345, value: 34}, ...],
      ...
    },
  }
  ```
- GET URI: `site/{siteId}/generation/history?from=...&to=...`
  Load history generation info of the site.
  `SiteGenerationHistoryDto` example:
  ```json
  {
    series: [
      {name: "Solar", data: [{x: 12345, y: 34}, ...]},
      {name: "Wind", data: [{x: 12345, y: 34}, ...]},
      {name: "Coal", data: [{x: 12345, y: 34}, ...]},
      ...
    ],
  }
  ```

### 6.4. <a name='Aggregator'></a>Aggregator

There are 3 aggregators and their infrastructure for:

- generation
- storage
- consumption

Description is for generation only.
TODO: for Storage and Consumption.

```puml
class GenerationAggregator {
  collector:GenerationCollector
  cache:IGenerationCacheWriter
  async record(record:GenerationRecord)
}

class GenerationCollector {
  period:number
  historyRecordsRepo: GenerationHistoryRecordRepo
  async collect(record:GenerationRecord)
}

GenerationAggregator --> GenerationCollector : collect(record)
GenerationAggregator --> IGenerationCacheWriter : save(cacheRecord)

interface IDataSource {
  async listen()
}
class FakeDataSource {
  generationAggregator:GenerationAggregator
}
IDataSource <|-- FakeDataSource
FakeDataSource --> GenerationAggregator : record(record)

interface IGenerationCacheWriter {
  async save(record:GenerationRecord)
}

class GenerationHistoryRecordRepo {
  persistAndFlush(record:GenerationHistoryRecord)
}
GenerationCollector --> GenerationHistoryRecordRepo : persistAndFlush(historyRecord)
```

## 7. <a name='Rationale'></a>Rationale

- We are not going to implemen any cache right now. There should be simple implementations of IReaderCache interfaces with random/some data.

- We are not goign to implement Aggregator/FakeDataSource. There are just migrtions to put fake history data for 2 days.

- We use BFF (Backend For Frontend) approach for both realtime and non-realtime API.There is no business logic, so, no serivce layer. There are only controllers. They get data from DB via MikroORM and IReaderCache interfaces.
- There is input data flows from data-sources like smart meters. We abstract collection and aggregation input data into Aggregator.

- Static widgets loads data from History DB. Dynamic realtime widgets load data from the cache.
- For now, assume we have single instance configuration. Use in-process cache implementation w/o Redis. Aggregator as a nestjs module in terms of `tymlez-middlerwire`, because it's much faster to implement. Later, we can implement multi-instance horizontaly scalable solution by external aggregator and redis as a cache.

- For now, implement External Data Source interface as in-process async. methods, because it's much faster to implement.

- For now, implement listener pattern of real-time plots by 5-seconds-period HTTP pulling, because it's much faster to do. Later, we will implement that interfaces by WebSocket and/or EventSource.

- For now, there is no blockchain, because it's not in Cencerns. Later, we would add blockchain as input data source or output records storage.

- HistoryRecords system is OLAP. We do slices by filtering and gpouping the history records. These slices are used as data sources for the widgets, because it's much faster to implement. Later, we would implement/use existing OLAP cube or columnar storage, at least.

- Hardcode vocabularies instead of putting to database, because it's faster.

- For now, ProsumerDashboarService has references and calls directly Prosumer DB, Cache and History DB layers, instead of Clean Architecture, because it's faster to implement. Later we inverse those dependencies to abstract business layer.

## 8. <a name='Questions'></a>Questions
