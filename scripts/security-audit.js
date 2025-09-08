#!/usr/bin/env node

/**
 * Security Audit Script for SA IS A MOVIE
 * Checks for exposed secrets, API keys, and security vulnerabilities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Security patterns to check for
const SECURITY_PATTERNS = {
  // API Keys and Secrets
  apiKeys: [
    /sk_live_[a-zA-Z0-9]{24,}/g, // Stripe live keys
    /sk_test_[a-zA-Z0-9]{24,}/g, // Stripe test keys
    /pk_live_[a-zA-Z0-9]{24,}/g, // Stripe public keys
    /pk_test_[a-zA-Z0-9]{24,}/g, // Stripe test public keys
    /AIza[0-9A-Za-z\\-_]{35}/g, // Google API keys
    /ya29\.[0-9A-Za-z\\-_]+/g, // Google OAuth tokens
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, // UUIDs (potential secrets)
    /[A-Za-z0-9+/]{40,}={0,2}/g, // Base64 encoded secrets
  ],
  
  // Database URLs
  databaseUrls: [
    /mongodb:\/\/[^\s]+/g,
    /postgres:\/\/[^\s]+/g,
    /mysql:\/\/[^\s]+/g,
    /redis:\/\/[^\s]+/g,
  ],
  
  // JWT Tokens
  jwtTokens: [
    /eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g,
  ],
  
  // Private Keys
  privateKeys: [
    /-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/g,
    /-----BEGIN RSA PRIVATE KEY-----[\s\S]*?-----END RSA PRIVATE KEY-----/g,
  ],
  
  // AWS Keys
  awsKeys: [
    /AKIA[0-9A-Z]{16}/g, // AWS Access Key ID
    /[A-Za-z0-9/+=]{40}/g, // AWS Secret Access Key
  ],
  
  // GitHub Tokens
  githubTokens: [
    /ghp_[A-Za-z0-9]{36}/g, // GitHub Personal Access Token
    /gho_[A-Za-z0-9]{36}/g, // GitHub OAuth Token
    /ghu_[A-Za-z0-9]{36}/g, // GitHub User Token
    /ghs_[A-Za-z0-9]{36}/g, // GitHub Server Token
    /ghr_[A-Za-z0-9]{36}/g, // GitHub Refresh Token
  ],
  
  // Auth0 Tokens
  auth0Tokens: [
    /[A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}/g, // Auth0 JWT
  ],
  
  // Contentful Tokens
  contentfulTokens: [
    /CFPAT-[A-Za-z0-9_-]{40}/g, // Contentful Personal Access Token
    /[A-Za-z0-9_-]{43}/g, // Contentful Access Token
  ]
};

// Files to exclude from scanning
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /\.env\.example$/,
  /\.env\.local\.backup$/,
  /\.lock$/,
  /\.log$/,
  /\.md$/,
  /\.html$/,
  /\.css$/,
  /\.scss$/,
  /\.sass$/,
  /\.less$/,
  /\.json$/,
  /\.xml$/,
  /\.yml$/,
  /\.yaml$/,
  /\.toml$/,
  /\.svg$/,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.gif$/,
  /\.ico$/,
  /\.woff$/,
  /\.woff2$/,
  /\.ttf$/,
  /\.eot$/,
  /\.map$/,
];

// Required environment variables
const REQUIRED_ENV_VARS = {
  // Client-side (VITE_ prefix)
  client: [
    'VITE_CONTENTFUL_SPACE_ID',
    'VITE_CONTENTFUL_ACCESS_TOKEN',
    'VITE_CLERK_PUBLISHABLE_KEY',
    'VITE_GOOGLE_VISION_API_KEY',
    'VITE_GEMINI_API_KEY',
    'VITE_GOOGLE_API_KEY',
  ],
  
  // Server-side (no VITE_ prefix)
  server: [
    'CLERK_SECRET_KEY',
    'GITHUB_TOKEN',
    'GITHUB_OWNER',
    'GITHUB_REPO',
  ]
};

class SecurityAuditor {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.info = [];
  }

  log(level, message, details = null) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, details };
    
    switch (level) {
      case 'ERROR':
        this.issues.push(logEntry);
        console.log(`${colors.red}❌ ERROR:${colors.reset} ${message}`);
        break;
      case 'WARNING':
        this.warnings.push(logEntry);
        console.log(`${colors.yellow}⚠️  WARNING:${colors.reset} ${message}`);
        break;
      case 'INFO':
        this.info.push(logEntry);
        console.log(`${colors.blue}ℹ️  INFO:${colors.reset} ${message}`);
        break;
      case 'SUCCESS':
        console.log(`${colors.green}✅ SUCCESS:${colors.reset} ${message}`);
        break;
    }
    
    if (details) {
      console.log(`${colors.cyan}   Details:${colors.reset} ${JSON.stringify(details, null, 2)}`);
    }
  }

  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Check for security patterns
      for (const [category, patterns] of Object.entries(SECURITY_PATTERNS)) {
        for (const pattern of patterns) {
          const matches = content.match(pattern);
          if (matches) {
            this.log('ERROR', `Potential ${category} found in ${relativePath}`, {
              matches: matches.slice(0, 3), // Show first 3 matches
              totalMatches: matches.length
            });
          }
        }
      }
      
      // Check for hardcoded environment variables
      const envVarPattern = /process\.env\.([A-Z_]+)/g;
      const envMatches = [...content.matchAll(envVarPattern)];
      
      for (const match of envMatches) {
        const envVar = match[1];
        if (envVar.startsWith('VITE_') && !content.includes(`import.meta.env.${envVar}`)) {
          this.log('WARNING', `Inconsistent environment variable usage in ${relativePath}`, {
            variable: envVar,
            suggestion: 'Use import.meta.env for client-side variables'
          });
        }
      }
      
    } catch (error) {
      this.log('WARNING', `Could not scan file ${filePath}`, { error: error.message });
    }
  }

  async scanDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip excluded directories
          if (!EXCLUDE_PATTERNS.some(pattern => pattern.test(fullPath))) {
            await this.scanDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          // Skip excluded files
          if (!EXCLUDE_PATTERNS.some(pattern => pattern.test(fullPath))) {
            await this.scanFile(fullPath);
          }
        }
      }
    } catch (error) {
      this.log('WARNING', `Could not scan directory ${dirPath}`, { error: error.message });
    }
  }

  checkEnvironmentVariables() {
    this.log('INFO', 'Checking environment variables...');
    
    // Check for .env files
    const envFiles = ['.env', '.env.local', '.env.production', '.env.development'];
    const existingEnvFiles = envFiles.filter(file => fs.existsSync(file));
    
    if (existingEnvFiles.length === 0) {
      this.log('WARNING', 'No .env files found', {
        suggestion: 'Create .env files for environment variables'
      });
    } else {
      this.log('SUCCESS', `Found environment files: ${existingEnvFiles.join(', ')}`);
    }
    
    // Check required environment variables
    for (const [type, vars] of Object.entries(REQUIRED_ENV_VARS)) {
      for (const varName of vars) {
        if (process.env[varName]) {
          this.log('SUCCESS', `${varName} is set`);
        } else {
          this.log('WARNING', `${varName} is not set`, {
            type: type,
            suggestion: type === 'client' ? 'Set in .env file' : 'Set in Netlify dashboard'
          });
        }
      }
    }
  }

  checkNetlifyConfiguration() {
    this.log('INFO', 'Checking Netlify configuration...');
    
    if (fs.existsSync('netlify.toml')) {
      const config = fs.readFileSync('netlify.toml', 'utf8');
      
      // Check for secrets scanning configuration
      if (config.includes('SECRETS_SCAN_OMIT_KEYS')) {
        this.log('SUCCESS', 'Secrets scanning is configured');
      } else {
        this.log('WARNING', 'Secrets scanning not configured', {
          suggestion: 'Add SECRETS_SCAN_OMIT_KEYS to netlify.toml'
        });
      }
      
      // Check for environment variables in config
      const envVarMatches = config.match(/[A-Z_]+ = /g);
      if (envVarMatches) {
        this.log('WARNING', 'Environment variables found in netlify.toml', {
          suggestion: 'Move sensitive variables to Netlify dashboard'
        });
      }
    } else {
      this.log('WARNING', 'netlify.toml not found');
    }
  }

  checkGitIgnore() {
    this.log('INFO', 'Checking .gitignore configuration...');
    
    if (fs.existsSync('.gitignore')) {
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      
      const requiredIgnores = ['.env', '.env.local', '.env.*.local', 'node_modules', 'dist'];
      const missingIgnores = requiredIgnores.filter(ignore => !gitignore.includes(ignore));
      
      if (missingIgnores.length === 0) {
        this.log('SUCCESS', 'All required files are in .gitignore');
      } else {
        this.log('WARNING', 'Missing entries in .gitignore', {
          missing: missingIgnores
        });
      }
    } else {
      this.log('ERROR', '.gitignore file not found');
    }
  }

  generateReport() {
    console.log(`\n${colors.bold}${colors.cyan}=== SECURITY AUDIT REPORT ===${colors.reset}\n`);
    
    console.log(`${colors.bold}Summary:${colors.reset}`);
    console.log(`  ${colors.red}Errors: ${this.issues.length}${colors.reset}`);
    console.log(`  ${colors.yellow}Warnings: ${this.warnings.length}${colors.reset}`);
    console.log(`  ${colors.blue}Info: ${this.info.length}${colors.reset}`);
    
    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log(`\n${colors.green}${colors.bold}🎉 No security issues found!${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}${colors.bold}⚠️  Please review the issues above${colors.reset}`);
    }
    
    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        errors: this.issues.length,
        warnings: this.warnings.length,
        info: this.info.length
      },
      issues: this.issues,
      warnings: this.warnings,
      info: this.info
    };
    
    fs.writeFileSync('security-audit-report.json', JSON.stringify(report, null, 2));
    this.log('SUCCESS', 'Security audit report saved to security-audit-report.json');
  }

  async run() {
    console.log(`${colors.bold}${colors.cyan}🔍 Starting Security Audit...${colors.reset}\n`);
    
    // Check environment variables
    this.checkEnvironmentVariables();
    
    // Check Netlify configuration
    this.checkNetlifyConfiguration();
    
    // Check .gitignore
    this.checkGitIgnore();
    
    // Scan source code
    this.log('INFO', 'Scanning source code for security issues...');
    await this.scanDirectory('./src');
    await this.scanDirectory('./netlify/functions');
    
    // Generate report
    this.generateReport();
  }
}

// Run the audit
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new SecurityAuditor();
  auditor.run().catch(console.error);
}

export default SecurityAuditor;
