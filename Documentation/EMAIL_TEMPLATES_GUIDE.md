# FinMan - Email Templates Guide

## Overview
This document provides detailed email templates and personalization guidelines for FinMan's email system using Nodemailer.

## Email Template Structure

### Template Variables
All email templates support the following variables:
- `{{userName}}` - User's first name or full name
- `{{userEmail}}` - User's email address
- `{{appName}}` - Application name (FinMan)
- `{{appUrl}}` - Base URL of the application
- `{{supportEmail}}` - Support email address
- `{{currentYear}}` - Current year

## Email Templates

### 1. Welcome Email

**Trigger**: After user registration  
**Subject**: Welcome to FinMan - Your Personal Financial Manager  
**Priority**: High

**Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #2563EB 0%, #10B981 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; background: #f9fafb; }
    .button { display: inline-block; padding: 14px 32px; background: #2563EB; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .button:hover { background: #1d4ed8; }
    .features { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; }
    .features ul { list-style: none; padding: 0; }
    .features li { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .features li:last-child { border-bottom: none; }
    .features li:before { content: "✓ "; color: #10B981; font-weight: bold; margin-right: 10px; }
    .footer { padding: 30px; text-align: center; color: #6b7280; font-size: 14px; background: #ffffff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to FinMan!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Your Personal Financial Manager</p>
    </div>
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>Thank you for joining <strong>FinMan</strong>! We're thrilled to have you on board and excited to help you take control of your finances.</p>
      
      <div class="features">
        <h3 style="margin-top: 0; color: #2563EB;">What you can do with FinMan:</h3>
        <ul>
          <li>Track your income and expenses effortlessly</li>
          <li>Create and manage budgets that work</li>
          <li>Set and achieve your financial goals</li>
          <li>Get AI-powered insights and recommendations</li>
          <li>Generate detailed financial reports</li>
          <li>Upload and process receipts automatically</li>
          <li>Monitor your investments and portfolio</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="{{appUrl}}/dashboard" class="button">Get Started Now</a>
      </p>

      <p>If you have any questions or need help getting started, our support team is here for you. Just reply to this email or contact us at {{supportEmail}}.</p>

      <p>Here's to better financial management! 🎉</p>

      <p>Best regards,<br>
      <strong>The FinMan Team</strong></p>
    </div>
    <div class="footer">
      <p>© {{currentYear}} FinMan. All rights reserved.</p>
      <p>You're receiving this email because you signed up for FinMan.</p>
    </div>
  </div>
</body>
</html>
```

### 2. Password Reset Email

**Trigger**: User requests password reset  
**Subject**: Reset Your FinMan Password  
**Priority**: High  
**Expiration**: 1 hour

**Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #2563EB; color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; background: #f9fafb; }
    .button { display: inline-block; padding: 14px 32px; background: #2563EB; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .link-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; word-break: break-all; font-family: monospace; font-size: 12px; }
    .footer { padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>We received a request to reset your password for your FinMan account ({{userEmail}}).</p>
      
      <p style="text-align: center;">
        <a href="{{resetUrl}}" class="button">Reset My Password</a>
      </p>

      <div class="link-box">
        <p style="margin: 0;"><strong>Or copy and paste this link:</strong></p>
        <p style="margin: 5px 0 0 0;">{{resetUrl}}</p>
      </div>

      <div class="warning-box">
        <p style="margin: 0;"><strong>⚠️ Important:</strong> This password reset link will expire in <strong>1 hour</strong> for security reasons.</p>
      </div>

      <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
      
      <p>If you're concerned about your account security, please contact our support team immediately at {{supportEmail}}.</p>

      <p>Best regards,<br>
      <strong>The FinMan Team</strong></p>
    </div>
    <div class="footer">
      <p>© {{currentYear}} FinMan. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
```

### 3. Budget Alert Email

**Trigger**: Budget reaches threshold or is exceeded  
**Subject**: Budget Alert: {{budgetName}}  
**Priority**: Medium

**Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: {{alertColor}}; color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; background: #f9fafb; }
    .stats-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; }
    .stat-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .stat-row:last-child { border-bottom: none; }
    .stat-label { color: #6b7280; }
    .stat-value { font-weight: 600; color: #1f2937; }
    .progress-container { margin: 20px 0; }
    .progress-bar { background: #e5e7eb; height: 24px; border-radius: 12px; overflow: hidden; }
    .progress-fill { background: {{alertColor}}; height: 100%; width: {{percentage}}%; transition: width 0.3s; }
    .button { display: inline-block; padding: 14px 32px; background: #2563EB; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{alertTitle}}</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">{{budgetName}}</p>
    </div>
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>{{alertMessage}}</p>

      <div class="stats-box">
        <h3 style="margin-top: 0; color: #2563EB;">Budget Details</h3>
        <div class="stat-row">
          <span class="stat-label">Budget Name:</span>
          <span class="stat-value">{{budgetName}}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Amount Spent:</span>
          <span class="stat-value">{{spent}} {{currency}}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Budget Limit:</span>
          <span class="stat-value">{{limit}} {{currency}}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Remaining:</span>
          <span class="stat-value" style="color: {{remainingColor}};">{{remaining}} {{currency}}</span>
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <p style="text-align: center; margin: 10px 0 0 0; font-weight: 600;">{{percentage}}% Used</p>
        </div>
      </div>

      <p style="text-align: center;">
        <a href="{{appUrl}}/budgets" class="button">View Budgets</a>
      </p>

      <p>Best regards,<br>
      <strong>The FinMan Team</strong></p>
    </div>
    <div class="footer">
      <p>© {{currentYear}} FinMan. All rights reserved.</p>
      <p>Manage your email preferences in your account settings.</p>
    </div>
  </div>
</body>
</html>
```

### 4. Goal Progress Email

**Trigger**: Weekly/monthly goal progress updates or milestones  
**Subject**: Goal Update: {{goalTitle}}  
**Priority**: Low

**Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #10B981 0%, #2563EB 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; background: #f9fafb; }
    .stats-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; }
    .progress-bar { background: #e5e7eb; height: 24px; border-radius: 12px; overflow: hidden; margin: 15px 0; }
    .progress-fill { background: linear-gradient(90deg, #10B981 0%, #2563EB 100%); height: 100%; width: {{percentage}}%; }
    .milestone { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; }
    .button { display: inline-block; padding: 14px 32px; background: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Goal Progress Update</h1>
    </div>
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>Great progress on your financial goal!</p>

      <div class="stats-box">
        <h3 style="margin-top: 0; color: #2563EB;">{{goalTitle}}</h3>
        <p><strong>Current Amount:</strong> {{currentAmount}} {{currency}}</p>
        <p><strong>Target Amount:</strong> {{targetAmount}} {{currency}}</p>
        <p><strong>Remaining:</strong> {{remaining}} {{currency}}</p>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <p style="text-align: center; font-size: 24px; font-weight: bold; color: #10B981;">{{percentage}}% Complete</p>
      </div>

      {{#if milestone}}
      <div class="milestone">
        <p style="margin: 0; font-size: 18px; font-weight: 600;">🎉 Milestone Reached!</p>
        <p style="margin: 5px 0 0 0;">You've reached {{milestone}}% of your goal!</p>
      </div>
      {{/if}}

      <p style="text-align: center;">
        <a href="{{appUrl}}/goals" class="button">View All Goals</a>
      </p>

      <p>Keep up the excellent work! You're making great progress toward your financial goals.</p>

      <p>Best regards,<br>
      <strong>The FinMan Team</strong></p>
    </div>
    <div class="footer">
      <p>© {{currentYear}} FinMan. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### 5. Weekly Summary Email

**Trigger**: Every Monday at 9 AM  
**Subject**: Your Weekly Financial Summary  
**Priority**: Low

**Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #2563EB 0%, #10B981 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; background: #f9fafb; }
    .summary-box { background: white; padding: 25px; border-radius: 8px; margin: 15px 0; }
    .stat-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .stat-row:last-child { border-bottom: none; }
    .positive { color: #10B981; font-weight: 600; }
    .negative { color: #dc2626; font-weight: 600; }
    .button { display: inline-block; padding: 14px 32px; background: #2563EB; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Weekly Financial Summary</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">{{weekRange}}</p>
    </div>
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>Here's your weekly financial summary:</p>

      <div class="summary-box">
        <h3 style="margin-top: 0; color: #2563EB;">Income & Expenses</h3>
        <div class="stat-row">
          <span>Total Income:</span>
          <span class="positive">+{{totalIncome}} {{currency}}</span>
        </div>
        <div class="stat-row">
          <span>Total Expenses:</span>
          <span class="negative">-{{totalExpenses}} {{currency}}</span>
        </div>
        <div class="stat-row" style="border-top: 2px solid #2563EB; margin-top: 10px; padding-top: 15px;">
          <span style="font-weight: 600;">Net:</span>
          <span style="font-weight: 600; font-size: 18px; color: {{netColor}};">{{netAmount}} {{currency}}</span>
        </div>
      </div>

      <div class="summary-box">
        <h3 style="margin-top: 0; color: #2563EB;">Top Spending Categories</h3>
        {{#each topCategories}}
        <div class="stat-row">
          <span>{{category}}</span>
          <span>{{amount}} {{../currency}}</span>
        </div>
        {{/each}}
      </div>

      <p style="text-align: center;">
        <a href="{{appUrl}}/reports" class="button">View Full Report</a>
      </p>

      <p>Best regards,<br>
      <strong>The FinMan Team</strong></p>
    </div>
    <div class="footer">
      <p>© {{currentYear}} FinMan. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### 6. Monthly Report Email

**Trigger**: First day of month at 9 AM  
**Subject**: Your Monthly Financial Report - {{monthName}}  
**Priority**: Low

**Template**: Similar to weekly summary but with monthly data and additional insights.

## Personalization Best Practices

### 1. Use User's Name
Always address users by their first name when available.

### 2. Dynamic Content
- Include relevant financial data
- Show progress bars and percentages
- Highlight achievements and milestones
- Provide actionable insights

### 3. Responsive Design
- Mobile-friendly templates
- Test on various email clients
- Use inline CSS for better compatibility

### 4. Clear Call-to-Actions
- Use prominent buttons
- Provide direct links to relevant pages
- Make actions clear and easy

### 5. Brand Consistency
- Use FinMan brand colors
- Maintain professional tone
- Include logo and branding elements

## Email Testing

### Development
- Use Mailtrap for testing
- Test all template variables
- Verify responsive design
- Check spam score

### Production
- Monitor email delivery rates
- Track open and click rates
- Handle bounces and unsubscribes
- Maintain email logs

## Email Preferences

Users can manage email preferences:
- Welcome emails
- Budget alerts
- Goal updates
- Weekly summaries
- Monthly reports
- Transaction alerts
- Marketing emails

---

**Last Updated**: 2024  
**Version**: 1.0

