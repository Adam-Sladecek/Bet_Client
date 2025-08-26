# Scraping Client - Angular Application

A comprehensive Angular application for real-time sports betting arbitrage monitoring and opportunity management.

## 📚 Documentation

This project includes comprehensive documentation for all public APIs, functions, and components:

- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference with examples and usage instructions
- **[Component Documentation](COMPONENT_DOCUMENTATION.md)** - Detailed component guides with templates and styling

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Angular CLI (v16 or higher)
- Backend server running on `http://127.0.0.1:8000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scraping-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/           # Angular components
│   │   ├── bets/            # Main betting interface
│   │   ├── config/          # Configuration management
│   │   ├── errors/          # Error handling
│   │   ├── login/           # Authentication
│   │   ├── opportunity-*/   # Opportunity management
│   │   └── hidden-bets/     # Hidden bets management
│   ├── services/            # Angular services
│   │   ├── web-socket.service.ts
│   │   ├── opportunity.service.ts
│   │   ├── config.service.ts
│   │   ├── login.service.ts
│   │   └── error.service.ts
│   ├── interfaces/          # TypeScript interfaces
│   ├── enums/              # TypeScript enums
│   └── layout/             # Layout components
├── assets/                 # Static assets
└── styles.scss            # Global styles
```

## 🔧 Key Features

### Real-time Betting Monitor
- WebSocket-based real-time data streaming
- Live arbitrage opportunity detection
- Profit calculation and filtering
- Audio notifications for new opportunities

### Opportunity Management
- Parent-child opportunity relationships
- Opportunity linking system
- Factory operations for opportunity creation
- Comprehensive CRUD operations

### Configuration Management
- Sports and sportsbooks configuration
- User preferences management
- Real-time configuration updates

### Error Handling
- Comprehensive error logging
- User-friendly error messages
- Error resolution system

## 🛠️ Technology Stack

- **Frontend Framework:** Angular 16
- **UI Library:** PrimeNG 16
- **Styling:** SCSS with PrimeFlex
- **Real-time Communication:** WebSocket
- **HTTP Client:** Angular HttpClient
- **State Management:** RxJS Observables
- **Testing:** Jasmine & Karma

## 📡 API Endpoints

### WebSocket
- **URL:** `ws://localhost:8000/ws/scrape/`
- **Purpose:** Real-time betting data and task state updates

### HTTP APIs
- **Base URL:** `http://127.0.0.1:8000/database/`
- **Error API:** `http://192.168.0.106:5000/`

See [API Documentation](API_DOCUMENTATION.md) for complete endpoint details.

## 🎯 Core Services

### WebSocketService
Manages real-time communication for live betting data and task state monitoring.

```typescript
// Example usage
this.webSocketService.connect();
this.webSocketService.sendMessage({ action: 'start' });
```

### OpportunityService
Handles opportunity-related HTTP operations including linking and parent-child relationships.

```typescript
// Example usage
this.opportunityService.getOpportunitiesToLink().subscribe(
  response => console.log('Opportunities:', response)
);
```

### ConfigService
Manages application configuration for sports and sportsbooks.

```typescript
// Example usage
this.configService.getConfig().subscribe(
  response => console.log('Config:', response)
);
```

## 🧩 Components

### BetsComponent
Main component for displaying and managing real-time betting opportunities.

### OpportunityManagementComponent
Container for opportunity management features with tabbed interface.

### ConfigComponent
Manages application configuration settings.

See [Component Documentation](COMPONENT_DOCUMENTATION.md) for detailed component guides.

## 🔌 Data Interfaces

### IBet
Represents a betting opportunity with arbitrage details.

```typescript
interface IBet {
  id: number;
  updated: string;
  sport_name: string;
  profit: number;
  details: IBetDetail[];
}
```

### IOpportunity
Represents a betting opportunity.

```typescript
interface IOpportunity {
  id: number;
  opp_description: string;
  sport: string;
  sportsbook: string;
}
```

## 🚦 Task States

```typescript
enum TaskState {
  RUNNING = 1,    // Task is running
  CLOSED = 2,     // Task is closed
  ENDING = 3      // Task is ending
}
```

## 🧪 Testing

Run the test suite:

```bash
ng test
```

Run tests with coverage:

```bash
ng test --code-coverage
```

## 📦 Building for Production

```bash
ng build --configuration production
```

## 🔍 Development

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write unit tests for services and components

### Best Practices
- Use OnPush change detection where appropriate
- Implement proper lifecycle hooks
- Unsubscribe from observables
- Use async pipe when possible
- Follow BEM methodology for CSS

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Verify backend server is running
   - Check WebSocket URL configuration
   - Ensure network connectivity

2. **HTTP Request Errors**
   - Verify API base URLs
   - Check CORS configuration
   - Ensure proper authentication

3. **Component Not Updating**
   - Check observable subscriptions
   - Verify change detection
   - Ensure data emission

See [API Documentation](API_DOCUMENTATION.md) for detailed troubleshooting guide.

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## 📞 Support

For technical support or questions about the API, please refer to the comprehensive documentation:

- [API Documentation](API_DOCUMENTATION.md)
- [Component Documentation](COMPONENT_DOCUMENTATION.md)

---

**Note:** This application is designed for sports betting arbitrage monitoring. Please ensure compliance with local gambling laws and regulations.
