# API Routes Documentation

## Authentication Module
- `POST /auth`: User Login
- `POST /auth/users`: Create user
- `GET /auth/users`: List all users
- `GET /auth/users/:userId`: Get user by ID
- `PATCH /auth/users/:userId`: Update user
- `PATCH /auth/users/:userId/roles`: Assign roles
- `DELETE /auth/users/:userId/roles/:roleId`: Remove role

## Address Module
### Addresses
- `POST /address`: Create address
- `GET /address`: List addresses
- `GET /address/:id`: Get address by ID
- `PATCH /address/:id`: Update address
- `DELETE /address/:id`: Delete address

### Cities
- `POST /address/city`: Create city
- `GET /address/city`: List cities
- `GET /address/city/:id`: Get city by ID
- `PATCH /address/city/:id`: Update city
- `DELETE /address/city/:id`: Delete city

### Countries
- `POST /address/country`: Create country
- `GET /address/country`: List countries
- `GET /address/country/:id`: Get country by ID
- `PATCH /address/country/:id`: Update country
- `DELETE /address/country/:id`: Delete country

### Regions
- `POST /address/region`: Create region
- `GET /address/region`: List regions
- `GET /address/region/:id`: Get region by ID
- `PATCH /address/region/:id`: Update region
- `DELETE /address/region/:id`: Delete region

## Billing Module
### Billing
- `POST /billing`: Create billing record
- `GET /billing`: List billing records

### Entity Billable
- `POST /billing/entity-billable`: Create entity billable
- `GET /billing/entity-billable`: Find linked invoices

### Invoices
- `POST /billing/invoice`: Create invoice
- `GET /billing/invoice`: List invoices
- `GET /billing/invoice/:invoiceId`: Get invoice by ID
- `PATCH /billing/invoice/:invoiceId`: Update invoice
- `DELETE /billing/invoice/:invoiceId`: Delete invoice

### Invoice Items
- `POST /billing/invoice/:invoiceId/items`: Create invoice item
- `GET /billing/invoice/:invoiceId/items`: List invoice items
- `GET /billing/invoice/:invoiceId/items/:itemId`: Get invoice item
- `PATCH /billing/invoice/:invoiceId/items/:itemId`: Update invoice item
- `DELETE /billing/invoice/:invoiceId/items/:itemId`: Delete invoice item

### Paystack
- `POST /billing/paystack/initialize`: Initialize payment
- `GET /billing/paystack/callback/invoice`: Handle invoice callback
- `GET /billing/paystack/callback/subscription`: Handle subscription callback

### Webhooks
- `POST /billing/webhook/paystack`: Webhook endpoint

### Subscriptions
- `POST /billing/subscription`: Create subscription
- `POST /billing/subscription/initialize`: Initialize subscription
- `GET /billing/subscription`: List subscriptions
- `GET /billing/subscription/:subscriptionId`: Get subscription
- `POST /billing/subscription/cancel`: Cancel subscription

### Subscription Plans
- `POST /billing/subscription/plan`: Create subscription plan
- `GET /billing/subscription/plan`: List subscription plans
- `GET /billing/subscription/plan/:planId`: Get plan
- `PUT /billing/subscription/plan/:planId`: Update plan

### Payments
- `GET /billing/payment/paystack`: Paystack payment endpoints
- `GET /billing/payment/channel`: Payment channel endpoints
- `GET /billing/payment/type`: Payment type endpoints

## Job Requests Module
### Job Requests
- `POST /job-request`: Create job request
- `GET /job-request`: List job requests
- `GET /job-request/:jobRequestId`: Get job request
- `PATCH /job-request/:jobRequestId`: Update job request
- `GET /job-request/user/:userId`: Find by user
- `GET /job-request/service/:serviceId`: Find by service

### Job Assignments
- `POST /job-request/assignments`: Assign job
- `GET /job-request/assignments/all`: List all assignments
- `GET /job-request/assignments/user/:userId`: Find jobs for user
- `GET /job-request/assignments/:jobRequestId/:userId`: Get assignment
- `PATCH /job-request/assignments/:jobRequestId`: Update assignment
- `DELETE /job-request/assignments/:jobRequestId/:userId`: Remove assignment

### Services
- `POST /job-request/service`: Create service
- `GET /job-request/service`: List services
- `GET /job-request/service/:serviceId`: Get service
- `PATCH /job-request/service/:serviceId`: Update service
- `DELETE /job-request/service/:serviceId`: Delete service
- `PATCH /job-request/service/assign-categories`: Assign services to categories
- `DELETE /job-request/service/remove-categories`: Remove service from categories

## Resources Module
### Media
- `POST /resources/media`: Create media
- `GET /resources/media`: List media
- `GET /resources/media/:mediaId`: Get media
- `PATCH /resources/media/:mediaId`: Update media
- `DELETE /resources/media/:mediaId`: Delete media

## Ticketing Module
- `POST /tickets`: Create ticket
- `GET /tickets`: List all tickets
- `GET /tickets/:caseNumber`: Get ticket
- `PATCH /tickets/:caseNumber`: Update ticket
- `DELETE /tickets/:caseNumber`: Delete ticket

## Messaging Module
- `POST /mail/send-reset-password`: Send reset password email
- `POST /mail/send-verification`: Send verification email
- `POST /mail/send-welcome`: Send welcome email
- `POST /mail/send-onboarding`: Send onboarding email
- `POST /mail/send-qr`: Send QR code email

## Health Check Module
- `GET /health`: Health check endpoint
- `GET /liveness`: Liveness check endpoint
- `GET /readiness`: Readiness check endpoint
