# Component Documentation

## Table of Contents
1. [BetsComponent](#betscomponent)
2. [HiddenBetsComponent](#hiddenbetscomponent)
3. [ConfigComponent](#configcomponent)
4. [ErrorsComponent](#errorscomponent)
5. [LoginComponent](#logincomponent)
6. [OpportunityManagementComponent](#opportunitymanagementcomponent)
7. [OpportunityFactoryComponent](#opportunityfactorycomponent)
8. [OpportunityLinksComponent](#opportunitylinkscomponent)
9. [OpportunityChildrenComponent](#opportunitychildrencomponent)
10. [Layout Components](#layout-components)

## BetsComponent

**Location:** `src/app/components/bets/`

**Purpose:** Main component for displaying and managing real-time betting opportunities with arbitrage calculations.

### Template Structure

```html
<!-- bets.component.html -->
<div class="bets-container">
  <!-- Control Panel -->
  <div class="control-panel">
    <button (click)="startScrape()" [disabled]="disable_buttons()">Start Scrape</button>
    <button (click)="endScrape()" [disabled]="disable_buttons()">End Scrape</button>
    
    <!-- Configuration Controls -->
    <div class="config-controls">
      <label>Budget: <input type="number" [(ngModel)]="budget" /></label>
      <label>Lower Bound: <input type="number" [(ngModel)]="lowerBound" /></label>
    </div>
    
    <!-- Status Display -->
    <div class="status-display">
      <span>Last Signal: {{ lastSignal }}</span>
      <span>Status: {{ appRunning() ? 'Running' : 'Stopped' }}</span>
    </div>
  </div>

  <!-- Bets Table -->
  <p-table [value]="filterBetsByLowerBound(bets)" [paginator]="true" [rows]="10">
    <ng-template pTemplate="header">
      <tr>
        <th>Sport</th>
        <th>Profit</th>
        <th>Updated</th>
        <th>Actions</th>
      </tr>
    </ng-template>
    <ng-template pTemplate="body" let-bet>
      <tr>
        <td>{{ bet.sport_name }}</td>
        <td>{{ bet.profit | percent }}</td>
        <td>{{ bet.updated | date:'medium' }}</td>
        <td>
          <button (click)="betDetail(bet)">Details</button>
          <button (click)="hideBet(bet)">Hide</button>
        </td>
      </tr>
      
      <!-- Expanded Details -->
      <tr *ngIf="editBet(bet)">
        <td colspan="4">
          <div class="bet-details">
            <h4>Bet Details</h4>
            <div *ngFor="let detail of betInDetail.details; let i = index">
              <div class="detail-item">
                <img [src]="getImageRoute(detail.sportsbook_name)" alt="Sportsbook" />
                <span>{{ detail.sportsbook_name }}</span>
                <span>{{ detail.player_name }}</span>
                <span>{{ detail.opportunity_name }}</span>
                <span>Odd: {{ detail.odd }}</span>
                <span>Amount: {{ getEditedBetAmount(i) * budget | currency }}</span>
              </div>
            </div>
            <div class="profit-calculation">
              <strong>Calculated Profit: {{ getEditedBetProfit() | percent }}</strong>
            </div>
          </div>
        </td>
      </tr>
    </ng-template>
  </p-table>

  <!-- Error Display -->
  <p-toast></p-toast>
</div>
```

### Styling

```scss
/* bets.component.scss */
.bets-container {
  padding: 20px;
  
  .control-panel {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    align-items: center;
    
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    .config-controls {
      display: flex;
      gap: 15px;
      
      label {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
    
    .status-display {
      display: flex;
      gap: 15px;
      font-size: 14px;
      color: #666;
    }
  }
  
  .bet-details {
    padding: 15px;
    background-color: #f5f5f5;
    border-radius: 4px;
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 0;
      
      img {
        width: 30px;
        height: 20px;
        object-fit: contain;
      }
    }
    
    .profit-calculation {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
      text-align: center;
    }
  }
}
```

### Usage Example

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BetsComponent } from './bets.component';

@Component({
  selector: 'app-betting-dashboard',
  template: `
    <div class="dashboard">
      <h1>Betting Dashboard</h1>
      <app-bets></app-bets>
    </div>
  `
})
export class BettingDashboardComponent {
  // Parent component that uses BetsComponent
}
```

## HiddenBetsComponent

**Location:** `src/app/components/hidden-bets/`

**Purpose:** Displays and manages bets that have been hidden from the main view.

### Template Structure

```html
<!-- hidden-bets.component.html -->
<div class="hidden-bets-container">
  <h2>Hidden Bets</h2>
  
  <p-table [value]="hiddenBets" [paginator]="true" [rows]="10">
    <ng-template pTemplate="header">
      <tr>
        <th>Sport</th>
        <th>Profit</th>
        <th>Hidden Date</th>
        <th>Actions</th>
      </tr>
    </ng-template>
    <ng-template pTemplate="body" let-bet>
      <tr>
        <td>{{ bet.sport_name }}</td>
        <td>{{ bet.profit | percent }}</td>
        <td>{{ bet.updated | date:'medium' }}</td>
        <td>
          <button (click)="restoreBet(bet)">Restore</button>
          <button (click)="deleteBet(bet)">Delete</button>
        </td>
      </tr>
    </ng-template>
  </p-table>
  
  <div *ngIf="hiddenBets.length === 0" class="no-bets">
    <p>No hidden bets found.</p>
  </div>
</div>
```

### Component Implementation

```typescript
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { IBet } from '../../interfaces/ibet';

@Component({
  selector: 'app-hidden-bets',
  templateUrl: './hidden-bets.component.html',
  styleUrls: ['./hidden-bets.component.scss']
})
export class HiddenBetsComponent implements OnInit {
  hiddenBets: IBet[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.loadHiddenBets();
  }

  loadHiddenBets() {
    this.hiddenBets = this.webSocketService.hiddenBets;
  }

  restoreBet(bet: IBet) {
    // Remove from hidden bets
    this.webSocketService.hiddenBets = this.webSocketService.hiddenBets.filter(
      hiddenBet => hiddenBet.id !== bet.id
    );
    this.loadHiddenBets();
  }

  deleteBet(bet: IBet) {
    // Permanently remove bet
    this.webSocketService.hiddenBets = this.webSocketService.hiddenBets.filter(
      hiddenBet => hiddenBet.id !== bet.id
    );
    this.loadHiddenBets();
  }
}
```

## ConfigComponent

**Location:** `src/app/components/config/`

**Purpose:** Manages application configuration settings for sports and sportsbooks.

### Template Structure

```html
<!-- config.component.html -->
<div class="config-container">
  <h2>Configuration Settings</h2>
  
  <div class="config-sections">
    <!-- Sports Configuration -->
    <div class="config-section">
      <h3>Sports</h3>
      <div class="config-grid">
        <div *ngFor="let sport of config.sports" class="config-item">
          <p-checkbox 
            [binary]="true" 
            [(ngModel)]="sport.selected"
            [inputId]="'sport-' + sport.id">
          </p-checkbox>
          <label [for]="'sport-' + sport.id">{{ sport.name }}</label>
        </div>
      </div>
    </div>

    <!-- Sportsbooks Configuration -->
    <div class="config-section">
      <h3>Sportsbooks</h3>
      <div class="config-grid">
        <div *ngFor="let sportsbook of config.sportsbooks" class="config-item">
          <p-checkbox 
            [binary]="true" 
            [(ngModel)]="sportsbook.selected"
            [inputId]="'sportsbook-' + sportsbook.id">
          </p-checkbox>
          <label [for]="'sportsbook-' + sportsbook.id">{{ sportsbook.name }}</label>
        </div>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="config-actions">
    <p-button label="Save Configuration" (onClick)="saveConfig()"></p-button>
    <p-button label="Reset to Defaults" (onClick)="resetConfig()" severity="secondary"></p-button>
  </div>

  <!-- Status Messages -->
  <p-toast></p-toast>
</div>
```

### Component Implementation

```typescript
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { IConfigResponse } from '../../interfaces/iconfigresponse';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  providers: [MessageService]
})
export class ConfigComponent implements OnInit {
  config: IConfigResponse = { sports: [], sportsbooks: [] };
  loading = false;

  constructor(
    private configService: ConfigService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig() {
    this.loading = true;
    this.configService.getConfig().subscribe({
      next: (response) => {
        this.config = response;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load configuration'
        });
        this.loading = false;
      }
    });
  }

  saveConfig() {
    this.loading = true;
    this.configService.setConfig(this.config).subscribe({
      next: (response) => {
        this.config = response;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Configuration saved successfully'
        });
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save configuration'
        });
        this.loading = false;
      }
    });
  }

  resetConfig() {
    // Reset all selections to false
    this.config.sports.forEach(sport => sport.selected = false);
    this.config.sportsbooks.forEach(sportsbook => sportsbook.selected = false);
  }
}
```

## ErrorsComponent

**Location:** `src/app/components/errors/`

**Purpose:** Displays error logs and system errors.

### Template Structure

```html
<!-- errors.component.html -->
<div class="errors-container">
  <h2>Error Logs</h2>
  
  <div class="error-controls">
    <p-button label="Refresh" (onClick)="loadErrors()" icon="pi pi-refresh"></p-button>
    <p-button label="Clear All" (onClick)="clearErrors()" severity="danger"></p-button>
  </div>

  <p-table [value]="errors" [paginator]="true" [rows]="20" [loading]="loading">
    <ng-template pTemplate="header">
      <tr>
        <th>Status</th>
        <th>Message</th>
        <th>Timestamp</th>
        <th>Actions</th>
      </tr>
    </ng-template>
    <ng-template pTemplate="body" let-error>
      <tr [class.active-error]="error.active">
        <td>
          <p-tag 
            [value]="error.active ? 'Active' : 'Resolved'"
            [severity]="error.active ? 'danger' : 'success'">
          </p-tag>
        </td>
        <td>{{ error.message }}</td>
        <td>{{ error.timestamp | date:'medium' }}</td>
        <td>
          <p-button 
            *ngIf="error.active"
            label="Resolve" 
            (onClick)="resolveError(error)"
            size="small"
            severity="success">
          </p-button>
        </td>
      </tr>
    </ng-template>
  </p-table>

  <div *ngIf="errors.length === 0 && !loading" class="no-errors">
    <p>No errors found.</p>
  </div>
</div>
```

### Component Implementation

```typescript
import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { IErrorResult } from '../../interfaces/ierrorresult';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
  providers: [MessageService]
})
export class ErrorsComponent implements OnInit {
  errors: any[] = [];
  loading = false;

  constructor(
    private errorService: ErrorService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadErrors();
  }

  loadErrors() {
    this.loading = true;
    this.errorService.getErrors().subscribe({
      next: (response) => {
        this.errors = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load errors'
        });
        this.loading = false;
      }
    });
  }

  resolveError(error: any) {
    // Implementation for resolving errors
    error.active = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Error resolved'
    });
  }

  clearErrors() {
    this.errors = [];
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Error logs cleared'
    });
  }
}
```

## LoginComponent

**Location:** `src/app/components/login/`

**Purpose:** Handles user authentication.

### Template Structure

```html
<!-- login.component.html -->
<div class="login-container">
  <div class="login-card">
    <h2>Login</h2>
    
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          id="username"
          type="text" 
          formControlName="username"
          placeholder="Enter username"
          class="form-control">
        <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" 
             class="error-message">
          Username is required
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password"
          type="password" 
          formControlName="password"
          placeholder="Enter password"
          class="form-control">
        <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
             class="error-message">
          Password is required
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" [disabled]="loginForm.invalid || loading" class="btn-primary">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
    </form>

    <div *ngIf="error" class="error-alert">
      {{ error }}
    </div>
  </div>
</div>
```

### Component Implementation

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.loginService.userLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      // Simulate login process
      setTimeout(() => {
        const { username, password } = this.loginForm.value;
        
        // Simple validation (replace with actual authentication)
        if (username === 'admin' && password === 'password') {
          localStorage.setItem('loggedIn', 'true');
          this.router.navigate(['/']);
        } else {
          this.error = 'Invalid username or password';
        }
        
        this.loading = false;
      }, 1000);
    }
  }
}
```

## OpportunityManagementComponent

**Location:** `src/app/components/opportunity-management/`

**Purpose:** Main container for opportunity management features with tabbed interface.

### Template Structure

```html
<!-- opportunity-management.component.html -->
<div class="opportunity-management-container">
  <h2>Opportunity Management</h2>
  
  <p-tabView [(activeIndex)]="activeIndex">
    <p-tabPanel header="Factory">
      <app-opportunity-factory></app-opportunity-factory>
    </p-tabPanel>
    
    <p-tabPanel header="Links">
      <app-opportunity-links></app-opportunity-links>
    </p-tabPanel>
    
    <p-tabPanel header="Children">
      <app-opportunity-children></app-opportunity-children>
    </p-tabPanel>
  </p-tabView>
</div>
```

### Component Implementation

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-opportunity-management',
  templateUrl: './opportunity-management.component.html',
  styleUrls: ['./opportunity-management.component.scss']
})
export class OpportunityManagementComponent {
  activeIndex: number = 0;

  constructor() {}
}
```

## OpportunityFactoryComponent

**Location:** `src/app/components/opportunity-factory/`

**Purpose:** Manages opportunity creation and factory operations.

### Template Structure

```html
<!-- opportunity-factory.component.html -->
<div class="opportunity-factory-container">
  <h3>Opportunity Factory</h3>
  
  <div class="factory-controls">
    <p-button label="Refresh" (onClick)="loadOpportunities()" icon="pi pi-refresh"></p-button>
  </div>

  <div class="opportunities-grid">
    <!-- Available Opportunities -->
    <div class="opportunities-section">
      <h4>Available Opportunities</h4>
      <p-table [value]="opportunities" [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
          <tr>
            <th>Description</th>
            <th>Sport</th>
            <th>Sportsbook</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-opportunity>
          <tr>
            <td>{{ opportunity.opp_description }}</td>
            <td>{{ opportunity.sport }}</td>
            <td>{{ opportunity.sportsbook }}</td>
            <td>
              <p-button 
                label="Link" 
                (onClick)="linkOpportunity(opportunity)"
                size="small">
              </p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- Parent Opportunities -->
    <div class="parents-section">
      <h4>Parent Opportunities</h4>
      <p-table [value]="parents" [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
          <tr>
            <th>Description</th>
            <th>Sport</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-parent>
          <tr>
            <td>{{ parent.description }}</td>
            <td>{{ parent.sport }}</td>
            <td>
              <p-button 
                label="View Children" 
                (onClick)="viewChildren(parent)"
                size="small"
                severity="secondary">
              </p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>
</div>
```

### Component Implementation

```typescript
import { Component, OnInit } from '@angular/core';
import { OpportunityService } from '../../services/opportunity.service';
import { IOpportunityFactoryResponse } from '../../interfaces/iopportunity-factory-response';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-opportunity-factory',
  templateUrl: './opportunity-factory.component.html',
  styleUrls: ['./opportunity-factory.component.scss'],
  providers: [MessageService]
})
export class OpportunityFactoryComponent implements OnInit {
  opportunities: any[] = [];
  parents: any[] = [];
  loading = false;

  constructor(
    private opportunityService: OpportunityService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadOpportunities();
  }

  loadOpportunities() {
    this.loading = true;
    this.opportunityService.getOpportunitiesToLink().subscribe({
      next: (response: IOpportunityFactoryResponse) => {
        this.opportunities = response.opportunities;
        this.parents = response.parents;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load opportunities'
        });
        this.loading = false;
      }
    });
  }

  linkOpportunity(opportunity: any) {
    // Implementation for linking opportunity
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: `Linking opportunity: ${opportunity.opp_description}`
    });
  }

  viewChildren(parent: any) {
    // Implementation for viewing children
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: `Viewing children for: ${parent.description}`
    });
  }
}
```

## OpportunityLinksComponent

**Location:** `src/app/components/opportunity-links/`

**Purpose:** Manages opportunity linking functionality.

### Template Structure

```html
<!-- opportunity-links.component.html -->
<div class="opportunity-links-container">
  <h3>Opportunity Links</h3>
  
  <div class="links-controls">
    <p-button label="Refresh" (onClick)="loadLinks()" icon="pi pi-refresh"></p-button>
  </div>

  <div class="links-section">
    <div *ngFor="let link of links" class="link-group">
      <h4>{{ link.sport }}</h4>
      
      <p-table [value]="link.parents" [paginator]="true" [rows]="5">
        <ng-template pTemplate="header">
          <tr>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-parent>
          <tr>
            <td>{{ parent.description }}</td>
            <td>
              <p-button 
                label="Delete" 
                (onClick)="deleteLink(parent.id)"
                size="small"
                severity="danger">
              </p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>

  <div *ngIf="links.length === 0" class="no-links">
    <p>No links found.</p>
  </div>
</div>
```

### Component Implementation

```typescript
import { Component, OnInit } from '@angular/core';
import { OpportunityService } from '../../services/opportunity.service';
import { IOpportunityLinkResponse } from '../../interfaces/iopportunity-link-response';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-opportunity-links',
  templateUrl: './opportunity-links.component.html',
  styleUrls: ['./opportunity-links.component.scss'],
  providers: [MessageService]
})
export class OpportunityLinksComponent implements OnInit {
  links: any[] = [];
  loading = false;

  constructor(
    private opportunityService: OpportunityService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadLinks();
  }

  loadLinks() {
    this.loading = true;
    this.opportunityService.getLinks().subscribe({
      next: (response: IOpportunityLinkResponse) => {
        this.links = response.links;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load links'
        });
        this.loading = false;
      }
    });
  }

  deleteLink(id: number) {
    this.opportunityService.deleteLink(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Link deleted successfully'
        });
        this.loadLinks();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete link'
        });
      }
    });
  }
}
```

## OpportunityChildrenComponent

**Location:** `src/app/components/opportunity-children/`

**Purpose:** Manages parent-child opportunity relationships.

### Template Structure

```html
<!-- opportunity-children.component.html -->
<div class="opportunity-children-container">
  <h3>Opportunity Children</h3>
  
  <div class="children-controls">
    <p-button label="Refresh" (onClick)="loadChildren()" icon="pi pi-refresh"></p-button>
  </div>

  <div class="children-section">
    <p-table [value]="children" [paginator]="true" [rows]="10">
      <ng-template pTemplate="header">
        <tr>
          <th>Parent</th>
          <th>Child Description</th>
          <th>Sport</th>
          <th>Sportsbook</th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-child>
        <tr>
          <td>{{ child.parent_name }}</td>
          <td>{{ child.opportunity.opp_description }}</td>
          <td>{{ child.opportunity.sport }}</td>
          <td>{{ child.opportunity.sportsbook }}</td>
          <td>
            <p-button 
              label="Remove" 
              (onClick)="removeChild(child.opportunity.id)"
              size="small"
              severity="danger">
            </p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </div>

  <div *ngIf="children.length === 0" class="no-children">
    <p>No children found.</p>
  </div>
</div>
```

### Component Implementation

```typescript
import { Component, OnInit } from '@angular/core';
import { OpportunityService } from '../../services/opportunity.service';
import { IOpportunityChildrenResponse } from '../../interfaces/iopportunity-children-response';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-opportunity-children',
  templateUrl: './opportunity-children.component.html',
  styleUrls: ['./opportunity-children.component.scss'],
  providers: [MessageService]
})
export class OpportunityChildrenComponent implements OnInit {
  children: any[] = [];
  loading = false;

  constructor(
    private opportunityService: OpportunityService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadChildren();
  }

  loadChildren() {
    this.loading = true;
    this.opportunityService.getChildren().subscribe({
      next: (response: IOpportunityChildrenResponse) => {
        this.children = response.opportunities;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load children'
        });
        this.loading = false;
      }
    });
  }

  removeChild(childId: number) {
    this.opportunityService.removeChildFromParent(childId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Child removed successfully'
        });
        this.loadChildren();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove child'
        });
      }
    });
  }
}
```

## Layout Components

### AppLayoutComponent

**Location:** `src/app/layout/app.layout.component.ts`

**Purpose:** Main layout component that provides the application shell.

### AppMenuComponent

**Location:** `src/app/layout/app.menu.component.ts`

**Purpose:** Handles navigation menu functionality.

### AppTopbarComponent

**Location:** `src/app/layout/app.topbar.component.ts`

**Purpose:** Provides the top navigation bar.

### AppSidebarComponent

**Location:** `src/app/layout/app.sidebar.component.ts`

**Purpose:** Provides the sidebar navigation.

### AppFooterComponent

**Location:** `src/app/layout/app.footer.component.ts`

**Purpose:** Provides the application footer.

## Component Communication Patterns

### Parent-Child Communication

```typescript
// Parent Component
@Component({
  selector: 'app-parent',
  template: `
    <app-child 
      [data]="parentData"
      (dataChange)="onDataChange($event)">
    </app-child>
  `
})
export class ParentComponent {
  parentData = 'Hello from parent';

  onDataChange(newData: string) {
    console.log('Data changed:', newData);
  }
}

// Child Component
@Component({
  selector: 'app-child',
  template: `
    <div>
      <p>{{ data }}</p>
      <button (click)="updateData()">Update</button>
    </div>
  `
})
export class ChildComponent {
  @Input() data: string = '';
  @Output() dataChange = new EventEmitter<string>();

  updateData() {
    this.dataChange.emit('Updated from child');
  }
}
```

### Service-Based Communication

```typescript
// Shared Service
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private dataSubject = new BehaviorSubject<string>('');
  data$ = this.dataSubject.asObservable();

  updateData(data: string) {
    this.dataSubject.next(data);
  }
}

// Component A
@Component({
  selector: 'app-component-a'
})
export class ComponentA {
  constructor(private sharedService: SharedService) {}

  sendData() {
    this.sharedService.updateData('Data from Component A');
  }
}

// Component B
@Component({
  selector: 'app-component-b'
})
export class ComponentB implements OnInit, OnDestroy {
  data: string = '';
  private subscription: Subscription;

  constructor(private sharedService: SharedService) {
    this.subscription = this.sharedService.data$.subscribe(
      data => this.data = data
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

## Component Lifecycle Management

### Proper Lifecycle Implementation

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lifecycle-example'
})
export class LifecycleExampleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private someService: SomeService) {}

  ngOnInit() {
    // Subscribe to observables with automatic cleanup
    this.someService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Handle data
      });
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Styling Guidelines

### Component-Specific Styles

```scss
// Component-specific styles should be scoped
:host {
  display: block;
  padding: 20px;
}

.component-container {
  // Component-specific styles
}

// Use BEM methodology for class naming
.component {
  &__element {
    // Element styles
  }
  
  &--modifier {
    // Modifier styles
  }
}
```

### Responsive Design

```scss
// Responsive breakpoints
@media (max-width: 768px) {
  .component {
    // Mobile styles
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .component {
    // Tablet styles
  }
}

@media (min-width: 1025px) {
  .component {
    // Desktop styles
  }
}
```

## Testing Guidelines

### Component Testing Example

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetsComponent } from './bets.component';
import { WebSocketService } from '../../services/web-socket.service';

describe('BetsComponent', () => {
  let component: BetsComponent;
  let fixture: ComponentFixture<BetsComponent>;
  let webSocketService: jasmine.SpyObj<WebSocketService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WebSocketService', ['connect', 'sendMessage']);
    
    await TestBed.configureTestingModule({
      declarations: [ BetsComponent ],
      providers: [
        { provide: WebSocketService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BetsComponent);
    component = fixture.componentInstance;
    webSocketService = TestBed.inject(WebSocketService) as jasmine.SpyObj<WebSocketService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start scraping when startScrape is called', () => {
    component.startScrape();
    expect(webSocketService.sendMessage).toHaveBeenCalledWith({ action: 'start' });
  });
});
```