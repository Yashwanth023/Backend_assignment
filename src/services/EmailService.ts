import { EmailProvider } from './mockEmailProviders';
import { retry, RateLimiter, CircuitBreaker } from '../utils/emailUtils';

interface EmailStatus {
  id: string;
  to: string;
  subject: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  attempts: number;
}

export class EmailService {
  private sentEmails: Set<string> = new Set();
  private emailQueue: EmailStatus[] = [];
  private rateLimiter: RateLimiter;
  private circuitBreaker: CircuitBreaker;

  constructor(
    private primaryProvider: EmailProvider,
    private fallbackProvider: EmailProvider,
    maxTokens: number = 10,
    refillRate: number = 1
  ) {
    this.rateLimiter = new RateLimiter(maxTokens, refillRate);
    this.circuitBreaker = new CircuitBreaker(5, 60000);
  }

  async sendEmail(to: string, subject: string, body: string): Promise<string> {
    const id = `${to}:${subject}`; // Remove Date.now() to ensure idempotency
    if (this.sentEmails.has(id)) {
      console.log(`Email ${id} already sent. Skipping.`);
      return id;
    }

    const emailStatus: EmailStatus = {
      id,
      to,
      subject,
      status: 'PENDING',
      attempts: 0,
    };
    this.emailQueue.push(emailStatus);

    this.processQueue();
    return id;
  }

  private async processQueue(): Promise<void> {
    while (this.emailQueue.length > 0) {
      const email = this.emailQueue[0];
      await this.rateLimiter.waitForToken();

      try {
        await this.circuitBreaker.execute(async () => {
          await retry(
            () => this.sendWithProvider(this.primaryProvider, email),
            3,
            1000
          );
        });
      } catch (error) {
        console.error(`Failed to send email with primary provider: ${error}`);
        try {
          await retry(
            () => this.sendWithProvider(this.fallbackProvider, email),
            3,
            1000
          );
        } catch (fallbackError) {
          console.error(`Failed to send email with fallback provider: ${fallbackError}`);
          email.status = 'FAILED';
        }
      }

      this.emailQueue.shift();
    }
  }

  private async sendWithProvider(provider: EmailProvider, email: EmailStatus): Promise<void> {
    email.attempts++;
    const success = await provider.sendEmail(email.to, email.subject, 'Email body');
    if (success) {
      email.status = 'SENT';
      this.sentEmails.add(email.id);
    } else {
      throw new Error('Failed to send email');
    }
  }

  getEmailStatus(id: string): EmailStatus | undefined {
    return this.emailQueue.find(email => email.id === id);
  }
}

