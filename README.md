# Tree Visualizer 🌳

Welcome to the **Tree Visualizer**! This full-stack project enables users to visualize and interact with various types of trees dynamically. With a real-time backend powered by PostgreSQL and Supabase, the application integrates GitHub webhooks to track live commits and repository statistics. It also features an intuitive Konva.js canvas for rendering tree visualizations based on user input.

## 🎯 Features

- **Dynamic Tree Generation**: Generate trees interactively from user-provided arrays, including Binary Search Trees, AVL Trees, and more.
- **Real-Time Updates**: Stay updated with live commit tracking and repository statistics through GitHub webhooks integrated with Supabase.
- **Interactive Visualization**: Explore trees visually on a canvas powered by Konva.js, with features like zooming, panning, and node highlights.
- **Extensibility**: Additional tree types and features are under development to further enhance visualization capabilities.

## 🔧 Tech Stack

### Frontend
- **Next.js** (Framework for React and server-side rendering)
- **React** (Frontend library)
- **TypeScript** (Static typing for better code quality)
- **Konva.js** (Canvas rendering for interactive visualizations)

### Backend
- **Next.js API Routes** (Handles all API calls directly within the framework)
- **Supabase** (PostgreSQL-based real-time backend)

### Integrations
- **GitHub Webhooks** (Live commit tracking)

### Deployment
- **Vercel** (For deploying the full Next.js application, including API routes)

---

## 🚀 Getting Started

Follow the steps below to set up the Tree Visualizer locally.

### Prerequisites
- **Node.js** (v14 or later)
- **NPM** or **Yarn**
- A Supabase project with database credentials
- A GitHub repository to enable webhooks (optional but recommended)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AlgoFoe/tree-visualizer.git
cd tree-visualizer
```
### 2️⃣ Install Dependencies
```bash
# Using npm
npm install

# Or using Yarn
yarn install
```
### 3️⃣ Configure Environment Variables
Create a .env.local file in the root directory and add the following:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
### 4️⃣ Start the Development Server
```bash
npm run dev
```
The application will be accessible at http://localhost:3000.

### 5️⃣ Setting Up Supabase
    1. Log in to Supabase and create a new project.
    2. Set up a PostgreSQL database.
    3. Add tables for commits and other required entities.
    4. Retrieve the API URL and anon/public key from the project settings.
### 6️⃣ Enable GitHub Webhooks (Optional)
    1. Navigate to your GitHub repository settings.
    2. Go to Webhooks and click Add webhook.
    3. Set the payload URL to your deployed backend endpoint (e.g., https://<your-vercel-app>/api/webhook).
    4. Add the secret from your .env.local file.
### 📈 Future Features
- Visualization for additional tree types, such as:
    - B-Trees
    - Splay Trees
- Enhanced analytics for commits, including:
    - Top Contributors
    - Commit Heatmaps
- Exporting tree visualizations as PNG or JSON.
- Animating the *insertion* and *deletion* operation

### 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page- https://github.com/AlgoFoe/tree-visualizer/issues.

### 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
