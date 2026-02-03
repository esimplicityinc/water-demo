# ClawMarket Commands

Quick reference for all Just recipes. Run `just` or `just --list` to see all commands.

## 🚀 Quick Start

```bash
# First time setup
just setup

# Start development (Next.js + Convex)
just dev-all

# Or use the shortcut
just d
```

## 📋 Common Commands

### Development
```bash
just dev              # Start Next.js only
just dev-all          # Start Next.js + Convex (recommended)
just build            # Build for production
just start            # Start production server
```

### Convex Backend
```bash
just convex-init      # Initialize Convex (first time)
just convex-dev       # Start Convex dev server
just convex-deploy    # Deploy to production
just convex-dashboard # Open Convex dashboard
just convex-run functionName  # Run a Convex function
```

### Testing
```bash
just test             # Run unit tests
just test-watch       # Watch mode
just test-e2e         # E2E tests
just test-all         # All tests
just check            # Lint + typecheck + test
```

### Documentation
```bash
just docs-dev         # Start docs site
just docs-build       # Build docs
just docs-serve       # Serve built docs
```

### Code Quality
```bash
just lint             # Run ESLint
just format           # Format with Prettier
just typecheck        # TypeScript check
just check            # Run all checks
```

### Dependencies
```bash
just install          # Install all deps
just add package      # Add dependency
just add-dev package  # Add dev dependency
just update           # Update all deps
just outdated         # Check outdated deps
```

### Cleanup
```bash
just clean            # Clean build artifacts
just clean-deps       # Remove node_modules
just clean-all        # Deep clean
just reset            # Reinstall everything
```

### Deployment
```bash
just deploy           # Deploy to production (Vercel + Convex)
just deploy-preview   # Deploy preview
```

### Utilities
```bash
just info             # Show project info
just open             # Open app in browser
just open-all         # Open all dev URLs
just tree             # Show project structure
just logs             # View Convex logs
just logs-follow      # Follow Convex logs
```

### DDD Helpers
```bash
just create-context name  # Create new bounded context
just show-contexts        # List all contexts
```

## ⚡ Shortcuts

```bash
just d     # = just dev-all
just t     # = just test
just b     # = just build
just c     # = just clean
just p     # = just deploy
```

## 🔥 Most Used Workflows

### Daily Development
```bash
just dev-all          # Start everything
just test-watch       # Watch tests in another terminal
just open-all         # Open browser tabs
```

### Before Commit
```bash
just check            # Lint + typecheck + test
```

### Creating a New Feature
```bash
# Create bounded context structure
just create-context my-feature

# Generate Convex types after schema changes
just generate
```

### Deployment
```bash
# Check everything first
just check

# Build locally
just build

# Deploy
just deploy
```

## 🆘 Troubleshooting

### Reset Everything
```bash
just reset            # Clean + reinstall
```

### Convex Issues
```bash
just convex-init      # Reinitialize
just generate         # Regenerate types
```

### See What's Running
```bash
ps aux | grep -E "bun|convex|next"
```

## 📚 Learn More

- Full documentation: `./docs/`
- DDD docs: `./docs/ddd/`
- Convex docs: `./convex/README.md`
- Source structure: `./src/README.md`

## 💡 Tips

- Tab completion works! Try `just <TAB>`
- Comments show up in `just --list`
- Recipes can call other recipes
- Environment variables are supported

---

Run `just --help` for more Just options.
