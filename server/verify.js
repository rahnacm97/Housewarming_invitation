/**
 * Backend Architecture Verification Script
 * Validates backend architecture (models, repositories, services) and performs compilation sanity checks.
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('--- STARTING SERVER ARCHITECTURE VERIFICATION ---');

// Check key files exist
const requiredFiles = [
  'src/models/rsvp.model.js',
  'src/repositories/base.repository.js',
  'src/repositories/rsvp.repository.js',
  'src/services/rsvp.service.js',
  'src/controllers/rsvp.controller.js',
  'src/routes/rsvp.routes.js',
  'src/app.js'
];

let allExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`[OK] Found file: ${file}`);
  } else {
    console.error(`[ERROR] Missing file: ${file}`);
    allExist = false;
  }
});

if (!allExist) {
  console.error('\nVerification failed: Some critical files are missing.');
  process.exit(1);
}

// Dry run loading backend components
try {
  console.log('\n--- VERIFYING BACKEND ARCHITECTURE & COUPLING ---');
  
  console.log('Loading Mongoose Model...');
  const RsvpModel = require('./src/models/rsvp.model');
  
  console.log('Loading Base Repository...');
  const BaseRepository = require('./src/repositories/base.repository');
  
  console.log('Loading RSVP Repository...');
  const RsvpRepository = require('./src/repositories/rsvp.repository');
  const repoInstance = new RsvpRepository();
  console.log(`  -> Repository instantiated successfully. Instantiated model: ${repoInstance.model.modelName}`);

  console.log('Loading RSVP Service...');
  const RsvpService = require('./src/services/rsvp.service');
  const serviceInstance = new RsvpService(repoInstance);
  console.log('  -> Service instantiated with Repository dependency successfully.');

  console.log('Loading Express App Router...');
  const app = require('./src/app');
  console.log('  -> Express configurations loaded correctly.');

  console.log('\n[PASS] Backend repository architecture, services, and SOLID coupling verify successfully!');
} catch (error) {
  console.error('\n[FAIL] Backend architecture verification failed:', error.stack);
  process.exit(1);
}

console.log('\n--- VERIFICATION COMPLETED SUCCESSFULLY ---');
process.exit(0);
