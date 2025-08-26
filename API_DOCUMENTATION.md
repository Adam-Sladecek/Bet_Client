# Scraping Client API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Services](#services)
   - [WebSocketService](#websocketservice)
   - [OpportunityService](#opportunityservice)
   - [ConfigService](#configservice)
   - [LoginService](#loginservice)
   - [ErrorService](#errorservice)
3. [Components](#components)
   - [BetsComponent](#betscomponent)
   - [HiddenBetsComponent](#hiddenbetscomponent)
   - [ConfigComponent](#configcomponent)
   - [ErrorsComponent](#errorscomponent)
   - [LoginComponent](#logincomponent)
   - [OpportunityManagementComponent](#opportunitymanagementcomponent)
   - [OpportunityFactoryComponent](#opportunityfactorycomponent)
   - [OpportunityLinksComponent](#opportunitylinkscomponent)
   - [OpportunityChildrenComponent](#opportunitychildrencomponent)
4. [Interfaces](#interfaces)
   - [IBet](#ibet)
   - [IOpportunity](#iopportunity)
   - [IConfigResponse](#iconfigresponse)
   - [IError](#ierror)
   - [IErrorResult](#ierrorresult)
   - [IOpportunityFactoryResponse](#iopportunityfactoryresponse)
   - [IOpportunityChildrenResponse](#iopportunitychildrenresponse)
   - [IOpportunityLinkResponse](#iopportunitylinkresponse)
   - [IParentOpportunity](#iparentopportunity)
5. [Enums](#enums)
   - [SocketResponseType](#socketresponsetype)
   - [TaskState](#taskstate)
6. [Usage Examples](#usage-examples)

## Overview

The Scraping Client is an Angular application designed for real-time sports betting arbitrage monitoring. It provides a comprehensive interface for managing betting opportunities, configuration settings, and real-time data streaming via WebSocket connections.

**Key Features:**
- Real-time WebSocket communication for live betting data
- Opportunity management and linking system
- Configuration management for sports and sportsbooks
- Error handling and logging
- User authentication system

## Services

### WebSocketService

**Location:** `src/app/services/web-socket.service.ts`

**Purpose:** Manages real-time WebSocket communication for live betting data and task state monitoring.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `hiddenBets` | `IBet[]` | Array of hidden bets |
| `state` | `TaskState` | Current task state (RUNNING, CLOSED, ENDING) |
| `error` | `IError` | Current error state |
| `bets` | `IBet[]` | Array of current bets |
| `triggerEventObservable` | `Observable<void>` | Observable for triggering UI updates |

#### Methods

##### `connect(): void`
Establishes WebSocket connection to the server.

```typescript
// Example usage
this.webSocketService.connect();
```

##### `sendMessage(message: any): void`
Sends a message to the WebSocket server.

**Parameters:**
- `message: any` - Message to send (will be JSON stringified)

```typescript
// Example usage - Start scraping
this.webSocketService.sendMessage({ action: 'start' });

// Example usage - End scraping
this.webSocketService.sendMessage({ action: 'end' });
```

#### WebSocket Event Handling

The service automatically handles the following WebSocket events:

- **onopen**: Logs connection establishment
- **onmessage**: Processes incoming messages based on response type:
  - `STATERESPONSE`: Updates task state
  - `MATCHDATA`: Updates bets array with new arbitrage opportunities
  - `ERROR`: Sets error state
- **onclose**: Sets error state when connection closes

#### Example Usage

```typescript
import { WebSocketService } from './services/web-socket.service';

export class MyComponent {
  constructor(private webSocketService: WebSocketService) {
    // Subscribe to state changes
    this.webSocketService.triggerEventObservable.subscribe(() => {
      this.updateUI();
    });
  }

  startScraping() {
    this.webSocketService.connect();
    this.webSocketService.sendMessage({ action: 'start' });
  }

  getCurrentBets() {
    return this.webSocketService.bets;
  }

  getCurrentState() {
    return this.webSocketService.state;
  }
}
```

### OpportunityService

**Location:** `src/app/services/opportunity.service.ts`

**Purpose:** Manages opportunity-related HTTP operations including linking, parent-child relationships, and CRUD operations.

#### Methods

##### `getOpportunitiesToLink(): Observable<IOpportunityFactoryResponse>`
Retrieves opportunities available for linking.

```typescript
// Example usage
this.opportunityService.getOpportunitiesToLink().subscribe(
  response => {
    console.log('Available opportunities:', response.opportunities);
    console.log('Parent opportunities:', response.parents);
  }
);
```

##### `addOpportunityLink(body: any): Observable<IOpportunityFactoryResponse>`
Adds a new opportunity link.

**Parameters:**
- `body: any` - Link configuration data

```typescript
// Example usage
const linkData = {
  parentId: 1,
  childId: 2,
  // other link properties
};
this.opportunityService.addOpportunityLink(linkData).subscribe(
  response => console.log('Link added successfully')
);
```

##### `addChild(parentId: number, childId: number): Observable<IOpportunityFactoryResponse>`
Adds a child opportunity to a parent.

**Parameters:**
- `parentId: number` - ID of the parent opportunity
- `childId: number` - ID of the child opportunity

```typescript
// Example usage
this.opportunityService.addChild(1, 2).subscribe(
  response => console.log('Child added successfully')
);
```

##### `getChildren(): Observable<IOpportunityChildrenResponse>`
Retrieves all child opportunities with their parent names.

```typescript
// Example usage
this.opportunityService.getChildren().subscribe(
  response => {
    response.opportunities.forEach(item => {
      console.log(`Child: ${item.opportunity.opp_description} - Parent: ${item.parent_name}`);
    });
  }
);
```

##### `removeChildFromParent(childId: number): Observable<IOpportunityChildrenResponse>`
Removes a child opportunity from its parent.

**Parameters:**
- `childId: number` - ID of the child opportunity to remove

```typescript
// Example usage
this.opportunityService.removeChildFromParent(2).subscribe(
  response => console.log('Child removed successfully')
);
```

##### `getLinks(): Observable<IOpportunityLinkResponse>`
Retrieves all opportunity links.

```typescript
// Example usage
this.opportunityService.getLinks().subscribe(
  response => {
    response.links.forEach(link => {
      console.log(`Sport: ${link.sport}`);
      link.parents.forEach(parent => {
        console.log(`  Parent: ${parent.description}`);
      });
    });
  }
);
```

##### `deleteLink(id: number): Observable<IOpportunityLinkResponse>`
Deletes an opportunity link by ID.

**Parameters:**
- `id: number` - ID of the link to delete

```typescript
// Example usage
this.opportunityService.deleteLink(1).subscribe(
  response => console.log('Link deleted successfully')
);
```

### ConfigService

**Location:** `src/app/services/config.service.ts`

**Purpose:** Manages application configuration including sports and sportsbooks settings.

#### Methods

##### `getConfig(): Observable<IConfigResponse>`
Retrieves current configuration settings.

```typescript
// Example usage
this.configService.getConfig().subscribe(
  response => {
    console.log('Sports:', response.sports);
    console.log('Sportsbooks:', response.sportsbooks);
  }
);
```

##### `setConfig(body: any): Observable<IConfigResponse>`
Updates configuration settings.

**Parameters:**
- `body: any` - Configuration data to update

```typescript
// Example usage
const configData = {
  sports: [
    { id: 1, name: 'Football', selected: true },
    { id: 2, name: 'Basketball', selected: false }
  ],
  sportsbooks: [
    { id: 1, name: 'Betfair', selected: true },
    { id: 2, name: 'IFortuna', selected: true }
  ]
};
this.configService.setConfig(configData).subscribe(
  response => console.log('Configuration updated successfully')
);
```

### LoginService

**Location:** `src/app/services/login.service.ts`

**Purpose:** Manages user authentication state.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `userLoggedIn` | `boolean` | Current login status |

#### Example Usage

```typescript
import { LoginService } from './services/login.service';

export class MyComponent {
  constructor(private loginService: LoginService) {}

  checkLoginStatus() {
    if (this.loginService.userLoggedIn) {
      console.log('User is logged in');
    } else {
      console.log('User is not logged in');
    }
  }
}
```

### ErrorService

**Location:** `src/app/services/error.service.ts`

**Purpose:** Retrieves error logs from the server.

#### Methods

##### `getErrors(): Observable<IErrorResult>`
Retrieves error logs.

```typescript
// Example usage
this.errorService.getErrors().subscribe(
  response => {
    response.data.forEach(error => {
      console.log(`Error: ${error.message} - Active: ${error.active}`);
    });
  }
);
```

## Components

### BetsComponent

**Location:** `src/app/components/bets/bets.component.ts`

**Purpose:** Main component for displaying and managing real-time betting opportunities.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `bets` | `IBet[]` | Array of current bets |
| `betInDetail` | `IBet` | Currently selected bet for detailed view |
| `budget` | `number` | User's betting budget |
| `lastSignal` | `string` | Timestamp of last signal |
| `lowerBound` | `number` | Minimum profit threshold |
| `error` | `IError` | Current error state |

#### Methods

##### `appRunning(): boolean`
Returns true if the scraping task is currently running.

##### `endingScrape(): boolean`
Returns true if the scraping task is in the ending state.

##### `disable_buttons(): boolean`
Returns true if buttons should be disabled (no task state or ending).

##### `betDetail(bet: IBet): void`
Toggles detailed view for a specific bet.

**Parameters:**
- `bet: IBet` - Bet to show/hide details for

##### `editBet(bet: IBet): boolean`
Returns true if a bet is currently being edited.

**Parameters:**
- `bet: IBet` - Bet to check

##### `getEditedBetProfit(): number`
Calculates profit for the currently edited bet.

##### `getEditedBetAmount(index: number): number`
Calculates bet amount for a specific detail in the edited bet.

**Parameters:**
- `index: number` - Index of the bet detail

##### `hideBet(bet: IBet): void`
Hides a bet from the main view.

**Parameters:**
- `bet: IBet` - Bet to hide

##### `getImageRoute(sbName?: string): string`
Returns the image path for a sportsbook.

**Parameters:**
- `sbName?: string` - Sportsbook name

**Returns:** Image path string

##### `startScrape(): void`
Initiates the scraping process.

##### `endScrape(): void`
Ends the scraping process.

##### `filterBets(bets: IBet[]): IBet[]`
Filters out hidden bets from the provided array.

**Parameters:**
- `bets: IBet[]` - Array of bets to filter

**Returns:** Filtered array of bets

##### `filterBetsByLowerBound(bets: IBet[]): IBet[]`
Filters bets based on profit threshold.

**Parameters:**
- `bets: IBet[]` - Array of bets to filter

**Returns:** Filtered array of bets meeting profit criteria

#### Example Usage

```typescript
import { BetsComponent } from './components/bets/bets.component';

// In template
<app-bets></app-bets>

// Component interaction
export class ParentComponent {
  @ViewChild(BetsComponent) betsComponent!: BetsComponent;

  startScraping() {
    this.betsComponent.startScrape();
  }

  getCurrentBets() {
    return this.betsComponent.bets;
  }
}
```

### HiddenBetsComponent

**Location:** `src/app/components/hidden-bets/hidden-bets.component.ts`

**Purpose:** Displays and manages hidden bets.

### ConfigComponent

**Location:** `src/app/components/config/config.component.ts`

**Purpose:** Manages application configuration settings.

### ErrorsComponent

**Location:** `src/app/components/errors/errors.component.ts`

**Purpose:** Displays error logs and system errors.

### LoginComponent

**Location:** `src/app/components/login/login.component.ts`

**Purpose:** Handles user authentication.

### OpportunityManagementComponent

**Location:** `src/app/components/opportunity-management/opportunity-management.component.ts`

**Purpose:** Main container for opportunity management features.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `activeIndex` | `number` | Currently active tab index |

### OpportunityFactoryComponent

**Location:** `src/app/components/opportunity-factory/opportunity-factory.component.ts`

**Purpose:** Manages opportunity creation and factory operations.

### OpportunityLinksComponent

**Location:** `src/app/components/opportunity-links/opportunity-links.component.ts`

**Purpose:** Manages opportunity linking functionality.

### OpportunityChildrenComponent

**Location:** `src/app/components/opportunity-children/opportunity-children.component.ts`

**Purpose:** Manages parent-child opportunity relationships.

## Interfaces

### IBet

**Location:** `src/app/interfaces/ibet.ts`

**Purpose:** Represents a betting opportunity with arbitrage details.

```typescript
export interface IBet {
    id: number;                    // Unique identifier
    updated: string;               // Last update timestamp
    first_odd_id: number;          // First odd identifier
    second_odd_id: number;         // Second odd identifier
    sport_id: number;              // Sport identifier
    sport_name: string;            // Sport name
    profit: number;                // Profit percentage
    details: IBetDetail[];         // Betting details
}

interface IBetDetail {
    id: number;                    // Detail identifier
    player_name: string;           // Player name
    sportsbook_name: string;       // Sportsbook name
    opportunity_name: string;      // Opportunity name
    odd: number;                   // Odds value
    amount: number;                // Bet amount
}
```

### IOpportunity

**Location:** `src/app/interfaces/iopportunity.ts`

**Purpose:** Represents a betting opportunity.

```typescript
export interface IOpportunity {
    id: number;                    // Unique identifier
    opp_description: string;       // Opportunity description
    tip_type: string;              // Tip type
    opp_number: string;            // Opportunity number
    market_id: string;             // Market identifier
    bet_order: number;             // Bet order
    sport: string;                 // Sport name
    sportsbook: string;            // Sportsbook name
}
```

### IConfigResponse

**Location:** `src/app/interfaces/iconfigresponse.ts`

**Purpose:** Represents configuration response data.

```typescript
export interface IConfigResponse {
    sports: IConfig[];             // Available sports
    sportsbooks: IConfig[];        // Available sportsbooks
}

export interface IConfig {
    id: number;                    // Configuration item ID
    name: string;                  // Configuration item name
    selected: boolean;             // Selection status
}
```

### IError

**Location:** `src/app/interfaces/ierror.ts`

**Purpose:** Represents an error state.

```typescript
export interface IError {
    active: boolean;               // Error active status
    message: string;               // Error message
}
```

### IErrorResult

**Location:** `src/app/interfaces/ierrorresult.ts`

**Purpose:** Represents error result data.

```typescript
export interface IErrorResult {
    data: IError[];                // Array of errors
}
```

### IOpportunityFactoryResponse

**Location:** `src/app/interfaces/iopportunity-factory-response.ts`

**Purpose:** Represents opportunity factory response data.

```typescript
export interface IOpportunityFactoryResponse {
    parents: IParentOpportunity[];     // Parent opportunities
    opportunities: IOpportunity[];     // Available opportunities
}
```

### IOpportunityChildrenResponse

**Location:** `src/app/interfaces/iopportunity-children-response.ts`

**Purpose:** Represents opportunity children response data.

```typescript
export interface IOpportunityChildrenResponse {
    opportunities: IOpportunityWithParentName[];  // Opportunities with parent names
}

export interface IOpportunityWithParentName { 
    parent_name: string;           // Parent opportunity name
    opportunity: IOpportunity;     // Child opportunity
}
```

### IOpportunityLinkResponse

**Location:** `src/app/interfaces/iopportunity-link-response.ts`

**Purpose:** Represents opportunity link response data.

```typescript
export interface IOpportunityLinkResponse {
    links: IOpportunityLink[];     // Opportunity links
}

export interface IOpportunityLink {
    sport: string;                 // Sport name
    parents: IParentOpportunity[]; // Parent opportunities
}
```

### IParentOpportunity

**Location:** `src/app/interfaces/iparrent-opportunity.ts`

**Purpose:** Represents a parent opportunity.

```typescript
export interface IParentOpportunity {
    id: number;                    // Unique identifier
    description: string;           // Opportunity description
    sport: string;                 // Sport name
}
```

## Enums

### SocketResponseType

**Location:** `src/app/enums/socket-response-type.ts`

**Purpose:** Defines WebSocket response types.

```typescript
export enum SocketResponseType {
    STATERESPONSE = 1,             // Task state response
    ERROR = 2,                     // Error response
    MATCHDATA = 3,                 // Match data response
}
```

### TaskState

**Location:** `src/app/enums/task-state.ts`

**Purpose:** Defines task execution states.

```typescript
export enum TaskState {
    RUNNING = 1,                   // Task is running
    CLOSED = 2,                    // Task is closed
    ENDING = 3,                    // Task is ending
}
```

## Usage Examples

### Complete Application Setup

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppModule } from './app.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppModule
  ],
  bootstrap: [AppComponent]
})
export class MainModule { }
```

### Real-time Betting Monitor

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from './services/web-socket.service';
import { IBet } from './interfaces/ibet';
import { TaskState } from './enums/task-state';

@Component({
  selector: 'app-betting-monitor',
  template: `
    <div>
      <h2>Real-time Betting Monitor</h2>
      <button (click)="startMonitoring()" [disabled]="isRunning">Start</button>
      <button (click)="stopMonitoring()" [disabled]="!isRunning">Stop</button>
      
      <div *ngIf="error.active" class="error">
        {{ error.message }}
      </div>
      
      <div class="bets-container">
        <div *ngFor="let bet of bets" class="bet-item">
          <h3>{{ bet.sport_name }}</h3>
          <p>Profit: {{ bet.profit | percent }}</p>
          <p>Updated: {{ bet.updated | date:'medium' }}</p>
        </div>
      </div>
    </div>
  `
})
export class BettingMonitorComponent implements OnInit, OnDestroy {
  bets: IBet[] = [];
  error: any = { active: false, message: '' };
  isRunning = false;
  private subscription: Subscription;

  constructor(private webSocketService: WebSocketService) {
    this.subscription = this.webSocketService.triggerEventObservable.subscribe(() => {
      this.updateData();
    });
  }

  ngOnInit() {
    this.webSocketService.connect();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  startMonitoring() {
    this.webSocketService.sendMessage({ action: 'start' });
  }

  stopMonitoring() {
    this.webSocketService.sendMessage({ action: 'end' });
  }

  private updateData() {
    this.bets = this.webSocketService.bets;
    this.error = this.webSocketService.error;
    this.isRunning = this.webSocketService.state === TaskState.RUNNING;
  }
}
```

### Configuration Management

```typescript
import { Component, OnInit } from '@angular/core';
import { ConfigService } from './services/config.service';
import { IConfigResponse } from './interfaces/iconfigresponse';

@Component({
  selector: 'app-config-manager',
  template: `
    <div>
      <h2>Configuration Manager</h2>
      
      <div class="sports-section">
        <h3>Sports</h3>
        <div *ngFor="let sport of config.sports" class="config-item">
          <input type="checkbox" 
                 [checked]="sport.selected" 
                 (change)="toggleSport(sport)">
          <label>{{ sport.name }}</label>
        </div>
      </div>
      
      <div class="sportsbooks-section">
        <h3>Sportsbooks</h3>
        <div *ngFor="let sportsbook of config.sportsbooks" class="config-item">
          <input type="checkbox" 
                 [checked]="sportsbook.selected" 
                 (change)="toggleSportsbook(sportsbook)">
          <label>{{ sportsbook.name }}</label>
        </div>
      </div>
      
      <button (click)="saveConfig()">Save Configuration</button>
    </div>
  `
})
export class ConfigManagerComponent implements OnInit {
  config: IConfigResponse = { sports: [], sportsbooks: [] };

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig() {
    this.configService.getConfig().subscribe(
      response => this.config = response
    );
  }

  toggleSport(sport: any) {
    sport.selected = !sport.selected;
  }

  toggleSportsbook(sportsbook: any) {
    sportsbook.selected = !sportsbook.selected;
  }

  saveConfig() {
    this.configService.setConfig(this.config).subscribe(
      response => {
        console.log('Configuration saved successfully');
        this.config = response;
      }
    );
  }
}
```

### Opportunity Management

```typescript
import { Component, OnInit } from '@angular/core';
import { OpportunityService } from './services/opportunity.service';
import { IOpportunityFactoryResponse } from './interfaces/iopportunity-factory-response';

@Component({
  selector: 'app-opportunity-manager',
  template: `
    <div>
      <h2>Opportunity Manager</h2>
      
      <div class="opportunities-section">
        <h3>Available Opportunities</h3>
        <div *ngFor="let opportunity of opportunities" class="opportunity-item">
          <h4>{{ opportunity.opp_description }}</h4>
          <p>Sport: {{ opportunity.sport }}</p>
          <p>Sportsbook: {{ opportunity.sportsbook }}</p>
          <button (click)="linkOpportunity(opportunity)">Link</button>
        </div>
      </div>
      
      <div class="parents-section">
        <h3>Parent Opportunities</h3>
        <div *ngFor="let parent of parents" class="parent-item">
          <h4>{{ parent.description }}</h4>
          <p>Sport: {{ parent.sport }}</p>
        </div>
      </div>
    </div>
  `
})
export class OpportunityManagerComponent implements OnInit {
  opportunities: any[] = [];
  parents: any[] = [];

  constructor(private opportunityService: OpportunityService) {}

  ngOnInit() {
    this.loadOpportunities();
  }

  loadOpportunities() {
    this.opportunityService.getOpportunitiesToLink().subscribe(
      response => {
        this.opportunities = response.opportunities;
        this.parents = response.parents;
      }
    );
  }

  linkOpportunity(opportunity: any) {
    // Implementation for linking opportunity
    console.log('Linking opportunity:', opportunity);
  }
}
```

### Error Handling

```typescript
import { Component, OnInit } from '@angular/core';
import { ErrorService } from './services/error.service';
import { IErrorResult } from './interfaces/ierrorresult';

@Component({
  selector: 'app-error-handler',
  template: `
    <div>
      <h2>Error Handler</h2>
      
      <div *ngFor="let error of errors" class="error-item">
        <div class="error-message">{{ error.message }}</div>
        <div class="error-status">
          Status: {{ error.active ? 'Active' : 'Resolved' }}
        </div>
      </div>
      
      <button (click)="refreshErrors()">Refresh Errors</button>
    </div>
  `
})
export class ErrorHandlerComponent implements OnInit {
  errors: any[] = [];

  constructor(private errorService: ErrorService) {}

  ngOnInit() {
    this.loadErrors();
  }

  loadErrors() {
    this.errorService.getErrors().subscribe(
      response => this.errors = response.data
    );
  }

  refreshErrors() {
    this.loadErrors();
  }
}
```

## API Endpoints

### Base URLs
- **WebSocket:** `ws://localhost:8000/ws/scrape/`
- **Database API:** `http://127.0.0.1:8000/database/`
- **Error API:** `http://192.168.0.106:5000/`

### HTTP Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/config/get` | Get configuration | - | `IConfigResponse` |
| POST | `/config/set` | Set configuration | Configuration object | `IConfigResponse` |
| GET | `/opportunitytolink/get` | Get opportunities to link | - | `IOpportunityFactoryResponse` |
| POST | `/opportunitylink/add` | Add opportunity link | Link data | `IOpportunityFactoryResponse` |
| POST | `/opportunity/{parentId}/add/{childId}` | Add child to parent | - | `IOpportunityFactoryResponse` |
| GET | `/opportunity/children/get` | Get children opportunities | - | `IOpportunityChildrenResponse` |
| DELETE | `/opportunity/children/remove/{childId}` | Remove child from parent | - | `IOpportunityChildrenResponse` |
| GET | `/opportunitylink/get` | Get opportunity links | - | `IOpportunityLinkResponse` |
| DELETE | `/opportunitylink/delete/{id}` | Delete opportunity link | - | `IOpportunityLinkResponse` |
| GET | `/getErrors` | Get error logs | - | `IErrorResult` |

### WebSocket Messages

| Action | Description | Message Format |
|--------|-------------|----------------|
| Start Scraping | Initiate scraping process | `{ action: 'start' }` |
| End Scraping | Stop scraping process | `{ action: 'end' }` |

### WebSocket Response Types

| Type | Description | Data Format |
|------|-------------|-------------|
| `STATERESPONSE` | Task state update | `TaskState` |
| `MATCHDATA` | New betting data | `IBet[]` |
| `ERROR` | Error message | `string` |

## Best Practices

### Service Usage
1. Always inject services in the constructor
2. Subscribe to observables and unsubscribe in `ngOnDestroy`
3. Handle errors in service calls
4. Use TypeScript interfaces for type safety

### Component Development
1. Keep components focused on a single responsibility
2. Use OnPush change detection strategy for performance
3. Implement proper lifecycle hooks
4. Handle component destruction properly

### Error Handling
1. Always implement error handling for HTTP requests
2. Use try-catch blocks for critical operations
3. Provide user-friendly error messages
4. Log errors for debugging

### Performance Optimization
1. Use trackBy functions in ngFor loops
2. Implement OnPush change detection where appropriate
3. Unsubscribe from observables to prevent memory leaks
4. Use async pipe when possible

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check if the server is running on the correct port
   - Verify the WebSocket URL in the service
   - Check network connectivity

2. **HTTP Request Errors**
   - Verify the API base URL
   - Check CORS configuration on the server
   - Ensure proper authentication headers

3. **Component Not Updating**
   - Check if observables are properly subscribed
   - Verify change detection is working
   - Ensure data is being emitted correctly

4. **Memory Leaks**
   - Always unsubscribe from observables
   - Use takeUntil operator with destroy subject
   - Implement proper component destruction

### Debugging Tips

1. Use browser developer tools to inspect network requests
2. Add console.log statements for debugging
3. Use Angular DevTools for component inspection
4. Monitor WebSocket connections in Network tab
5. Check browser console for error messages