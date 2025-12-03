# AI Image Generator

This project is a React-based AI image generator, built with Vite and TypeScript, leveraging Shadcn UI components for a modern and responsive interface. It allows users to generate images from text prompts, apply various attributes, select different AI models, and utilize image-to-image capabilities with adjustable strength.

## Features

*   **Text-to-Image Generation:** Generate images from descriptive text prompts.
*   **Attribute-Based Prompting:** Select from predefined categories and attributes to construct detailed prompts.
*   **Multi-Select Attributes:** Choose multiple attributes for categories like "Action" and "Enhancements".
*   **Manual Prompt Override:** Option to manually input a prompt, overriding the attribute-generated one.
*   **Negative Prompting:** Specify elements to exclude from the generated images.
*   **Image-to-Image (Img2Img):** Upload a source image to guide the generation process, with adjustable strength.
*   **Multiple AI Models:** Select from a variety of image generation models (currently powered by Pollinations.ai).
*   **Multi-Style Image Generation:** Generates multiple images simultaneously using various predefined styles, offering more diverse outputs.
*   **Full-Size Image Viewer:** Click on generated images to view them in a full-screen modal.
*   **Clean Prompt Display:** Automatically removes redundant phrases (e.g., "photorealistic image of photorealistic image of") from the displayed prompt for a cleaner UI.
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

For future API integrations (e.g., advanced image manipulation services), you might need API keys.
1.  Create a `.env` file in the root of the project by copying `.env.example`:
    ```bash
    cp .env.example .env
    ```
2.  Open `.env` and fill in any required API keys:
    ```
    # VITE_EXTERNAL_API_KEY=your_api_key_here
    ```

### Running the Application

To start the development server, you can use the newly created `start.command` file:

```bash
./start.command
```

Alternatively, you can run:

```bash
npm run dev
```

The application will typically be available at `http://localhost:8080`.

### Building for Production

To build the application for production:

```bash
npm run build
# or yarn build
```

This will create an optimized build in the `dist` directory.

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
