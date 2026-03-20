# Claude Diagram Importer - FigJam Plugin

Import diagrams created by Claude directly into FigJam!

## Installation

### Option 1: Install in Figma Desktop

1. Open Figma Desktop app
2. Go to **Menu** → **Plugins** → **Development** → **Import plugin from manifest...**
3. Select the `manifest.json` file from this folder
4. The plugin is now installed!

### Option 2: Development Mode

1. Open FigJam
2. Right-click → **Plugins** → **Development** → **Import plugin from manifest...**
3. Navigate to `/Users/sen/workspace/claude_figma/figjam-plugin/`
4. Select `manifest.json`

## Usage

### Step 1: Generate Diagram with Claude

In your Claude conversation, say something like:

```
Create a flowchart in FigJam with:
- Start node
- Process step
- Decision point
- End node
Connected with arrows
```

Claude will generate a diagram specification JSON.

### Step 2: Import to FigJam

1. Open your FigJam board
2. Right-click → **Plugins** → **Claude Diagram Importer**
3. Copy the JSON specification from Claude
4. Paste it into the plugin
5. Click **Import Diagram**

## Supported Elements

- **Sticky Notes** - Perfect for ideas and brainstorming
- **Rectangles** - Process steps, containers
- **Circles/Ellipses** - Start/end points
- **Text** - Labels and annotations
- **Connectors** - Arrows between elements (auto-routing)

## Example Diagram Spec

```json
{
  "title": "User Login Flow",
  "diagramType": "flowchart",
  "nodes": [
    {
      "id": "start",
      "type": "circle",
      "label": "Start",
      "x": 100,
      "y": 100,
      "width": 100,
      "height": 100,
      "color": "#4ADE80"
    },
    {
      "id": "login",
      "type": "rectangle",
      "label": "Login Form",
      "x": 100,
      "y": 250,
      "width": 180,
      "height": 80,
      "color": "#60A5FA"
    },
    {
      "id": "success",
      "type": "sticky",
      "label": "Success!",
      "x": 100,
      "y": 400,
      "color": "#34D399"
    }
  ],
  "connections": [
    { "from": "start", "to": "login" },
    { "from": "login", "to": "success", "label": "Valid credentials" }
  ]
}
```

## Features

- ✅ Automatic node layout (if positions not specified)
- ✅ Auto-routing connectors
- ✅ Custom colors (hex codes)
- ✅ Connection labels
- ✅ Auto-zoom to created diagram
- ✅ Multiple diagram types support

## Tips

- Start with Claude to generate the structure
- Let Claude handle positioning or specify manually
- Use hex colors (#FF6B6B) for custom colors
- Add connection labels for better clarity

## Troubleshooting

**Plugin not showing up?**
- Make sure you're in a FigJam file (not regular Figma)
- Check Plugins → Development → Import plugin from manifest

**Invalid JSON error?**
- Copy the entire JSON from Claude
- Make sure it's valid JSON format
- Check for missing commas or brackets

**Nodes not connected?**
- Verify node IDs match in connections
- Ensure both 'from' and 'to' nodes exist

## Development

To modify the plugin:

1. Edit `code.js` or `ui.html`
2. In FigJam: **Plugins** → **Development** → **Hot reload plugin**
3. Or restart the plugin to see changes

## License

MIT - Free to use and modify!
