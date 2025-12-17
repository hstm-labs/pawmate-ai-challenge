# Canned Benchmark Profiles

This folder contains **pre-defined profiles** for the four supported benchmark configurations.

## Available profiles

| Profile file              | Target Model | API Style |
|---------------------------|--------------|-----------|
| `model-a-rest.profile`    | Model A      | REST      |
| `model-a-graphql.profile` | Model A      | GraphQL   |
| `model-b-rest.profile`    | Model B      | REST      |
| `model-b-graphql.profile` | Model B      | GraphQL   |

The contract artifact type is determined by API style: REST → OpenAPI, GraphQL → GraphQL schema.

## Usage

Pass the profile name (without `.profile` extension) to the renderer:

```bash
./scripts/initialize_run.sh --profile model-a-rest --tool "YourTool" --tool-ver "1.0"
```

## Profile format

Each `.profile` file is a simple key=value file:

```
model=A
api_type=REST
```

The renderer reads these values and uses them to:
1. Pre-select the correct checkboxes in the prompt wrapper
2. Populate the `run.config` in the generated run folder

