// Quick switch script to toggle between mock and real authentication
// Run this script to switch between mock and real Firebase authentication

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/loginModal/LoginModal.jsx',
  'src/components/userDropdown/UserDropdown.jsx',
  'src/components/header/Header.jsx'
];

const mockImport = 'import { authService } from "../../utils/authService.mock";';
const realImport = 'import { authService } from "../../utils/authService";';

function switchToRealAuth() {
  console.log('🔄 Switching to REAL Firebase authentication...');
  
  filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(mockImport, realImport);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`❌ File not found: ${filePath}`);
    }
  });
  
  console.log('🎉 Switched to real Firebase authentication!');
  console.log('📝 Make sure to update your Firebase config in src/firebase/config.js');
}

function switchToMockAuth() {
  console.log('🔄 Switching to MOCK authentication...');
  
  filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(realImport, mockImport);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`❌ File not found: ${filePath}`);
    }
  });
  
  console.log('🎉 Switched to mock authentication!');
}

// Get command line argument
const command = process.argv[2];

if (command === 'real') {
  switchToRealAuth();
} else if (command === 'mock') {
  switchToMockAuth();
} else {
  console.log('Usage:');
  console.log('  node switch-auth.js real  - Switch to real Firebase auth');
  console.log('  node switch-auth.js mock  - Switch to mock auth');
}

