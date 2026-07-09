# Graphify

Graphify is used in Nyra to create a queryable project knowledge graph from source code, Markdown documentation, Graphify/Codex instructions, and database knowledge. The graph helps Codex answer architecture, routing, API, frontend, database, admin, learning-system, and shared-utility questions from indexed project context instead of broad repository scans.

## Installation

Graphify was installed on macOS with the official `uv` tool workflow:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
~/.local/bin/uv tool install 'graphifyy[ollama,postgres]' --force
```

The installed CLI is:

```bash
~/.local/bin/graphify --version
```

Nyra also has a project-scoped Codex install:

```bash
~/.local/bin/graphify install --project --platform codex
```

This created `AGENTS.md`, `.codex/hooks.json`, and `.codex/skills/graphify/`.

## Indexed Scope

Graphify should index Nyra product knowledge and application code:

- `app/`
- `components/`
- `lib/`
- `prisma/seed.ts`
- root configuration files
- `README.md`
- `CONTEXT.md`
- `docs/`

The Prisma schema is still the source of truth for database models. Because Graphify 0.9.11 does not classify `.prisma` files directly, `docs/DATABASE_SCHEMA.md` mirrors the schema for knowledge-graph indexing.

## Ignore Rules

Project-specific ignore rules live in `.graphifyignore`. They exclude dependency folders, build outputs, cache directories, generated Prisma client files, logs, temporary files, and local assistant tooling. Do not exclude Nyra source code, product documentation, ADRs, or schema documentation.

## Rebuild The Graph

Use a full rebuild after large documentation changes, major refactors, or dependency upgrades:

```bash
set -a
source .env
set +a
PG_DSN=$(node -e 'const u = new URL(process.env.DATABASE_URL); u.searchParams.delete("schema"); process.stdout.write(u.toString())')
OLLAMA_MODEL='gemma3:4b' OLLAMA_API_KEY='local' ~/.local/bin/graphify extract . --backend ollama --model 'gemma3:4b' --mode deep --max-concurrency 1 --api-timeout 900 --postgres "$PG_DSN"
~/.local/bin/graphify cluster-only . --backend ollama --model 'gemma3:4b' --max-concurrency 1
```

Outputs are written to `graphify-out/`, including `graph.json`, `graph.html`, `GRAPH_REPORT.md`, semantic cache files, and the manifest used for incremental updates.

## Update The Graph

Use incremental updates after normal code changes:

```bash
~/.local/bin/graphify update .
```

Use watch mode during a longer coding session when continuous refresh is useful:

```bash
~/.local/bin/graphify watch .
```

The project also supports Graphify's git hooks:

```bash
~/.local/bin/graphify hook install
~/.local/bin/graphify hook status
```

The hook refreshes code-oriented graph data after commits and checkouts. For Markdown-heavy changes, run the full rebuild or a manual update so semantic document extraction is refreshed.

## Query Workflow

For architecture questions, prefer Graphify before broad source browsing:

```bash
~/.local/bin/graphify query "backend api learning sessions"
~/.local/bin/graphify query "frontend components admin panel"
~/.local/bin/graphify explain "LearningSession"
~/.local/bin/graphify path "LearningSession" "QuestionAttempt"
```

Recommended Codex workflow:

1. Query Graphify for the area being changed.
2. Inspect the cited files directly before editing.
3. Make the code or documentation change.
4. Run the relevant project checks.
5. Run `~/.local/bin/graphify update .` at a good stopping point.
6. Commit and push when the repository has a GitHub remote and the work is in a coherent state.

## Troubleshooting

- If `graphify` is not found, use the absolute path `~/.local/bin/graphify` or add `~/.local/bin` to `PATH`.
- If full extraction says an LLM key is missing, use the local Ollama backend shown above or configure one of Graphify's supported API keys.
- If Ollama returns invalid JSON for Markdown chunks, rerun with a stronger local model or a cloud model. The AST code graph can still be useful, but document semantics may be partial.
- If PostgreSQL introspection fails with Prisma's `schema` URL parameter, remove that parameter before passing the DSN to Graphify.
- If PostgreSQL returns zero nodes, run `npm run db:push` against the target database and rebuild.
- If generated or dependency files appear in the graph, update `.graphifyignore` and rebuild.

## Best Practices

- Keep `CONTEXT.md` as the glossary only; keep implementation decisions in ADRs and operational instructions in docs like this one.
- Keep `docs/DATABASE_SCHEMA.md` synchronized with `prisma/schema.prisma` when database models change.
- Use `graphify query` for broad orientation, `graphify explain` for one concept, and `graphify path` for relationships between two concepts.
- Treat Graphify output as navigation and evidence, not a replacement for reading the cited source files.
