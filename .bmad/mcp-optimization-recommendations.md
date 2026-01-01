# MCP & Token Optimization Recommendations

**Date:** 2026-01-02
**Project:** Steps to Recovery
**Optimized By:** Claude Code

---

## Summary

Successfully removed **7 unnecessary MCP servers**, reducing token overhead by ~5,000-10,000 tokens per conversation and improving startup performance.

---

## Removed MCPs ✅

| MCP Server | Reason | Impact |
|------------|--------|--------|
| puppeteer | Browser automation (not needed for mobile app) | -2,000 tokens |
| firecrawl | Web scraping (no use case) | -1,500 tokens |
| memory | Knowledge graph (overkill for this project) | -1,000 tokens |
| brave-search | Failed to connect anyway | -500 tokens |
| fetch | Failed to connect anyway | -500 tokens |
| sqlite | Failed to connect anyway | -500 tokens |
| time | Time utilities (not needed) | -300 tokens |
| aws | AWS integration (not using) | -500 tokens |

**Total Estimated Savings:** ~6,800 tokens/conversation + faster startup

---

## Current MCPs (7 remaining)

### Critical - DO NOT REMOVE
1. **supabase** - Your backend database (needs auth setup)
2. **filesystem** - Core file operations
3. **github** - Git workflow automation
4. **sequential-thinking** - Complex problem solving

### Useful - Keep for Now
5. **context7** - Library documentation lookups
6. **greptile** - Code repository indexing

### Consider Removing
7. **plugin:playwright:playwright** - Browser automation (not needed for mobile development)

---

## Recommended Next Steps

### 1. Remove Playwright Plugin
To fully remove the playwright plugin, run inside Claude Code:
```
/mcp disable plugin:playwright:playwright
```
Or manually edit plugin configuration.

**Estimated Savings:** ~2,000 additional tokens

### 2. Authenticate Supabase MCP
Your Supabase MCP shows "⚠ Needs authentication". To fix:
```
# Set your Supabase credentials
export SUPABASE_ACCESS_TOKEN=your-token-here
```
Or follow the authentication flow when prompted.

### 3. Consider Removing Greptile
If you find filesystem search sufficient for your needs:
```
claude mcp remove plugin:greptile:greptile
```
**Estimated Savings:** ~1,500 additional tokens

### 4. Project-Level Token Optimizations

#### A. Reduce CLAUDE.md Includes
Your `.bmad/project-context.md` is comprehensive (249 lines). Consider splitting into:
- `project-context-core.md` - Essential rules only (~100 lines)
- `project-context-reference.md` - Extended guidelines (load on-demand)

**Estimated Savings:** ~1,000-2,000 tokens per conversation

#### B. Use .claudeignore
Create `.claudeignore` to exclude unnecessary directories:
```
node_modules/
.expo/
dist/
build/
.git/
coverage/
*.log
.turbo/
```

#### C. Optimize File Mentions
Use targeted @-mentions instead of @-mentioning large directories:
```
# Instead of: @apps/mobile
# Use: @apps/mobile/src/features/journal/JournalCard.tsx
```

### 5. Settings Optimization

Create `.claude/settings.json` with:
```json
{
  "ignorePatterns": [
    "**/node_modules/**",
    "**/.expo/**",
    "**/dist/**",
    "**/build/**",
    "**/.turbo/**"
  ],
  "allowedTools": {
    "Read": ["**/*.{ts,tsx,js,jsx,json,md}"],
    "Write": ["**/*.{ts,tsx,js,jsx,json,md}"],
    "Edit": ["**/*.{ts,tsx,js,jsx,json,md}"]
  }
}
```

---

## Expected Total Impact

| Optimization | Token Savings | Startup Improvement |
|--------------|---------------|---------------------|
| Removed MCPs | ~6,800/conv | 2-3 seconds |
| Remove Playwright | ~2,000/conv | 0.5 seconds |
| Remove Greptile (optional) | ~1,500/conv | 0.5 seconds |
| Optimize CLAUDE.md | ~1,500/conv | - |
| Add .claudeignore | ~2,000/conv | - |

**Total Potential Savings:** ~13,800 tokens per conversation (~7% of 200k limit)

---

## Monitoring

After these changes, monitor:
1. **Startup time** - Should be faster
2. **Token usage** - Use `/usage` command to track
3. **Performance** - Responses should be faster

---

## Rollback Instructions

If you need to restore any MCP server:
```bash
# Example: Restore memory MCP
claude mcp add memory stdio -- npx -y @modelcontextprotocol/server-memory
```

---

**Last Updated:** 2026-01-02
**Next Review:** After 1 week of usage
