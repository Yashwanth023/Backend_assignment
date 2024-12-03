import React, { useState } from 'react';
import { EmailService } from '../services/EmailService';
import { MockEmailProvider1, MockEmailProvider2 } from '../services/mockEmailProviders';

const emailService = new EmailService(new MockEmailProvider1(), new MockEmailProvider2());

const EmailSender: React.FC = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await emailService.sendEmail(to, subject, 'Email body');
      setStatus(`Email sent with ID: ${id}`);
    } catch (error) {
      setStatus(`Failed to send email: ${error}`);
    }
  };

  return (
    <div>
      <h1>Email Sender</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="to">To:</label>
          <input
            type="email"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Email</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default EmailSender;

