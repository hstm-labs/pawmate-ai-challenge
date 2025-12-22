# LLM Usage Tracking Guide

## Purpose

This document provides tool-specific instructions for checking LLM usage metrics (tokens, requests, cost) before and after benchmark runs. Accurate usage tracking enables cost analysis and comparison across different AI coding tools.

## General Process

1. **Before the run**: Check your current LLM plan usage/billing status
2. **Note the metrics**: Record token counts, request counts, or cost
3. **After the run**: Check again to calculate the difference
4. **Record in result file**: Include usage metrics in the AI run report or result file

## Tool-Specific Instructions

### Cursor

**How to check usage:**
1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Navigate to **Usage** or **Billing** section
3. Check current token usage, request count, or billing information
4. Alternatively, visit the Cursor dashboard/account page in your browser

**What to record:**
- Input tokens used
- Output tokens used
- Total tokens
- Number of requests (if available)
- Estimated cost (if available)

**Note**: Cursor may show usage in the settings or require checking the account dashboard online.

### GitHub Copilot

**How to check usage:**
1. Go to GitHub.com
2. Navigate to **Settings** → **Copilot**
3. Check the **Usage** tab or billing information
4. Alternatively, check your GitHub account billing page

**What to record:**
- Token usage (if available)
- Request count (if available)
- Billing/cost information

**Note**: GitHub Copilot usage may be shown in monthly billing cycles. You may need to estimate based on your billing period.

### Codeium

**How to check usage:**
1. Open Codeium settings or dashboard
2. Navigate to **Usage** or **Account** section
3. Check token/request metrics
4. Review billing information if available

**What to record:**
- Token usage
- Request count
- Cost information (if available)

### Other Tools

For tools not listed above:
1. Check the tool's settings/preferences for usage metrics
2. Look for a billing/account dashboard
3. Review any usage reports or analytics provided by the tool
4. If no metrics are available, note this in the result file

## Recording Usage in Result Files

Usage metrics should be recorded in the AI run report (`benchmark/ai_run_report.md`) under the "LLM Usage" section:

```markdown
## LLM Usage

- **Input Tokens**: 125000
- **Output Tokens**: 45000
- **Total Tokens**: 170000
- **Requests Count**: 45
- **Estimated Cost (USD)**: 2.50
- **Cost Currency**: USD
- **Usage Source**: tool_reported
```

If metrics are not available from the tool:
- Set `usage_source` to `operator_estimated` if you manually calculated
- Set `usage_source` to `unknown` if no data is available
- Leave numeric fields empty or set to null

## Usage Source Values

- **tool_reported**: Metrics were automatically provided by the AI tool
- **operator_estimated**: Metrics were manually calculated by the operator (e.g., from billing differences)
- **unknown**: No usage data is available

## Best Practices

1. **Check before starting**: Always check your usage status before beginning a benchmark run
2. **Check immediately after**: Check again right after completion to get accurate before/after comparison
3. **Record promptly**: Don't wait too long between completion and recording, as other usage may accumulate
4. **Be consistent**: Use the same method for checking usage across all runs for accurate comparison
5. **Note limitations**: If a tool doesn't provide detailed metrics, note this in the result file

## Troubleshooting

**Q: My tool doesn't show token counts, only cost.**
A: Record the cost and set token fields to null. The cost is still valuable for comparison.

**Q: I can only see monthly totals, not per-run usage.**
A: Estimate based on the run's duration and complexity relative to your monthly usage. Set `usage_source` to `operator_estimated`.

**Q: The tool shows no usage metrics at all.**
A: Set `usage_source` to `unknown` and leave all numeric fields null. This is acceptable if the tool doesn't provide metrics.

**Q: How do I calculate usage if I only have before/after billing totals?**
A: If you have billing totals before and after, calculate the difference. Set `usage_source` to `operator_estimated` and note the calculation method in the result file notes.

