## 🔀 Git Branch Structure

This project follows a structured Git branching strategy to support stable development and clear contribution flow.

### 📌 Main Branches

- **`master`**  
  This is the original repository from [SMACAcademy/idurar-erp-crm](https://github.com/SMACAcademy/idurar-erp-crm). It serves as the base reference for our forked project and is not modified directly.

- **`dev`**  
  This is the **primary development branch**. All new features, bug fixes, and tasks are merged into this branch after code review and testing.  
  ➤ **Please make sure to switch to this branch to work with the latest code:**

  ```bash
  git checkout dev
  ```

### 🧪 Feature/Task Branches

- All other branches are named according to their respective tasks and functionality as described in the coding test documentation.
- After completion and testing, these branches are merged into the `dev` branch via pull requests.

### 📬 Postman Collection

The Postman collection for testing available APIs is located in the `postman/` folder.

## ⚙️ Phase 1: Setup & Baseline Verification

### 🗂 Project Structure

In the root directory, you'll find a folder named `original_app`, which contains:

- `frontend/`
- `backend/`

---

### 🛠 Backend Setup

```bash
cd original_app/backend
cp .env.example .env  # Update with appropriate values
npm install
npm run setup
npm run dev
```

### 💻 Frontend Setup

```bash
cd original_app/frontend
cp .env.example .env  # Update with appropriate values
npm install
npm run dev
```

### 🔐 Dev Login Credentials

Use the following credentials to log in:

Email: admin@demo.com
Password: admin123

## 📘 Phase 2: Query Management Module (Existing)

### 🔗 API Endpoints

> **Note:** The endpoints differ from those specified in the coding test.  
> The application uses a `createCRUDController` function, which creates default CRUD endpoints.  
> To integrate seamlessly with the existing system, these default endpoints were used.  
> ❗ Deleting a single note is not supported via a separate API. Notes can be updated via the `PATCH` endpoint.

- **Paginated List**  
  `GET /api/queries/list?page=1&items=10`

  - `items` refers to the limit

- **Create Query**  
  `POST /api/queries/create`

- **Get Single Query**  
  `GET /api/queries/read/:id`

- **Update Query**  
  `PATCH /api/queries/update/:id`

- **Delete Query**  
  `DELETE /api/queries/delete/:id`

- **Add Note to Query**  
  `POST /api/queries/:id/notes`
  - Appends a note to the existing list

---

### 🧭 Navigating the Query Module

1. Navigate to the **Queries** module via the sidebar in the dashboard.
2. A **data table** will be displayed showing the list of queries.
3. Click **"Add New Query"** to open a form and submit a new entry.
4. Use the **status toggle** directly from the table to update the status.
5. Click the **three-dot menu** on any row to perform actions:
   - **Delete** – Remove the entry.
   - **Add Notes** – Append notes to the query.
   - **Edit** – Update the entry via the form.can also update (add,delete,edit) the notes.
   - **Show** – View detailed information about the query.

## 🛠️ Phase 3: Bug Fixes & AI Enhancements (Existing)

### 🐞 Bug Fix: Invoice Note Field

- Navigate to the **Invoice** module from the sidebar.
- Click **"Add New Invoice"** – a **note field** is available for each invoice item.
- Notes can be:
  - **Added** during invoice creation
  - **Edited** in the edit form
  - **Viewed** in the details view
  - **Included** in the **PDF download** of the invoice

---

### 🤖 AI Feature: Gemini Summary Integration

> ⚠️ **Important:** Ensure the AI API key is added to the backend `.env` file:  
> `OPENAI_API_KEY=your_key_here`  
> The integration uses the **Gemini API**.

- If **notes are added** to invoice items, a **"Generate Summary"** button will appear in the invoice details view.
- Clicking the button:
  - Opens a modal
  - Generates a summary using Gemini
  - Saves and displays the latest summary in the invoice details view
- Once generated:
  - The button is **disabled**
  - It will be **re-enabled only when the invoice is updated**
- The summary is also displayed at the **bottom of the PDF download**.

## 🧩 Phase 4: Additional Backend Module (Nest.js)

### 🚀 Setup Instructions

```bash
cd nest_module
cp env.example .env  # Update with required variables
```

> **Note:**  
> Set the `MONGO_URI` to point to the **same database** used by the `idurar-erp-crm` application.

```bash
npm install
npm run start:dev
```

### 🔗 API Endpoints

#### Get Summary Report

**GET** `/integration/reports/summary`  
Returns:

- Query status count
- Query Created this month count
- Invoice status count
- Invoice Payment status count
- Invoice Expired count

#### Webhook to Create Query in CRM

**POST** `/integration/webhook`  
Triggers the creation of a query in the main CRM app.

---

### 🐳 Docker Support

To start the module using Docker:

```bash
docker compose up --build
```

To stop and remove containers:

```bash
Ctrl + C
docker compose down
```

## 🧱 Phase 5: Next.js CRUD Module (Separate Application)

### 🚀 Setup Instructions

```bash
cd nextjs_crud_app
cp env.example .env  # Update with appropriate values
```

> ⚠️ **Important:**  
> The database used must be **MongoDB**.

to run app

```bash
npm install
npm run dev
```

### 🔗 API Endpoints

#### Create Project

**POST** `/api/projects`

#### Paginated Project List

**GET** `/api/projects?page=1&limit=10&status=in-progress`

#### Project Details

**GET** `/api/projects/:id`

#### Update Project

**PUT** `/api/projects/:id`

#### Delete Project

**DELETE** `/api/projects/:id`

---

### 🧭 App Navigation & Features

- The **Home** page redirects to the **Dashboard**.
- From the **sidebar**, click on **Projects** to open the module.
- A **DataTable** is displayed with:
  - **Pagination**
  - A **status filter** dropdown in the table header
- Click **"Add Project"** to open a **modal form** for creating a new project.
- Each project row has a **three-dot menu** with:

  - **Edit** – Update the project
  - **Show** – View project details
  - **Delete** – Remove the project

### 🐳 Docker Support

To start the module using Docker:

```bash
docker compose up --build
```

To stop and remove containers:

```bash
Ctrl + C
docker compose down
```
