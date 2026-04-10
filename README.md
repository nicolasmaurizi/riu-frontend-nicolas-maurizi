# RIU Frontend - Nicolas Maurizi

Single Page Application developed with Angular 21 using a modern standalone architecture, reactive state management with Signals, and a clean feature-based structure.

## Description

This application allows managing a list of superheroes through a complete CRUD interface. It includes search, pagination, local persistence, and integration with an external API to automatically retrieve hero images.

The project was built focusing on clean architecture, reactive programming, and maintainability.

## Features

- Create, edit and delete superheroes
- Search heroes by name
- Paginated list view
- Local data persistence (no backend required)
- Automatic image retrieval from external API
- Global loading indicator using HTTP interceptor
- Runtime language switching (English / Spanish)
- Unit tests with coverage above 80%

## Tech Stack

- Angular 21
- Standalone Components
- Signals (Reactive State Management)
- RxJS
- Angular Material
- ngx-translate (i18n)
- SCSS
- Docker (multi-stage with Nginx)

## Project Structure

src/app/
  core/
  shared/
  features/
    heroes/

## Requirements

- Node.js >= 24
- npm

## Getting Started

Install dependencies:

npm install

Run the application:

ng serve

Open in browser:

http://localhost:4200

## Testing

Run unit tests:

npm test

Run tests with coverage:

npm run test:coverage

## Build

Generate production build:

npm run build

## Docker

The application is containerized using a multi-stage build.

Build the production image:

docker build -t heroes-app .

Run the container:

docker run -p 8080:80 heroes-app

Access the application:

http://localhost:8080

The final image only includes Nginx and static files, ensuring a lightweight and secure deployment.

## Internationalization

- Runtime language switching (English / Spanish)
- Translation files managed using JSON
- Language preference persisted locally

## Architecture Decisions

- Separation between domain model and form model
- Feature-based folder structure
- Facade pattern for state management
- Signals and computed values for reactive UI
- Event-driven communication between components

## Deployment

The application can be deployed as a static site.

For Netlify deployment:

- Build command: npm run build
- Publish directory: dist/<project-name>/browser

To support Angular routing, include a _redirects file:

/*    /index.html   200

## Author

Nicolas Maurizi