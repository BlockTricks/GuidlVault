#!/usr/bin/env node

/**
 * Quick verification script to check for common frontend issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking VaultGuard Frontend...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Check if required directories exist
const requiredDirs = ['app', 'components', 'hooks', 'lib', 'public'];
console.log('📁 Checking directories...');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`  ✅ ${dir}/ exists`);
    checks.passed++;
  } else {
    console.log(`  ❌ ${dir}/ missing`);
    checks.failed++;
  }
});

// Check if required files exist
const requiredFiles = [
  'app/layout.tsx',
  'app/page.tsx',
  'app/create/page.tsx',
  'app/vaults/page.tsx',
  'app/vaults/[id]/page.tsx',
  'app/submit/page.tsx',
  'app/dashboard/page.tsx',
  'app/judge/page.tsx',
  'hooks/useVaultGuard.ts',
  'hooks/useVaults.ts',
  'hooks/useSubmissions.ts',
  'lib/contract.ts',
  'lib/types.ts',
  'lib/wagmi.tsx',
  'components/navbar.tsx',
  'components/error-boundary.tsx',
  'components/states.tsx',
  'components/skeletons.tsx',
];

console.log('\n📄 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
    checks.passed++;
  } else {
    console.log(`  ❌ ${file} missing`);
    checks.failed++;
  }
});

// Check for common import issues
console.log('\n🔗 Checking imports...');
const filesToCheck = [
  'app/create/page.tsx',
  'app/vaults/page.tsx',
  'app/submit/page.tsx',
  'app/dashboard/page.tsx',
  'app/judge/page.tsx',
];

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for correct type imports
    if (content.includes('@/lib/types')) {
      console.log(`  ✅ ${file} - types imported correctly`);
      checks.passed++;
    } else if (content.includes('Severity') || content.includes('SubmissionStatus')) {
      console.log(`  ⚠️  ${file} - might need type imports`);
      checks.warnings++;
    }
    
    // Check for hook imports
    if (content.includes('@/hooks/')) {
      console.log(`  ✅ ${file} - uses custom hooks`);
      checks.passed++;
    }
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Summary:');
console.log(`  ✅ Passed: ${checks.passed}`);
console.log(`  ❌ Failed: ${checks.failed}`);
console.log(`  ⚠️  Warnings: ${checks.warnings}`);
console.log('='.repeat(50));

if (checks.failed === 0) {
  console.log('\n🎉 All checks passed! Frontend structure looks good.');
  console.log('\n💡 Next steps:');
  console.log('  1. Run: npm install (if not done)');
  console.log('  2. Run: npm run dev');
  console.log('  3. Visit: http://localhost:3000');
} else {
  console.log('\n⚠️  Some issues found. Please review the output above.');
  process.exit(1);
}

