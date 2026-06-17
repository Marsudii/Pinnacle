# Pinnacle

**Data Explorer for developers** — fast, local, and private.

Pinnacle is a modern desktop data explorer designed for developers. It offers a fast, local-first, and private environment to connect, browse, and execute queries across multiple databases and message brokers — keeping all credentials and data securely stored on your local machine.

---

## Features

- **Multi-Service & Database Support:**
  - **Relational:** PostgreSQL, MySQL (via SQLx)
  - **NoSQL / Documents:** MongoDB, Elasticsearch (via reqwest REST API)
  - **Key-Value:** Redis
  - **Message Brokers:** RabbitMQ (via lapin)
- **SQL & Query Editors:**
  - Built-in Monaco Editor for writing SQL and Elasticsearch queries with syntax highlighting.
- **Advanced Data Grid:**
  - AG Grid Community integration for fast rendering of query results, Redis keyspaces, elastic collections, and large datasets.
- **Connection Management:**
  - Save, organize, and manage connection profiles. All connections are stored securely and locally using Tauri Store & Stronghold.
- **Privacy First:**
  - Zero telemetry or remote credential transmission. Everything runs on your machine.

---

## Tech Stack

### Frontend
- **Framework:** React 19 / TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (v4)
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Routing:** React Router v7
- **Key Libraries:** Monaco Editor (`@monaco-editor/react`), AG Grid (`ag-grid-react`), React Flow / System (`@xyflow/react`)

### Desktop/Backend (Tauri app)
- **Runtime:** Tauri v2
- **Language:** Rust (Rust Edition 2021)
- **Relational Databases:** `sqlx` (PostgreSQL & MySQL connectors with Tokio runtime)
- **HTTP/REST clients:** `reqwest` (for Elasticsearch)
- **Excel/Data Export:** `rust_xlsxwriter` & `csv`

---

## Getting Started & Installation

To run or build Pinnacle locally, you will need to set up the system prerequisites for **Tauri v2** and **Rust**.

### Prerequisites

#### 1. System Dependencies (Choose your OS)

##### macOS
Install Xcode Command Line Tools:
```bash
xcode-select --install
```

##### Windows
1. Download and run the [Visual Studio Build Tools Installer](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
2. Select the **Desktop development with C++** workload and install it.

##### Linux (Ubuntu/Debian)
Ensure you have the essential build libraries installed:
```bash
sudo apt update
sudo apt install -y build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

#### 2. Rust
Install the Rust toolchain via `rustup`:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
*Note: Make sure your Rust compiler version is updated (Rust `1.77.2` or later).*

#### 3. Node.js & npm
Install Node.js (LTS version recommended, `v18+` or `v20+`). Check your installation using:
```bash
node -v
npm -v
```

---

### Step-by-Step Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/pinnacle.git
   cd pinnacle
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Run in Development Mode:**
   To launch the Pinnacle desktop application in development mode (with hot-reloading for the frontend and automatic recompilation of the Rust codebase on changes):
   ```bash
   npm run tauri:dev
   ```

4. **Verify/Typecheck Code:**
   To check TypeScript types and run ESLint checks:
   ```bash
   npm run typecheck
   npm run lint
   ```

5. **Build for Production:**
   To compile and package the desktop application into native installers (dmg, pkg, exe, msi, deb, or rpm depending on the runner OS):
   ```bash
   npm run tauri:build
   ```
   Built binaries and release bundles will be available in target directory:
   `src-tauri/target/release/bundle/`

---

## Project Structure

```
├── public/                # Static public assets
├── src/                   # React Frontend App
│   ├── app/               # Providers & Routes
│   ├── assets/            # Styling, icons, and layout assets
│   ├── features/          # Feature-based folders
│   │   ├── data-explorer/ # Main database client interfaces
│   │   ├── home/          # Home / dashboard interfaces
│   │   └── settings/      # Application settings
│   ├── layouts/           # Common layouts (AppShell)
│   ├── services/          # Tauri-Rust API clients
│   └── state/             # Zustand state management stores
├── src-tauri/             # Tauri Desktop Backend
│   ├── Cargo.toml         # Rust backend dependencies
│   ├── tauri.conf.json    # Tauri configuration (capabilities, builds)
│   └── src/               # Rust source code
│       ├── main.rs        # Rust entrypoint
│       ├── lib.rs         # Tauri core plugins setup
│       ├── application/   # Tauri Commands controller layer
│       ├── core/          # App result/error definitions
│       ├── domain/        # Domain types & logic
│       └── infrastructure/# DB drivers & client implementations
├── tsconfig.json          # TypeScript configurations
└── package.json           # Frontend scripts & NPM dependencies
```

---

## License

This project is licensed under the MIT License unless stated otherwise.
