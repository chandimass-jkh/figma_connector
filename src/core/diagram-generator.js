/**
 * Diagram Generator
 * Core logic for generating diagram specifications
 */

export class DiagramGenerator {
  constructor() {
    this.diagrams = new Map();
  }

  /**
   * Generate ER diagram for data warehouse
   */
  generateERDiagram({ title, tables, relationships, annotations = [] }) {
    const diagram = {
      title,
      type: 'er-diagram',
      created: new Date().toISOString(),
      nodes: [],
      connections: [],
    };

    // Add title annotation
    if (title) {
      diagram.nodes.push({
        id: 'title',
        type: 'text',
        label: title,
        x: 400,
        y: 10,
        width: 680,
        height: 30,
      });
    }

    // Process tables
    tables.forEach((table) => {
      const tableNode = this.createTableNode(table);
      diagram.nodes.push(tableNode);
    });

    // Process relationships
    relationships.forEach((rel) => {
      diagram.connections.push({
        from: rel.from,
        to: rel.to,
        label: rel.label || rel.type,
      });
    });

    // Add annotations (legends, notes, etc.)
    annotations.forEach((annotation) => {
      diagram.nodes.push(annotation);
    });

    return diagram;
  }

  /**
   * Create a table node with formatted columns
   */
  createTableNode(table) {
    let tableText = `${table.emoji || ''} ${table.name}\n`;
    tableText += '━'.repeat(25) + '\n';

    // Primary key
    const pkColumn = table.columns.find((c) => c.constraint === 'PK');
    if (pkColumn) {
      tableText += `${pkColumn.name} (PK)\n`;
    }

    // Foreign keys
    const fkColumns = table.columns.filter((c) => c.constraint === 'FK');
    if (fkColumns.length > 0) {
      fkColumns.forEach((fk) => {
        tableText += `${fk.name} (FK)\n`;
      });
      tableText += '━'.repeat(25) + '\n';
    }

    // Regular columns (first 6)
    const regularColumns = table.columns
      .filter((c) => !c.constraint || (c.constraint !== 'PK' && c.constraint !== 'FK'))
      .slice(0, 6);

    regularColumns.forEach((col) => {
      tableText += `${col.name}\n`;
    });

    // Show count of additional columns
    const remainingCount =
      table.columns.length - regularColumns.length - fkColumns.length - (pkColumn ? 1 : 0);
    if (remainingCount > 0) {
      tableText += `... (+${remainingCount} more)`;
    }

    return {
      id: table.id,
      type: table.visualType || 'rectangle',
      label: tableText.trim(),
      x: table.x,
      y: table.y,
      width: table.width,
      height: table.height,
      color: table.color,
    };
  }

  /**
   * Generate flowchart
   */
  generateFlowchart({ title, steps, decisions = [] }) {
    const diagram = {
      title,
      type: 'flowchart',
      created: new Date().toISOString(),
      nodes: [],
      connections: [],
    };

    // Generate flowchart nodes and connections
    let yPos = 100;
    const xPos = 400;
    const spacing = 150;

    steps.forEach((step, index) => {
      diagram.nodes.push({
        id: `step_${index}`,
        type: step.type || 'rectangle',
        label: step.label,
        x: xPos,
        y: yPos,
        width: 200,
        height: 80,
        color: step.color || '#4ECDC4',
      });

      // Connect to next step
      if (index < steps.length - 1) {
        diagram.connections.push({
          from: `step_${index}`,
          to: `step_${index + 1}`,
          label: step.nextLabel || '',
        });
      }

      yPos += spacing;
    });

    return diagram;
  }

  /**
   * Generate architecture diagram
   */
  generateArchitectureDiagram({ title, components, connections }) {
    const diagram = {
      title,
      type: 'architecture',
      created: new Date().toISOString(),
      nodes: [],
      connections: [],
    };

    // Add components
    components.forEach((component) => {
      diagram.nodes.push({
        id: component.id,
        type: component.type || 'rectangle',
        label: `${component.icon || ''} ${component.name}\n${component.description || ''}`,
        x: component.x,
        y: component.y,
        width: component.width || 200,
        height: component.height || 100,
        color: component.color || '#764ba2',
      });
    });

    // Add connections
    connections.forEach((conn) => {
      diagram.connections.push({
        from: conn.from,
        to: conn.to,
        label: conn.label || conn.protocol || '',
      });
    });

    return diagram;
  }

  /**
   * Save diagram specification to file
   */
  saveDiagram(diagram, diagramName, outputPath) {
    const fs = require('fs');
    const path = require('path');

    const fileName = `${diagramName}_${Date.now()}.json`;
    const fullPath = path.join(outputPath, fileName);

    // Ensure directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    fs.writeFileSync(fullPath, JSON.stringify(diagram, null, 2));

    return {
      path: fullPath,
      fileName,
      diagram,
    };
  }
}

export default DiagramGenerator;
