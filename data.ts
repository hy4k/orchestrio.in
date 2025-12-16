import { Prompt, Category, Platform } from './types';

export const PROMPT_DATA: Prompt[] = [
  {
    id: '1',
    title: 'React Component Generator',
    description: 'Generates a production-ready React component with Tailwind CSS.',
    category: Category.CODING,
    tags: [Platform.GEMINI, Platform.OPENAI, Platform.ANTHROPIC],
    likes: 342,
    content: `You are an expert Senior React Engineer.
    
Task: Create a reusable React functional component for a [Component Name].

Context: The project uses TypeScript, Tailwind CSS for styling, and Lucide React for icons. The codebase follows modern best practices including functional components and hooks.

Restrictions:
- Do not use class components.
- Do not use inline styles, use Tailwind classes.
- Do not use any third-party libraries besides Lucide React unless specified.
- Ensure all props are typed.

Output: Provide the full .tsx file content including imports.

Style: Clean, readable, and production-ready code.`,
    rtcros: {
      role: "Expert Senior React Engineer",
      task: "Create a reusable React functional component",
      context: "TypeScript, Tailwind CSS, Lucide React icons project",
      restrictions: "No class components, no inline styles, strictly typed",
      output: "Full .tsx file content",
      style: "Clean, readable, production-ready"
    }
  },
  {
    id: 'gemini-code-1',
    title: 'Gemini Python Data Analyzer',
    description: 'Optimized for Gemini 1.5 Pro to generate efficient pandas data analysis scripts.',
    category: Category.CODING,
    tags: [Platform.GEMINI],
    likes: 156,
    content: `Role: Senior Data Scientist specializing in Python and Pandas.

Task: Write a Python script to analyze a CSV dataset named 'data.csv'. The script should clean missing values, calculate the correlation matrix, and plot the distribution of the 'target' column.

Context: Large dataset with potential noisy data. Using Python 3.9+, Pandas, and Matplotlib/Seaborn.

Restrictions:
- Use vectorization where possible (avoid loops).
- Add docstrings to all functions.
- Handle potential FileNotFoundError.

Output: A single executable Python code block.

Style: PEP 8 compliant, efficient, and well-commented.`,
    rtcros: {
      role: "Senior Data Scientist",
      task: "Analyze CSV dataset with Pandas",
      context: "Large dataset, Python 3.9+, Matplotlib",
      restrictions: "Vectorization only, docstrings required, error handling",
      output: "Executable Python code block",
      style: "PEP 8 compliant, efficient"
    },
    parameters: {
      temperature: 0.2,
      maxTokens: 2048,
      model: "gemini-1.5-pro-latest"
    }
  },
  {
    id: 'anthropic-write-1',
    title: 'Claude Sci-Fi World Builder',
    description: 'Leverages Anthropic\'s large context window for detailed creative writing and lore generation.',
    category: Category.WRITING,
    tags: [Platform.ANTHROPIC],
    likes: 289,
    content: `Role: Hugo Award-winning Science Fiction Author.

Task: Create a detailed lore entry for a fictional planet named "Xylos Prime". Include details about its geography, atmospheric conditions, dominant species, and a unique technological advancement.

Context: The setting is a hard sci-fi universe (physics-compliant) in the year 3050.

Restrictions:
- Avoid faster-than-light travel tropes.
- Focus on sociological impacts of their technology.
- No magic or supernatural elements.

Output: A markdown formatted encyclopedia entry.

Style: Descriptive, immersive, and sociologically analytical.`,
    rtcros: {
      role: "Sci-Fi Author",
      task: "Create lore for Xylos Prime",
      context: "Hard sci-fi universe, year 3050",
      restrictions: "No FTL tropes, no magic, focus on sociology",
      output: "Markdown encyclopedia entry",
      style: "Descriptive, immersive"
    },
    parameters: {
      temperature: 0.8,
      model: "claude-3-opus",
      topP: 0.9
    }
  },
  {
    id: 'leonardo-img-1',
    title: 'Leonardo.ai Character Portrait',
    description: 'Specific prompt structure for Leonardo.ai with negative prompts for high-fidelity character generation.',
    category: Category.IMAGE,
    tags: [Platform.LEONARDO],
    likes: 412,
    content: `A highly detailed cinematic portrait of a rogue cyberpunk hacker, neon dreadlocks, glowing cybernetic eye, rainy neo-tokyo street background, bokeh effect, volumetric lighting, 8k resolution, unreal engine 5 render style, sharp focus, intricate mechanical details.`,
    rtcros: {
      role: "Digital Artist",
      task: "Generate character portrait",
      context: "Cyberpunk aesthetic, Neo-Tokyo",
      restrictions: "High fidelity, cinematic lighting",
      output: "Image prompt string",
      style: "8k, Unreal Engine 5, Volumetric"
    },
    parameters: {
      negativePrompt: "blurry, low quality, distorted face, extra fingers, mutated hands, watermark, text, signature, bad anatomy, lowres, ugly",
      aspectRatio: "9:16",
      guidanceScale: 7.5,
      model: "Leonardo Diffusion XL"
    }
  },
  {
    id: '2',
    title: 'Cinematic Video Scene',
    description: 'Detailed prompt for generating cinematic video scenes with Veo or Sora.',
    category: Category.VIDEO,
    tags: [Platform.VEO, Platform.GEMINI],
    likes: 128,
    content: `Role: Professional Cinematographer and Director.

Task: Describe a highly detailed, cinematic video shot for an AI video generation model.

Context: Creating a sci-fi atmosphere for a movie trailer.
Subject: A cyberpunk street food vendor cooking under neon rain.

Restrictions:
- No text overlays.
- Keep the camera movement steady and fluid.
- Avoid distortions in human faces.

Output: A single paragraph descriptive prompt focusing on lighting, camera angle, and movement.

Style: Visual, descriptive, evocative, 4k resolution keywords.`,
    rtcros: {
      role: "Professional Cinematographer",
      task: "Describe a cinematic video shot",
      context: "Sci-fi atmosphere, cyberpunk street vendor",
      restrictions: "No text, steady camera, no distortion",
      output: "Single paragraph descriptive prompt",
      style: "Visual, evocative, 4k resolution"
    }
  },
  {
    id: '3',
    title: 'Complex Concept Simplifier',
    description: 'Explains difficult topics effectively for different learning levels.',
    category: Category.STUDIES,
    tags: [Platform.GEMINI, Platform.OPENAI],
    likes: 895,
    content: `Role: Expert Educator and Science Communicator.

Task: Explain the concept of [Topic, e.g., Quantum Entanglement].

Context: The audience is a [Target Audience, e.g., High School Student]. They have basic knowledge of physics but no advanced math skills.

Restrictions:
- Do not use jargon without defining it immediately.
- Use an analogy to explain the core mechanism.
- Keep the explanation under 300 words.

Output: A structured explanation with an Analogy section and a Key Takeaway section.

Style: Engaging, clear, and encouraging.`,
    rtcros: {
      role: "Expert Educator",
      task: "Explain a complex concept",
      context: "Target audience with specific knowledge level",
      restrictions: "No undefined jargon, use analogies, word limit",
      output: "Structured explanation with Analogy and Takeaways",
      style: "Engaging, clear, encouraging"
    }
  },
  {
    id: '4',
    title: 'Photorealistic Portrait',
    description: 'Optimized for high-fidelity image generation models.',
    category: Category.IMAGE,
    tags: [Platform.MIDJOURNEY, Platform.GEMINI],
    likes: 567,
    content: `Role: Award-winning Portrait Photographer.

Task: Generate a prompt for a photorealistic portrait.

Context: Studio setting, soft lighting.
Subject: An elderly fisherman with a weathered face, wearing a yellow raincoat.

Restrictions:
- Avoid cartoonish or 3D render styles.
- Ensure eyes are symmetrical and focused.

Output: A comma-separated list of keywords and descriptive phrases.

Style: 85mm lens, f/1.8, bokeh, dramatic lighting, high texture.`,
    rtcros: {
      role: "Portrait Photographer",
      task: "Generate photorealistic portrait prompt",
      context: "Studio setting, elderly fisherman",
      restrictions: "No cartoon style, symmetrical eyes",
      output: "Comma-separated keywords",
      style: "Technical photography terms (85mm, bokeh)"
    }
  },
  {
    id: '5',
    title: 'Unit Test Writer',
    description: 'Automatically generates comprehensive unit tests for code.',
    category: Category.CODING,
    tags: [Platform.OPENAI, Platform.ANTHROPIC],
    likes: 210,
    content: `Role: QA Automation Engineer.

Task: Write unit tests for the provided function.

Context: Using Jest and React Testing Library. The code to test is [Insert Code Here].

Restrictions:
- Must cover edge cases (null, empty inputs).
- Must achieve at least 90% coverage.
- Mock all external API calls.

Output: A complete test file.

Style: Robust, isolated, and self-documenting.`,
    rtcros: {
      role: "QA Automation Engineer",
      task: "Write unit tests",
      context: "Jest, React Testing Library",
      restrictions: "Cover edge cases, 90% coverage, mock APIs",
      output: "Complete test file",
      style: "Robust, isolated"
    }
  },
  {
    id: '6',
    title: 'Marketing Email Sequence',
    description: 'Creates a converting email drip campaign.',
    category: Category.MARKETING,
    tags: [Platform.GEMINI, Platform.ANTHROPIC],
    likes: 150,
    content: `Role: Senior Copywriter.

Task: Write a 3-email sequence for a new SaaS product launch.

Context: The product is a time-tracking tool for freelancers. The goal is to convert free trial users to paid subscribers.

Restrictions:
- Subject lines must be under 50 characters.
- No spammy keywords (e.g., "Buy now", "Free money").
- Focus on benefits, not features.

Output: Three emails (Subject, Body, CTA).

Style: Persuasive, empathetic, urgent but polite.`,
    rtcros: {
      role: "Senior Copywriter",
      task: "Write 3-email sequence",
      context: "SaaS launch, converting trial users",
      restrictions: "Short subject lines, no spam words, benefit-focused",
      output: "3 structured emails",
      style: "Persuasive, empathetic"
    }
  }
];