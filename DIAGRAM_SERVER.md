# Diagram Server

Local HTTP server that serves generated diagrams to the FigJam plugin.

## Why This Exists

Figma plugins run in a **sandboxed environment** and cannot access your local file system directly. This server solves that limitation by:

1. Reading diagrams from your local `diagrams/` folder
2. Serving them via HTTP API on `localhost:3456`
3. Plugin fetches diagrams via standard HTTP requests

## Quick Start

### 1. Start the Server

```bash
npm run diagram-server
```

You should see:
```
╔════════════════════════════════════════════════════════════════╗
║     🎨 Claude Figma Diagram Server                           ║
╚════════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:3456
📂 Serving diagrams from: /Users/sen/workspace/claude_figma/diagrams

📡 API Endpoints:
   GET  /health                      - Server health check
   GET  /api/diagrams                - List all diagrams
   GET  /api/diagrams/:name          - Get specific diagram
   GET  /api/diagrams/:name/versions - List diagram versions

💡 Keep this server running while using the FigJam plugin
   Press Ctrl+C to stop

📊 Found 2 diagram(s) ready to serve
```

### 2. Use the Plugin

1. **Keep the server running** (don't close the terminal)
2. Open FigJam board
3. Run plugin: **Claude ER Diagram Auto-Creator**
4. Click **🔄 Refresh List**
5. See all your diagrams in the dropdown! 🎉

### 3. Select and Create

- Choose any diagram from the dropdown
- Click **✨ Create Diagram**
- Watch it appear in FigJam!

## How It Works

```
┌─────────────────┐          ┌──────────────────┐          ┌─────────────┐
│  FigJam Plugin  │  HTTP    │  Diagram Server  │  Read    │  diagrams/  │
│  (code.js)      │─────────▶│  (port 3456)     │─────────▶│  folder     │
│                 │◀─────────│                  │◀─────────│             │
│                 │  JSON    │                  │  Files   │             │
└─────────────────┘          └──────────────────┘          └─────────────┘
```

## API Endpoints

### GET /health

Health check for server status.

**Response:**
```json
{
  "status": "ok",
  "server": "Claude Figma Diagram Server",
  "version": "1.0.0",
  "port": 3456
}
```

### GET /api/diagrams

List all available diagrams.

**Response:**
```json
{
  "diagrams": [
    {
      "name": "healthcare-analytics",
      "title": "Healthcare Analytics - Constellation Schema",
      "hasLatest": true,
      "nodeCount": 12,
      "connectionCount": 7
    },
    {
      "name": "data-warehouse-2facts",
      "title": "Data Warehouse - Constellation Schema",
      "hasLatest": true,
      "nodeCount": 12,
      "connectionCount": 7
    }
  ],
  "count": 2
}
```

### GET /api/diagrams/:name

Get a specific diagram's full specification.

**Example:** `GET /api/diagrams/healthcare-analytics`

**Response:**
```json
{
  "name": "healthcare-analytics",
  "diagram": {
    "title": "Healthcare Analytics - Constellation Schema",
    "type": "er-diagram",
    "nodes": [...],
    "connections": [...]
  }
}
```

### GET /api/diagrams/:name/versions

List all versions (timestamped files) of a diagram.

**Example:** `GET /api/diagrams/healthcare-analytics/versions`

**Response:**
```json
{
  "name": "healthcare-analytics",
  "versions": [
    {
      "filename": "healthcare-analytics_1773974328533.json",
      "timestamp": 1773974328533,
      "created": "2026-03-20T02:38:48.533Z",
      "size": 4521
    }
  ],
  "count": 1
}
```

## Testing the Server

### Test Health Check
```bash
curl http://localhost:3456/health
```

### Test List Diagrams
```bash
curl http://localhost:3456/api/diagrams
```

### Test Get Specific Diagram
```bash
curl http://localhost:3456/api/diagrams/healthcare-analytics
```

### Test with Pretty JSON
```bash
curl -s http://localhost:3456/api/diagrams | jq '.'
```

## Workflow

### Daily Usage

1. **Start server once** (morning):
   ```bash
   npm run diagram-server
   ```

2. **Keep it running** in the background

3. **Generate diagrams** as needed:
   ```bash
   npm run generate -- --type er-diagram --name my-diagram --spec spec.json
   ```

4. **Use plugin** in FigJam:
   - Refresh to see new diagrams
   - Select and create

5. **Stop server** when done (Ctrl+C)

### Create New Diagram

1. Create spec file:
   ```bash
   mkdir -p diagrams/my-new-diagram/inputs
   # Edit: diagrams/my-new-diagram/inputs/spec.json
   ```

2. Generate:
   ```bash
   npm run generate -- --type er-diagram --name my-new-diagram --spec spec.json
   ```

3. **Refresh in plugin** - new diagram appears automatically!

## Configuration

### Change Port

Edit `diagram-server.js`:
```javascript
const PORT = 3456; // Change to your preferred port
```

Then update plugin `code.js`:
```javascript
const response = await fetch('http://localhost:YOUR_PORT/api/diagrams');
```

### CORS Settings

The server allows all origins by default (for Figma plugin sandbox). This is safe because:
- Server only runs on localhost
- Only serves read-only diagram data
- No authentication needed

## Troubleshooting

### "Connection refused" in plugin

**Problem:** Server is not running

**Solution:**
```bash
npm run diagram-server
```

Keep the terminal open!

### "No diagrams found"

**Problem:** No `latest.json` files in diagrams folders

**Solution:** Generate diagrams first:
```bash
npm run generate -- --template er-star-schema --name test-diagram
```

### "Port 3456 already in use"

**Problem:** Server is already running or port is taken

**Solution 1:** Kill existing process:
```bash
lsof -ti:3456 | xargs kill
```

**Solution 2:** Change port (see Configuration above)

### Plugin shows old diagrams after generating new ones

**Problem:** Browser/plugin cache

**Solution:**
1. Click **🔄 Refresh List** in plugin
2. If that doesn't work:
   - Quit Figma completely (Cmd+Q)
   - Restart server
   - Reopen Figma and plugin

## Production Considerations

**This is a development tool.** For production use:

1. ✅ **Keep as-is** - Simple, local, secure
2. 🔒 **Add authentication** - If exposing beyond localhost
3. ☁️ **Cloud hosting** - Deploy diagrams to cloud storage, serve via CDN
4. 🔄 **File watching** - Auto-refresh when diagrams change (future enhancement)

## Security

✅ **Safe to use:**
- Runs on localhost only
- Read-only access to diagrams
- No external network access
- CORS enabled for Figma plugin

❌ **Do not:**
- Expose to public internet
- Run on shared servers
- Store sensitive data in diagrams

## Future Enhancements

- [ ] File system watching (auto-refresh on diagram changes)
- [ ] WebSocket support for real-time updates
- [ ] Diagram preview thumbnails
- [ ] Version comparison
- [ ] Backup and restore
- [ ] Export to multiple formats

## Alternative Solutions

### Option 1: Embed in Plugin (No Server)

**Pros:** No server needed, simpler
**Cons:** Large plugin file, requires rebuild

### Option 2: Cloud Storage

**Pros:** Accessible anywhere, team sharing
**Cons:** Setup complexity, costs

### Option 3: This HTTP Server ✅

**Pros:** Dynamic, automatic, local
**Cons:** Must keep running

We chose **Option 3** because it provides the best developer experience.

## Support

For issues:
- Check server is running: `curl http://localhost:3456/health`
- Check diagrams exist: `ls -la diagrams/*/created_diagrams/latest.json`
- View server logs in terminal
- Restart server: Ctrl+C, then `npm run diagram-server`
