# VULCA-EMNLP2025

Implementation of "VULCA: A Comprehensive Evaluation Framework for Assessing Multimodal Large Language Models' Cultural Understanding through Chinese Art Critique" (EMNLP 2025).

## Requirements

- Python 3.8+
- CUDA 11.8+
- 16GB+ GPU memory

## Installation

```bash
git clone https://github.com/[username]/VULCA-EMNLP2025.git
cd VULCA-EMNLP2025
pip install -r requirements.txt
```

## Usage

### Quick Evaluation

```python
from src.vulca import VULCA

# Initialize framework
evaluator = VULCA("configs/model_config.yaml")

# Evaluate with specific persona
result = evaluator.evaluate_with_persona("path/to/image.jpg", "Su_Shi")

# Get critique
print(result['critique'])
```

### Full Pipeline

```bash
cd experiments
bash run_full_pipeline.sh /path/to/images /path/to/output
```

### Available Personas

- **Su Shi (苏轼)**: Northern Song Dynasty literati painter perspective
- **Guo Xi (郭熙)**: Imperial court landscape painter analysis
- **John Ruskin**: Victorian art critic with moral aesthetic views
- **Okakura Kakuzo (冈仓天心)**: Pan-Asian art philosophy
- **Dr. Aris Thorne**: Future-oriented digital art criticism
- **Mama Zola**: African community-centered art interpretation
- **Professor Elena Petrova**: Russian Formalist structural analysis
- **Brother Thomas**: Byzantine theological art perspective

## Data

- **Personas**: 8 cultural critic personas in `data/personas/`
- **Knowledge Base**: Domain knowledge in `data/knowledge/knowledge_base.json`
- **Test Images**: Download from [Link to dataset]

## Model Setup

The framework uses Qwen2.5-VL-7B-Instruct by default. Start the vLLM server:

```bash
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-VL-7B-Instruct \
    --port 8000
```

## Project Structure

```
├── src/                 # Core implementation
│   ├── vulca.py        # Main framework
│   ├── evaluate.py     # MLLM evaluation
│   ├── preprocess.py   # Image preprocessing
│   └── analyze.py      # Semantic analysis
├── data/               # Personas and knowledge
├── configs/            # Configuration files
├── experiments/        # Evaluation scripts
└── requirements.txt    # Dependencies
```

## Citation

```bibtex
@inproceedings{vulca2025emnlp,
  title={VULCA: A Comprehensive Evaluation Framework for Assessing Multimodal Large Language Models' Cultural Understanding through Chinese Art Critique},
  author={[Authors]},
  booktitle={Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing},
  year={2025},
  address={Suzhou, China}
}
```

## License

MIT License - see LICENSE file for details.

## Contact

- GitHub Issues: [https://github.com/[username]/VULCA-EMNLP2025/issues]
- Email: [contact email]