# Claude ER Diagram Auto-Creator Plugin

🎨 Automatically creates the **Retail Sales ER Diagram** in your FigJam board with ONE CLICK!

## 📊 What It Creates

- **5 Database Tables:**
  - 1 Fact Table (FactSales) - Red
  - 4 Dimension Tables (Date, Customer, Product, Store) - Various colors

- **4 Relationships:** Connecting dimensions to the fact table

- **4 Legend Sticky Notes:** Explaining the schema

## 🚀 Installation Steps

### 1. Open Figma Desktop
⚠️ **IMPORTANT:** Must use **Figma Desktop app**, not the web version!

Download from: https://www.figma.com/downloads/

### 2. Open Your FigJam Board
Go to: https://www.figma.com/board/ht9CrCOgT7sZpKyopJpHXN/claude-test

### 3. Install the Plugin

**In Figma Desktop:**

1. Click **Menu** (top-left hamburger icon)
2. Go to **Plugins** → **Development** → **Import plugin from manifest...**
3. Navigate to this folder:
   ```
   /Users/sen/workspace/claude_figma/figjam-plugin-auto/
   ```
4. Select the file: **`manifest.json`**
5. Click **Open**

✅ You should see: "Claude ER Diagram Auto-Creator" installed!

### 4. Run the Plugin

**In your FigJam board:**

1. Right-click anywhere on the canvas
2. Select **Plugins** → **Development** → **Claude ER Diagram Auto-Creator**

   OR

   Click **Menu** → **Plugins** → **Development** → **Claude ER Diagram Auto-Creator**

3. A beautiful purple window appears!
4. Click the big **"✨ Create Diagram"** button
5. ✨ **Watch your ER diagram appear!**

The plugin will automatically:
- Create all 5 tables
- Connect them with relationship lines
- Add legend sticky notes
- Zoom to fit the diagram
- Close itself after 2 seconds

## 🎯 What You'll See

### Center (Red):
**📊 FactSales** - Contains sales transactions with measures

### Top (Teal):
**📅 DimDate** - Time dimension

### Left (Green):
**👤 DimCustomer** - Customer information

### Right (Yellow):
**📦 DimProduct** - Product catalog

### Bottom (Mint):
**🏪 DimStore** - Store locations

### Connections:
All dimensions connect to the fact table (classic star schema)

## 🆘 Troubleshooting

### Plugin Not Showing?
- Make sure you're using **Figma Desktop**, not web
- Restart Figma Desktop
- Re-import the manifest.json

### Creation Fails?
- Check you're in a **FigJam board** (not regular Figma file)
- Make sure you have edit permissions
- Try refreshing the board

### Can't Find the Plugin?
Look in: **Menu → Plugins → Development → Claude ER Diagram Auto-Creator**

## 🔄 Update the Diagram

To change what diagram is created, edit:
```
/Users/sen/workspace/claude_figma/figjam-plugin-auto/code.js
```

And modify the `DIAGRAM_SPEC` constant at the top.

## 📝 Notes

- Plugin data is embedded (no external API calls needed)
- Works offline
- Creates native FigJam shapes (fully editable)
- Takes ~2-3 seconds to create
- Auto-closes after completion

---

## 🎉 Next Steps

Once this is working, you can tell Claude:

```
Create a different ER diagram for [your use case]
```

And I'll generate a new plugin version for you!

**Enjoy your automated ER diagrams! 🚀**
