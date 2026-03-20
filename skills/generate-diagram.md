---
name: generate-diagram
description: Generate FigJam diagrams from specifications using the CLI tool
version: 1.0.0
author: Claude
tags: [figma, figjam, generator, cli, er-diagram]
---

# Generate Diagram Skill

Generates FigJam diagrams using the command-line generator tool.

## When to Use

Use this skill when the user asks to:
- Generate a diagram from a spec file
- Create a diagram using a template
- Generate ER diagrams, flowcharts, or architecture diagrams
- Test the diagram generator

## Usage

### Generate from Template

```bash
npm run generate -- --template <template-name> --name <diagram-name>
```

**Available templates:**
- `er-star-schema` - Retail sales data warehouse star schema

### Generate from Spec File

```bash
npm run generate -- --type <diagram-type> --name <diagram-name> --spec <spec-file>
```

**Diagram types:**
- `er-diagram` - Entity-relationship diagrams
- `flowchart` - Process flowcharts
- `architecture` - System architecture diagrams

## Input Spec Format

### ER Diagram Spec

```json
{
  "title": "Database Schema",
  "type": "er-diagram",
  "tables": [
    {
      "id": "table_id",
      "name": "TableName",
      "emoji": "📊",
      "x": 100,
      "y": 100,
      "width": 280,
      "height": 320,
      "color": "#4ECDC4",
      "columns": [
        { "name": "ID", "constraint": "PK" },
        { "name": "ForeignKey", "constraint": "FK" },
        { "name": "RegularColumn" }
      ]
    }
  ],
  "relationships": [
    { "from": "table1_id", "to": "table2_id", "label": "1:N" }
  ],
  "annotations": [
    {
      "id": "note_id",
      "type": "sticky",
      "label": "Note text",
      "x": 50,
      "y": 50,
      "color": "#FFE66D"
    }
  ]
}
```

### Flowchart Spec

```json
{
  "title": "Process Flow",
  "type": "flowchart",
  "steps": [
    {
      "label": "Start",
      "type": "rectangle",
      "color": "#4ECDC4"
    },
    {
      "label": "Process Step",
      "type": "rectangle",
      "color": "#95E1D3"
    }
  ]
}
```

### Architecture Diagram Spec

```json
{
  "title": "System Architecture",
  "type": "architecture",
  "components": [
    {
      "id": "api",
      "name": "API Gateway",
      "icon": "🌐",
      "description": "REST API",
      "x": 100,
      "y": 100,
      "color": "#764ba2"
    }
  ],
  "connections": [
    {
      "from": "api",
      "to": "service",
      "label": "HTTPS",
      "protocol": "REST"
    }
  ]
}
```

## Output Location

Generated diagrams are saved to:
```
diagrams/<diagram-name>/created_diagrams/
  ├── latest.json              # Always the latest version
  └── <name>_<timestamp>.json  # Timestamped versions
```

## Workflow

1. **Create input spec** (optional - can use templates)
   - Create `diagrams/<name>/inputs/spec.json`
   - Define tables, relationships, annotations

2. **Run generator**
   ```bash
   npm run generate -- --type er-diagram --name my-diagram --spec spec.json
   ```

3. **Open in FigJam**
   - Open FigJam board
   - Run plugin: **Claude ER Diagram Auto-Creator**
   - Diagram appears automatically

## Examples

### Example 1: Star Schema from Template

```bash
npm run generate -- --template er-star-schema --name retail-dw
```

Creates a retail sales data warehouse with:
- FactSales table
- 4 dimension tables (Date, Customer, Product, Store)
- Relationships and legends

### Example 2: Custom ER Diagram

Create `diagrams/blog/inputs/spec.json`:
```json
{
  "title": "Blog Database",
  "type": "er-diagram",
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
        { "name": "Email" }
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
        { "name": "Content" }
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
npm run generate -- --type er-diagram --name blog --spec spec.json
```

### Example 3: Multiple Fact Tables

For complex data warehouses with multiple fact tables:

```json
{
  "title": "Multi-Fact Data Warehouse",
  "type": "er-diagram",
  "tables": [
    {
      "id": "fact_sales",
      "name": "FactSales",
      "emoji": "💰",
      "x": 400,
      "y": 400,
      "color": "#FF6B6B",
      "columns": [
        { "name": "SaleID", "constraint": "PK" },
        { "name": "DateKey", "constraint": "FK" },
        { "name": "Amount" }
      ]
    },
    {
      "id": "fact_inventory",
      "name": "FactInventory",
      "emoji": "📦",
      "x": 800,
      "y": 400,
      "color": "#F8B500",
      "columns": [
        { "name": "InventoryID", "constraint": "PK" },
        { "name": "DateKey", "constraint": "FK" },
        { "name": "Quantity" }
      ]
    },
    {
      "id": "dim_date",
      "name": "DimDate",
      "emoji": "📅",
      "x": 600,
      "y": 100,
      "color": "#4ECDC4",
      "columns": [
        { "name": "DateKey", "constraint": "PK" },
        { "name": "Date" },
        { "name": "Year" }
      ]
    }
  ],
  "relationships": [
    { "from": "dim_date", "to": "fact_sales", "label": "1:N" },
    { "from": "dim_date", "to": "fact_inventory", "label": "1:N" }
  ]
}
```

## Tips for Claude

1. **Always ask for diagram name** - Use descriptive names like `retail-sales-dw` not `diagram1`
2. **Validate coordinates** - Ensure x/y positions don't overlap
3. **Color consistency** - Use config/defaults.json for standard colors
4. **Test after generation** - Check that output JSON is valid
5. **Provide instructions** - Tell user how to open in FigJam

## Common Issues

### Issue: "Cannot read properties of undefined"
**Solution:** Check that spec file has required fields (title, tables/steps/components)

### Issue: "Template not found"
**Solution:** Template must exist in `src/templates/` directory

### Issue: Output file not created
**Solution:** Check file permissions and that directory structure was created

## Configuration

Edit [config/defaults.json](../config/defaults.json) to customize:
- Default colors for each element type
- Canvas size and padding
- Spacing between elements
- Font styles and sizes

## Adding New Templates

1. Create template file in `src/templates/`
2. Follow existing template format
3. Test with generator: `npm run generate -- --template <name> --name test`

## Integration with FigJam Plugin

The generated JSON files are read by the FigJam plugin:
- Plugin location: [figjam-plugin-auto/code.js](../figjam-plugin-auto/code.js)
- Currently reads hardcoded DIAGRAM_SPEC
- Future: Will read from `diagrams/<name>/created_diagrams/latest.json`

## Future Enhancements

- [ ] Natural language to spec conversion
- [ ] Diagram validation before generation
- [ ] Auto-layout algorithm for optimal positioning
- [ ] Diagram versioning and diffing
- [ ] Export to multiple formats (PNG, SVG, PDF)
