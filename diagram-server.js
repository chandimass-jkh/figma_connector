#!/usr/bin/env node

/**
 * Diagram Server
 * Serves generated diagrams to FigJam plugin via HTTP
 *
 * Why: Figma plugins can't access file system, but can make HTTP requests
 *
 * Usage: npm run diagram-server
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const PORT = 3456;

const app = express();

// Enable CORS for Figma plugin
app.use(cors({
  origin: '*', // Figma plugin sandbox
  methods: ['GET'],
}));

app.use(express.json());

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'Claude Figma Diagram Server',
    version: '1.0.0',
    port: PORT
  });
});

/**
 * List all available diagrams
 * GET /api/diagrams
 */
app.get('/api/diagrams', (req, res) => {
  try {
    if (!fs.existsSync(DIAGRAMS_DIR)) {
      return res.json({ diagrams: [] });
    }

    const diagrams = fs.readdirSync(DIAGRAMS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .filter(dirent => !dirent.name.startsWith('.')) // Ignore hidden folders
      .map(dirent => {
        const diagramName = dirent.name;
        const latestPath = path.join(DIAGRAMS_DIR, diagramName, 'created_diagrams', 'latest.json');

        // Check if diagram has a latest.json
        const hasLatest = fs.existsSync(latestPath);

        let title = diagramName;
        let nodeCount = 0;
        let connectionCount = 0;

        if (hasLatest) {
          try {
            const diagramData = JSON.parse(fs.readFileSync(latestPath, 'utf8'));
            title = diagramData.title || diagramName;
            nodeCount = diagramData.nodes ? diagramData.nodes.length : 0;
            connectionCount = diagramData.connections ? diagramData.connections.length : 0;
          } catch (error) {
            console.error(`Error reading ${diagramName}:`, error.message);
          }
        }

        return {
          name: diagramName,
          title,
          hasLatest,
          nodeCount,
          connectionCount
        };
      })
      .filter(diagram => diagram.hasLatest); // Only return diagrams with latest.json

    res.json({
      diagrams,
      count: diagrams.length
    });
  } catch (error) {
    console.error('Error listing diagrams:', error);
    res.status(500).json({
      error: 'Failed to list diagrams',
      message: error.message
    });
  }
});

/**
 * Get a specific diagram
 * GET /api/diagrams/:name
 */
app.get('/api/diagrams/:name', (req, res) => {
  try {
    const diagramName = req.params.name;
    const latestPath = path.join(DIAGRAMS_DIR, diagramName, 'created_diagrams', 'latest.json');

    if (!fs.existsSync(latestPath)) {
      return res.status(404).json({
        error: 'Diagram not found',
        message: `No diagram found with name: ${diagramName}`
      });
    }

    const diagramData = JSON.parse(fs.readFileSync(latestPath, 'utf8'));

    res.json({
      name: diagramName,
      diagram: diagramData
    });
  } catch (error) {
    console.error('Error fetching diagram:', error);
    res.status(500).json({
      error: 'Failed to fetch diagram',
      message: error.message
    });
  }
});

/**
 * Get all diagram versions for a specific diagram
 * GET /api/diagrams/:name/versions
 */
app.get('/api/diagrams/:name/versions', (req, res) => {
  try {
    const diagramName = req.params.name;
    const diagramDir = path.join(DIAGRAMS_DIR, diagramName, 'created_diagrams');

    if (!fs.existsSync(diagramDir)) {
      return res.status(404).json({
        error: 'Diagram directory not found'
      });
    }

    const files = fs.readdirSync(diagramDir)
      .filter(file => file.endsWith('.json') && file !== 'latest.json')
      .map(file => {
        const filePath = path.join(diagramDir, file);
        const stats = fs.statSync(filePath);
        const timestamp = file.match(/_(\d+)\.json$/)?.[1];

        return {
          filename: file,
          timestamp: timestamp ? parseInt(timestamp) : null,
          created: stats.mtime.toISOString(),
          size: stats.size
        };
      })
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Newest first

    res.json({
      name: diagramName,
      versions: files,
      count: files.length
    });
  } catch (error) {
    console.error('Error listing versions:', error);
    res.status(500).json({
      error: 'Failed to list versions',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║     🎨 Claude Figma Diagram Server                           ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📂 Serving diagrams from: ${DIAGRAMS_DIR}\n`);
  console.log('📡 API Endpoints:');
  console.log(`   GET  /health                      - Server health check`);
  console.log(`   GET  /api/diagrams                - List all diagrams`);
  console.log(`   GET  /api/diagrams/:name          - Get specific diagram`);
  console.log(`   GET  /api/diagrams/:name/versions - List diagram versions`);
  console.log('\n💡 Keep this server running while using the FigJam plugin');
  console.log('   Press Ctrl+C to stop\n');

  // Check if diagrams directory exists
  if (!fs.existsSync(DIAGRAMS_DIR)) {
    console.warn('⚠️  Warning: diagrams/ directory not found');
    console.log('   Create diagrams using: npm run generate\n');
  } else {
    // Count available diagrams
    const diagramCount = fs.readdirSync(DIAGRAMS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
      .filter(dirent => {
        const latestPath = path.join(DIAGRAMS_DIR, dirent.name, 'created_diagrams', 'latest.json');
        return fs.existsSync(latestPath);
      }).length;

    console.log(`📊 Found ${diagramCount} diagram(s) ready to serve\n`);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down diagram server...');
  process.exit(0);
});
