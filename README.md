# 🚀 Node.js HTTP Server Without Framework (JavaScript, No Database)

> - Building a robust HTTP server from scratch using pure Node.js - no frameworks!
> - This project is a simple example of how to build a complete HTTP server using only Node.js core modules, without relying on external frameworks like Express.js or Koa.js.
> - Just a study project, not for production use (Company on-boarding project)

## 📖 Overview

This project demonstrates how to build a complete HTTP server using only Node.js core modules, without relying on external frameworks like Express.js. It implements essential web server features including routing, middleware, body parsing, and layered architecture.

## ✨ Features

- 🛣️ **Custom Router** - Dynamic routing with path parameters
- 📝 **Body Parser** - JSON, URL-encoded, text and multipart/form-data parsing
- 🏗️ **Layered Architecture** - Controller, Service, Repository pattern
- 🔧 **Middleware System** - Extensible middleware pipeline
- 📁 **File-based Database** - Text file storage system
- 🎯 **RESTful API** - Complete CRUD operations

## 📁 Project Structure

```
📦 node-http-without-framework
├── 📂 .cursor
│   └── 📂 rules              # Cursor IDE rules
├── 📂 data                   # File-based database
├── 📂 src
│   ├── 📂 common             # Shared components
│   │   ├── 📂 body-parser    # Body parser implementation
│   │   ├── 📂 router         # Custom router implementation
│   │   └── 📂 middleware     # Middleware functions
│   ├── 📂 configs            # Configuration management
│   ├── 📂 controllers        # Request handlers
│   ├── 📂 domains            # Data schemas
│   ├── 📂 repositories       # Data access layer
│   ├── 📂 routes             # Route definitions
│   ├── 📂 services           # Business logic
│   ├── 📂 utils              # Utility functions
│   └── 📜 app.js             # Application setup
├── 📜 server.js              # Server entry point
├── 📜 package.json
└── 📜 README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 22.16.0
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamkanguk97/node-http-without-framework.git
   cd node-http-without-framework
   ```

2. **Install dependencies**
   ```bash
   npm install / npm ci
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server (no development mode -> because just a study project)**
   ```bash
   npm start
   ```

The server will be running at `http://localhost:8000`

## 🛠️ Core Components

TBU

## Contact

- 📧 Email: iamkangukii.dev@gmail.com