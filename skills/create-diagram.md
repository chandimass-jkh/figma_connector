---
name: create-diagram
description: Create diagrams in FigJam (ER diagrams, flowcharts, architecture diagrams) with automatic server integration
version: 2.0.0
author: Claude
tags: [figma, figjam, diagrams, visualization, er-diagram, flowchart, architecture, automated]
---

# Create Diagram Skill

Creates professional diagrams in FigJam from natural language descriptions with **fully automated workflow**.

## Supported Diagram Types

1. **ER Diagrams** - Database schemas, star schemas, constellation schemas, snowflake schemas
2. **Flowcharts** - Process flows, workflows, decision trees
3. **Architecture Diagrams** - System architecture, microservices, infrastructure

## Complete Automated Workflow

### Prerequisites Check

**ALWAYS check first:**
```bash
# Check if diagram server is running
curl -s http://localhost:3456/health
```

**If server not running:**
```bash
# Start the diagram server (keep it running)
npm run diagram-server
```

This server is **REQUIRED** for the FigJam plugin to automatically see new diagrams.

### Full Workflow (When User Asks to Create a Diagram)

1. **Ensure server is running** (check prerequisites above)

2. **Create the diagram specification**
   - Extract information from user request
   - Build JSON spec with tables/nodes/connections
   - Save to: `diagrams/<diagram-name>/inputs/spec.json`

3. **Generate the diagram**:
   ```bash
   npm run generate -- --type <diagram-type> --name <diagram-name> --spec spec.json
   ```

4. **Verify server detected it**:
   ```bash
   curl -s http://localhost:3456/api/diagrams | grep <diagram-name>
   ```

5. **Instruct user**:
   - Open FigJam: https://www.figma.com/board/ht9CrCOgT7sZpKyopJpHXN/claude-test
   - Run plugin: Claude ER Diagram Auto-Creator
   - Click **🔄 Refresh List**
   - Select the new diagram from dropdown
   - Click **✨ Create Diagram**
   - Done! ✨

### Why This Works Automatically

```
User Request → Generate → Server Detects → Plugin Refresh → Create in FigJam
     ↓            ↓             ↓                ↓              ↓
  "Create     spec.json    Auto-scans      Shows in       Draws diagram
   ER diagram"  created     diagrams/       dropdown       automatically
```

## Examples

### ER Diagram
**User**: "Create an ER diagram for an e-commerce database with users, products, orders, and order_items tables"

**Action**:
1. Create input spec in `diagrams/ecommerce/inputs/schema.json`
2. Run generator
3. Output FigJam-ready JSON

### Flowchart
**User**: "Create a flowchart for user login process"

**Action**:
1. Identify steps: start → enter credentials → validate → success/fail
2. Create input spec
3. Generate flowchart

### Architecture
**User**: "Create architecture diagram for microservices with API gateway, auth service, and database"

**Action**:
1. Identify components and their connections
2. Create input spec
3. Generate architecture diagram

## File Structure

```
diagrams/
  <diagram-name>/
    inputs/
      spec.json          # Input specification
      config.json        # Optional configuration
    created_diagrams/
      diagram_123.json   # Generated FigJam spec
      diagram_124.json   # Another version
```

## Configuration

Default settings in `config/defaults.json`:
- Canvas size
- Default colors
- Font sizes
- Spacing rules

## Integration with FigJam + Diagram Server

### The Magic: Automatic Discovery

The diagram server (port 3456) automatically:
- Scans `diagrams/` folder
- Finds all `latest.json` files
- Serves them via HTTP API
- Plugin fetches on refresh

**No manual copying, no plugin rebuild needed!**

### User Workflow in FigJam

1. **Open FigJam board** (keep diagram server running)
2. **Run plugin:** Claude ER Diagram Auto-Creator
3. **Click 🔄 Refresh List** - sees all diagrams automatically
4. **Select diagram** from dropdown (shows title, node count, connection count)
5. **Click ✨ Create Diagram** - appears in FigJam instantly
6. **Done!** ✨

### Alternative: Paste JSON Method

If server not running, user can still:
1. Copy from `diagrams/<name>/created_diagrams/latest.json`
2. Paste into plugin textarea
3. Click **✓ Validate JSON**
4. Click **✨ Create Diagram**

## Templates

Pre-built templates in `src/templates/`:
- `er-star-schema.json` - Star schema for data warehouses
- `er-snowflake.json` - Snowflake schema
- `flowchart-approval.json` - Approval workflow
- `architecture-microservices.json` - Microservices architecture

## Commands

### Generate from template
```bash
node src/generators/generate.js --template star-schema --name retail-sales
```

### Generate from natural language
```bash
node src/generators/generate.js --type er-diagram --name my-db --prompt "Create a schema for a blog with users, posts, and comments"
```

### List available templates
```bash
node src/generators/list-templates.js
```

## Tips for Claude

1. **Check diagram server first** - Essential for automated workflow
   ```bash
   curl -s http://localhost:3456/health || npm run diagram-server &
   ```

2. **Always create a new diagram folder** for each request
   - Use descriptive names (e.g., `healthcare-analytics` not `diagram1`)
   - Keep related diagrams together (e.g., `ecommerce-*`)

3. **Save input specs** - Users can modify and regenerate
   - Always save to `diagrams/<name>/inputs/spec.json`
   - These are tracked in git (outputs are not)

4. **Verify server detection** after generation
   ```bash
   curl -s http://localhost:3456/api/diagrams | grep <diagram-name>
   ```

5. **Provide complete instructions**:
   - Mention that server must be running
   - Show FigJam URL
   - Explain refresh button
   - Offer paste-JSON alternative if server down

6. **Commit input specs to git** - For version control
   ```bash
   git add diagrams/<name>/inputs/spec.json
   git commit -m "Add <name> diagram"
   ```

7. **Test the workflow** - Verify diagram appears in dropdown

## Error Handling

### Server Issues

**Server not running:**
```bash
# Symptom: Plugin shows "No diagrams found" or "Server not running"
# Fix: Start the server
npm run diagram-server
```

**Port already in use:**
```bash
# Kill existing process
lsof -ti:3456 | xargs kill
# Restart
npm run diagram-server
```

**Server not detecting new diagrams:**
- Check file exists: `ls diagrams/<name>/created_diagrams/latest.json`
- Test endpoint: `curl http://localhost:3456/api/diagrams`
- Server should auto-detect (no restart needed)

### Generation Issues

**Invalid spec:**
- Validate JSON syntax
- Check required fields: `title`, `tables`/`nodes`, `relationships`/`connections`
- Ensure all foreign key references exist

**Plugin Issues:**
- Missing FIGMA_ACCESS_TOKEN: Not needed for plugin (only for MCP server)
- Plugin not installed: Show installation instructions
- Plugin cache: Quit Figma (Cmd+Q), reopen, re-import plugin

### Troubleshooting Commands

```bash
# Check server status
curl http://localhost:3456/health

# List all diagrams
curl http://localhost:3456/api/diagrams | jq '.'

# Get specific diagram
curl http://localhost:3456/api/diagrams/<name> | jq '.diagram.title'

# Check what diagrams exist locally
ls -la diagrams/*/created_diagrams/latest.json

# View server logs
tail -f /tmp/diagram-server.log
```

## Future Enhancements

- [ ] Direct API integration (no plugin needed)
- [ ] Real-time collaboration
- [ ] Version control for diagrams
- [ ] Export to PNG/SVG
- [ ] AI-powered diagram suggestions

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Request                            │
│  "Create an ER diagram for e-commerce with orders/returns" │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│               Claude (This Skill)                           │
│  1. Create spec.json                                        │
│  2. Run: npm run generate                                   │
│  3. Verify server detection                                 │
│  4. Instruct user                                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│            Diagram Generator CLI                            │
│  - Reads spec from diagrams/<name>/inputs/                  │
│  - Generates nodes, connections, annotations                │
│  - Saves to diagrams/<name>/created_diagrams/latest.json    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│          Diagram Server (localhost:3456)                    │
│  - Auto-scans diagrams/ folder                              │
│  - Serves via HTTP API                                      │
│  - GET /api/diagrams (list all)                             │
│  - GET /api/diagrams/:name (get specific)                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│            FigJam Plugin (Figma Sandbox)                    │
│  1. User clicks "Refresh List"                              │
│  2. Fetches from localhost:3456/api/diagrams                │
│  3. Shows in dropdown with metadata                         │
│  4. User selects → fetches full JSON                        │
│  5. Creates shapes/connections in FigJam                    │
└─────────────────────────────────────────────────────────────┘
```

## Session Workflow

**Start of session:**
```bash
# Terminal 1: Start diagram server (keep running)
npm run diagram-server

# Server runs continuously, scans for new diagrams
```

**During session:**
```bash
# Generate new diagrams as requested
npm run generate -- --type er-diagram --name <name> --spec spec.json

# Server automatically detects (no restart needed)
# User refreshes plugin → sees new diagram
# User selects and creates in FigJam
```

**End of session:**
```bash
# Stop server: Ctrl+C in server terminal
```

## Completed Features

- [x] Automatic diagram discovery via HTTP server
- [x] Dropdown selection with metadata (title, counts)
- [x] Refresh functionality (no manual JSON copying)
- [x] Multiple diagram type support (ER, flowchart, architecture)
- [x] Constellation schema support (2+ fact tables)
- [x] Real-time generation without server restart
- [x] Alternative paste-JSON method when server down
- [x] Comprehensive error handling and troubleshooting

## Future Enhancements

- [ ] Natural language to spec conversion (AI-powered)
- [ ] WebSocket for real-time updates (no manual refresh needed)
- [ ] Direct Figma REST API integration (eliminate plugin requirement)
- [ ] Diagram versioning UI in plugin
- [ ] Export to PNG/SVG/PDF
- [ ] Collaborative editing with conflict resolution
- [ ] Diagram templates library
- [ ] Schema validation with helpful error messages
