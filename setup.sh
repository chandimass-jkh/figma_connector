#!/bin/bash

echo "🎨 FigJam Claude Connector Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo ""
    echo "📦 Install it with:"
    echo "   brew install node"
    echo ""
    echo "   Or download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Configure Claude MCP Server"
echo ""
echo "   For Claude Code:"
echo "   ~/.claude/settings.json"
echo ""
echo "   For Claude Desktop:"
echo "   ~/Library/Application Support/Claude/claude_desktop_config.json"
echo ""
echo "   Add this to the 'mcpServers' section:"
echo ""
cat mcp-config.json
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "2️⃣  Install FigJam Plugin"
echo ""
echo "   • Open Figma Desktop app"
echo "   • Menu → Plugins → Development"
echo "   • Import plugin from manifest..."
echo "   • Select: $(pwd)/figjam-plugin/manifest.json"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "3️⃣  Restart Claude"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "4️⃣  Test Connection"
echo ""
echo "   Say to Claude: 'Check my FigJam connection'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📖 See README.md for detailed instructions and examples"
echo ""
echo "🚀 Ready to create amazing diagrams with Claude + FigJam!"
