# ClawMarket Just Recipes
# Run `just` or `just --list` to see all available commands

# Set shell
set shell := ["bash", "-c"]

# Default recipe (shows help)
default:
    @just --list

# ==============================================================================
# 🚀 Development
# ==============================================================================

# Start Next.js development server
dev:
    ~/.bun/bin/bun dev

# Build Next.js for production
build:
    ~/.bun/bin/bun run build

# Start Next.js production server
start:
    ~/.bun/bin/bun start

# Run Next.js and Convex dev servers in parallel
dev-all:
    @echo "Starting Next.js and Convex dev servers..."
    @echo "Next.js: http://localhost:3000"
    @echo "Convex Dashboard: https://dashboard.convex.dev"
    ~/.bun/bin/bun dev & ~/.bun/bin/bunx convex dev

# ==============================================================================
# 🗄️ Convex Backend
# ==============================================================================

# Initialize Convex project
convex-init:
    ~/.bun/bin/bunx convex dev --once

# Start Convex development server
convex-dev:
    ~/.bun/bin/bunx convex dev

# Deploy Convex to production
convex-deploy:
    ~/.bun/bin/bunx convex deploy

# Clear Convex database (requires confirmation)
convex-clear:
    @echo "⚠️  This will clear all data in your Convex database!"
    @read -p "Type 'yes' to confirm: " confirm && [ "$$confirm" = "yes" ] && ~/.bun/bin/bunx convex run --prod _system/cli/clearAll || echo "Cancelled"

# View Convex dashboard
convex-dashboard:
    @echo "Opening Convex dashboard..."
    @open "https://dashboard.convex.dev"

# Run Convex function (usage: just convex-run functionName)
convex-run function:
    ~/.bun/bin/bunx convex run {{function}}

# ==============================================================================
# 📚 Documentation
# ==============================================================================

# Start documentation site
docs-dev:
    cd docs && ~/.bun/bin/bun start

# Build documentation site
docs-build:
    cd docs && ~/.bun/bin/bun run build

# Serve built documentation
docs-serve:
    cd docs && ~/.bun/bin/bun run serve

# ==============================================================================
# 🧪 Testing
# ==============================================================================

# Run all unit tests
test:
    ~/.bun/bin/bun test

# Run tests in watch mode
test-watch:
    ~/.bun/bin/bun test --watch

# Run tests with UI
test-ui:
    ~/.bun/bin/bun test --ui

# Run E2E tests
test-e2e:
    ~/.bun/bin/bun test:e2e

# Run E2E tests with UI
test-e2e-ui:
    ~/.bun/bin/bunx playwright test --ui

# ==============================================================================
# 🎭 BDD Testing (Stack Tests)
# ==============================================================================

# Install BDD test dependencies
bdd-install:
    cd stack-tests && npm install

# Run all BDD tests
bdd-test:
    cd stack-tests && npm test

# Run BDD tests for specific tag (usage: just bdd-tag @smoke)
bdd-tag tag:
    cd stack-tests && npm test -- --grep "{{tag}}"

# Run BDD API tests only
bdd-api:
    cd stack-tests && npm test -- --project=api

# Run BDD UI tests only
bdd-ui:
    cd stack-tests && npm test -- --project=ui

# Run BDD hybrid/E2E tests only
bdd-hybrid:
    cd stack-tests && npm test -- --project=hybrid

# Run BDD tests in headed mode (see browser)
bdd-headed:
    cd stack-tests && HEADLESS=false npm test

# Run BDD tests for roadmap item (usage: just bdd-roadmap ROAD-004)
bdd-roadmap item:
    cd stack-tests && npm test -- --grep "@{{item}}"

# Generate BDD test files from feature specs
bdd-gen:
    cd stack-tests && npm run gen

# Clean BDD generated files
bdd-clean:
    cd stack-tests && npm run clean:gen

# View BDD test report
bdd-report:
    @echo "Opening BDD test report..."
    @open stack-tests/cucumber-report/index.html || echo "No report found. Run tests first."

# Validate BDD capability tags
bdd-validate-cap-tags:
    node scripts/validate-bdd-tags.js

# Validate BDD capability tags (strict mode - requires all features to have capability tags)
bdd-validate-cap-tags-strict:
    node scripts/validate-bdd-tags.js --strict

# Generate capability coverage report
capability-coverage:
    node scripts/capability-coverage-report.js

# Generate capability coverage report (JSON format)
capability-coverage-json:
    node scripts/capability-coverage-report.js --format=json

# ==============================================================================
# 👥 Persona Management
# ==============================================================================

# Lint all persona files
lint-personas:
    node scripts/governance-linter.js --personas

# Lint specific persona
lint-persona persona-id:
    node scripts/governance-linter.js {{persona-id}}

# Generate persona coverage report
persona-coverage:
    node scripts/persona-coverage-report.js

# Generate persona coverage report (JSON format)
persona-coverage-json:
    node scripts/persona-coverage-report.js --format=json

# Run BDD tests for specific persona tag
bdd-persona tag:
    cd stack-tests && npm test -- --grep "{{tag}}"

# Run all tests (unit + E2E)
test-all:
    just test
    just test-e2e

# ==============================================================================
# 📦 Dependencies
# ==============================================================================

# Install dependencies
install:
    ~/.bun/bin/bun install

# Add a dependency
add package:
    ~/.bun/bin/bun add {{package}}

# Add a dev dependency
add-dev package:
    ~/.bun/bin/bun add -d {{package}}

# Update all dependencies
update:
    ~/.bun/bin/bun update

# Check for outdated dependencies
outdated:
    ~/.bun/bin/bun outdated

# ==============================================================================
# 🎨 Code Quality
# ==============================================================================

# Run ESLint
lint:
    ~/.bun/bin/bun run lint

# Format code with Prettier (if installed)
format:
    @if command -v prettier >/dev/null 2>&1; then \
        ~/.bun/bin/bunx prettier --write .; \
    else \
        echo "Prettier not found. Install with: bun add -d prettier"; \
    fi

# Type check with TypeScript
typecheck:
    ~/.bun/bin/bunx tsc --noEmit

# Run all quality checks
check:
    just lint
    just typecheck
    just test

# ==============================================================================
# 🗃️ Database & Schema
# ==============================================================================

# Generate Convex types
generate:
    ~/.bun/bin/bunx convex codegen

# Validate Convex schema
validate-schema:
    ~/.bun/bin/bunx convex dev --once --until-success

# ==============================================================================
# 🧹 Cleanup
# ==============================================================================

# Clean build artifacts
clean:
    rm -rf .next
    rm -rf out
    rm -rf build
    rm -rf dist
    rm -rf docs/build
    rm -rf docs/.docusaurus

# Clean dependencies
clean-deps:
    rm -rf node_modules
    rm -rf docs/node_modules
    rm -f bun.lockb

# Deep clean (everything)
clean-all:
    just clean
    just clean-deps

# Reinstall everything from scratch
reset:
    just clean-all
    just install
    @echo "✓ Project reset complete!"

# ==============================================================================
# 🚢 Deployment
# ==============================================================================

# Deploy to Vercel (production)
deploy:
    @echo "Deploying to Vercel..."
    vercel --prod
    @echo "Deploying Convex..."
    ~/.bun/bin/bunx convex deploy

# Deploy to Vercel (preview)
deploy-preview:
    vercel

# ==============================================================================
# 🔧 Utilities
# ==============================================================================

# Show project info
info:
    @echo "ClawMarket - LLM Compute Futures Market"
    @echo "=========================================="
    @echo "Bun version:     $(~/.bun/bin/bun --version)"
    @echo "Node version:    $(node --version)"
    @echo "Next.js:         $(cat package.json | grep '\"next\"' | cut -d'"' -f4)"
    @echo "Convex:          $(cat package.json | grep '\"convex\"' | cut -d'"' -f4)"
    @echo ""
    @echo "Bounded Contexts:"
    @echo "  - Bot Identity & Reputation"
    @echo "  - Promise Market"
    @echo "  - Token Management"
    @echo "  - Settlement & Verification"

# Open app in browser
open:
    @open "http://localhost:3000"

# Open all development URLs
open-all:
    @open "http://localhost:3000"
    @open "https://dashboard.convex.dev"

# Show project structure
tree:
    @tree -L 2 -I 'node_modules|.next|.git|dist|build' --dirsfirst

# ==============================================================================
# 🏗️ Setup
# ==============================================================================

# Initial project setup (run once)
setup:
    @echo "Setting up ClawMarket..."
    @echo "1. Installing dependencies..."
    just install
    @echo "2. Setting up environment..."
    @if [ ! -f .env.local ]; then \
        cp .env.local.example .env.local; \
        echo "Created .env.local - please add your Convex URL"; \
    else \
        echo ".env.local already exists"; \
    fi
    @echo "3. Initializing Convex..."
    ~/.bun/bin/bunx convex dev --once --until-success
    @echo ""
    @echo "✓ Setup complete!"
    @echo ""
    @echo "Next steps:"
    @echo "  1. Add your Convex URL to .env.local"
    @echo "  2. Run 'just dev-all' to start development"
    @echo "  3. Visit http://localhost:3000"

# ==============================================================================
# 🎯 Domain-Driven Design Helpers
# ==============================================================================

# Create a new bounded context
create-context name:
    @echo "Creating bounded context: {{name}}"
    mkdir -p src/{{name}}/{domain,application,infrastructure}
    mkdir -p convex/{{name}}
    @echo "✓ Created context structure for {{name}}"

# Show all bounded contexts
show-contexts:
    @echo "Bounded Contexts:"
    @ls -1 src/ | grep -v shared | grep -v README

# ==============================================================================
# 📊 Monitoring & Logs
# ==============================================================================

# View Convex logs
logs:
    ~/.bun/bin/bunx convex logs

# View Convex logs (follow)
logs-follow:
    ~/.bun/bin/bunx convex logs --watch

# Monitor OpenCode sessions (runs in 5-min loop, alerts on new sessions)
# When new session detected, outputs: "@agent-manager analyze session for ROAD-XXX"
monitor-sessions:
    @./scripts/monitor-sessions.sh

# Show latest OpenCode sessions (one-time check)
sessions:
    @echo "Latest OpenCode sessions:"
    @ls -lt .opencode/logs/*.md 2>/dev/null | head -10 | awk '{printf "  %s %s %s - %s\n", $6, $7, $8, $9}'
    @echo ""
    @echo "💡 Run 'just monitor-sessions' to watch continuously"
    @echo "💡 Message @agent-manager: 'analyze session for ROAD-XXX'"

# Analyze latest OpenCode session (opens agent-manager with command)
analyze-latest:
    @#!/bin/bash
    @LATEST=$(ls -t .opencode/logs/*.md 2>/dev/null | head -1)
    @if [ -f "$LATEST" ]; then
    @  ROAD=$(grep "roadmap_item:" "$LATEST" 2>/dev/null | head -1 | cut -d':' -f2 | tr -d ' ')
    @  if [ -n "$ROAD" ]; then
    @    echo "Latest session: $ROAD"
    @    echo ""
    @    echo "Copy this command to OpenCode:"
    @    echo "  @agent-manager analyze session for $ROAD"
    @    echo ""
    @    # Copy to clipboard
    @    if command -v pbcopy &> /dev/null; then
    @      echo "@agent-manager analyze session for $ROAD" | pbcopy
    @      echo "✓ Copied to clipboard! Paste into OpenCode"
    @    fi
    @  fi
    @fi

# ==============================================================================
# 🔐 Security
# ==============================================================================

# Check for security vulnerabilities
audit:
    ~/.bun/bin/bun audit

# Update dependencies with security fixes
audit-fix:
    ~/.bun/bin/bun update

# ==============================================================================
# 💡 Quick Commands (Shortcuts)
# ==============================================================================

# Quick start development
d: dev-all

# Quick test
t: test

# Quick build
b: build

# Quick clean
c: clean

# Quick deploy
p: deploy
