# AI Image Generator - Free Workaround Tool

**A realistic, unrestricted image generation tool** - Your free workaround for creating diverse AI images without restrictions.

This React-based app leverages **30+ Pollinations.ai models** to generate maximum creative variety from a single prompt. Perfect for artists, creators, and anyone wanting diverse AI-generated content without platform limitations.

⚠️ **Realistic Expectations**: Results vary by model. Some images may not match expectations due to AI limitations, but the variety gives you more options to choose from.

## What to Expect

### ✅ **What Works Well:**
- Diverse image generation from the same prompt
- Different artistic styles from various AI models
- Creative exploration and experimentation
- Fast generation (typically 10-30 seconds per image)

### ⚠️ **Realistic Limitations:**
- **Quality varies** - Some models produce better results than others
- **Inconsistent results** - Same prompt can give very different outputs
- **No guaranteed perfection** - AI has limitations and biases
- **Rate limiting** - Free API may limit requests during peak times
- **Server issues** - Pollinations.ai may be temporarily unavailable

### 🎯 **Best Use Cases:**
- Creative brainstorming and ideation
- Getting multiple perspectives on the same concept
- Finding unexpected artistic interpretations
- Rapid prototyping of visual ideas
- Educational exploration of AI image generation

## Features

*   **Text-to-Image Generation:** Generate images from descriptive text prompts using multiple AI models simultaneously.
*   **Model-Based Variety:** Generate the same prompt with different Pollinations.ai models for maximum creative diversity (30+ models available).
*   **Attribute-Based Prompting:** Select from predefined categories and attributes to construct detailed prompts.
*   **Multi-Select Attributes:** Choose multiple attributes for categories like "Action" and "Enhancements".
*   **Manual Prompt Override:** Option to manually input a prompt, overriding the attribute-generated one.
*   **AI-Powered Prompt Enhancement:** Enhance your manual prompts using OpenRouter's Gemma AI model for photorealistic, professional-quality prompts. Requires a free OpenRouter API key.
*   **Advanced Negative Prompting:** Five specialized presets to exclude unwanted elements:
    *   **None:** No negative prompts applied
    *   **Default:** Comprehensive quality controls for general image generation (anatomical issues, artifacts, low quality)
    *   **High Quality:** Maximum quality preset for professional/commercial use (stricter quality standards)
    *   **Anime Style:** Prevents realistic elements in anime generation (photorealism, 3D rendering)
    *   **Censorship Bypass:** Specialized for realistic uncensored NSFW images (censorship artifacts, anatomical deformations, style issues)
*   **Multiple AI Models:** Comprehensive collection of Pollinations.ai models including FLUX, Stable Diffusion, Pony Realistic, and more.
*   **Generate with All Models:** Special button to generate images using all available models for ultimate variety.
*   **Model Attribution:** Each generated image clearly shows which AI model was used.
*   **Full-Size Image Viewer:** Click on generated images to view them in a full-screen modal.
*   **Clean Prompt Display:** Automatically removes redundant phrases (e.g., "photorealistic image of photorealistic image of") from the displayed prompt for a cleaner UI.
*   **Proper Input Field Handling:** Input fields correctly handle spaces and special characters without cursor jumping or character displacement issues.
*   **Consistent Terminology:** Ensures gender-related terms in prompts are consistent ("girl" instead of "female").
*   **Responsive Design:** Built with modern UI components for a seamless experience on different devices.
*   **Robust Error Handling:** Provides user-friendly toast notifications for input validation.

## Planned Enhancements (Future Development)

*   **Advanced Image Manipulation:** Integration of APIs for inpainting (editing specific parts of generated/uploaded images) and potentially more flexible content handling for uploaded images.
*   **Performance Optimizations:** Further improvements to generation speed and resource usage.
*   **Code Documentation:** Comprehensive JSDoc comments for easier development and maintenance.
*   **Accessibility Improvements:** Ensuring the application is usable by a wider audience.

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or Yarn (preferred: npm)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-image-generator.git
    cd ai-image-generator
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

### Environment Variables

#### For Prompt Enhancement Feature (Optional)
The AI-powered prompt enhancement feature requires an OpenRouter API key to work. This feature is completely optional and only enhances manual prompts for better photorealistic results.

1. **Get an OpenRouter API Key** (Free):
   - Visit [openrouter.ai/keys](https://openrouter.ai/keys)
   - Create a free account and generate an API key
   - Copy the key (starts with `sk-or-v1-`)

2. **Using the Enhancement Feature**:
   - Enable "Use Manual Prompt Input" in the app
   - Type your prompt and click the "Enhance" button
   - You'll be prompted to enter your OpenRouter API key on first use
   - The key is stored temporarily in your browser session only
   - Click "Forget Key" anytime to clear it

**Note:** The API key is stored in browser session storage only - it's forgotten when you close the browser tab. No account registration or persistent storage is required.

#### For Future API Integrations
Additional API keys for future features can be configured:
1.  Create a `.env` file in the root of the project by copying `.env.example`:
    ```bash
    cp .env.example .env
    ```
2.  Open `.env` and fill in any required API keys:
    ```
    # VITE_EXTERNAL_API_KEY=your_api_key_here
    ```

### Running the Application

#### ⚠️ **Currently Offline-Only (Private Repository)**
This application is currently configured for **local/offline use only**. It is fully prepared for online deployment when needed, but is not publicly accessible at this time.

**Deployment Status:** ✅ **Prepared for Online Deployment**
- Production build scripts ready (`npm run build`)
- GitHub Pages deployment configuration intact
- Static hosting compatible
- All deployment code and logic preserved for future use

#### Local Development:
```bash
npm install
npm run dev
```

Appen kommer att vara tillgänglig på `http://localhost:8080`.

#### Enkelt sätt (lokal):
Använd de förberedda startfilerna i `dist/` mappen:

- **Mac:** Dubbelklicka på `dist/mac/start.command`
- **Windows:** Dubbelklicka på `dist/windows/start.bat`
- **Linux:** Kör `./dist/linux/start.sh`

Appen öppnas automatiskt i din webbläsare!

### Building for Production

To build the application for production:

```bash
npm run build
# or yarn build
```

This will create an optimized build in the `dist` directory.

### Deployment Preparation

**Status:** ✅ **Fully Prepared for Online Deployment**

The application is configured and ready for online deployment using any static hosting service:

- **GitHub Pages:** Ready to deploy (previously deployed, can be re-enabled)
- **Vercel/Netlify:** Compatible with drag-and-drop deployment or CLI
- **Static Hosting:** All assets optimized and self-contained

**To re-enable online deployment:**
1. Build: `npm run build`
2. Deploy `dist/` folder to any static hosting service
3. Or recreate gh-pages branch: `git checkout -b gh-pages && cp -r dist/* . && git add . && git commit -m "Deploy" && git push origin gh-pages`

**Note:** Prompt enhancement requires backend deployment (Express server) for full functionality.

## Project Structure

```
.
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Shadcn UI components (button, toast, etc.)
│   │   ├── AttributeSelector.tsx
│   │   ├── GeneratedImages.tsx
│   │   ├── ImageGenerator.tsx
│   │   ├── ImageModal.tsx         # New: Full-size image viewing modal
│   │   ├── ModelsManager.tsx
│   │   ├── MultiAttributeSelector.tsx
│   │   ├── PromptControls.tsx
│   │   └── PromptInput.tsx
│   ├── hooks/             # Custom React hooks (e.g., useImageGeneration)
│   │   └── useImageGeneration.ts
│   ├── pages/             # Page-level components
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── types/             # TypeScript type definitions
│   │   └── imageGenerator.ts
│   ├── utils/             # Utility functions
│   │   ├── imageGeneration.ts
│   │   └── promptGeneratorData.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example           # Example environment variables
├── .gitignore             # Files ignored by Git
├── LICENSE                # Project license (MIT)
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.
