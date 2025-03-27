import React, { useState } from 'react';
import './Email_style.css';

const { textGenTextOnlyPromptStreaming } = require("./gemini.js");




const EmailGenerator = () => {
  const [fromEmail, setFromEmail] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [editableEmail, setEditableEmail] = useState('');
  const [error, setError] = useState(null);

  const handleGenerateEmail = async () => {
    try {
      // Reset previous errors
      setError(null);

      // Validate inputs
      if (!prompt) {
        setError('Please enter a prompt for email generation');
        return;
      }

      const response = await textGenTextOnlyPromptStreaming(prompt);
      
      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      const email = data.email;
      setGeneratedEmail(email);
      setEditableEmail(email);
    } catch (error) {
      console.error('Error generating email:', error);
      setError(error.message || 'Failed to generate email');
    }
  };

  const handleSendEmail = async () => {
    try {
      // Validate inputs
      if (!fromEmail || !toEmail) {
        setError('Please enter both sender and recipient email addresses');
        return;
      }

      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromEmail,
          toEmail,
          emailContent: editableEmail
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const result = await response.json();
      if (result.success) {
        alert('Email sent successfully!');
        // Reset form after successful send
        setFromEmail('');
        setToEmail('');
        setPrompt('');
        setGeneratedEmail('');
        setEditableEmail('');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setError(error.message || 'Failed to send email');
    }
  };

  return (
    <div className="email-generator-container">
      <div className="email-generator-card">
        <h2 className="email-generator-title">Email Generator</h2>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Email Inputs */}
        <div className="form-group">
          <input 
            type="email"
            placeholder="From Email" 
            className="form-control"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            required
          />

          <input 
            type="email"
            placeholder="To Email" 
            className="form-control"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            required
          />

          {/* Prompt Input */}
          <textarea 
            placeholder="Enter email generation prompt (e.g., Write a job application email for a software engineer position)" 
            className="form-control"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            required
          />

          {/* Generate Email Button */}
          <button 
            onClick={handleGenerateEmail}
            className="btn btn-primary"
          >
            Generate Email
          </button>

          {/* Email Editor */}
          {generatedEmail && (
            <div className="email-editor">
              <textarea 
                value={editableEmail}
                onChange={(e) => setEditableEmail(e.target.value)}
                rows={8}
                className="form-control"
              />
              <button 
                onClick={handleSendEmail}
                className="btn btn-success"
              >
                Send Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailGenerator;