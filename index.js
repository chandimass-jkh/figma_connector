#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FIGMA_API_BASE = 'https://api.figma.com/v1';
const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_TOKEN) {
  console.error('Error: FIGMA_ACCESS_TOKEN not found in .env file');
  process.exit(1);
}

class FigJamServer {
  constructor() {
    this.server = new Server(
      {
        name: 'figjam-connector',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_figjam_board',
          description: 'Create a new FigJam board for diagrams and collaborative whiteboarding',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the FigJam board',
              },
            },
            required: ['name'],
          },
        },
        {
          name: 'check_connection',
          description: 'Check FigJam/Figma API connection and get user info',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_file_info',
          description: 'Get information about a FigJam board or Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              file_key: {
                type: 'string',
                description: 'FigJam/Figma file key (from URL: figma.com/file/{FILE_KEY}/...)',
              },
            },
            required: ['file_key'],
          },
        },
        {
          name: 'create_diagram_spec',
          description: 'Generate a diagram specification for FigJam with shapes, sticky notes, connectors, and text',
          inputSchema: {
            type: 'object',
            properties: {
              file_key: {
                type: 'string',
                description: 'FigJam file key',
              },
              title: {
                type: 'string',
                description: 'Title/description of the diagram',
              },
              diagram_type: {
                type: 'string',
                description: 'Type: flowchart, architecture, mindmap, process, etc',
              },
              nodes: {
                type: 'array',
                description: 'Diagram nodes (shapes, sticky notes, text)',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'Unique identifier for the node' },
                    type: {
                      type: 'string',
                      enum: ['rectangle', 'circle', 'sticky', 'text', 'diamond'],
                      description: 'Shape type'
                    },
                    label: { type: 'string', description: 'Text content' },
                    x: { type: 'number', description: 'X position' },
                    y: { type: 'number', description: 'Y position' },
                    width: { type: 'number', description: 'Width in pixels' },
                    height: { type: 'number', description: 'Height in pixels' },
                    color: { type: 'string', description: 'Hex color (e.g., #FF6B6B)' },
                  },
                  required: ['id', 'type', 'label']
                },
              },
              connections: {
                type: 'array',
                description: 'Connections between nodes',
                items: {
                  type: 'object',
                  properties: {
                    from: { type: 'string', description: 'Source node ID' },
                    to: { type: 'string', description: 'Target node ID' },
                    label: { type: 'string', description: 'Optional label for the connection' },
                  },
                  required: ['from', 'to']
                },
              },
            },
            required: ['file_key', 'title', 'nodes'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_figjam_board':
            return await this.createFigJamBoard(args);

          case 'check_connection':
            return await this.checkConnection();

          case 'get_file_info':
            return await this.getFileInfo(args);

          case 'create_diagram_spec':
            return await this.createDiagramSpec(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}\n\nStack: ${error.stack}`,
            },
          ],
        };
      }
    });
  }

  async createFigJamBoard(args) {
    return {
      content: [
        {
          type: 'text',
          text: `📋 To create a FigJam board:\n\n1. Go to https://www.figma.com/figjam/\n2. Click "New FigJam file"\n3. Name it: "${args.name}"\n4. Copy the file key from the URL: figma.com/file/{FILE_KEY}/...\n5. Use that file key with the create_diagram_spec tool to generate diagrams!\n\nNote: The Figma API doesn't support creating FigJam boards programmatically yet. You'll need to create it manually, then I can help you populate it with diagrams!`,
        },
      ],
    };
  }

  async checkConnection() {
    try {
      const response = await axios.get(`${FIGMA_API_BASE}/me`, {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: `✅ Connected to Figma/FigJam API!\n\n👤 User: ${response.data.email}\n🆔 ID: ${response.data.id}\n\n🎨 You can now:\n  • Get info about FigJam boards\n  • Generate diagram specifications\n  • Create structured diagrams\n\nReady to create diagrams in FigJam!`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to connect: ${error.response?.data?.message || error.message}`);
    }
  }

  async getFileInfo(args) {
    try {
      const response = await axios.get(
        `${FIGMA_API_BASE}/files/${args.file_key}`,
        {
          headers: {
            'X-Figma-Token': FIGMA_TOKEN,
          },
        }
      );

      const isFigJam = response.data.editorType === 'figjam';

      return {
        content: [
          {
            type: 'text',
            text: `✅ ${isFigJam ? 'FigJam Board' : 'Figma File'} Info:\n\n📄 Name: ${response.data.name}\n⏰ Last Modified: ${response.data.lastModified}\n🔢 Version: ${response.data.version}\n📑 Pages: ${response.data.document.children.length}\n🔗 URL: https://www.figma.com/file/${args.file_key}\n\n${isFigJam ? '✨ This is a FigJam board - perfect for diagrams!' : '💡 Tip: Use FigJam for better diagram support!'}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get file info: ${error.response?.data?.message || error.message}`);
    }
  }

  async createDiagramSpec(args) {
    try {
      // Auto-layout nodes if positions aren't specified
      const layoutNodes = args.nodes.map((node, index) => {
        if (!node.x || !node.y) {
          // Auto-layout in a grid
          const col = index % 4;
          const row = Math.floor(index / 4);
          return {
            ...node,
            x: node.x || col * 250 + 100,
            y: node.y || row * 200 + 100,
            width: node.width || 180,
            height: node.height || (node.type === 'sticky' ? 180 : 80),
          };
        }
        return {
          ...node,
          width: node.width || 180,
          height: node.height || (node.type === 'sticky' ? 180 : 80),
        };
      });

      // Generate diagram specification
      const spec = {
        title: args.title,
        diagramType: args.diagram_type,
        fileKey: args.file_key,
        nodes: layoutNodes,
        connections: args.connections || [],
        metadata: {
          created: new Date().toISOString(),
          nodeCount: layoutNodes.length,
          connectionCount: (args.connections || []).length,
        },
      };

      // Create visual representation
      let visualOutput = `\n🎨 Diagram Specification: ${args.title}\n`;
      visualOutput += `📊 Type: ${args.diagram_type || 'diagram'}\n`;
      visualOutput += `🔗 File: https://www.figma.com/file/${args.file_key}\n`;
      visualOutput += `\n📦 Nodes (${layoutNodes.length}):\n`;

      layoutNodes.forEach((node, i) => {
        const emoji = {
          rectangle: '▭',
          circle: '●',
          sticky: '📝',
          text: '📄',
          diamond: '◆',
        }[node.type] || '▪';

        visualOutput += `  ${i + 1}. ${emoji} ${node.label} [${node.type}] at (${node.x}, ${node.y})\n`;
      });

      if (spec.connections.length > 0) {
        visualOutput += `\n🔗 Connections (${spec.connections.length}):\n`;
        spec.connections.forEach((conn, i) => {
          const fromNode = layoutNodes.find(n => n.id === conn.from);
          const toNode = layoutNodes.find(n => n.id === conn.to);
          const label = conn.label ? ` [${conn.label}]` : '';
          visualOutput += `  ${i + 1}. ${fromNode?.label} → ${toNode?.label}${label}\n`;
        });
      }

      visualOutput += `\n📋 Next Steps:\n`;
      visualOutput += `\n🔌 OPTION 1: Use the FigJam Plugin (Coming Soon)\n`;
      visualOutput += `   I'll create a custom plugin to import this spec directly into FigJam!\n`;
      visualOutput += `\n✋ OPTION 2: Manual Creation\n`;
      visualOutput += `   1. Open your FigJam board: https://www.figma.com/file/${args.file_key}\n`;
      visualOutput += `   2. Create the shapes and sticky notes listed above\n`;
      visualOutput += `   3. Add connections between them\n`;
      visualOutput += `\n💾 Specification saved to: ./diagram-specs/\n`;

      // Save spec to file
      const fs = await import('fs/promises');
      const path = await import('path');
      const specsDir = './diagram-specs';

      try {
        await fs.mkdir(specsDir, { recursive: true });
        const filename = `${args.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.json`;
        const filepath = path.join(specsDir, filename);
        await fs.writeFile(filepath, JSON.stringify(spec, null, 2));
        visualOutput += `\n✅ Saved to: ${filename}`;
      } catch (err) {
        visualOutput += `\n⚠️  Could not save to file: ${err.message}`;
      }

      return {
        content: [
          {
            type: 'text',
            text: visualOutput,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create diagram spec: ${error.message}`);
    }
  }

  parseColor(colorStr) {
    // Convert hex color to RGB 0-1 range
    const hex = colorStr.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return { r, g, b };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('FigJam MCP server running on stdio');
  }
}

const server = new FigJamServer();
server.run().catch(console.error);
