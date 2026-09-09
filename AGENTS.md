# Agent Instructions

## Project status

This repository is being initialized. Before making assumptions about the stack,
inspect the root directory and existing configuration files. Update this section
when the project has a defined purpose or architecture.

## Working conventions

- Keep changes focused on the requested task.
- Read relevant source, configuration, and documentation before editing.
- Preserve existing user changes; do not reset, discard, or reformat unrelated work.
- Prefer small, reversible changes and explain meaningful trade-offs.
- Add or update tests when changing behavior, then run the narrowest relevant checks.
- Never commit, deploy, publish, or send external messages unless explicitly asked.

## Project hygiene

- Keep secrets out of source control. Store local credentials in ignored `.env` files
  and document required variables in `.env.example`.
- Do not place generated files, dependencies, build output, or local databases in Git
  unless the project explicitly requires them.
- Use UTF-8 and maintain the formatting conventions already present in the repository.

## First-task checklist

1. Identify the runtime and package manager from the files in the repository root.
2. Read the README and configuration files relevant to the requested work.
3. Check the working-tree status before editing.
4. Implement only the requested scope.
5. Run applicable validation and report what was verified.
