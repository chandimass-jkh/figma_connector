# Diagram Examples 📊

Ready-to-use diagram specifications you can try!

## How to Use These Examples

1. Replace `YOUR-FILE-KEY` with your FigJam file key
2. Tell Claude: "Create this diagram in my FigJam board"
3. Paste the specification into the FigJam plugin

---

## 1. Simple Flowchart

```
Create a user login flowchart in FigJam {YOUR-FILE-KEY} with:
- Start (green circle)
- Enter credentials (blue rectangle)
- Validate (yellow rectangle)
- Success or Error decision (orange diamond)
- Dashboard (green sticky) for success path
- Retry (red sticky) for error path
Connect with arrows showing the flow
```

---

## 2. Microservices Architecture

```
Design a microservices architecture in FigJam {YOUR-FILE-KEY}:
- API Gateway at the top (blue rectangle)
- Three services below: Auth Service, User Service, Order Service (purple rectangles)
- Message Queue in the middle (orange rectangle)
- Two databases at bottom: User DB, Order DB (green rectangles)
- Connect gateway to all services
- Connect services to their databases
- Connect services to message queue
```

---

## 3. Learning Mindmap

```
Create a learning mindmap for "Web Development" in FigJam {YOUR-FILE-KEY}:

Central node: "Web Development" (large blue sticky)

Main branches (rectangles, different colors):
- Frontend (green): HTML, CSS, JavaScript, React
- Backend (blue): Node.js, Python, Databases, APIs
- DevOps (orange): Git, Docker, CI/CD, Cloud
- Skills (purple): Problem Solving, Testing, Security

Connect central node to all main branches
Connect each main branch to its subtopics
```

---

## 4. E-commerce Order Flow

```
Create an e-commerce order processing flow in FigJam {YOUR-FILE-KEY}:

1. Customer places order (green circle "Start")
2. Validate inventory (blue rectangle)
3. Process payment (blue rectangle)
4. Decision point: Payment success? (yellow diamond)
5. If yes: Ship order (green rectangle)
6. If no: Cancel order (red rectangle)
7. Send confirmation email (purple rectangle)
8. Complete (green circle "End")

Connect all steps with labeled arrows
```

---

## 5. Agile Sprint Process

```
Create an Agile sprint process diagram in FigJam {YOUR-FILE-KEY}:

Sticky notes (different colors):
- Sprint Planning (blue)
- Daily Standup (green) - show 3 connected in a row
- Development (purple)
- Code Review (orange)
- Testing (yellow)
- Sprint Review (teal)
- Retrospective (pink)

Arrange in a circular flow
Add arrows showing the process cycle
Label arrow from Retrospective to Sprint Planning as "Improvements"
```

---

## 6. Data Pipeline

```
Design a data pipeline architecture in FigJam {YOUR-FILE-KEY}:

- Data Sources (left side): API, Database, Files (3 green circles)
- Ingestion Layer: Kafka (orange rectangle)
- Processing: Spark Jobs (blue rectangle)
- Storage: Data Lake (purple rectangle)
- Analytics: BI Tools (yellow rectangle)
- Output: Dashboards (green rectangle)

Connect left to right showing data flow
Add labels on connections: "raw data", "processed", "analyzed"
```

---

## 7. CI/CD Pipeline

```
Create a CI/CD pipeline diagram in FigJam {YOUR-FILE-KEY}:

Linear flow (left to right):
1. Code Commit (blue circle)
2. Build (rectangle)
3. Unit Tests (rectangle)
4. Integration Tests (rectangle)
5. Security Scan (orange rectangle)
6. Deploy to Staging (yellow rectangle)
7. Manual Approval (diamond)
8. Deploy to Production (green rectangle)
9. Monitor (purple circle)

Add a feedback arrow from Monitor back to Code Commit
Label connection "Issues/Bugs"
```

---

## 8. User Journey Map

```
Create a user journey map for online shopping in FigJam {YOUR-FILE-KEY}:

Timeline flow (top to bottom):
- Discovery (blue sticky): "User searches product"
- Research (blue sticky): "Reads reviews, compares"
- Decision (yellow sticky): "Adds to cart"
- Purchase (green sticky): "Completes checkout"
- Delivery (orange sticky): "Waits for delivery"
- Experience (purple sticky): "Uses product"
- Feedback (pink sticky): "Leaves review"

Add emotion indicators (circle):
- Happy (green) - at Purchase, Experience
- Neutral (yellow) - at Discovery, Research
- Anxious (orange) - at Delivery

Connect timeline vertically
Add horizontal connections from emotions to timeline steps
```

---

## 9. Database Schema

```
Design a simple database schema in FigJam {YOUR-FILE-KEY}:

Tables (rectangles with fields):

Users table (blue):
- id (primary key)
- email
- name
- created_at

Orders table (green):
- id (primary key)
- user_id (foreign key)
- total
- status
- created_at

OrderItems table (yellow):
- id (primary key)
- order_id (foreign key)
- product_name
- quantity
- price

Connect Users to Orders (one-to-many)
Connect Orders to OrderItems (one-to-many)
Label connections with relationship types
```

---

## 10. Decision Tree

```
Create a customer support decision tree in FigJam {YOUR-FILE-KEY}:

Start: "Customer contacts support" (green circle)

First decision (blue diamond): "Is account issue?"
- Yes → "Check account status" (rectangle)
- No → Go to next decision

Second decision (yellow diamond): "Is technical issue?"
- Yes → "Transfer to tech team" (rectangle)
- No → Go to next decision

Third decision (orange diamond): "Is billing issue?"
- Yes → "Transfer to billing" (rectangle)
- No → "General inquiry form" (rectangle)

All paths end at: "Follow up" (green circle)

Connect all decision points with labeled arrows
```

---

## Tips for Creating Your Own

1. **Start Simple** - Begin with 3-5 nodes
2. **Use Colors** - Color-code by type or importance
3. **Be Specific** - Describe exact positions if needed
4. **Label Connections** - Add meaningful labels to arrows
5. **Iterate** - Create basic diagram, then refine

## Common Patterns

### Linear Flow
```
A → B → C → D → E
```

### Branching
```
      → B
A → C → D
      → E
```

### Circular/Loop
```
A → B → C → D → back to A
```

### Hierarchical
```
        A
      / | \
     B  C  D
    /|  |  |\
   E F  G  H I
```

---

**Ready to create your own? Just describe it to Claude!** 🚀
