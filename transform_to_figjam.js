#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the ER diagram JSON
const erDiagram = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'retail_sales_er_diagram.json'), 'utf8')
);

// Transform to FigJam plugin format
const figJamSpec = {
  title: erDiagram.title,
  nodes: [],
  connections: []
};

// Add title annotation
if (erDiagram.annotations) {
  const titleAnnotation = erDiagram.annotations.find(a => a.id === 'title');
  if (titleAnnotation) {
    figJamSpec.nodes.push({
      id: titleAnnotation.id,
      type: 'text',
      label: titleAnnotation.content,
      x: titleAnnotation.x,
      y: titleAnnotation.y,
      width: titleAnnotation.width,
      height: titleAnnotation.height
    });
  }
}

// Transform tables to rectangles with formatted text
for (const table of erDiagram.tables) {
  // Build table text with columns
  let tableText = `${table.emoji} ${table.name}\n`;
  tableText += '━'.repeat(25) + '\n';

  // Primary key first
  const pkColumn = table.columns.find(c => c.constraint === 'PK');
  if (pkColumn) {
    tableText += `${pkColumn.name} (PK)\n`;
  }

  // Foreign keys
  const fkColumns = table.columns.filter(c => c.constraint === 'FK');
  for (const fk of fkColumns) {
    tableText += `${fk.name} (FK)\n`;
  }

  if (pkColumn || fkColumns.length > 0) {
    tableText += '━'.repeat(25) + '\n';
  }

  // Regular columns (limit to key ones for space)
  const regularColumns = table.columns
    .filter(c => !c.constraint || (c.constraint !== 'PK' && c.constraint !== 'FK'))
    .slice(0, 6); // Show first 6 regular columns

  for (const col of regularColumns) {
    tableText += `${col.name}\n`;
  }

  if (table.columns.length > regularColumns.length + fkColumns.length + 1) {
    tableText += `... (+${table.columns.length - regularColumns.length - fkColumns.length - 1} more)`;
  }

  figJamSpec.nodes.push({
    id: table.id,
    type: 'rectangle',
    label: tableText,
    x: table.x,
    y: table.y,
    width: table.width,
    height: table.height,
    color: table.color
  });
}

// Add sticky note annotations
if (erDiagram.annotations) {
  const stickyAnnotations = erDiagram.annotations.filter(a => a.type === 'sticky');
  for (const sticky of stickyAnnotations) {
    figJamSpec.nodes.push({
      id: sticky.id,
      type: 'sticky',
      label: sticky.content,
      x: sticky.x,
      y: sticky.y,
      width: sticky.width,
      height: sticky.height,
      color: sticky.color
    });
  }
}

// Transform relationships to connections
for (const rel of erDiagram.relationships) {
  figJamSpec.connections.push({
    from: rel.from,
    to: rel.to,
    label: rel.label
  });
}

// Save the transformed spec
const outputPath = path.join(__dirname, 'figjam_diagram_spec.json');
fs.writeFileSync(outputPath, JSON.stringify(figJamSpec, null, 2));

console.log('✅ Transformed ER diagram to FigJam format!');
console.log(`📁 Output: ${outputPath}`);
console.log(`\n📊 Summary:`);
console.log(`   - Nodes: ${figJamSpec.nodes.length}`);
console.log(`   - Connections: ${figJamSpec.connections.length}`);
console.log(`   - Tables: ${erDiagram.tables.length}`);
console.log(`   - Annotations: ${erDiagram.annotations?.length || 0}`);
