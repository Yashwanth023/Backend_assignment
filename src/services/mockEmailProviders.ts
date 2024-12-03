export interface EmailProvider {
  sendEmail: (to: string, subject: string, body: string) => Promise<boolean>;
}

export class MockEmailProvider1 implements EmailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    // Simulate network delay and random failures
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    return Math.random() > 0.3;
  }
}

export class MockEmailProvider2 implements EmailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    // Simulate network delay and random failures
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    return Math.random() > 0.3;
  }
}

