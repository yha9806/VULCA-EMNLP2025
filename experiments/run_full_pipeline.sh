#!/bin/bash

# VULCA Full Pipeline Execution Script
# This script runs the complete evaluation pipeline for EMNLP 2025 experiments

echo "=================================================="
echo "VULCA EVALUATION PIPELINE - EMNLP 2025"
echo "=================================================="
echo ""

# Configuration
IMAGE_DIR="${1:-../data/test_images}"
OUTPUT_DIR="${2:-../results}"
CONFIG_FILE="${3:-../configs/model_config.yaml}"

# Check if vLLM server is running
echo "Checking vLLM server status..."
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo "⚠️  Warning: vLLM server is not running on port 8000"
    echo "Please start the server with: python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-VL-7B-Instruct"
    exit 1
fi
echo "✓ vLLM server is running"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to run evaluation on a single image
run_single_evaluation() {
    local image_path="$1"
    local image_name=$(basename "$image_path" .png)
    
    echo "Processing: $image_name"
    python run_evaluation.py \
        --image "$image_path" \
        --persona all \
        --config "$CONFIG_FILE" \
        --output "$OUTPUT_DIR/$image_name"
    
    if [ $? -eq 0 ]; then
        echo "✓ Completed: $image_name"
    else
        echo "✗ Failed: $image_name"
    fi
    echo "----------------------------------------"
}

# Main execution
echo "Starting evaluation pipeline..."
echo "Image directory: $IMAGE_DIR"
echo "Output directory: $OUTPUT_DIR"
echo "Configuration: $CONFIG_FILE"
echo ""

# Check if image directory exists
if [ ! -d "$IMAGE_DIR" ]; then
    echo "Error: Image directory not found: $IMAGE_DIR"
    echo "Creating sample directory..."
    mkdir -p "$IMAGE_DIR"
    echo "Please add test images to: $IMAGE_DIR"
    exit 1
fi

# Process all images in the directory
image_count=0
for image_file in "$IMAGE_DIR"/*.{png,jpg,jpeg}; do
    if [ -f "$image_file" ]; then
        run_single_evaluation "$image_file"
        ((image_count++))
    fi
done

if [ $image_count -eq 0 ]; then
    echo "No images found in $IMAGE_DIR"
    echo "Please add .png, .jpg, or .jpeg files to process"
    exit 1
fi

# Generate summary report
echo ""
echo "=================================================="
echo "PIPELINE COMPLETE"
echo "=================================================="
echo "Processed $image_count images"
echo "Results saved to: $OUTPUT_DIR"
echo ""

# Run analysis if available
if [ -f "../src/analyze.py" ]; then
    echo "Running semantic analysis..."
    python -c "
import sys
sys.path.append('..')
from src.analyze import analyze_critiques
import json
import glob

# Load all results
results = []
for file in glob.glob('$OUTPUT_DIR/*_all_personas.json'):
    with open(file, 'r', encoding='utf-8') as f:
        results.append(json.load(f))

if results:
    analysis = analyze_critiques(results)
    with open('$OUTPUT_DIR/analysis_summary.json', 'w', encoding='utf-8') as f:
        json.dump(analysis, f, ensure_ascii=False, indent=2)
    print('✓ Analysis complete: $OUTPUT_DIR/analysis_summary.json')
else:
    print('No results to analyze')
"
fi

echo ""
echo "Pipeline execution finished at: $(date)"