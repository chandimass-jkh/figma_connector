# Quick Start Guide 🚀

Get up and running with FigJam + Claude in 5 minutes!

## Prerequisites

- ✅ Figma account (free or paid)
- ✅ Figma Personal Access Token (you already have this!)
- ✅ Node.js installed

## Setup (5 minutes)

### 1. Run Setup Script

```bash
cd /Users/sen/workspace/claude_figma
./setup.sh
```

### 2. Add MCP Configuration

Open your Claude settings file:

**Claude Code:**
```bash
code ~/.claude/settings.json
```

**Claude Desktop:**
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Add this to the `mcpServers` section:

```json
{
  "mcpServers": {
    "figjam": {
      "command": "node",
      "args": ["/Users/sen/workspace/claude_figma/index.js"]
    }
  }
}
```

### 3. Install FigJam Plugin

1. Open **Figma Desktop** app
2. **Menu** → **Plugins** → **Development** → **Import plugin from manifest...**
3. Navigate to: `/Users/sen/workspace/claude_figma/figjam-plugin/`
4. Select `manifest.json`

### 4. Restart Claude

Close and reopen Claude Code or Claude Desktop.

## First Diagram (2 minutes)

### Step 1: Create FigJam Board

1. Go to https://www.figma.com/figjam/
2. Click **"New FigJam file"**
3. Name it: **"Claude Diagrams"**
4. Copy the file key from URL: `figma.com/file/{THIS-IS-THE-FILE-KEY}/...`

### Step 2: Test Connection

In Claude, type:

```
Check my FigJam connection
```

You should see: ✅ Connected to Figma/FigJam API!

### Step 3: Create Your First Diagram

In Claude, type:

```
Create a simple flowchart in FigJam file {YOUR-FILE-KEY} with:
- Start (green circle)
- Process step (blue rectangle)
- Decision point (yellow diamond)
- End (red circle)
Connect them with arrows
```

### Step 4: Import to FigJam

1. Claude generates a JSON specification
2. Open your FigJam board
3. **Right-click** → **Plugins** → **Claude Diagram Importer**
4. **Copy the JSON** from Claude's response
5. **Paste** into the plugin
6. Click **Import Diagram**
7. 🎉 Your diagram appears!

## Example Prompts to Try

### Flowchart
```
Create a user registration flowchart in FigJam {FILE-KEY}
```

### Architecture Diagram
```
Design a microservices architecture with API gateway,
3 services, and database in FigJam {FILE-KEY}
```

### Mindmap
```
Create a mindmap for learning Python with main topics
and subtopics in FigJam {FILE-KEY}
```

### Process Flow
```
Create an order processing workflow diagram in FigJam {FILE-KEY}
```

## Tips for Better Diagrams

1. **Be Specific** - Describe node types (sticky, rectangle, circle)
2. **Mention Colors** - "green for success, red for errors"
3. **Describe Layout** - "arrange in a grid" or "flow from left to right"
4. **Add Details** - Include labels, connections, and relationships

## Troubleshooting

### Can't find the plugin?
- Make sure you're in a **FigJam file** (not regular Figma)
- Restart Figma Desktop app

### Connection failed?
```bash
# Check .env file
cat .env

# Should show your token
```

### Node.js not found?
```bash
brew install node
```

## What's Next?

- Create complex architecture diagrams
- Design process workflows
- Build mindmaps
- Visualize data structures
- Plan user journeys

## Support

- 📖 Full docs: [README.md](README.md)
- 🔌 Plugin docs: [figjam-plugin/README.md](figjam-plugin/README.md)
- 🐛 Issues: Check your FigJam file key and Claude MCP config

---

**Happy Diagramming! 🎨✨**
