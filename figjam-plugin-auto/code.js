// FigJam Plugin: Claude ER Diagram Auto-Creator
// Reads diagram spec from generated output files

// This will be replaced with dynamic file reading in future versions
// For now, update this manually or regenerate the plugin after diagram generation
const DIAGRAM_SPEC = {
  "title": "Retail Sales Data Warehouse - Star Schema ER Diagram",
  "nodes": [
    {
      "id": "title",
      "type": "text",
      "label": "🗄️ Retail Sales Data Warehouse - Star Schema",
      "x": 400,
      "y": 10,
      "width": 680,
      "height": 30
    },
    {
      "id": "fact_sales",
      "type": "rectangle",
      "label": "📊 FactSales\n━━━━━━━━━━━━━━━━━━━━━━━━━\nSaleID (PK)\nDateKey (FK)\nCustomerKey (FK)\nProductKey (FK)\nStoreKey (FK)\n━━━━━━━━━━━━━━━━━━━━━━━━━\nTransactionDate\nQuantity\nUnitPrice\nTotalAmount\nDiscountAmount\nTaxAmount\n... (+3 more)",
      "x": 600,
      "y": 500,
      "width": 280,
      "height": 380,
      "color": "#FF6B6B"
    },
    {
      "id": "dim_date",
      "type": "rectangle",
      "label": "📅 DimDate\n━━━━━━━━━━━━━━━━━━━━━━━━━\nDateKey (PK)\n━━━━━━━━━━━━━━━━━━━━━━━━━\nDate\nYear\nQuarter\nQuarterName\nMonth\nMonthName\n... (+7 more)",
      "x": 600,
      "y": 50,
      "width": 280,
      "height": 330,
      "color": "#4ECDC4"
    },
    {
      "id": "dim_customer",
      "type": "rectangle",
      "label": "👤 DimCustomer\n━━━━━━━━━━━━━━━━━━━━━━━━━\nCustomerKey (PK)\n━━━━━━━━━━━━━━━━━━━━━━━━━\nCustomerID\nFirstName\nLastName\nEmail\nPhone\nDateOfBirth\n... (+8 more)",
      "x": 100,
      "y": 400,
      "width": 280,
      "height": 350,
      "color": "#95E1D3"
    },
    {
      "id": "dim_product",
      "type": "rectangle",
      "label": "📦 DimProduct\n━━━━━━━━━━━━━━━━━━━━━━━━━\nProductKey (PK)\n━━━━━━━━━━━━━━━━━━━━━━━━━\nProductID\nProductName\nDescription\nCategory\nSubCategory\nBrand\n... (+8 more)",
      "x": 1100,
      "y": 400,
      "width": 280,
      "height": 350,
      "color": "#F8B500"
    },
    {
      "id": "dim_store",
      "type": "rectangle",
      "label": "🏪 DimStore\n━━━━━━━━━━━━━━━━━━━━━━━━━\nStoreKey (PK)\n━━━━━━━━━━━━━━━━━━━━━━━━━\nStoreID\nStoreName\nStoreType\nAddress\nCity\nState\n... (+6 more)",
      "x": 600,
      "y": 1000,
      "width": 280,
      "height": 320,
      "color": "#A8E6CF"
    },
    {
      "id": "legend_fact",
      "type": "sticky",
      "label": "📊 FACT TABLE\n━━━━━━━━━━━━━━━━\n• Contains measurable metrics\n• Granularity: One row per transaction\n• Measures: Quantity, Amount, Profit\n• Foreign keys to all dimensions",
      "x": 50,
      "y": 50,
      "width": 220,
      "height": 140,
      "color": "#FF6B6B"
    },
    {
      "id": "legend_dim",
      "type": "sticky",
      "label": "📋 DIMENSION TABLES\n━━━━━━━━━━━━━━━━\n• Descriptive attributes\n• Who: Customer\n• What: Product\n• When: Date\n• Where: Store",
      "x": 50,
      "y": 210,
      "width": 220,
      "height": 140,
      "color": "#4ECDC4"
    },
    {
      "id": "legend_keys",
      "type": "sticky",
      "label": "🔑 KEY TYPES\n━━━━━━━━━━━━━━━━\nPK = Primary Key\nFK = Foreign Key\n\n💡 Star Schema Benefits:\n• Simple queries\n• Fast aggregations\n• Easy to understand",
      "x": 1210,
      "y": 50,
      "width": 220,
      "height": 160,
      "color": "#FFE66D"
    },
    {
      "id": "analytics_note",
      "type": "sticky",
      "label": "📈 COMMON ANALYTICS\n━━━━━━━━━━━━━━━━\n• Sales by time period\n• Top customers/products\n• Store performance\n• Profit margins\n• Regional trends\n• Customer segmentation",
      "x": 1210,
      "y": 230,
      "width": 220,
      "height": 160,
      "color": "#B4F8C8"
    }
  ],
  "connections": [
    {
      "from": "dim_date",
      "to": "fact_sales",
      "label": "1:N"
    },
    {
      "from": "dim_customer",
      "to": "fact_sales",
      "label": "1:N"
    },
    {
      "from": "dim_product",
      "to": "fact_sales",
      "label": "1:N"
    },
    {
      "from": "dim_store",
      "to": "fact_sales",
      "label": "1:N"
    }
  ]
};

figma.showUI(__html__, { width: 400, height: 600 });

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0.5, g: 0.5, b: 0.5 };
}

async function createDiagram(spec) {
  try {
    const nodes = new Map();
    const createdNodes = [];

    console.log('🚀 Starting diagram creation...');
    figma.notify('⏳ Loading fonts...');

    // Load all fonts we'll need upfront
    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
      await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
      console.log('✅ Fonts loaded');
    } catch (fontError) {
      console.error('❌ Font loading error:', fontError);
      throw new Error('Font loading failed: ' + fontError.message);
    }

    figma.notify('⏳ Creating nodes...');

    // Create all nodes first
    for (let i = 0; i < spec.nodes.length; i++) {
      const nodeSpec = spec.nodes[i];
      console.log(`Creating node ${i + 1}/${spec.nodes.length}: ${nodeSpec.id} (${nodeSpec.type})`);

      let node;

      try {
        switch (nodeSpec.type) {
          case 'sticky':
            console.log('  - Creating sticky note');
            node = figma.createSticky();
            node.text.characters = nodeSpec.label;
            // Sticky notes auto-size - don't set width/height
            break;

          case 'rectangle':
            console.log('  - Creating shape with text');
            node = figma.createShapeWithText();
            node.shapeType = 'ROUNDED_RECTANGLE';
            node.text.characters = nodeSpec.label;
            node.text.fontSize = 14;
            if (nodeSpec.width && nodeSpec.height) {
              node.resize(nodeSpec.width, nodeSpec.height);
            }
            break;

          case 'text':
            console.log('  - Creating text node');
            node = figma.createText();
            node.characters = nodeSpec.label;
            node.fontSize = 24;
            node.fontName = { family: "Inter", style: "Bold" };
            break;

          default:
            console.log('  - Creating default sticky note');
            node = figma.createSticky();
            node.text.characters = nodeSpec.label;
            // Sticky notes auto-size - don't set width/height
            break;
        }

        // Set position
        console.log(`  - Setting position: (${nodeSpec.x}, ${nodeSpec.y})`);
        node.x = nodeSpec.x;
        node.y = nodeSpec.y;

        // Set color
        if (nodeSpec.color) {
          console.log(`  - Setting color: ${nodeSpec.color}`);
          const color = hexToRgb(nodeSpec.color);
          if (node.fills && node.fills.length > 0) {
            node.fills = [{ type: 'SOLID', color }];
          }
        }

        nodes.set(nodeSpec.id, node);
        createdNodes.push(node);
        console.log(`  ✅ Node created successfully`);

      } catch (nodeError) {
        console.error(`  ❌ Error creating node ${nodeSpec.id}:`, nodeError);
        throw new Error(`Failed to create node ${nodeSpec.id} (${nodeSpec.type}): ${nodeError.message}`);
      }
    }

    figma.notify('⏳ Creating connections...');

    // Create connections
    if (spec.connections) {
      for (let i = 0; i < spec.connections.length; i++) {
        const conn = spec.connections[i];
        console.log(`Creating connection ${i + 1}/${spec.connections.length}: ${conn.from} -> ${conn.to}`);

        try {
          const fromNode = nodes.get(conn.from);
          const toNode = nodes.get(conn.to);

          if (fromNode && toNode) {
            console.log('  - Creating connector');
            const connector = figma.createConnector();

            console.log('  - Setting connector endpoints');
            connector.connectorStart = {
              endpointNodeId: fromNode.id,
              magnet: 'AUTO',
            };
            connector.connectorEnd = {
              endpointNodeId: toNode.id,
              magnet: 'AUTO',
            };

            console.log('  - Setting connector style');
            if (connector.strokeWeight !== undefined) {
              connector.strokeWeight = 2;
            }

            createdNodes.push(connector);
            console.log('  ✅ Connector created successfully');
          } else {
            console.warn(`  ⚠️ Skipping connection: fromNode=${fromNode ? 'exists' : 'missing'}, toNode=${toNode ? 'exists' : 'missing'}`);
          }
        } catch (connError) {
          console.error(`  ❌ Error creating connection:`, connError);
          // Don't throw - continue with other connections
          figma.notify(`⚠️ Connection ${conn.from}->${conn.to} failed`, { error: true });
        }
      }
    }

    // Select all created nodes and zoom to fit
    console.log('Setting selection and zooming...');
    figma.currentPage.selection = createdNodes;
    figma.viewport.scrollAndZoomIntoView(createdNodes);

    console.log('✅ Diagram creation complete!');
    figma.notify(`✅ Created: ${spec.title}`);
    const connectionCount = spec.connections ? spec.connections.length : 0;
    figma.notify(`📊 ${spec.nodes.length} nodes, ${connectionCount} connections`);

  } catch (error) {
    console.error('❌ Fatal error in createDiagram:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'get-hardcoded-diagram') {
    // Return the built-in diagram
    figma.ui.postMessage({
      type: 'diagram-loaded',
      diagram: DIAGRAM_SPEC
    });

  } else if (msg.type === 'load-diagram') {
    // Load diagram from local server
    try {
      const diagramName = msg.diagramName;
      const response = await fetch(`http://localhost:3456/api/diagrams/${diagramName}`);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      figma.ui.postMessage({
        type: 'diagram-loaded',
        diagram: data.diagram
      });
    } catch (error) {
      console.error('Error loading diagram:', error);
      figma.notify('⚠️ Make sure diagram server is running: npm run diagram-server', { error: true });
      figma.ui.postMessage({
        type: 'creation-error',
        error: `Failed to load diagram: ${error.message}\n\nStart the server: npm run diagram-server`
      });
    }

  } else if (msg.type === 'refresh-diagrams') {
    // Fetch diagram list from local server
    try {
      const response = await fetch('http://localhost:3456/api/diagrams');

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const diagramNames = data.diagrams.map(d => ({
        name: d.name,
        title: d.title,
        nodeCount: d.nodeCount,
        connectionCount: d.connectionCount
      }));

      figma.ui.postMessage({
        type: 'diagrams-list',
        diagrams: diagramNames
      });
    } catch (error) {
      console.error('Error fetching diagrams:', error);
      figma.notify('⚠️ Make sure diagram server is running: npm run diagram-server', { error: true });
      figma.ui.postMessage({
        type: 'diagrams-list',
        diagrams: [],
        error: `Server not running. Start with: npm run diagram-server`
      });
    }

  } else if (msg.type === 'create-diagram') {
    try {
      console.log('📋 Received create-diagram message');

      // Determine which diagram to create
      let diagramSpec;
      if (msg.diagram) {
        // Custom diagram from JSON paste
        diagramSpec = msg.diagram;
        console.log('Using custom diagram from JSON');
      } else if (msg.source === 'hardcoded') {
        // Built-in diagram
        diagramSpec = DIAGRAM_SPEC;
        console.log('Using hardcoded diagram');
      } else {
        throw new Error('No diagram specification provided');
      }

      await createDiagram(diagramSpec);
      console.log('✅ Diagram created, sending success message');
      figma.ui.postMessage({ type: 'creation-success' });

      // Auto-close after 2 seconds
      setTimeout(() => figma.closePlugin(), 2000);

    } catch (error) {
      console.error('❌ Error caught in message handler:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      const errorDetails = `${error.message}\n\nType: ${error.name}\n\nCheck console (Cmd+Option+I) for full details`;
      figma.notify(`❌ Error: ${error.message}`, { error: true });
      figma.ui.postMessage({
        type: 'creation-error',
        error: error.message,
        errorDetails: errorDetails,
        errorStack: error.stack
      });
    }
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
