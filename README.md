# PhishShield AI

> **Paste a suspicious message, get a risk score, explanation, and safe next steps in seconds.**

PhishShield AI is an advanced phishing detection tool designed specifically for the Indian threat landscape. It provides instant analysis of suspicious messages, URLs, and screenshots with AI-powered explanations and actionable security recommendations.

## 🚀 Features

### 🔍 **Comprehensive Threat Detection**
- **Multi-format Analysis**: Text messages, URLs, and screenshot uploads
- **India-Specific Patterns**: UPI fraud, delivery scams, job offers, bank alerts
- **Real-time Scanning**: Analysis completed in under 2 seconds
- **Smart URL Analysis**: Domain reputation, shortener detection, brand impersonation

### 🧠 **AI-Powered Explainability**
- **Detailed Breakdowns**: Understand exactly why content is flagged
- **Risk Scoring**: 0-100 scale with confidence indicators
- **Evidence Highlighting**: Specific text patterns and suspicious elements
- **Educational Context**: Learn to spot scams independently

### 🛡️ **Privacy-First Design**
- **Local Processing**: All analysis happens on your device
- **No External Calls**: Messages never leave your browser
- **Data Control**: Export or clear your data anytime
- **Zero Telemetry**: No tracking or analytics

### 📊 **Professional Reporting**
- **Shareable Reports**: Generate professional incident summaries
- **Export Options**: CSV, PDF-ready HTML, and plain text formats
- **Team Collaboration**: Share findings with colleagues and family
- **Audit Trail**: Complete history of all scans

## 🎯 Target Audience

- **Individuals**: Protect yourself from phishing and scam attempts
- **Small Businesses**: Educate employees about cybersecurity threats
- **Students**: Learn about digital security and scam tactics
- **Security Professionals**: Quick triage tool for suspicious content
- **Families**: Help relatives identify and avoid online scams

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React, Framer Motion
- **Database**: SQLite with Prisma ORM
- **State Management**: Zustand
- **Validation**: Zod
- **Charts**: Recharts
- **Styling**: Tailwind CSS with custom cybersecurity theme

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/aryancta/phishshield-ai.git
   cd phishshield-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   cp .env.example .env
   npm run db:push
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Docker Deployment

1. **Using Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```

2. **Using Docker directly**
   ```bash
   docker build -t phishshield-ai .
   docker run -p 3000:3000 phishshield-ai
   ```

3. **Production deployment**
   ```bash
   docker build -t phishshield-ai .
   docker run -d \
     --name phishshield \
     -p 3000:3000 \
     -v phishshield_data:/app/data \
     --restart unless-stopped \
     phishshield-ai
   ```

## 🚦 Usage Guide

### 🏠 **Landing Page**
- **Quick Analysis**: Paste suspicious content for instant results
- **Sample Library**: Try pre-loaded scam examples
- **Feature Overview**: Learn about detection capabilities

### 🔬 **Deep Scan Workspace** (`/scan`)
- **Multi-tab Input**: Message text, URLs, or screenshot uploads
- **Detailed Results**: Risk meters, threat breakdowns, URL analysis
- **Export Options**: Generate shareable reports

### 📊 **Security Dashboard** (`/dashboard`)
- **Activity Overview**: Scan statistics and trends
- **Quick Actions**: Fast access to common features
- **Threat Intelligence**: Current scam campaigns and patterns

### 📚 **Sample Library** (`/samples`)
- **Categorized Examples**: UPI fraud, delivery scams, job offers, etc.
- **Educational Content**: Learn about different threat types
- **Interactive Testing**: Load samples directly into analyzer

### 📝 **Scan History** (`/history`)
- **Complete Records**: All previous analyses with timestamps
- **Search & Filter**: Find specific scans by content or verdict
- **Bulk Export**: Download history as CSV for record-keeping

### ⚙️ **Settings** (`/settings`)
- **Privacy Controls**: Manage local data and preferences
- **Theme Options**: Light/dark mode selection
- **Export Tools**: Backup settings and clear data

## 🧪 Demo Mode

PhishShield AI includes a comprehensive demo mode that simulates real threat detection without requiring external services:

- **Realistic Analysis**: AI-powered pattern recognition using local algorithms
- **Sample Data**: Pre-loaded with 50+ real-world scam examples
- **Educational Focus**: Learn to identify threats with detailed explanations
- **No Dependencies**: Fully functional without internet connectivity

## 🔒 Privacy & Security

### Data Handling
- **Local Storage Only**: All data remains on your device
- **No Server Transmission**: Messages are analyzed client-side
- **User-Controlled**: Export or delete data at any time
- **Session Isolation**: Each analysis is independent

### Security Measures
- **Input Validation**: All user input is sanitized and validated
- **XSS Protection**: Comprehensive output encoding
- **CSRF Protection**: Built-in Next.js security features
- **Content Security Policy**: Strict CSP headers in production

## 🌟 Key Innovations

1. **Hybrid Detection Engine**: Combines rule-based patterns with AI reasoning
2. **India-Centric Intelligence**: Specialized for local scam tactics and language
3. **Educational First**: Explains threats instead of just flagging them
4. **Privacy by Design**: Client-side processing ensures data never leaves device
5. **Professional Grade**: Enterprise-ready reporting and audit capabilities

## 🗂️ Project Structure

```
phishshield-ai/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API endpoints
│   │   ├── dashboard/      # Security dashboard
│   │   ├── scan/           # Deep scan workspace
│   │   ├── samples/        # Scam template library
│   │   ├── history/        # Scan history
│   │   ├── settings/       # User preferences
│   │   └── report/[id]/    # Shareable reports
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── *.tsx          # Custom components
│   ├── lib/               # Core libraries
│   │   ├── analysis-engine.ts    # Main detection logic
│   │   ├── url-analysis.ts       # URL scanning
│   │   ├── scam-patterns.ts      # Pattern definitions
│   │   └── *.ts                  # Utilities
│   ├── hooks/             # React hooks
│   ├── store/             # Zustand state management
│   └── types/             # TypeScript definitions
├── prisma/                # Database schema and seeds
├── public/                # Static assets
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Multi-service orchestration
└── README.md             # This file
```

## 🧑‍💻 Development

### Environment Variables

```bash
# Database
DATABASE_URL="file:./dev.db"

# App Configuration  
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEMO_MODE="true"
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data

# Docker
docker-compose up    # Start with Docker
docker-compose down  # Stop containers
```

### Adding New Scam Patterns

1. **Update pattern definitions** in `src/lib/scam-patterns.ts`
2. **Add sample templates** in `prisma/seed.ts`
3. **Update analysis logic** in `src/lib/analysis-engine.ts`
4. **Test with new samples** in the UI

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper tests
4. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Ensure all tests pass
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cybersecurity Community**: For threat intelligence and pattern research
- **Open Source Libraries**: Built on the shoulders of giants
- **Indian Cyber Awareness**: Inspired by the need for localized security tools
- **User Feedback**: Continuous improvement through community input

## 📞 Support & Contact

- **Developer**: Aryan Choudhary
- **Email**: [aryancta@gmail.com](mailto:aryancta@gmail.com)
- **GitHub**: [github.com/aryancta/phishshield-ai](https://github.com/aryancta/phishshield-ai)

### Getting Help
1. **Check the documentation** in this README
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed description
4. **Join discussions** in GitHub Discussions

---

**Made with ❤️ for digital security education and awareness.**

*PhishShield AI - Protecting users from phishing, one message at a time.*