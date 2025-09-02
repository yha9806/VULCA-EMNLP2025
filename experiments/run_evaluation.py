#!/usr/bin/env python
"""
VULCA Evaluation Script
Run MLLM evaluation with cultural personas on Chinese paintings
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import argparse
from pathlib import Path
from src.vulca import VULCA
from src.utils import load_config

def main():
    parser = argparse.ArgumentParser(description='Run VULCA evaluation')
    parser.add_argument('--image', type=str, required=True, help='Path to image file')
    parser.add_argument('--persona', type=str, default='all', 
                        help='Persona name or "all" for all personas')
    parser.add_argument('--config', type=str, default='configs/model_config.yaml',
                        help='Path to configuration file')
    parser.add_argument('--output', type=str, default='results/',
                        help='Output directory for results')
    
    args = parser.parse_args()
    
    # Initialize VULCA framework
    print(f"Loading VULCA framework with config: {args.config}")
    evaluator = VULCA(args.config)
    
    # Get list of personas
    if args.persona == 'all':
        personas = [
            'Su_Shi', 'Guo_Xi', 'John_Ruskin', 'Okakura_Kakuzo',
            'Dr_Aris_Thorne', 'Mama_Zola', 'Professor_Elena_Petrova', 'Brother_Thomas'
        ]
    else:
        personas = [args.persona]
    
    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Run evaluation for each persona
    results = {}
    for persona in personas:
        print(f"\nEvaluating with persona: {persona}")
        try:
            result = evaluator.evaluate_with_persona(args.image, persona)
            results[persona] = result
            
            # Save individual result
            output_file = output_dir / f"{Path(args.image).stem}_{persona}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                import json
                json.dump(result, f, ensure_ascii=False, indent=2)
            
            print(f"  ✓ Result saved to {output_file}")
        except Exception as e:
            print(f"  ✗ Error: {e}")
            results[persona] = {"error": str(e)}
    
    # Save combined results
    combined_file = output_dir / f"{Path(args.image).stem}_all_personas.json"
    with open(combined_file, 'w', encoding='utf-8') as f:
        import json
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ All results saved to {combined_file}")
    
    # Display summary
    print("\n" + "="*50)
    print("EVALUATION SUMMARY")
    print("="*50)
    for persona, result in results.items():
        if "error" not in result:
            print(f"{persona}: Success")
        else:
            print(f"{persona}: Failed - {result['error']}")

if __name__ == "__main__":
    main()