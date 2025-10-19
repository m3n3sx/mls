#!/usr/bin/env node

/**
 * Kiro Hooks Validator
 * 
 * Validates all .kiro.hook files to ensure they have proper structure
 * and prevent "Cannot read properties of undefined (reading 'type')" errors
 */

const fs = require('fs');
const path = require('path');

const HOOKS_DIR = path.join(__dirname, 'hooks');
const REQUIRED_PROPERTIES = ['enabled', 'name', 'when', 'then'];
const REQUIRED_WHEN_PROPERTIES = ['type'];
const REQUIRED_THEN_PROPERTIES = ['type'];

function validateHookFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const hook = JSON.parse(content);
        
        const errors = [];
        
        // Check required top-level properties
        REQUIRED_PROPERTIES.forEach(prop => {
            if (!(prop in hook)) {
                errors.push(`Missing required property: ${prop}`);
            }
        });
        
        // Check 'when' object
        if (hook.when && typeof hook.when === 'object') {
            REQUIRED_WHEN_PROPERTIES.forEach(prop => {
                if (!(prop in hook.when)) {
                    errors.push(`Missing required property in 'when': ${prop}`);
                }
            });
        } else {
            errors.push("'when' must be an object");
        }
        
        // Check 'then' object
        if (hook.then && typeof hook.then === 'object') {
            REQUIRED_THEN_PROPERTIES.forEach(prop => {
                if (!(prop in hook.then)) {
                    errors.push(`Missing required property in 'then': ${prop}`);
                }
            });
        } else {
            errors.push("'then' must be an object");
        }
        
        return {
            file: path.basename(filePath),
            valid: errors.length === 0,
            errors: errors
        };
        
    } catch (error) {
        return {
            file: path.basename(filePath),
            valid: false,
            errors: [`JSON parse error: ${error.message}`]
        };
    }
}

function validateAllHooks() {
    if (!fs.existsSync(HOOKS_DIR)) {
        console.error('Hooks directory not found:', HOOKS_DIR);
        return;
    }
    
    const files = fs.readdirSync(HOOKS_DIR)
        .filter(file => file.endsWith('.kiro.hook'));
    
    console.log(`Validating ${files.length} hook files...\n`);
    
    let totalValid = 0;
    let totalInvalid = 0;
    
    files.forEach(file => {
        const filePath = path.join(HOOKS_DIR, file);
        const result = validateHookFile(filePath);
        
        if (result.valid) {
            console.log(`✅ ${result.file} - VALID`);
            totalValid++;
        } else {
            console.log(`❌ ${result.file} - INVALID`);
            result.errors.forEach(error => {
                console.log(`   - ${error}`);
            });
            totalInvalid++;
        }
    });
    
    console.log(`\nValidation Summary:`);
    console.log(`Valid hooks: ${totalValid}`);
    console.log(`Invalid hooks: ${totalInvalid}`);
    
    if (totalInvalid > 0) {
        console.log(`\n⚠️  Fix invalid hooks to prevent "Cannot read properties of undefined" errors`);
        process.exit(1);
    } else {
        console.log(`\n✅ All hooks are valid!`);
    }
}

// Run validation
validateAllHooks();