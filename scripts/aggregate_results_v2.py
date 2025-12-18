#!/usr/bin/env python3
"""
aggregate_results_v2.py — Enhanced benchmark results aggregation with v2.0 schema support

Generates HTML reports with:
- Clear metric names (no cryptic abbreviations)
- Visual charts and graphs
- Separate API and UI timing/scoring
- Executive summary with insights
- Better readability

Usage:
    python3 scripts/aggregate_results_v2.py [--input-dir <dir>] [--output-dir <dir>]
"""

import argparse
import json
import os
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Metric name mappings for clarity
METRIC_NAMES = {
    'C': 'Correctness',
    'R': 'Reproducibility', 
    'D': 'Determinism',
    'E': 'Effort',
    'S': 'Speed',
    'K': 'Contract Quality',
    'P_O': 'Overreach Penalty'
}

METRIC_DESCRIPTIONS = {
    'Correctness': 'Percentage of acceptance tests passed',
    'Reproducibility': 'Consistency across multiple runs',
    'Determinism': 'Deterministic ordering and behavior',
    'Effort': 'Low human intervention required (100 = no help needed)',
    'Speed': 'Time to complete (relative to cohort)',
    'Contract Quality': 'Quality of API contract and documentation',
    'Overreach Penalty': 'Penalty for adding unrequested features'
}


def detect_schema_version(data: dict) -> str:
    """Detect which schema version is being used."""
    schema_version = data.get('schema_version', '1.0')
    
    # Check for v2.0 structure
    if 'implementations' in data.get('result_data', {}):
        return '2.0'
    
    return schema_version


def parse_result_file(file_path: Path) -> Optional[dict]:
    """Parse a result file and return structured data."""
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        # Add metadata
        data['_filename'] = file_path.name
        data['_filepath'] = str(file_path)
        data['_schema_version'] = detect_schema_version(data)
        
        return data
    
    except Exception as e:
        print(f"Error parsing {file_path}: {e}", file=sys.stderr)
        return None


def extract_metrics_v1(result: dict) -> dict:
    """Extract metrics from v1.0 schema."""
    metrics = result['result_data']['metrics']
    scores = result['result_data']['scores']
    
    return {
        'api_time': metrics.get('ttfr', {}).get('minutes', 'N/A'),
        'total_time': metrics.get('ttfc', {}).get('minutes', 'N/A'),
        'ui_time': 'N/A',
        'llm_model': 'Unknown',
        'correctness': scores.get('correctness_C', 'Unknown'),
        'reproducibility': scores.get('reproducibility_R', 'Unknown'),
        'determinism': scores.get('determinism_D', 'Unknown'),
        'effort': scores.get('effort_E', 'Unknown'),
        'speed': scores.get('speed_S', 'Unknown'),
        'contract_quality': scores.get('contract_docs_K', 'Unknown'),
        'overreach_penalty': scores.get('penalty_overreach_PO', 'Unknown'),
        'overall': scores.get('overall_score', 'Unknown')
    }


def extract_metrics_v2(result: dict) -> dict:
    """Extract metrics from v2.0 schema (separate API/UI)."""
    impls = result['result_data']['implementations']
    
    api_metrics = {}
    ui_metrics = {}
    
    # API implementation
    if 'api' in impls:
        api = impls['api']
        gen = api.get('generation_metrics', {})
        scores = api.get('scores', {})
        
        api_metrics = {
            'time': gen.get('duration_minutes', 'N/A'),
            'llm_model': gen.get('llm_model', 'Unknown'),
            'correctness': scores.get('correctness_C', 'Unknown'),
            'reproducibility': scores.get('reproducibility_R', 'Unknown'),
            'determinism': scores.get('determinism_D', 'Unknown'),
            'effort': scores.get('effort_E', 'Unknown'),
            'speed': scores.get('speed_S', 'Unknown'),
            'contract_quality': scores.get('contract_docs_K', 'Unknown'),
            'overreach_penalty': scores.get('penalty_overreach_PO', 'Unknown'),
            'overall': scores.get('overall_score', 'Unknown')
        }
    
    # UI implementation
    if 'ui' in impls:
        ui = impls['ui']
        gen = ui.get('generation_metrics', {})
        scores = ui.get('scores', {})
        
        ui_metrics = {
            'time': gen.get('duration_minutes', 'N/A'),
            'llm_model': gen.get('llm_model', 'Unknown'),
            'correctness': scores.get('ui_correctness', 'Unknown'),
            'integration': scores.get('api_integration_quality', 'Unknown'),
            'ux_quality': scores.get('ux_quality', 'Unknown'),
            'speed': scores.get('speed_S', 'Unknown'),
            'overall': scores.get('overall_ui_score', 'Unknown'),
            'backend_changes': gen.get('backend_changes_required', False)
        }
    
    return {
        'api': api_metrics,
        'ui': ui_metrics,
        'has_ui': 'ui' in impls
    }


def generate_html_report(group_key: Tuple[str, str, str], group_results: List[dict], output_dir: Path) -> None:
    """Generate an enhanced HTML comparison report."""
    spec_ref, model, api_type = group_key
    
    # Group by tool
    tools = defaultdict(lambda: {'run1': None, 'run2': None})
    
    for result in group_results:
        ri = result['result_data']['run_identity']
        tool_key = f"{ri['tool_name']} {ri.get('tool_version', '')}".strip()
        run_num = ri['run_number']
        
        if run_num == 1:
            tools[tool_key]['run1'] = result
        elif run_num == 2:
            tools[tool_key]['run2'] = result
    
    report_id = f"{spec_ref}-Model{model}-{api_type}-Comparison"
    report_path = output_dir / f"{report_id}.html"
    
    # Prepare data for charts
    tool_names = sorted(tools.keys())
    
    # Extract metrics for each tool
    tool_data = []
    for tool_name in tool_names:
        run1 = tools[tool_name]['run1']
        if not run1:
            continue
        
        schema_ver = run1.get('_schema_version', '1.0')
        
        if schema_ver == '2.0':
            metrics = extract_metrics_v2(run1)
        else:
            metrics = extract_metrics_v1(run1)
        
        tool_data.append({
            'name': tool_name,
            'schema_version': schema_ver,
            'metrics': metrics,
            'run1': run1,
            'run2': tools[tool_name]['run2']
        })
    
    # Generate HTML
    html = generate_html_content(report_id, spec_ref, model, api_type, tool_data)
    
    with open(report_path, 'w') as f:
        f.write(html)
    
    print(f"✓ Generated HTML report: {report_path}")


def generate_html_content(report_id: str, spec_ref: str, model: str, api_type: str, tool_data: List[dict]) -> str:
    """Generate the HTML content for the report."""
    
    # Generate executive summary
    summary_html = generate_executive_summary(tool_data)
    
    # Generate comparison tables
    tables_html = generate_comparison_tables(tool_data)
    
    # Generate charts
    charts_html = generate_charts_html(tool_data)
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{report_id} - Benchmark Comparison</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        
        h1 {{
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }}
        
        h2 {{
            color: #555;
            margin-top: 40px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }}
        
        h3 {{
            color: #666;
            margin-top: 30px;
            margin-bottom: 15px;
        }}
        
        .report-header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
        }}
        
        .report-header h1 {{
            color: white;
            border: none;
            margin: 0;
        }}
        
        .meta-info {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }}
        
        .meta-item {{
            background: rgba(255,255,255,0.2);
            padding: 10px 15px;
            border-radius: 6px;
        }}
        
        .meta-label {{
            font-size: 0.85rem;
            opacity: 0.9;
        }}
        
        .meta-value {{
            font-size: 1.1rem;
            font-weight: 600;
            margin-top: 5px;
        }}
        
        .executive-summary {{
            background: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 20px;
            border-radius: 6px;
            margin: 30px 0;
        }}
        
        .summary-highlights {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }}
        
        .highlight-card {{
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #c8e6c9;
        }}
        
        .highlight-label {{
            font-size: 0.875rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        
        .highlight-value {{
            font-size: 1.5rem;
            font-weight: bold;
            color: #2e7d32;
            margin-top: 5px;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        
        th {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }}
        
        td {{
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
        }}
        
        tr:hover {{
            background: #f5f5f5;
        }}
        
        .score-cell {{
            font-weight: 600;
        }}
        
        .score-high {{
            color: #4caf50;
        }}
        
        .score-medium {{
            color: #ff9800;
        }}
        
        .score-low {{
            color: #f44336;
        }}
        
        .chart-container {{
            position: relative;
            height: 400px;
            margin: 30px 0;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        
        .metric-explainer {{
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 20px 0;
            border-radius: 6px;
        }}
        
        .metric-explainer strong {{
            color: #e65100;
        }}
        
        .badge {{
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-left: 8px;
        }}
        
        .badge-v2 {{
            background: #4caf50;
            color: white;
        }}
        
        .badge-v1 {{
            background: #9e9e9e;
            color: white;
        }}
        
        .footer {{
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="report-header">
            <h1>📊 {report_id}</h1>
            <div class="meta-info">
                <div class="meta-item">
                    <div class="meta-label">Specification</div>
                    <div class="meta-value">{spec_ref}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Target Model</div>
                    <div class="meta-value">Model {model}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">API Style</div>
                    <div class="meta-value">{api_type}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Generated</div>
                    <div class="meta-value">{datetime.now().strftime('%Y-%m-%d %H:%M')}</div>
                </div>
            </div>
        </div>
        
        {summary_html}
        
        <h2>📈 Visual Comparison</h2>
        {charts_html}
        
        <h2>📋 Detailed Metrics</h2>
        {tables_html}
        
        <div class="footer">
            <p>PawMate Benchmark Report • Generated {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
    </div>
</body>
</html>"""
    
    return html


def generate_executive_summary(tool_data: List[dict]) -> str:
    """Generate executive summary section."""
    if not tool_data:
        return "<p>No data available for summary.</p>"
    
    # Calculate some interesting statistics
    total_tools = len(tool_data)
    tools_with_ui = sum(1 for t in tool_data if t['schema_version'] == '2.0' and t['metrics'].get('has_ui', False))
    
    # Find fastest API generation
    api_times = []
    for tool in tool_data:
        if tool['schema_version'] == '2.0':
            time = tool['metrics']['api'].get('time', 'N/A')
        else:
            time = tool['metrics'].get('api_time', 'N/A')
        
        if time != 'N/A' and isinstance(time, (int, float)):
            api_times.append((tool['name'], time))
    
    fastest_api = min(api_times, key=lambda x: x[1]) if api_times else None
    
    html = """
    <div class="executive-summary">
        <h2>📝 Executive Summary</h2>
        <div class="summary-highlights">
            <div class="highlight-card">
                <div class="highlight-label">Tools Compared</div>
                <div class="highlight-value">""" + str(total_tools) + """</div>
            </div>
            <div class="highlight-card">
                <div class="highlight-label">With UI Implementation</div>
                <div class="highlight-value">""" + str(tools_with_ui) + """</div>
            </div>
    """
    
    if fastest_api:
        html += f"""
            <div class="highlight-card">
                <div class="highlight-label">Fastest API Generation</div>
                <div class="highlight-value">{fastest_api[0]}</div>
                <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">{fastest_api[1]} minutes</div>
            </div>
        """
    
    html += """
        </div>
    </div>
    """
    
    return html


def generate_comparison_tables(tool_data: List[dict]) -> str:
    """Generate HTML comparison tables."""
    
    # Separate v1.0 and v2.0 tools
    v1_tools = [t for t in tool_data if t['schema_version'] == '1.0']
    v2_tools = [t for t in tool_data if t['schema_version'] == '2.0']
    
    html = ""
    
    # v2.0 API metrics table
    if v2_tools:
        html += """
        <h3>API Implementation Metrics <span class="badge badge-v2">Schema v2.0</span></h3>
        <div class="metric-explainer">
            <strong>Understanding the metrics:</strong>
            <ul style="margin-top: 10px; margin-left: 20px;">
                <li><strong>Time:</strong> Minutes from start to completion</li>
                <li><strong>Correctness:</strong> % of acceptance tests passed (100 = all passed)</li>
                <li><strong>Determinism:</strong> Consistent ordering and behavior (100 = fully deterministic)</li>
                <li><strong>Effort:</strong> Low human intervention (100 = fully autonomous)</li>
                <li><strong>Contract Quality:</strong> API documentation and completeness</li>
            </ul>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Tool</th>
                    <th>LLM Model</th>
                    <th>Time (min)</th>
                    <th>Correctness</th>
                    <th>Determinism</th>
                    <th>Effort</th>
                    <th>Contract Quality</th>
                    <th>Overall Score</th>
                </tr>
            </thead>
            <tbody>
        """
        
        for tool in v2_tools:
            api = tool['metrics']['api']
            html += f"""
                <tr>
                    <td><strong>{tool['name']}</strong></td>
                    <td>{api.get('llm_model', 'Unknown')}</td>
                    <td>{api.get('time', 'N/A')}</td>
                    <td class="score-cell {get_score_class(api.get('correctness', 0))}">{api.get('correctness', 'N/A')}</td>
                    <td class="score-cell {get_score_class(api.get('determinism', 0))}">{api.get('determinism', 'N/A')}</td>
                    <td class="score-cell {get_score_class(api.get('effort', 0))}">{api.get('effort', 'N/A')}</td>
                    <td class="score-cell {get_score_class(api.get('contract_quality', 0))}">{api.get('contract_quality', 'N/A')}</td>
                    <td class="score-cell {get_score_class(api.get('overall', 0))}"><strong>{api.get('overall', 'N/A')}</strong></td>
                </tr>
            """
        
        html += """
            </tbody>
        </table>
        """
        
        # v2.0 UI metrics table (if any have UI)
        tools_with_ui = [t for t in v2_tools if t['metrics'].get('has_ui', False)]
        if tools_with_ui:
            html += """
            <h3>UI Implementation Metrics <span class="badge badge-v2">Schema v2.0</span></h3>
            <div class="metric-explainer">
                <strong>UI-specific metrics:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                    <li><strong>Correctness:</strong> UI requirements compliance and functionality</li>
                    <li><strong>Integration:</strong> How well UI integrates with existing API</li>
                    <li><strong>UX Quality:</strong> Consumer experience and usability</li>
                    <li><strong>Backend Changes:</strong> Whether UI required backend modifications</li>
                </ul>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Tool</th>
                        <th>LLM Model</th>
                        <th>Time (min)</th>
                        <th>Correctness</th>
                        <th>Integration</th>
                        <th>UX Quality</th>
                        <th>Backend Changes</th>
                        <th>Overall Score</th>
                    </tr>
                </thead>
                <tbody>
            """
            
            for tool in tools_with_ui:
                ui = tool['metrics']['ui']
                backend_changes = '✓ Yes' if ui.get('backend_changes', False) else '✗ No'
                
                html += f"""
                    <tr>
                        <td><strong>{tool['name']}</strong></td>
                        <td>{ui.get('llm_model', 'Unknown')}</td>
                        <td>{ui.get('time', 'N/A')}</td>
                        <td class="score-cell {get_score_class(ui.get('correctness', 0))}">{ui.get('correctness', 'N/A')}</td>
                        <td class="score-cell {get_score_class(ui.get('integration', 0))}">{ui.get('integration', 'N/A')}</td>
                        <td class="score-cell {get_score_class(ui.get('ux_quality', 0))}">{ui.get('ux_quality', 'N/A')}</td>
                        <td>{backend_changes}</td>
                        <td class="score-cell {get_score_class(ui.get('overall', 0))}"><strong>{ui.get('overall', 'N/A')}</strong></td>
                    </tr>
                """
            
            html += """
                </tbody>
            </table>
            """
    
    # v1.0 legacy table
    if v1_tools:
        html += """
        <h3>Legacy Metrics <span class="badge badge-v1">Schema v1.0</span></h3>
        <table>
            <thead>
                <tr>
                    <th>Tool</th>
                    <th>API Time (min)</th>
                    <th>Total Time (min)</th>
                    <th>Correctness</th>
                    <th>Determinism</th>
                    <th>Effort</th>
                    <th>Overall Score</th>
                </tr>
            </thead>
            <tbody>
        """
        
        for tool in v1_tools:
            m = tool['metrics']
            html += f"""
                <tr>
                    <td><strong>{tool['name']}</strong></td>
                    <td>{m.get('api_time', 'N/A')}</td>
                    <td>{m.get('total_time', 'N/A')}</td>
                    <td class="score-cell {get_score_class(m.get('correctness', 0))}">{m.get('correctness', 'N/A')}</td>
                    <td class="score-cell {get_score_class(m.get('determinism', 0))}">{m.get('determinism', 'N/A')}</td>
                    <td class="score-cell {get_score_class(m.get('effort', 0))}">{m.get('effort', 'N/A')}</td>
                    <td class="score-cell {get_score_class(m.get('overall', 0))}"><strong>{m.get('overall', 'N/A')}</strong></td>
                </tr>
            """
        
        html += """
            </tbody>
        </table>
        """
    
    return html


def get_score_class(score) -> str:
    """Return CSS class based on score value."""
    if score == 'Unknown' or score == 'N/A':
        return ''
    
    try:
        score_val = float(score)
        if score_val >= 80:
            return 'score-high'
        elif score_val >= 60:
            return 'score-medium'
        else:
            return 'score-low'
    except (ValueError, TypeError):
        return ''


def generate_charts_html(tool_data: List[dict]) -> str:
    """Generate Chart.js visualizations."""
    
    # Prepare data for API timing chart
    v2_tools = [t for t in tool_data if t['schema_version'] == '2.0']
    
    if not v2_tools:
        return "<p>No data available for charts.</p>"
    
    tool_names = [t['name'] for t in v2_tools]
    api_times = [t['metrics']['api'].get('time', 0) if isinstance(t['metrics']['api'].get('time', 0), (int, float)) else 0 for t in v2_tools]
    ui_times = [t['metrics']['ui'].get('time', 0) if t['metrics'].get('has_ui') and isinstance(t['metrics']['ui'].get('time', 0), (int, float)) else 0 for t in v2_tools]
    
    # Prepare scores data
    correctness = [t['metrics']['api'].get('correctness', 0) if isinstance(t['metrics']['api'].get('correctness', 0), (int, float)) else 0 for t in v2_tools]
    determinism = [t['metrics']['api'].get('determinism', 0) if isinstance(t['metrics']['api'].get('determinism', 0), (int, float)) else 0 for t in v2_tools]
    effort = [t['metrics']['api'].get('effort', 0) if isinstance(t['metrics']['api'].get('effort', 0), (int, float)) else 0 for t in v2_tools]
    
    html = f"""
    <div class="chart-container">
        <canvas id="timingChart"></canvas>
    </div>
    
    <div class="chart-container">
        <canvas id="qualityChart"></canvas>
    </div>
    
    <script>
        // Timing comparison chart
        new Chart(document.getElementById('timingChart'), {{
            type: 'bar',
            data: {{
                labels: {json.dumps(tool_names)},
                datasets: [
                    {{
                        label: 'API Generation Time (minutes)',
                        data: {json.dumps(api_times)},
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 1
                    }},
                    {{
                        label: 'UI Generation Time (minutes)',
                        data: {json.dumps(ui_times)},
                        backgroundColor: 'rgba(118, 75, 162, 0.8)',
                        borderColor: 'rgba(118, 75, 162, 1)',
                        borderWidth: 1
                    }}
                ]
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{
                    title: {{
                        display: true,
                        text: 'Generation Time Comparison',
                        font: {{ size: 16 }}
                    }},
                    legend: {{
                        position: 'top'
                    }}
                }},
                scales: {{
                    y: {{
                        beginAtZero: true,
                        title: {{
                            display: true,
                            text: 'Minutes'
                        }}
                    }}
                }}
            }}
        }});
        
        // Quality metrics radar chart
        new Chart(document.getElementById('qualityChart'), {{
            type: 'radar',
            data: {{
                labels: ['Correctness', 'Determinism', 'Effort'],
                datasets: {json.dumps([
                    {
                        'label': tool['name'],
                        'data': [
                            tool['metrics']['api'].get('correctness', 0) if isinstance(tool['metrics']['api'].get('correctness', 0), (int, float)) else 0,
                            tool['metrics']['api'].get('determinism', 0) if isinstance(tool['metrics']['api'].get('determinism', 0), (int, float)) else 0,
                            tool['metrics']['api'].get('effort', 0) if isinstance(tool['metrics']['api'].get('effort', 0), (int, float)) else 0
                        ],
                        'backgroundColor': f'rgba({(i * 50) % 255}, {(i * 80) % 255}, {(i * 120) % 255}, 0.2)',
                        'borderColor': f'rgba({(i * 50) % 255}, {(i * 80) % 255}, {(i * 120) % 255}, 1)',
                        'borderWidth': 2
                    }
                    for i, tool in enumerate(v2_tools)
                ])}
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{
                    title: {{
                        display: true,
                        text: 'Quality Metrics Comparison',
                        font: {{ size: 16 }}
                    }}
                }},
                scales: {{
                    r: {{
                        beginAtZero: true,
                        max: 100
                    }}
                }}
            }}
        }});
    </script>
    """
    
    return html


def main():
    parser = argparse.ArgumentParser(description='Enhanced benchmark results aggregation (v2.0)')
    parser.add_argument('--input-dir', default='results/submitted', help='Input directory')
    parser.add_argument('--output-dir', default='results/compiled', help='Output directory')
    
    args = parser.parse_args()
    
    # Resolve paths
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    input_dir = repo_root / args.input_dir
    output_dir = repo_root / args.output_dir
    
    if not input_dir.exists():
        print(f"Error: Input directory does not exist: {input_dir}", file=sys.stderr)
        sys.exit(1)
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Find all result files
    result_files = list(input_dir.glob('*.json'))
    
    if not result_files:
        print(f"No result files found in {input_dir}", file=sys.stderr)
        sys.exit(0)
    
    print(f"Found {len(result_files)} result file(s)")
    
    # Parse results
    results = []
    for result_file in result_files:
        result = parse_result_file(result_file)
        if result:
            results.append(result)
    
    if not results:
        print("No valid results to aggregate", file=sys.stderr)
        sys.exit(0)
    
    # Group results by (spec_version, model, api_type)
    grouped = defaultdict(list)
    for result in results:
        ri = result['result_data']['run_identity']
        key = (ri['spec_reference'], ri['target_model'], ri['api_style'])
        grouped[key].append(result)
    
    # Generate HTML reports
    for group_key, group_results in grouped.items():
        generate_html_report(group_key, group_results, output_dir)
    
    print(f"\n✓ Enhanced reports generated in: {output_dir}")
    print("  Open the .html files in your browser for interactive visualizations")


if __name__ == '__main__':
    main()

