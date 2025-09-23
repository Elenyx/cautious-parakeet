# TicketMesh 🎫

A modern Discord ticket bot with a beautiful web dashboard built with TypeScript, Node.js, and React.

## 🚀 Features

- **Discord Bot**: Powerful ticket management system for Discord servers
- **Web Dashboard**: Modern, responsive dashboard for managing tickets and users
- **TypeScript**: Full type safety across the entire codebase
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Monorepo**: Organized workspace with pnpm for efficient dependency management

## 🛠️ Tech Stack

### Discord Bot

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **discord.js** - Discord API wrapper
- **dotenv** - Environment variable management

### Web Dashboard

- **React** - UI library
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```text
TicketMesh/
├── packages/
│   ├── bot/                 # Discord bot package
│   │   ├── src/
│   │   │   └── index.ts     # Bot entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example     # Environment variables template
│   └── dashboard/           # Web dashboard package
│       ├── src/
│       │   ├── App.tsx      # Main dashboard component
│       │   ├── lib/
│       │   │   └── utils.ts # Utility functions
│       │   └── index.css    # Global styles with Tailwind
│       ├── components.json  # shadcn/ui configuration
│       ├── tailwind.config.js
│       └── vite.config.ts
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)
- **Discord Bot Token** (from Discord Developer Portal)

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd TicketMesh
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Set up environment variables**

    ```bash
    # Copy the example environment file for the bot
    cp packages/bot/.env.example packages/bot/.env
    ```

    ```bash
    # Edit the .env file and add your Discord bot token
    # DISCORD_TOKEN=your_discord_bot_token_here
    ```

### Development

#### Start the Web Dashboard

```bash
cd packages/dashboard
pnpm dev
```

The dashboard will be available at `http://localhost:5173`

#### Start the Discord Bot

```bash
cd packages/bot
pnpm dev
```

#### Run Both Services

From the root directory:

```bash
pnpm dev
```

### Building for Production

#### Build the Dashboard

```bash
cd packages/dashboard
pnpm build
```

#### Build the Bot

```bash
cd packages/bot
pnpm build
pnpm start
```

## 🎨 Dashboard Features

The web dashboard includes:

- **📊 Analytics Dashboard**: Overview of ticket statistics and metrics
- **🎫 Ticket Management**: View and manage all support tickets
- **👥 User Management**: Monitor active users and their activity
- **⚙️ Settings**: Configure bot settings and preferences
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **🌙 Modern UI**: Clean, professional interface with shadcn/ui components

## 🤖 Bot Features

The Discord bot includes:

- **Ticket Creation**: Users can create support tickets
- **Ticket Management**: Staff can manage and respond to tickets
- **User Permissions**: Role-based access control
- **Logging**: Comprehensive activity logging
- **Slash Commands**: Modern Discord slash command support

## 📝 Available Scripts

### Root Level

- `pnpm dev` - Start both bot and dashboard in development mode
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages

### Bot Package

- `pnpm dev` - Start bot in development mode with hot reload
- `pnpm build` - Build bot for production
- `pnpm start` - Start built bot
- `pnpm lint` - Lint bot code
- `pnpm type-check` - Type check bot code

### Dashboard Package

- `pnpm dev` - Start dashboard development server
- `pnpm build` - Build dashboard for production
- `pnpm preview` - Preview built dashboard
- `pnpm lint` - Lint dashboard code
- `pnpm type-check` - Type check dashboard code

## 🔧 Configuration

### Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section and create a bot
4. Copy the bot token and add it to `packages/bot/.env`
5. Invite the bot to your server with appropriate permissions

### Environment Variables

Create a `.env` file in `packages/bot/` with:

```env
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DATABASE_URL=your_database_url_here
API_PORT=3001
API_SECRET=your_api_secret_here
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m '''Add some amazing feature'''`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [discord.js](https://discord.js.org/) - Discord API wrapper
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Fast build tool
- [Lucide](https://lucide.dev/) - Beautiful icons

---

**TicketMesh** - Making Discord support tickets beautiful and efficient! 🎫✨
