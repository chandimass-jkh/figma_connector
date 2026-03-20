#!/usr/bin/env node

/**
 * Main Diagram Generator CLI
 * Usage: node generate.js --type <type> --name <name> [--spec <spec-file>]
 */

import { DiagramGenerator } from '../core/diagram-generator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '../..');

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(`--${name}`);
  return index !== -1 ? args[index + 1] : null;
};

const diagramType = getArg('type');
const diagramName = getArg('name');
const specFile = getArg('spec');
const templateName = getArg('template');

// Validate inputs
if (!diagramName) {
  console.error('❌ Error: --name is required');
  process.exit(1);
}

if (!diagramType && !templateName) {
  console.error('❌ Error: --type or --template is required');
  process.exit(1);
}

console.log('🎨 Claude Figma Diagram Generator\n');
console.log(`📋 Diagram: ${diagramName}`);
console.log(`📊 Type: ${diagramType || `template:${templateName}`}\n`);

// Create diagram folder structure
const diagramDir = path.join(ROOT_DIR, 'diagrams', diagramName);
const inputsDir = path.join(diagramDir, 'inputs');
const outputsDir = path.join(diagramDir, 'created_diagrams');

[diagramDir, inputsDir, outputsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${path.relative(ROOT_DIR, dir)}`);
  }
});

// Initialize generator
const generator = new DiagramGenerator();

let diagramSpec;

// Load from template or spec file
if (templateName) {
  const templatePath = path.join(ROOT_DIR, 'src/templates', `${templateName}.json`);

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template not found: ${templateName}`);
    console.error(`   Available templates in src/templates/`);
    process.exit(1);
  }

  diagramSpec = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  console.log(`📄 Loaded template: ${templateName}`);

} else if (specFile) {
  const fullSpecPath = path.isAbsolute(specFile)
    ? specFile
    : path.join(inputsDir, specFile);

  if (!fs.existsSync(fullSpecPath)) {
    console.error(`❌ Spec file not found: ${fullSpecPath}`);
    process.exit(1);
  }

  diagramSpec = JSON.parse(fs.readFileSync(fullSpecPath, 'utf8'));
  console.log(`📄 Loaded spec: ${path.basename(fullSpecPath)}`);

} else {
  console.error('❌ Error: --spec or --template is required');
  process.exit(1);
}

// Generate diagram
let diagram;

try {
  // Determine type from spec or command line
  const effectiveType = diagramType || diagramSpec.type;

  switch (effectiveType) {
    case 'er-diagram':
      diagram = generator.generateERDiagram(diagramSpec);
      break;
    case 'flowchart':
      diagram = generator.generateFlowchart(diagramSpec);
      break;
    case 'architecture':
      diagram = generator.generateArchitectureDiagram(diagramSpec);
      break;
    default:
      // If spec already has nodes (pre-generated), use as-is
      if (diagramSpec.nodes) {
        diagram = diagramSpec;
      } else {
        console.error(`❌ Unknown diagram type: ${effectiveType}`);
        process.exit(1);
      }
      break;
  }

  const nodeCount = diagram.nodes ? diagram.nodes.length : 0;
  const connCount = diagram.connections ? diagram.connections.length : 0;
  console.log(`\n✨ Generated diagram with ${nodeCount} nodes and ${connCount} connections`);

} catch (error) {
  console.error(`❌ Generation failed: ${error.message}`);
  process.exit(1);
}

// Save output
const timestamp = Date.now();
const outputFile = `${diagramName}_${timestamp}.json`;
const outputPath = path.join(outputsDir, outputFile);
const latestPath = path.join(outputsDir, 'latest.json');

fs.writeFileSync(outputPath, JSON.stringify(diagram, null, 2));
fs.writeFileSync(latestPath, JSON.stringify(diagram, null, 2));

console.log(`\n💾 Saved to:`);
console.log(`   ${path.relative(ROOT_DIR, outputPath)}`);
console.log(`   ${path.relative(ROOT_DIR, latestPath)} (symlink)\n`);

// Print summary
console.log('📊 Summary:');
console.log(`   Title: ${diagram.title}`);
console.log(`   Nodes: ${diagram.nodes.length}`);
console.log(`   Connections: ${diagram.connections.length}`);
console.log(`   Type: ${diagram.type}`);

// Instructions
console.log(`\n🎯 Next Steps:`);
console.log(`   1. Open FigJam: https://www.figma.com/board/ht9CrCOgT7sZpKyopJpHXN/claude-test`);
console.log(`   2. Run plugin: Claude ER Diagram Auto-Creator`);
console.log(`   3. Your diagram will appear automatically!\n`);
console.log(`✅ Done!\n`);
