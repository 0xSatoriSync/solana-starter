import * as fs from 'fs';
import { execSync } from 'child_process';
import * as path from 'path';

// Get the file to compile from command line arguments
const fileToCompile = process.argv[2];
if (!fileToCompile) {
    console.error('Please specify a file to compile');
    process.exit(1);
}

// Path to tsconfig
const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');

// Read the current tsconfig
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

// Store the original include
const originalInclude = tsconfig.include;

try {
    // Modify the include to only include our target file
    tsconfig.include = [fileToCompile];
    
    // Write the modified config
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    
    // Run the compilation
    execSync('tsc', { stdio: 'inherit' });
    
} catch (error) {
    console.error('Compilation failed:', error);
    
} finally {
    // Restore the original config
    tsconfig.include = originalInclude;
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
} 