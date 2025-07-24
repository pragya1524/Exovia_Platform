import nodemailer from 'nodemailer';
import { getEmailConfig, isEmailConfigured } from '../config/email.config';

// Create transporter based on configuration
const createTransporter = () => {
  if (!isEmailConfigured()) {
    console.log('Email credentials not configured. Emails will be logged instead.');
    return null;
  }

  const config = getEmailConfig();
  if (!config) return null;

  switch (config.service) {
    case 'gmail':
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

    case 'smtp':
      return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

    case 'sendgrid':
    case 'resend':
      // These will be handled by their respective SDKs
      return null;

    default:
      console.log(`Unsupported email service: ${config.service}`);
      return null;
  }
};

const transporter = createTransporter();

// Beautiful email templates
const getWelcomeEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Exovia</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to Exovia!</h1>
            <p>Your Excel Analytics Journey Begins</p>
        </div>
        <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Welcome to Exovia Excel Analytics! We're excited to have you on board and can't wait to help you transform your data into powerful insights.</p>
            
            <h3>🚀 What you can do with Exovia:</h3>
            <ul>
                <li>Upload and analyze Excel files instantly</li>
                <li>Create stunning 2D and 3D visualizations</li>
                <li>Generate AI-powered insights from your data</li>
                <li>Share and collaborate on analytics projects</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Get Started Now</a>
            </div>
            
            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
        </div>
        <div class="footer">
            <p>© 2024 Exovia Analytics. All rights reserved.</p>
            <p>This email was sent to you because you signed up for Exovia Analytics.</p>
        </div>
    </div>
</body>
</html>
`;

const getPasswordResetTemplate = (resetLink: string, name: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>Secure your Exovia account</p>
        </div>
        <div class="content">
            <h2>Hello ${name}!</h2>
            <p>We received a request to reset your password for your Exovia Analytics account.</p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset My Password</a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                    <li>This link will expire in 1 hour</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Never share this link with anyone</li>
                </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetLink}</p>
        </div>
        <div class="footer">
            <p>© 2024 Exovia Analytics. All rights reserved.</p>
            <p>This email was sent to you because you requested a password reset.</p>
        </div>
    </div>
</body>
</html>
`;

const getAnalysisCompleteTemplate = (name: string, analysisName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analysis Complete</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Analysis Complete!</h1>
            <p>Your insights are ready</p>
        </div>
        <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Great news! Your analysis is complete and ready for review.</p>
            
            <div class="success">
                <h3>📊 Analysis: ${analysisName}</h3>
                <p>Your data has been processed and analyzed successfully. You can now view your results and insights.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">View Results</a>
            </div>
            
            <p>Your analysis includes:</p>
            <ul>
                <li>📈 Interactive visualizations</li>
                <li>🧠 AI-powered insights</li>
                <li>📋 Detailed reports</li>
                <li>💡 Actionable recommendations</li>
            </ul>
        </div>
        <div class="footer">
            <p>© 2024 Exovia Analytics. All rights reserved.</p>
            <p>This email was sent to you because your analysis is complete.</p>
        </div>
    </div>
</body>
</html>
`;

const getPasswordChangeTemplate = (name: string, timestamp: string, ipAddress?: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff7675 0%, #d63031 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #ff7675 0%, #d63031 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .info { background: #e3f2fd; border: 1px solid #bbdefb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Changed</h1>
            <p>Your Exovia account security update</p>
        </div>
        <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your password for your Exovia Analytics account has been successfully changed.</p>
            
            <div class="info">
                <h3>📅 Change Details:</h3>
                <p><strong>Time:</strong> ${timestamp}</p>
                ${ipAddress ? `<p><strong>IP Address:</strong> ${ipAddress}</p>` : ''}
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                    <li>If you didn't make this change, please contact support immediately</li>
                    <li>Consider enabling two-factor authentication for extra security</li>
                    <li>Never share your password with anyone</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">Go to Dashboard</a>
            </div>
            
            <p>If you have any questions or concerns about this change, please don't hesitate to contact our support team.</p>
        </div>
        <div class="footer">
            <p>© 2024 Exovia Analytics. All rights reserved.</p>
            <p>This email was sent to you because your password was changed.</p>
        </div>
    </div>
</body>
</html>
`;

// Email sending functions
export async function sendWelcomeEmail(to: string, name: string) {
  const config = getEmailConfig();
  
  if (!config) {
    console.log(`[EMAIL LOG] Welcome email would be sent to ${to} for user ${name}`);
    return;
  }

  const mailOptions = {
    from: config.from || 'noreply@Exovia.com',
    to,
    subject: '🎉 Welcome to Exovia Analytics!',
    html: getWelcomeEmailTemplate(name)
  };
  
  try {
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${to}`);
    } else {
      console.log(`[EMAIL LOG] Welcome email would be sent to ${to} for user ${name}`);
    }
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
  }
}

export async function sendPasswordResetEmail(to: string, resetLink: string, name: string) {
  const config = getEmailConfig();
  
  if (!config) {
    console.log(`[EMAIL LOG] Password reset email would be sent to ${to} with link: ${resetLink}`);
    return;
  }

  const mailOptions = {
    from: config.from || 'noreply@Exovia.com',
    to,
    subject: '🔐 Reset Your Exovia Password',
    html: getPasswordResetTemplate(resetLink, name)
  };
  
  try {
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${to}`);
    } else {
      console.log(`[EMAIL LOG] Password reset email would be sent to ${to} with link: ${resetLink}`);
    }
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
  }
}

export async function sendAnalysisCompleteEmail(to: string, name: string, analysisName: string) {
  const config = getEmailConfig();
  
  if (!config) {
    console.log(`[EMAIL LOG] Analysis complete email would be sent to ${to} for analysis: ${analysisName}`);
    return;
  }

  const mailOptions = {
    from: config.from || 'noreply@Exovia.com',
    to,
    subject: '✅ Your Analysis is Ready!',
    html: getAnalysisCompleteTemplate(name, analysisName)
  };
  
  try {
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Analysis complete email sent to ${to}`);
    } else {
      console.log(`[EMAIL LOG] Analysis complete email would be sent to ${to} for analysis: ${analysisName}`);
    }
  } catch (error) {
    console.error('❌ Failed to send analysis completion email:', error);
  }
}

export async function sendPasswordChangeEmail(to: string, name: string, ipAddress?: string) {
  const config = getEmailConfig();
  
  if (!config) {
    console.log(`[EMAIL LOG] Password change email would be sent to ${to} for user ${name}`);
    return;
  }

  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const mailOptions = {
    from: config.from || 'noreply@Exovia.com',
    to,
    subject: '🔐 Your Exovia Password Has Been Changed',
    html: getPasswordChangeTemplate(name, timestamp, ipAddress)
  };
  
  try {
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Password change email sent to ${to}`);
    } else {
      console.log(`[EMAIL LOG] Password change email would be sent to ${to} for user ${name}`);
    }
  } catch (error) {
    console.error('❌ Failed to send password change email:', error);
  }
}

// Test email function
export async function sendTestEmail(to: string) {
  const config = getEmailConfig();
  
  if (!config) {
    console.log(`[EMAIL LOG] Test email would be sent to ${to}`);
    return;
  }

  const mailOptions = {
    from: config.from || 'noreply@Exovia.com',
    to,
    subject: '🧪 Exovia Email Test',
    html: `
      <h2>Email Test Successful!</h2>
      <p>This is a test email from Exovia Analytics to verify your email configuration is working correctly.</p>
      <p>If you received this email, your email service is properly configured! 🎉</p>
    `
  };
  
  try {
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Test email sent to ${to}`);
      return true;
    } else {
      console.log(`[EMAIL LOG] Test email would be sent to ${to}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    return false;
  }
} 