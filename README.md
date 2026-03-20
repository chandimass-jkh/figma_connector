# Claude Figma Diagram Generator

Automatically create professional diagrams in FigJam using Claude AI through natural language descriptions.

## Features

- **ER Diagrams** - Database schemas, star schemas, snowflake schemas
- **Flowcharts** - Process flows, workflows, decision trees
- **Architecture Diagrams** - System architecture, microservices, infrastructure
- **Natural Language Interface** - Describe your diagram, Claude creates it
- **Automatic Creation** - Diagrams appear directly in FigJam (no manual import)

## Quick Start

### 1. Setup

```bash
# Install dependencies
npm install

# Create .env file with your Figma Personal Access Token
echo "FIGMA_ACCESS_TOKEN=your_token_here" > .env
```

### 2. Install FigJam Plugin

1. Open FigJam Desktop App
2. Navigate to **Plugins** → **Development** → **Import plugin from manifest**
3. Select `figjam-plugin-auto/manifest.json`
4. Plugin name: **Claude ER Diagram Auto-Creator**

### 3. Generate Your First Diagram

```bash
# Using a template
npm run generate -- --template er-star-schema --name retail-sales

# From custom spec file
npm run generate -- --type er-diagram --name my-db --spec spec.json
```

### 4. View in FigJam

1. Open [FigJam Board](https://www.figma.com/board/ht9CrCOgT7sZpKyopJpHXN/claude-test)
2. Run plugin: **Claude ER Diagram Auto-Creator**
3. Your diagram appears automatically!

## Project Structure

```
claude_figma/
├── src/
│   ├── core/
│   │   ├── diagram-generator.js    # Core generation logic
│   │   └── figma-client.js         # Figma API client
│   ├── generators/
│   │   └── generate.js             # CLI tool
│   └── templates/
│       └── er-star-schema.json     # Pre-built templates
├── diagrams/
│   └── <diagram-name>/
│       ├── inputs/                 # Input specifications
│       └── created_diagrams/       # Generated outputs
│           ├── latest.json         # Most recent version
│           └── <name>_<timestamp>.json
├── config/
│   └── defaults.json               # Default settings
├── skills/
│   └── create-diagram.md           # Claude Code skill
└── figjam-plugin-auto/
    ├── manifest.json               # Plugin manifest
    ├── code.js                     # Plugin logic
    └── ui.html                     # Plugin UI
```

## Usage

### Generate from Template

```bash
npm run generate -- --template er-star-schema --name my-diagram
```

### Generate from Spec File

Create an input spec in `diagrams/<name>/inputs/spec.json`:

```json
{
  "title": "My Database Schema",
  "tables": [
    {
      "id": "users",
      "name": "Users",
      "emoji": "👤",
      "x": 100,
      "y": 100,
      "width": 280,
      "height": 320,
      "color": "#4ECDC4",
      "columns": [
        { "name": "UserID", "constraint": "PK" },
        { "name": "Email" },
        { "name": "Name" }
      ]
    }
  ],
  "relationships": [
    { "from": "users", "to": "posts", "label": "1:N" }
  ]
}
```

Then generate:

```bash
npm run generate -- --type er-diagram --name my-db --spec spec.json
```

## Claude Code Integration

This project includes a Claude Code skill for seamless diagram creation. The skill is located at [skills/create-diagram.md](skills/create-diagram.md).

## Configuration

Edit [config/defaults.json](config/defaults.json) to customize:
- Canvas size and padding
- Default colors for different node types
- Spacing between elements
- Font styles and sizes
- FigJam board URL

## API Documentation

### DiagramGenerator Class

```javascript
import { DiagramGenerator } from './src/core/diagram-generator.js';

const generator = new DiagramGenerator();

// Generate ER Diagram
const diagram = generator.generateERDiagram({
  title: "My Schema",
  tables: [...],
  relationships: [...],
  annotations: [...]
});

// Generate Flowchart
const flowchart = generator.generateFlowchart({
  title: "My Process",
  steps: [...],
  decisions: [...]
});

// Generate Architecture Diagram
const architecture = generator.generateArchitectureDiagram({
  title: "My System",
  components: [...],
  connections: [...]
});
```

### FigmaClient Class

```javascript
import { FigmaClient } from './src/core/figma-client.js';

const client = new FigmaClient(process.env.FIGMA_ACCESS_TOKEN);

// Get user info
const user = await client.getMe();

// Get file data
const file = await client.getFile('file-key');

// Test connection
const result = await client.testConnection();
```

## Troubleshooting

### Plugin Not Loading

- Quit Figma completely (Cmd+Q on Mac) and reopen
- Reimport plugin from manifest
- Check browser console (Cmd+Option+I) for errors

### Missing Fonts Error

The plugin automatically loads required fonts. If you see font errors:
- Ensure you're using Figma Desktop App (not browser)
- Check that Inter font is available

### Diagrams Not Appearing

- Verify output file exists: `diagrams/<name>/created_diagrams/latest.json`
- Check file permissions
- Ensure FigJam board is open before running plugin

## Examples

### Example 1: Retail Sales Data Warehouse

```bash
npm run generate -- --template er-star-schema --name retail-sales
```

Creates a complete star schema with:
- 1 fact table (FactSales)
- 4 dimension tables (Date, Customer, Product, Store)
- Relationships and annotations

### Example 2: Custom ER Diagram

Create `diagrams/blog/inputs/spec.json`:
```json
{
  "title": "Blog Database Schema",
  "tables": [
    {
      "id": "users",
      "name": "Users",
      "emoji": "👤",
      "x": 100,
      "y": 100,
      "width": 280,
      "height": 250,
      "color": "#4ECDC4",
      "columns": [
        { "name": "UserID", "constraint": "PK" },
        { "name": "Username" },
        { "name": "Email" },
        { "name": "CreatedAt" }
      ]
    },
    {
      "id": "posts",
      "name": "Posts",
      "emoji": "📝",
      "x": 500,
      "y": 100,
      "width": 280,
      "height": 300,
      "color": "#F8B500",
      "columns": [
        { "name": "PostID", "constraint": "PK" },
        { "name": "UserID", "constraint": "FK" },
        { "name": "Title" },
        { "name": "Content" },
        { "name": "PublishedAt" }
      ]
    }
  ],
  "relationships": [
    { "from": "users", "to": "posts", "label": "1:N" }
  ]
}
```

Then run:
```bash
npm run generate -- --type er-diagram --name blog --spec spec.json
```

## Figma Personal Access Token

To get your token:
1. Go to [Figma Settings → Personal Access Tokens](https://www.figma.com/settings)
2. Click "Create new token"
3. Required scopes:
   - File content (read)
   - File content (write)
4. Copy token and save to `.env`

## Contributing

Contributions welcome! Please follow the existing code structure:
- Core logic in `src/core/`
- Generators in `src/generators/`
- Templates in `src/templates/`
- Skills in `skills/`

## License

MIT

## Support

For issues or questions:
- Open an issue on GitHub
- Check the Claude Code skill documentation: [skills/create-diagram.md](skills/create-diagram.md)

## Roadmap

- [ ] Natural language diagram generation
- [ ] Direct API integration (no plugin needed)
- [ ] Real-time collaboration
- [ ] Version control for diagrams
- [ ] Export to PNG/SVG
- [ ] AI-powered diagram suggestions
- [ ] More diagram types (sequence diagrams, class diagrams)
- [ ] Customizable themes
