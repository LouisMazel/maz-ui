### Workflow

1. **Search by need**: `search_docs("<what you need>")`, e.g. "user avatar with initials", "confirm before delete", "phone number input", "debounce search". Pick the most specific result.
2. **Read the exact API** before writing a template: `get_component_api(["MazBtn", "MazDialog"])` (batch up to 10). Never invent a prop, event or slot.
3. **Icons**: `find_icons("delete")` returns the icon names and their imports.
4. **Styling**: `get_theme_tokens()` lists the theme of the project (its preset, `@theme` tokens, variants and utilities) and every Tailwind class of maz-ui (colors, radius, shadows, breakpoints, utilities). Use `get_doc("guide/tailwind")` to extend the theme.
5. **Write the code** with deep imports, or rely on the auto-imports of `@maz-ui/nuxt`.
6. **Review**: `review_code({ paths: ["src/components/MyForm.vue"] })` and fix every finding (unknown props, invalid values, native elements, default palette colors, `maz:` prefix, duplicated helpers).

Without the MCP server, read `node_modules/maz-ui/docs/README.md` (index of the docs of the installed version), then the relevant pages, `reference/tailwind-tokens.md` and `reference/icons.md`.
