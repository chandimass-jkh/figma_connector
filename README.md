# Claude Figma Diagram Generator

Automatically create professional diagrams in FigJam using Claude AI with **fully automated workflow**.

## 🌟 What Makes This Special

✨ **Fully Automated** - Just ask Claude, diagrams appear in FigJam
🔄 **Real-time Refresh** - New diagrams show instantly in plugin
🎯 **No Manual Copying** - HTTP server handles everything
📊 **Multiple Diagram Types** - ER, flowcharts, architecture
🚀 **Constellation Schemas** - 2+ fact tables, shared dimensions
🎨 **Professional Quality** - Color-coded, annotated, publication-ready

## Quick Start (3 Steps)

### 1. Start the Diagram Server

```bash
npm install  # One-time only
npm run diagram-server
```

**Keep this running!** The server automatically detects new diagrams.

### 2. Install FigJam Plugin

1. Open **Figma Desktop App** (not browser)
2. **Menu** → **Plugins** → **Development** → **Import plugin from manifest**
3. Select: `figjam-plugin-auto/manifest.json`

### 3. Create Your First Diagram

Ask Claude: *"Create an ER diagram for e-commerce with orders and returns"*

Claude will:
- ✅ Create the specification
- ✅ Generate the diagram
- ✅ Verify server detection
- ✅ Give you FigJam instructions

Then in FigJam:
1. Run plugin: **Claude ER Diagram Auto-Creator**
2. Click **🔄 Refresh List**
3. Select your diagram
4. Click **✨ Create Diagram**
5. Done! 🎉

## See Full Guide

📖 **[QUICK_START.md](QUICK_START.md)** - 5-minute getting started guide

## How It Works

```
User Request ──> Claude ──> Generator ──> HTTP Server ──> FigJam Plugin
    "Create           Creates      Saves to       Auto-scans      Fetches &
   ER diagram"       spec.json    diagrams/       new files       displays
                                   folder                         in FigJam
```

### The Magic: No Manual Steps!

1. **Ask Claude** - Natural language request
2. **Auto-generate** - Spec created, diagram generated
3. **Auto-detect** - Server finds new diagram (no restart)
4. **Auto-refresh** - Plugin shows it in dropdown
5. **One-click create** - Appears in FigJam instantly

## Available Diagrams (3)

### 1. Healthcare Analytics
- **2 Facts:** Patient Visits, Prescriptions
- **4 Dimensions:** Date, Patient, Doctor, Facility
- **Use Case:** Hospital analytics, patient trends

### 2. Data Warehouse (Retail)
- **2 Facts:** Sales, Inventory
- **4 Dimensions:** Date, Customer, Product, Store
- **Use Case:** Stock optimization, demand forecasting

### 3. E-Commerce Analytics
- **2 Facts:** Orders, Returns
- **4 Dimensions:** Date, Customer, Product, Shipping
- **Use Case:** Return rate analysis, revenue tracking

All are **constellation schemas** (2 facts + 4 shared dimensions)

## Project Structure

```
claude_figma/
├── diagram-server.js              # HTTP server (port 3456)
├── src/
│   ├── core/
│   │   ├── diagram-generator.js   # Core generation logic
│   │   └── figma-client.js        # Figma API client
│   ├── generators/
│   │   └── generate.js            # CLI generator
│   └── templates/
│       └── er-star-schema.json    # Pre-built template
├── diagrams/                      # Generated diagrams
│   ├── healthcare-analytics/
│   ├── data-warehouse-2facts/
│   └── ecommerce-analytics/
│       ├── inputs/
│       │   └── spec.json          # Input specification (tracked in git)
│       └── created_diagrams/
│           └── latest.json        # Generated output (not tracked)
├── figjam-plugin-auto/            # FigJam plugin with refresh
│   ├── manifest.json
│   ├── code.js                    # Fetches from localhost:3456
│   └── ui.html                    # Dropdown + paste JSON
├── config/
│   └── defaults.json              # Default colors, spacing, fonts
└── skills/
    ├── create-diagram.md          # Main skill (v2.0 - automated)
    └── generate-diagram.md        # CLI reference
```

## Usage

### Method 1: Ask Claude (Recommended)

Just describe what you want:
```
"Create an ER diagram for a university database with students, courses, and enrollments"
"Make a constellation schema for financial analytics with transactions and budgets"
"Design an architecture diagram with microservices and API gateway"
```

Claude handles everything automatically!

### Method 2: Generate Manually

#### From Template

```bash
npm run generate -- --template er-star-schema --name my-diagram
```

#### From Spec File

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

## Diagram Server

The HTTP server makes everything automatic:

```bash
# Start once per session
npm run diagram-server
```

**Features:**
- 🔍 Auto-scans `diagrams/` folder
- 🚀 Serves via HTTP API (localhost:3456)
- 🔄 No restart needed for new diagrams
- 📡 Plugin fetches on refresh

**API Endpoints:**
- `GET /health` - Server status
- `GET /api/diagrams` - List all diagrams
- `GET /api/diagrams/:name` - Get specific diagram
- `GET /api/diagrams/:name/versions` - List versions

📖 See [DIAGRAM_SERVER.md](DIAGRAM_SERVER.md) for full documentation

## Claude Code Integration

**Version 2.0** - Fully automated workflow!

The skill automatically:
1. ✅ Checks if server is running
2. ✅ Starts it if needed
3. ✅ Creates diagram specification
4. ✅ Generates the diagram
5. ✅ Verifies server detection
6. ✅ Provides complete instructions

📖 See [skills/create-diagram.md](skills/create-diagram.md) for full skill documentation

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
