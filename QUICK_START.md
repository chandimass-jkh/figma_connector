# Quick Start Guide

Get up and running with automated diagram creation in 5 minutes!

## One-Time Setup (Already Done ✅)

- ✅ Node.js and dependencies installed
- ✅ FigJam plugin installed
- ✅ Diagram generator configured
- ✅ HTTP server created

## Daily Workflow

### Step 1: Start the Server (Once per session)

```bash
cd /Users/sen/workspace/claude_figma
npm run diagram-server
```

**Keep this terminal open!** Leave it running in the background.

### Step 2: Create Diagrams with Claude

Just ask Claude:
- "Create an ER diagram for a hospital database"
- "Make a constellation schema for retail analytics"
- "Design an architecture diagram for microservices"

Claude will automatically:
1. ✅ Check if server is running
2. ✅ Create the specification
3. ✅ Generate the diagram
4. ✅ Verify server detection
5. ✅ Give you instructions

### Step 3: View in FigJam

1. Open: https://www.figma.com/board/ht9CrCOgT7sZpKyopJpHXN/claude-test
2. Run plugin: **Claude ER Diagram Auto-Creator**
3. Click **🔄 Refresh List**
4. Select your diagram from dropdown
5. Click **✨ Create Diagram**
6. Done! 🎉

## Current Diagrams (3 Available)

1. **Healthcare Analytics**
   - Patient Visits + Prescriptions
   - 12 nodes, 7 connections

2. **Data Warehouse (Retail)**
   - Sales + Inventory
   - 12 nodes, 7 connections

3. **E-Commerce**
   - Orders + Returns
   - 12 nodes, 7 connections

## Useful Commands

### Check Server Status
```bash
curl http://localhost:3456/health
```

### List All Diagrams
```bash
curl http://localhost:3456/api/diagrams | jq '.'
```

### Generate New Diagram
```bash
npm run generate -- --type er-diagram --name my-diagram --spec spec.json
```

### Stop Server
```bash
# Press Ctrl+C in server terminal
```

## Troubleshooting

### "No diagrams found" in plugin
**Fix:** Make sure server is running
```bash
npm run diagram-server
```

### "Port 3456 already in use"
**Fix:** Kill existing process
```bash
lsof -ti:3456 | xargs kill
npm run diagram-server
```

### Plugin not showing diagrams
**Fix:** Quit Figma completely and reopen
```bash
# Mac: Cmd+Q
# Then reopen Figma Desktop
# Re-import plugin from manifest.json
```

## File Structure

```
claude_figma/
├── diagram-server.js          # HTTP server (keep running)
├── diagrams/                  # Generated diagrams
│   ├── healthcare-analytics/
│   ├── data-warehouse-2facts/
│   └── ecommerce-analytics/
├── figjam-plugin-auto/        # FigJam plugin
├── src/
│   ├── core/                  # Business logic
│   └── generators/            # CLI tools
└── skills/                    # Claude skill files
```

## Tips

- **Leave server running** during your work session
- **Refresh plugin** after generating new diagrams
- **No restart needed** - server auto-detects new diagrams
- **Commit input specs** to git (outputs are gitignored)

## Documentation

- Full guide: [README.md](README.md)
- Server docs: [DIAGRAM_SERVER.md](DIAGRAM_SERVER.md)
- Plugin docs: [figjam-plugin-auto/README.md](figjam-plugin-auto/README.md)
- Skill files: [skills/create-diagram.md](skills/create-diagram.md)

## Support

Ask Claude:
- "Show me how to create a diagram"
- "What diagrams are available?"
- "Help with diagram server"

---

**That's it!** Just keep the server running and ask Claude to create diagrams. Everything else is automatic! 🚀
