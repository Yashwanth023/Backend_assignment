import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Email Sender heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Email Sender/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders email form elements', () => {
  render(<App />);
  const toLabel = screen.getByLabelText(/To:/i);
  const subjectLabel = screen.getByLabelText(/Subject:/i);
  const sendButton = screen.getByText(/Send Email/i);
  expect(toLabel).toBeInTheDocument();
  expect(subjectLabel).toBeInTheDocument();
  expect(sendButton).toBeInTheDocument();
});

