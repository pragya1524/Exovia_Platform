export interface EmailConfig {
  service: 'gmail' | 'sendgrid' | 'resend' | 'smtp';
  user?: string;
  pass?: string;
  apiKey?: string;
  host?: string;
  port?: number;
  from?: string;
  secure?: boolean;
}

export const getEmailConfig = (): EmailConfig | null => {
  const service = process.env.EMAIL_SERVICE as EmailConfig['service'];
  
  console.log('🔍 Email Config Debug:');
  console.log('  EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
  console.log('  EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
  
  if (!service) {
    console.log('Email service not configured. Set EMAIL_SERVICE in your environment variables.');
    return null;
  }

  switch (service) {
    case 'gmail':
      const gmailConfig: EmailConfig = {
        service: 'gmail',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        from: process.env.EMAIL_USER
      };
      console.log('  Gmail config:', { ...gmailConfig, pass: gmailConfig.pass ? 'SET' : 'NOT SET' });
      return gmailConfig;
    
    case 'sendgrid':
      return {
        service: 'sendgrid',
        apiKey: process.env.SENDGRID_API_KEY,
        from: process.env.EMAIL_FROM || 'noreply@Exovia.com'
      };
    
    case 'resend':
      return {
        service: 'resend',
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.EMAIL_FROM || 'noreply@Exovia.com'
      };
    
    case 'smtp':
      return {
        service: 'smtp',
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.EMAIL_FROM || 'noreply@Exovia.com',
        secure: process.env.SMTP_SECURE === 'true'
      };
    
    default:
      console.log(`Unsupported email service: ${service}`);
      return null;
  }
};

export const isEmailConfigured = (): boolean => {
  const config = getEmailConfig();
  if (!config) return false;
  
  switch (config.service) {
    case 'gmail':
      return !!(config.user && config.pass);
    case 'sendgrid':
      return !!config.apiKey;
    case 'resend':
      return !!config.apiKey;
    case 'smtp':
      return !!(config.host && config.user && config.pass);
    default:
      return false;
  }
}; 