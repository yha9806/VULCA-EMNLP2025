# Project Context

## Purpose

**VULCA** (Vision-Understanding and Language-based Cultural Adaptability) is a comprehensive evaluation framework for assessing Multimodal Large Language Models' (MLLMs) cultural understanding through Chinese art critique.

**Goals:**
- Evaluate how well MLLMs can understand and critique art from diverse cultural perspectives
- Generate critiques through 8 distinct cultural critic personas (historical figures and diverse perspectives)
- Apply semantic analysis to assess persona adherence and critique quality
- Enable reproducible, configuration-driven evaluation of vision-language models
- Demonstrate the importance of cultural context in AI evaluation frameworks

**Target Audience:** AI researchers, MLLM developers, evaluators interested in cultural understanding in AI systems

**Publication Venue:** EMNLP 2025 (Camera-ready submission), Suzhou, China

## Tech Stack

### Core Deep Learning & NLP
- **PyTorch** (>=2.0.0) - Deep learning framework
- **Transformers** (>=4.35.0) - Transformer model utilities and abstractions
- **vLLM** (>=0.2.0) - Open-source LLM inference engine with optimized serving
- **sentence-transformers** (>=2.2.0) - Semantic embedding models (BAAI/bge-large-zh-v1.5)

### Primary Models
- **Qwen2.5-VL-7B-Instruct** (default) - 7B parameter vision-language model, optimized for Chinese
- **Llama 4 Scout 17B 16E** - Alternative large model option
- **Gemini 2.5 Pro** - Cloud-based model option (API-integrated)

### Image Processing & Computer Vision
- **OpenCV-Python** (>=4.8.0) - Image manipulation and filtering
- **scikit-image** (>=0.21.0) - Image processing algorithms (saliency, edge detection)
- **Pillow** (>=10.0.0) - Python Imaging Library for image I/O

### Data Processing & Visualization
- **pandas** (>=2.0.0) - Data manipulation and analysis
- **numpy** (>=1.24.0) - Numerical computing
- **scipy** (>=1.10.0) - Scientific computing (EMD distance calculations)
- **matplotlib** (>=3.7.0) - 2D visualization
- **seaborn** (>=0.12.0) - Statistical data visualization

### Configuration & Utilities
- **PyYAML** - YAML configuration parsing
- **python-dotenv** (>=1.0.0) - Environment variable management
- **requests** (>=2.31.0) - HTTP library for API calls
- **tqdm** (>=4.65.0) - Progress bar utilities

### Development Tools
- **OpenSpec** - Specification-driven development framework (integrated in `/openspec` directory)

## Project Conventions

### Code Style

**Python Code Style:**
- **Naming Convention:** snake_case for functions, variables, and module names
- **Bilingual Naming:** Use English for technical code; Chinese + English romanization for domain-specific elements (e.g., persona names like `Su_Shi.md`)
- **Docstrings:** All classes and public functions include docstrings explaining purpose, parameters, and return values
- **Type Hints:** Used where applicable for clarity
- **Line Length:** Target ~100 characters
- **Imports:** Organized as (1) builtins, (2) third-party, (3) local imports

**Configuration Files:**
- **YAML Format** - For model configurations and hyperparameters
- **JSON Format** - For structured data (knowledge base, results)
- **Configuration Location** - `configs/` directory with clear naming

**Persona & Knowledge Files:**
- **Markdown Format** - Human-readable persona definitions in `data/personas/`
- **Structure:** Basic info → Key influences → Analytical style → Numeric attributes → Expression style → Sample phrases
- **Naming:** `FirstName_LastName.md` format with bilingual support

**Documentation:**
- **README.md** - Project overview, installation, usage
- **Inline Comments** - Used for complex logic and non-obvious algorithm decisions
- **Method Documentation** - Each method includes purpose and usage context

### Architecture Patterns

1. **Facade Pattern** (vulca.py)
   - Main `VULCA` class provides unified, simplified interface to complex subsystems
   - Abstracts configuration loading, persona management, knowledge base access
   - Goal: Hide complexity from users while maintaining separation of concerns

2. **Configuration-Driven Design**
   - All model parameters, hyperparameters, and experiment settings in YAML/JSON
   - Decouples code from configuration for easy experimentation
   - Supports multiple model configurations (Qwen, Llama, Gemini)
   - Enables reproducibility and easy parameter tuning

3. **Modular Pipeline Architecture**
   - **Preprocessing** → **Evaluation** → **Analysis** → **Reporting**
   - Each module is independently testable and reusable
   - Pipeline orchestration in `pipeline.py`
   - Each step can be invoked separately or as part of the full pipeline

4. **API Abstraction Layer** (model.py)
   - Abstract `MLLMInterface` base class
   - Specific implementations for different MLLM providers
   - vLLM server management and health checking
   - Enables easy addition of new model providers

5. **Data-Centric Design**
   - Personas defined as structured documents (not hardcoded)
   - Knowledge base as queryable JSON structure
   - Configuration files as single source of truth for experiment parameters
   - Flexible, non-invasive way to add new personas or knowledge

6. **Semantic Embedding & Analysis**
   - Dedicated `SemanticAnalyzer` class for critique comparison
   - Uses fixed embedding model (BAAI/bge-large-zh-v1.5) for consistency
   - Metrics: cosine similarity, Earth Mover's Distance, profile alignment scores

### Testing Strategy

**Testing Approach:**
- **Configuration-Driven Testing** - Leverage YAML/JSON configs to define test scenarios
- **Scenario-Based Testing:**
  - Single image evaluation with one persona
  - Batch processing of multiple images with all personas
  - Multi-persona comparative analysis (similarity metrics)
  - Full pipeline end-to-end execution

**Validation Metrics:**
- **Semantic Similarity:** Target ≥0.78 (cosine similarity)
- **Profile Accuracy:** Target ≥0.82 (persona adherence)
- **EMD Distance:** Target ≤0.23 (critique distribution difference)

**Best Configuration Tracking:**
- `configs/best_config.json` documents optimal settings and achieved metrics
- Historical performance tracking for regression detection
- Per-persona performance analysis (Guo Xi and Su Shi show strongest performance)

**Testing Execution:**
- `experiments/run_evaluation.py` - CLI for single/batch testing
- `experiments/run_full_pipeline.sh` - Complete pipeline validation
- Batch evaluation mode processes multiple images in parallel (batch_size=16)

### Git Workflow

**Branching Strategy:**
- **master** - Production-ready, release branch
- **feature branches** - For new capabilities (e.g., new models, new personas)
- Follows OpenSpec specification-driven development workflow

**Commit Conventions:**
- **Format:** Clear, descriptive commit messages in English
- **Scope:** Each commit should represent a logical, coherent change
- **Initial Setup:** Single comprehensive initial commit with full framework
- **Future Changes:** Use OpenSpec change proposals for significant modifications

**OpenSpec Integration:**
- Specification-driven development through `/openspec/AGENTS.md`
- Change proposals documented in `/openspec/changes/`
- Capability specifications in `/openspec/specs/`

## Domain Context

### Art Critique & Cultural Understanding

**Core Domain:**
- **Chinese Landscape Painting** - Traditional art form with distinct aesthetic principles
- **Historical Perspectives** - Different eras (Northern Song, Qing Dynasty) have different approaches
- **Cultural Perspectives** - 8 distinct cultural critic personas bring diverse interpretative frameworks

**8 Cultural Critic Personas:**

| Persona | Era/Region | Focus | Approach |
|---------|-----------|-------|----------|
| 苏轼 (Su Shi) | Northern Song (1037-1101) | Literati painting philosophy | Aesthetic idealism, personal expression |
| 郭熙 (Guo Xi) | Northern Song | Landscape painting techniques | Formal compositional analysis |
| 约翰·罗斯金 (John Ruskin) | Victorian England | Moral aesthetics | Nature observation, social responsibility |
| 冈仓天心 (Okakura Kakuzo) | Meiji Japan | Pan-Asian art philosophy | Cross-cultural synthesis |
| 阿里斯·索恩博士 (Dr. Aris Thorne) | Contemporary | Digital art criticism | Technology and visual futures |
| 佐拉妈妈 (Mama Zola) | Contemporary African | Community-centered interpretation | Collective meaning-making, oral traditions |
| 埃琳娜·佩特洛娃教授 (Professor Elena Petrova) | Contemporary Russian | Formalist analysis | Structure and visual elements |
| 托马斯修士 (Brother Thomas) | Byzantine | Theological perspective | Spiritual symbolism and sacred art |

**Knowledge Base:**
- **Chinese Landscape Painting** - Aesthetics, techniques, historical development
- **Qing Court Painting** - Imperial context, style characteristics, artists
- **Giuseppe Castiglione (Lang Shining)** - Sino-European artistic synthesis
- **Twelve Months Series** - Thematic cycles and artistic significance

### Multimodal Large Language Models (MLLMs)

- Models capable of understanding both images and text
- Evaluated on their ability to generate culturally-informed art critiques
- Key challenge: Can MLLMs understand cultural nuances and perspectives they weren't explicitly trained on?
- Focus on evaluating depth of understanding, not just descriptive accuracy

### Evaluation Methodology

- **Adaptive Image Preprocessing** - Extract salient image patches using saliency-based sliding windows
- **Persona-Based Generation** - Use different cultural critic personas as evaluation lenses
- **Semantic Analysis** - Compare generated critiques using embedding-based metrics
- **Profile Alignment** - Measure how well critiques match expected persona characteristics

## Important Constraints

### Technical Constraints

1. **GPU Requirements**
   - Minimum: 16GB GPU memory
   - CUDA 11.8+ for GPU acceleration
   - Recommended: NVIDIA A100 or H100 for vLLM inference

2. **Python Version**
   - Python 3.8 or higher
   - Python 3.10+ recommended for best compatibility

3. **Memory & Storage**
   - Typical model weights: 7-17GB (depending on model)
   - Preprocessing generates multiple image patches (disk space varies by dataset size)
   - Knowledge base size: ~9KB (minimal)

4. **Network/Server Requirements**
   - vLLM inference server must be running at `localhost:8000` (configurable)
   - HTTP connectivity required for API-based models (Gemini)
   - Estimated GPU memory: 16GB for Qwen2.5-VL-7B

### Operational Constraints

1. **Model Availability**
   - Qwen2.5-VL requires local deployment or vLLM server
   - Gemini API requires valid authentication credentials
   - Model selection affects inference speed and quality

2. **Persona Limitations**
   - Currently supports 8 predefined personas
   - Adding new personas requires markdown file creation and configuration updates
   - Personas designed for art critique (may not generalize to other domains)

3. **Image Format Support**
   - Currently supports: JPEG, PNG, BMP, TIFF
   - Images encoded as base64 for API transmission
   - Base64 encoding overhead ~33% size increase

### Business/Research Constraints

1. **Publication Constraints**
   - EMNLP 2025 camera-ready submission deadline
   - Maintains academic rigor and reproducibility standards
   - Results must be generalizable to MLLMs beyond test models

2. **Evaluation Scope**
   - Focuses on visual art critique (primarily paintings)
   - Emphasizes cultural understanding, not technical accuracy
   - Limited to evaluation framework (not model training/fine-tuning)

## External Dependencies

### Inference Engines & Model Serving

1. **vLLM** - Local model inference
   - Provides OpenAI-compatible API endpoints
   - Serves Qwen2.5-VL and Llama models locally
   - Default endpoint: `http://localhost:8000/v1/chat/completions`
   - Health check endpoint: `http://localhost:8000/health`

2. **HuggingFace Model Hub**
   - Source for model weights and tokenizers
   - Requires HF token for gated models
   - Internet connectivity for model downloads

### Embedding Models

1. **BAAI/bge-large-zh-v1.5** (Sentence Transformers)
   - Specifically optimized for Chinese text
   - 1024-dimensional embeddings
   - Used for semantic similarity analysis
   - Downloaded on first use via transformers library

### External APIs

1. **Google Gemini API** (Optional)
   - Cloud-based alternative model
   - Requires authentication credentials
   - Rate limiting applies (depends on usage tier)
   - Configuration: `configs/model_config.yaml`

### Data Sources

1. **Persona Knowledge Files** - Internal (data/personas/)
2. **Knowledge Base** - Internal JSON structure (data/knowledge/knowledge_base.json)
3. **Test Images** - User-provided or dataset-specific

### Python Package Ecosystem

- PyPI for all Python dependencies
- Specific versions pinned in requirements.txt for reproducibility
- No offline operation mode (requires internet for model downloads)
