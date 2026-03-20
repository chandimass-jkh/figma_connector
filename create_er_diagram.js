#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the ER diagram JSON
const diagramData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'retail_sales_er_diagram.json'), 'utf8')
);

console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║     🎨 RETAIL SALES ER DIAGRAM - READY FOR FIGJAM IMPORT         ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

console.log('📋 DIAGRAM DETAILS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`📊 Title: ${diagramData.title}`);
console.log(`📝 Description: ${diagramData.description}`);
console.log(`🔗 FigJam Board: ${diagramData.fileKey}\n`);

console.log('🗂️  TABLES IN DIAGRAM:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Display fact table
const factTable = diagramData.tables.find(t => t.type === 'fact');
console.log(`${factTable.emoji} ${factTable.name.toUpperCase()} (FACT TABLE)`);
console.log(`   Position: (${factTable.x}, ${factTable.y})`);
console.log(`   Columns: ${factTable.columns.length}`);
console.log(`   Foreign Keys: ${factTable.foreignKeys.length}`);
console.log('');

// Display dimension tables
const dimTables = diagramData.tables.filter(t => t.type === 'dimension');
dimTables.forEach(table => {
  console.log(`${table.emoji} ${table.name} (DIMENSION)`);
  console.log(`   Position: (${table.x}, ${table.y})`);
  console.log(`   Columns: ${table.columns.length}`);
  console.log('');
});

console.log('🔗 RELATIONSHIPS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

diagramData.relationships.forEach(rel => {
  const fromTable = diagramData.tables.find(t => t.id === rel.from);
  const toTable = diagramData.tables.find(t => t.id === rel.to);
  console.log(`${fromTable.emoji} ${fromTable.name}.${rel.fromColumn}`);
  console.log(`   └─→ [${rel.label}] ${toTable.emoji} ${toTable.name}.${rel.toColumn}`);
  console.log(`       ${rel.description}\n`);
});

console.log('\n📈 ANALYTICS CAPABILITIES:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('✓ Sales by time period (daily, weekly, monthly, quarterly)');
console.log('✓ Top customers by revenue');
console.log('✓ Best-selling products');
console.log('✓ Store performance comparison');
console.log('✓ Profit margin analysis');
console.log('✓ Regional sales trends');
console.log('✓ Customer segmentation analysis');
console.log('✓ Product category performance');
console.log('✓ Seasonal sales patterns\n');

console.log('\n🎯 NEXT STEPS TO IMPORT INTO FIGJAM:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('1. Open your FigJam board:');
console.log('   https://www.figma.com/board/ht9CrCOgT7sZpKyopJpHXN/claude-test\n');
console.log('2. Right-click → Plugins → Claude Diagram Importer\n');
console.log('3. Copy the entire content from:');
console.log('   /Users/sen/workspace/claude_figma/retail_sales_er_diagram.json\n');
console.log('4. Paste into the plugin\n');
console.log('5. Click "Import Diagram"\n');
console.log('6. ✨ Your ER diagram will appear!\n');

console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║                    ✅ DIAGRAM READY TO IMPORT!                    ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');
