# Resilient Email Service

This project implements a resilient email sending service using React and TypeScript. It demonstrates various reliability patterns such as retry logic, fallback mechanisms, idempotency, rate limiting, and circuit breaker.

## Setup Instructions

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Run `npm test` to run the unit tests

## Assumptions

- This is a mock implementation and does not actually send emails
- The mock email providers have a 30% chance of failure to simulate network issues
- Rate limiting is set to 10 emails per second by default
- The circuit breaker opens after 5 consecutive failures and resets after 60 seconds

## Features

- Retry mechanism with exponential backoff
- Fallback between two email providers
- Idempotency to prevent duplicate sends
- Rate limiting to prevent overwhelming the email providers
- Status tracking for email sending attempts
- Circuit breaker pattern to prevent cascading failures
- Simple logging (console.log)
- Basic queue system for email processing

## Project Structure

- `src/services/EmailService.ts`: Main email service implementation
- `src/services/mockEmailProviders.ts`: Mock email provider implementations
- `src/utils/emailUtils.ts`: Utility functions for retry, rate limiting, and circuit breaker
- `src/components/EmailSender.tsx`: React component for demonstrating email sending
- `src/services/EmailService.test.ts`: Unit tests for the email service

## Future Improvements

- Implement persistent storage for the email queue and sent emails
- Add more comprehensive error handling and logging
- Implement a more sophisticated queue system with priority and scheduling
- Add integration tests with mock API endpoints

