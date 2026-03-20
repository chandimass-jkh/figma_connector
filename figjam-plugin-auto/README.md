# FigJam Diagram Creator Plugin

Creates ER diagrams, flowcharts, and architecture diagrams in FigJam from JSON specifications.

## Features

✨ **New in v2.0:**
- 📂 Select from available diagrams (dropdown)
- 📋 Paste custom JSON directly
- ✓ JSON validation before creation
- 🔄 Refresh diagram list
- 📊 Show diagram preview (title, nodes, connections)
- 🎨 Improved UI with better layout

## Installation

1. Open Figma Desktop app
2. Go to **Menu** → **Plugins** → **Development** → **Import plugin from manifest**
3. Select this folder's `manifest.json`
4. Plugin name: **Claude ER Diagram Auto-Creator**

## Usage

### Method 1: Use Built-in Diagram

1. Open a FigJam board
2. Right-click → **Plugins** → **Claude ER Diagram Auto-Creator**
3. Select "Retail Sales Star Schema (Built-in)" from dropdown
4. Click **✨ Create Diagram**
5. Your diagram appears!

### Method 2: Paste Custom JSON

1. Generate a diagram using the CLI tool:
   ```bash
   npm run generate -- --type er-diagram --name my-diagram --spec spec.json
   ```

2. Copy the generated JSON from:
   ```
   diagrams/my-diagram/created_diagrams/latest.json
   ```

3. Open the plugin in FigJam

4. Paste the JSON into the textarea

5. Click **✓ Validate JSON** to check it's valid

6. Click **✨ Create Diagram**

### Method 3: Select from List (Coming Soon)

Future versions will scan your `diagrams/` folder and show all available diagrams in the dropdown.

## UI Overview

```
┌─────────────────────────────────────┐
│  🎨 Claude Diagram Creator         │
├─────────────────────────────────────┤
│                                     │
│  📂 Select Diagram:                 │
│  [Dropdown: Choose diagram...]      │
│  [Diagram info preview]             │
│  [🔄 Refresh List]                  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  📋 Or Paste Custom JSON:           │
│  [Textarea for JSON]                │
│  [✓ Validate JSON]                  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [✨ Create Diagram]                │
│  [Cancel]                           │
│                                     │
└─────────────────────────────────────┘
```

## Built-in Diagrams

The plugin includes one built-in diagram:

### Retail Sales Star Schema
- 5 tables (1 fact table + 4 dimension tables)
- 4 relationships (1:N)
- 4 legend sticky notes
- Pre-positioned for optimal layout

## JSON Format

The plugin accepts diagram specifications in this format:

```json
{
  "title": "My Diagram",
  "type": "er-diagram",
  "nodes": [
    {
      "id": "table1",
      "type": "rectangle",
      "label": "Table Name\nColumn1\nColumn2",
      "x": 100,
      "y": 100,
      "width": 280,
      "height": 320,
      "color": "#4ECDC4"
    },
    {
      "id": "note1",
      "type": "sticky",
      "label": "This is a note",
      "x": 500,
      "y": 100,
      "color": "#FFE66D"
    }
  ],
  "connections": [
    {
      "from": "table1",
      "to": "table2",
      "label": "1:N"
    }
  ]
}
```

### Supported Node Types

| Type | FigJam Element | Use Case |
|------|----------------|----------|
| `rectangle` | Shape with text | Tables, components, processes |
| `sticky` | Sticky note | Legends, annotations, notes |
| `text` | Text node | Titles, labels |

### Colors

Use hex colors for customization:
- `#FF6B6B` - Red (fact tables)
- `#4ECDC4` - Teal (dimension tables)
- `#F8B500` - Orange (products)
- `#A8E6CF` - Green (stores)
- `#FFE66D` - Yellow (legends)

## Integration with Generator

This plugin is designed to work with the diagram generator CLI:

1. **Generate diagram:**
   ```bash
   npm run generate -- --type er-diagram --name retail-dw --spec spec.json
   ```

2. **Output location:**
   ```
   diagrams/retail-dw/created_diagrams/latest.json
   ```

3. **Use in plugin:**
   - Copy JSON from `latest.json`
   - Paste into plugin textarea
   - Validate and create

## Troubleshooting

### Plugin not showing?
- Make sure you're in a FigJam file (not regular Figma)
- Re-import the manifest: **Plugins** → **Development** → **Import plugin from manifest**
- Restart Figma Desktop app

### Diagram not appearing?
1. Open browser console: **Cmd+Option+I** (Mac) or **Ctrl+Shift+I** (Windows)
2. Check for error messages
3. Verify you're using Figma Desktop (not browser version)
4. Ensure fonts are loaded (Inter font required)

### Invalid JSON error?
- Click **✓ Validate JSON** before creating
- Check that JSON has required fields: `nodes` array
- Verify all node IDs referenced in `connections` exist
- Use a JSON validator online to check syntax

### Sticky notes too large/small?
- Sticky notes auto-size based on content
- Don't specify `width` or `height` for sticky notes
- Adjust content length instead

### Plugin cache issues?
If changes to code.js aren't reflected:
1. Quit Figma completely: **Cmd+Q** (Mac)
2. Reopen Figma Desktop
3. Re-import plugin manifest
4. Try in a new FigJam file

## Development

### Files

- `manifest.json` - Plugin metadata
- `code.js` - Main plugin logic (runs in Figma sandbox)
- `ui.html` - Plugin UI (runs in browser iframe)

### Updating the Built-in Diagram

Edit `DIAGRAM_SPEC` in `code.js`:

```javascript
const DIAGRAM_SPEC = {
  title: "Your Diagram Title",
  nodes: [...],
  connections: [...]
};
```

### Adding Font Support

Load fonts in `createDiagram()`:

```javascript
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
```

## Future Enhancements

- [ ] Direct file system integration (read from `diagrams/` folder)
- [ ] Real-time diagram list with auto-refresh
- [ ] Diagram preview thumbnails
- [ ] Edit existing diagrams
- [ ] Export diagrams to PNG/SVG
- [ ] Undo/redo support
- [ ] Multi-page diagram support

## API Reference

### Messages from UI to Plugin

```javascript
// Get built-in diagram
{ type: 'get-hardcoded-diagram' }

// Load diagram by name (future)
{ type: 'load-diagram', diagramName: 'my-diagram' }

// Refresh diagram list
{ type: 'refresh-diagrams' }

// Create diagram
{
  type: 'create-diagram',
  diagram: { /* spec */ },
  source: 'hardcoded' | 'custom'
}

// Cancel and close
{ type: 'cancel' }
```

### Messages from Plugin to UI

```javascript
// Diagram loaded successfully
{ type: 'diagram-loaded', diagram: { /* spec */ } }

// List of available diagrams
{ type: 'diagrams-list', diagrams: ['name1', 'name2'] }

// Creation succeeded
{ type: 'creation-success' }

// Creation failed
{
  type: 'creation-error',
  error: 'Error message',
  errorDetails: 'Full details',
  errorStack: 'Stack trace'
}
```

## License

MIT

## Support

For issues or questions:
- Check the main project [README.md](../README.md)
- Review [skills/create-diagram.md](../skills/create-diagram.md) for diagram creation guide
- Open an issue on GitHub
