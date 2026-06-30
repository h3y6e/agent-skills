---
description: Leverages BigQuery's built-in machine learning and GenAI capabilities for advanced data analytics. Use when you need to write SQL queries that perform time-series forecasting, detect outliers, find key drivers, or leverage generative AI capabilities in BigQuery.
metadata:
    category: AiAndMachineLearning
    github-path: skills/cloud/bigquery-ai-ml
    github-ref: refs/heads/main
    github-repo: https://github.com/google/skills
    github-tree-sha: 68d2b69b904ea378673374c2b6a5bbae7e57a74e
name: bigquery-ai-ml
---
# BigQuery AI & ML

BigQuery integrates with Vertex AI to provide powerful machine learning and
generative AI capabilities directly within SQL queries using built-in functions
like `AI.FORECAST`, `AI.KEY_DRIVERS`, `AI.DETECT_ANOMALIES`, and `AI.GENERATE`.

## Reference Directory

-   [AI Forecast](references/ai_forecast.md): Leveraging pre-trained
    TimesFM model for forecasting without custom training.

-   [AI Detect Anomalies](references/ai_detect_anomalies.md): Identify
    deviations in time series data using pre-trained TimesFM model.

-   [AI Generate](references/ai_generate.md): General-purpose text and
    content generation using Gemini models.

-   [AI Key Drivers](references/ai_key_drivers.md): Automatically identify
    dimensional segments most responsible for driving changes in a metric.

## Related Skills

- [BigQuery Basics Skill](../bigquery-basics):
  SKILL.md file for core BigQuery concepts, resource management, CLI,
  and client libraries.
