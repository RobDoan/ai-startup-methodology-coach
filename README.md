# AI Startup Methodology Coach

An intelligent platform that guides entrepreneurs through the startup journey using AI-powered methodology templates, workflow automation, and context-aware suggestions.

## 🎯 Vision

Transform the chaotic startup journey into a structured, data-driven process by combining proven methodologies with AI assistance. This platform helps founders move from idea to product-market fit with confidence and clarity.

## ✨ Key Features

- **📋 Methodology Templates**: Comprehensive templates for every phase of startup development
- **🤖 AI-Powered Guidance**: Multi-agent system provides intelligent suggestions and validation
- **🔄 Workflow Automation**: Automatic dependency tracking and task sequencing
- **📊 GraphRAG Technology**: Section-specific context retrieval for targeted assistance
- **✅ Manifesto Compliance**: Ensures all documentation aligns with company values
- **💾 Smart Caching**: Efficient flow generation with intelligent caching
- **🔍 Progressive Validation**: Step-by-step validation with checkpoint recovery

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Service                            │
│                   (React + TypeScript)                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                      API Gateway                             │
│                    (Node.js/Express)                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  Brainiac AI Service                         │
│        (FastAPI + LangGraph + Multi-Agent System)           │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
ai-startup-methodology-coach/
├── services/                     # Microservices (Git submodules)
│   ├── brainiac-ai-service/    # Core AI logic and multi-agent system
│   ├── ui-service/              # Frontend React application
│   └── api-gateway/             # API routing and authentication
├── templates/                    # Startup methodology templates
│   ├── 01-research-phase/      # Problem validation templates
│   ├── 02-design-phase/        # Solution design templates
│   ├── 03-development-phase/   # Development planning templates
│   ├── 04-testing-phase/       # Testing and validation templates
│   ├── 05-deployment-phase/    # Deployment and launch templates
│   └── 06-features/             # Feature-specific templates
├── scripts/                      # Automation scripts
│   └── git-submodules/          # Git submodule workflow scripts
├── docs/                        # Documentation
│   └── GIT_SUBMODULE_WORKFLOW.md # Complete submodule guide
└── .kiro/                       # Kiro specifications (if applicable)
```

## 🚀 Quick Start

### Prerequisites

- Git 2.30+
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- GitHub CLI (`gh`) for PR workflows

### Initial Setup

1. **Clone the repository with submodules**:
```bash
git clone --recursive https://github.com/your-org/ai-startup-methodology-coach.git
cd ai-startup-methodology-coach
```

2. **Initialize submodules** (if not cloned recursively):
```bash
./scripts/git-submodules/01-init-submodules.sh
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start services with Docker Compose**:
```bash
docker-compose up -d
```

5. **Access the application**:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- AI Service: http://localhost:8001

### Development Setup

For local development without Docker:

1. **Sync all submodules**:
```bash
./scripts/git-submodules/02-sync-submodules.sh
```

2. **Set up each service** (follow individual README files):
- [Brainiac AI Service Setup](services/brainiac-ai-service/README.md)
- [UI Service Setup](services/ui-service/README.md)
- [API Gateway Setup](services/api-gateway/README.md)

## 💻 Development Workflow

### Working with Git Submodules

This project uses Git submodules for service management. Each service is an independent repository. We provide both **Node.js CLI** (recommended) and bash scripts for workflow management.

📚 **[Complete Git Submodule Workflow Guide](docs/GIT_SUBMODULE_WORKFLOW.md)**

#### Node.js CLI (Recommended)

Modern, cross-platform CLI with interactive workflows:

```bash
# Setup
cd scripts/git-submodules-js && npm install

# Interactive workflow
npm start

# Quick commands
npm run sync                                    # Sync all submodules
npm run new-feature <service-name> <feature>   # Start new feature
npm run create-pr <service-name>               # Create service PR  
npm run parent-pr <feature-name>               # Create parent PR
```

#### Bash Scripts (Alternative)

Traditional bash scripts for Unix-like systems:

```bash
# Start new feature
./scripts/git-submodules/03-new-feature.sh <service-name> <feature-name>

# Create service PR
./scripts/git-submodules/04-create-submodule-pr.sh <service-name>

# Update parent repo
./scripts/git-submodules/05-create-parent-pr.sh <feature-name>

# Sync all submodules
./scripts/git-submodules/02-sync-submodules.sh
```

### Example: Implementing a New Feature

Using the **Node.js CLI** (recommended):

```bash
# 1. Setup CLI (first time)
cd scripts/git-submodules-js && npm install

# 2. Sync to latest
npm run sync

# 3. Create feature branch
npm run new-feature brainiac-ai-service template-validation

# 4. Develop your feature
cd services/brainiac-ai-service
# ... make changes ...
git add . && git commit -m "feat: add template validation logic"

# 5. Create PR for service
cd ../../scripts/git-submodules-js
npm run create-pr brainiac-ai-service

# 6. After merge, update parent
npm run sync
npm run parent-pr template-validation
```

Using **bash scripts** (alternative):

```bash
# 1. Sync to latest
./scripts/git-submodules/02-sync-submodules.sh

# 2. Create feature branch
./scripts/git-submodules/03-new-feature.sh brainiac-ai-service template-validation

# 3. Develop and create PRs (same as above)
# 4. After merge, update parent
./scripts/git-submodules/02-sync-submodules.sh  
./scripts/git-submodules/05-create-parent-pr.sh template-validation
```

## 📋 Methodology Templates

The platform includes comprehensive templates for the startup journey:

### Research Phase
- Problem Validation Sprint
- Hypothesis List
- Opportunity Landscape
- Lean Canvas
- Experiment Summary

### Design Phase
- Tech Spike Check
- Experiment Brief
- User Journey Map
- Prototype Spec
- Tech Feasibility Check

### Development Phase
- Build Plan
- Pre-flight Checklist
- Experiment Debrief

### Testing Phase
- Test Plan
- Test Cases
- Bug Tracker
- User Feedback Log
- Learning Summary

### Deployment Phase
- Release Runbook
- Post-release Log

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Service Ports
UI_PORT=3000
API_GATEWAY_PORT=8000
AI_SERVICE_PORT=8001

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/methodology_coach
REDIS_URL=redis://localhost:6379

# AI Configuration
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Vector Store
CHROMA_PERSIST_DIRECTORY=./chroma_db

# Monitoring (Optional)
LANGSMITH_API_KEY=your-langsmith-key
LANGCHAIN_TRACING_V2=true
```

### Docker Compose Configuration

The `docker-compose.yml` orchestrates all services:

```yaml
version: '3.8'

services:
  brainiac-ai:
    build: ./services/brainiac-ai-service
    ports:
      - "8001:8001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    volumes:
      - ./templates:/app/templates:ro

  ui-service:
    build: ./services/ui-service
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000

  api-gateway:
    build: ./services/api-gateway
    ports:
      - "8000:8000"
    environment:
      - AI_SERVICE_URL=http://brainiac-ai:8001
```

## 🧪 Testing

### Run All Tests
```bash
# Run tests for all services
./scripts/run-all-tests.sh

# Run tests for specific service
cd services/brainiac-ai-service && npm test
cd services/ui-service && npm test
cd services/api-gateway && npm test
```

### Integration Tests
```bash
# Run integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📊 Monitoring

### Application Metrics

- **LangSmith**: Monitor AI agent execution and traces
- **Redis Commander**: View cached flows and data
- **pgAdmin**: Database management and queries

### Health Checks

All services expose health endpoints:
- UI Service: http://localhost:3000/health
- API Gateway: http://localhost:8000/health
- AI Service: http://localhost:8001/health

## 🚢 Deployment

### Production Deployment

1. **Build production images**:
```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Deploy to Kubernetes**:
```bash
kubectl apply -f k8s/
```

3. **Monitor deployment**:
```bash
kubectl get pods -n methodology-coach
kubectl logs -f deployment/brainiac-ai-service
```

### CI/CD Pipeline

The project uses GitHub Actions for CI/CD:

- **On PR**: Run tests, linting, and build checks
- **On Merge to Main**: Deploy to staging environment
- **On Tag**: Deploy to production

## 🤝 Contributing

We welcome contributions! Please follow our development workflow:

1. **Read the Git Submodule Workflow Guide**: [docs/GIT_SUBMODULE_WORKFLOW.md](docs/GIT_SUBMODULE_WORKFLOW.md)
2. **Create a feature branch** in the appropriate service
3. **Follow coding standards** for each service
4. **Write tests** for new functionality
5. **Create PRs** following the workflow scripts
6. **Update documentation** as needed

### Coding Standards

- **Python** (AI Service): Black, Ruff, type hints
- **TypeScript** (UI Service): ESLint, Prettier
- **Node.js** (API Gateway): ESLint, Jest

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `chore:` Maintenance
- `test:` Testing
- `refactor:` Code refactoring

## 📚 Documentation

- **[Git Submodule Workflow](docs/GIT_SUBMODULE_WORKFLOW.md)** - Complete guide for working with submodules
- **[Brainiac AI Service](services/brainiac-ai-service/README.md)** - AI service documentation
- **[UI Service](services/ui-service/README.md)** - Frontend documentation
- **[API Gateway](services/api-gateway/README.md)** - API gateway documentation
- **[Template Guide](templates/README.md)** - How to use and create templates

## 🐛 Troubleshooting

### Common Issues

#### Submodules not initialized
```bash
git submodule update --init --recursive
```

#### Service connection issues
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f <service-name>
```

#### Database migrations
```bash
cd services/brainiac-ai-service
python scripts/migrate_db.py
```

For more issues, check the [troubleshooting section](docs/GIT_SUBMODULE_WORKFLOW.md#troubleshooting) in the workflow guide.

## 📈 Roadmap

- [ ] Enhanced template library with industry-specific variations
- [ ] Real-time collaboration features
- [ ] Advanced analytics and insights dashboard
- [ ] Mobile application
- [ ] Integration with popular startup tools (Stripe, Slack, etc.)
- [ ] AI-powered pitch deck generator
- [ ] Investor matching system

## 📝 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- LangChain and LangGraph teams for the excellent AI orchestration framework
- The startup community for methodology inspiration
- All contributors and early adopters

## 📞 Support

- **Documentation**: Check the [docs](docs/) folder
- **Issues**: [GitHub Issues](https://github.com/your-org/ai-startup-methodology-coach/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/ai-startup-methodology-coach/discussions)
- **Email**: support@your-domain.com

---

Built with ❤️ for entrepreneurs by entrepreneurs