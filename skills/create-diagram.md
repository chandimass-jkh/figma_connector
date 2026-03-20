---
name: create-diagram
description: Create diagrams in FigJam (ER diagrams, flowcharts, architecture diagrams) using natural language
version: 1.0.0
author: Claude
tags: [figma, figjam, diagrams, visualization, er-diagram, flowchart, architecture]
---

# Create Diagram Skill

Creates professional diagrams in FigJam from natural language descriptions.

## Supported Diagram Types

1. **ER Diagrams** - Database schemas, star schemas, snowflake schemas
2. **Flowcharts** - Process flows, workflows, decision trees
3. **Architecture Diagrams** - System architecture, microservices, infrastructure

## Usage

When the user asks to create a diagram:

1. **Identify the diagram type** from the user's request
2. **Extract key information**:
   - For ER diagrams: tables, columns, relationships
   - For flowcharts: steps, decisions, branches
   - For architecture: components, connections, protocols

3. **Run the generator**:
   ```bash
   node src/generators/generate.js --type <diagram-type> --name "<diagram-name>" --spec "<spec-file>"
   ```

4. **Output location**: `diagrams/<diagram-name>/created_diagrams/`

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

## Integration with FigJam

After generation:
1. Open FigJam board
2. Run plugin: **Claude ER Diagram Auto-Creator**
3. Plugin reads from `diagrams/<name>/created_diagrams/latest.json`
4. Diagram appears in FigJam

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

1. **Always create a new diagram folder** for each request
2. **Save input specs** so users can modify and regenerate
3. **Use descriptive names** for diagram folders (e.g., `retail-sales-dw` not `diagram1`)
4. **Validate specs** before generating
5. **Auto-open FigJam link** after generation if available

## Error Handling

- Missing FIGMA_ACCESS_TOKEN: Prompt user to add to .env
- Invalid spec: Show validation errors
- Plugin not installed: Show installation instructions

## Future Enhancements

- [ ] Direct API integration (no plugin needed)
- [ ] Real-time collaboration
- [ ] Version control for diagrams
- [ ] Export to PNG/SVG
- [ ] AI-powered diagram suggestions
