import { describe, test, expect, beforeEach } from '@jest/globals';
import { EmailService } from './EmailService';
import { MockEmailProvider1, MockEmailProvider2 } from './mockEmailProviders';

describe('EmailService', () => {
  let emailService: EmailService;
  let mockProvider1: MockEmailProvider1;
  let mockProvider2: MockEmailProvider2;

  beforeEach(() => {
    mockProvider1 = new MockEmailProvider1();
    mockProvider2 = new MockEmailProvider2();
    emailService = new EmailService(mockProvider1, mockProvider2);
  });

  test('sendEmail should return an ID', async () => {
    const id = await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Body');
    expect(id).toBeTruthy();
  });

  test('sendEmail should be idempotent', async () => {
    const id1 = await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Body');
    const id2 = await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Body');
    expect(id1).toBe(id2);
    expect(id1).toBe('test@example.com:Test Subject');
  });

  test('sendEmail should return different IDs for different emails', async () => {
    const id1 = await emailService.sendEmail('test1@example.com', 'Subject 1', 'Body 1');
    const id2 = await emailService.sendEmail('test2@example.com', 'Subject 2', 'Body 2');
    expect(id1).not.toBe(id2);
  });

  test('getEmailStatus should return the correct status', async () => {
    const id = await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Body');
    const status = emailService.getEmailStatus(id);
    expect(status).toBeTruthy();
    expect(status?.status).toMatch(/PENDING|SENT|FAILED/);
  });
});

