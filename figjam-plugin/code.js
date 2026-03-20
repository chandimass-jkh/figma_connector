// FigJam Plugin: Claude Diagram Importer
// This plugin imports diagram specifications created by Claude

figma.showUI(__html__, { width: 400, height: 500 });

// Color palette
const COLORS = {
  blue: { r: 0.23, g: 0.51, b: 0.96 },
  green: { r: 0.16, g: 0.71, b: 0.45 },
  red: { r: 1, g: 0.42, b: 0.42 },
  yellow: { r: 1, g: 0.84, b: 0.0 },
  purple: { r: 0.64, g: 0.38, b: 0.96 },
  orange: { r: 1, g: 0.6, b: 0.2 },
  pink: { r: 0.96, g: 0.38, b: 0.75 },
  gray: { r: 0.5, g: 0.5, b: 0.5 },
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : COLORS.blue;
}

async function createDiagram(spec) {
  const nodes = new Map();

  // Create all nodes first
  for (const nodeSpec of spec.nodes) {
    let node;

    switch (nodeSpec.type) {
      case 'sticky':
        node = figma.createSticky();
        node.text.characters = nodeSpec.label;
        break;

      case 'rectangle':
        node = figma.createRectangle();
        const rectText = figma.createText();
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        rectText.characters = nodeSpec.label;
        rectText.x = nodeSpec.x + 10;
        rectText.y = nodeSpec.y + (nodeSpec.height - rectText.height) / 2;
        break;

      case 'circle':
        node = figma.createEllipse();
        const circleText = figma.createText();
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        circleText.characters = nodeSpec.label;
        circleText.x = nodeSpec.x + (nodeSpec.width - circleText.width) / 2;
        circleText.y = nodeSpec.y + (nodeSpec.height - circleText.height) / 2;
        break;

      case 'text':
        node = figma.createText();
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        node.characters = nodeSpec.label;
        node.fontSize = 16;
        break;

      default:
        node = figma.createRectangle();
        break;
    }

    // Set position and size
    node.x = nodeSpec.x;
    node.y = nodeSpec.y;

    if (node.type !== 'STICKY' && node.type !== 'TEXT') {
      node.resize(nodeSpec.width, nodeSpec.height);
    }

    // Set color
    if (nodeSpec.color) {
      const color = hexToRgb(nodeSpec.color);
      if (node.type === 'STICKY') {
        node.fills = [{ type: 'SOLID', color }];
      } else if (node.fills && node.fills.length > 0) {
        node.fills = [{ type: 'SOLID', color }];
      }
    }

    nodes.set(nodeSpec.id, node);
  }

  // Create connections
  if (spec.connections) {
    for (const conn of spec.connections) {
      const fromNode = nodes.get(conn.from);
      const toNode = nodes.get(conn.to);

      if (fromNode && toNode) {
        const connector = figma.createConnector();
        connector.connectorStart = {
          endpointNodeId: fromNode.id,
          magnet: 'AUTO',
        };
        connector.connectorEnd = {
          endpointNodeId: toNode.id,
          magnet: 'AUTO',
        };

        if (conn.label) {
          const label = figma.createText();
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          label.characters = conn.label;
          label.fontSize = 12;

          // Position label at midpoint of connector
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          label.x = midX;
          label.y = midY;
        }
      }
    }
  }

  // Select all created nodes
  figma.currentPage.selection = Array.from(nodes.values());
  figma.viewport.scrollAndZoomIntoView(Array.from(nodes.values()));

  figma.notify(`✅ Created diagram: ${spec.title} (${spec.nodes.length} nodes, ${spec.connections?.length || 0} connections)`);
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-diagram') {
    try {
      const spec = JSON.parse(msg.spec);
      await createDiagram(spec);
      figma.ui.postMessage({ type: 'import-success' });
    } catch (error) {
      figma.notify(`❌ Error: ${error.message}`, { error: true });
      figma.ui.postMessage({ type: 'import-error', error: error.message });
    }
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
