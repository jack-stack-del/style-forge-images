
const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div dangerouslySetInnerHTML={{ __html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Image Generator</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Roboto', system-ui, sans-serif;
            background: #121212;
            color: #e5e5e5;
            min-height: 100vh;
            font-size: 14px;
            line-height: 1.6;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            position: relative;
        }

        .header {
            text-align: center;
            margin-bottom: 50px;
        }

        .title {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .subtitle {
            color: #999;
            font-size: 16px;
            font-weight: 400;
        }

        .input-section {
            margin-bottom: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        .prompt-input {
            width: 100%;
            max-width: 600px;
            padding: 18px 24px;
            background: #1e1e1e;
            border: 1px solid #333;
            border-radius: 12px;
            color: #e5e5e5;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
            font-family: inherit;
        }

        .prompt-input:focus {
            border-color: #555;
            background: #252525;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }

        .prompt-input::placeholder {
            color: #777;
        }

        .generate-btn {
            padding: 16px 40px;
            background: #1e1e1e;
            border: 1px solid #404040;
            border-radius: 10px;
            color: #e5e5e5;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            outline: none;
            font-family: inherit;
            min-width: 140px;
        }

        .generate-btn:hover:not(:disabled) {
            background: #2a2a2a;
            border-color: #555;
            transform: translateY(-1px);
        }

        .generate-btn:active:not(:disabled) {
            transform: translateY(0);
        }

        .generate-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .models-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        .models-toggle {
            width: 44px;
            height: 44px;
            background: #1e1e1e;
            border: 1px solid #333;
            border-radius: 10px;
            color: #e5e5e5;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            outline: none;
        }

        .models-toggle:hover {
            background: #2a2a2a;
            border-color: #444;
        }

        .models-content {
            position: absolute;
            top: 54px;
            right: 0;
            width: 340px;
            background: #1e1e1e;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 24px;
            transform: translateY(-10px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .models-content.open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }

        .models-header {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 18px;
            color: #ffffff;
        }

        .models-list {
            margin-bottom: 24px;
        }

        .model-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #121212;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .model-name {
            color: #e5e5e5;
            font-weight: 600;
        }

        .remove-btn {
            width: 24px;
            height: 24px;
            background: none;
            border: none;
            color: #777;
            cursor: pointer;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            outline: none;
            font-size: 16px;
        }

        .remove-btn:hover {
            background: #ff4444;
            color: white;
        }

        .add-model-section {
            border-top: 1px solid #2a2a2a;
            padding-top: 20px;
        }

        .add-model-toggle {
            width: 100%;
            padding: 12px;
            background: #121212;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            color: #999;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
            font-family: inherit;
        }

        .add-model-toggle:hover {
            background: #1e1e1e;
            border-color: #333;
        }

        .add-model-form {
            margin-top: 16px;
            display: none;
        }

        .add-model-form.show {
            display: block;
        }

        .form-input {
            width: 100%;
            padding: 12px 16px;
            background: #121212;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            color: #e5e5e5;
            font-size: 14px;
            margin-bottom: 12px;
            outline: none;
            transition: all 0.2s ease;
            font-family: inherit;
        }

        .form-input:focus {
            border-color: #404040;
        }

        .form-input::placeholder {
            color: #666;
        }

        .form-actions {
            display: flex;
            gap: 10px;
        }

        .form-btn {
            flex: 1;
            padding: 10px;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
            font-family: inherit;
        }

        .save-btn {
            background: #2a4a2a;
            color: #e5e5e5;
            font-weight: 600;
        }

        .save-btn:hover {
            background: #355535;
        }

        .cancel-btn {
            background: #121212;
            color: #999;
        }

        .cancel-btn:hover {
            background: #1e1e1e;
        }

        .images-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 50px;
            min-height: 200px;
        }

        .image-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 512px;
            width: 100%;
        }

        .generated-image {
            width: 100%;
            height: auto;
            border-radius: 16px;
            border: 1px solid #2a2a2a;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s ease;
        }

        .generated-image:hover {
            transform: translateY(-2px);
        }

        .image-label {
            margin-top: 16px;
            font-size: 14px;
            color: #bbb;
            font-weight: 600;
            text-align: center;
        }

        .loading {
            text-align: center;
            padding: 80px 20px;
            color: #999;
            font-size: 18px;
            font-weight: 500;
        }

        .loading-spinner {
            display: inline-block;
            width: 32px;
            height: 32px;
            border: 3px solid #333;
            border-radius: 50%;
            border-top-color: #666;
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 16px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .arrow-icon {
            width: 18px;
            height: 18px;
            transition: transform 0.3s ease;
        }

        .arrow-icon.rotated {
            transform: rotate(180deg);
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px 15px;
            }

            .title {
                font-size: 28px;
            }

            .models-content {
                width: 300px;
            }

            .input-section {
                gap: 16px;
            }

            .prompt-input {
                font-size: 16px; /* Prevent zoom on iOS */
            }
        }

        @media (max-width: 480px) {
            .models-panel {
                right: 10px;
                top: 10px;
            }

            .models-content {
                width: calc(100vw - 40px);
                right: -10px;
            }

            .generate-btn {
                padding: 14px 32px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">AI Image Generator</h1>
            <p class="subtitle">Create stunning images with artificial intelligence</p>
        </div>

        <div class="input-section">
            <input 
                type="text" 
                id="promptInput" 
                class="prompt-input" 
                placeholder="Describe the image you want to create..."
            >
            <button id="generateBtn" class="generate-btn">Generate</button>
        </div>

        <div id="imagesContainer" class="images-container"></div>
    </div>

    <div class="models-panel">
        <button id="modelsToggle" class="models-toggle">
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
            </svg>
        </button>
        <div id="modelsContent" class="models-content">
            <div class="models-header">AI Models</div>
            <div id="modelsList" class="models-list"></div>
            <div class="add-model-section">
                <button id="addModelToggle" class="add-model-toggle">+ Add New Model</button>
                <div id="addModelForm" class="add-model-form">
                    <input type="text" id="newModelName" class="form-input" placeholder="Model name (e.g., Anime)">
                    <input type="text" id="newModelStyle" class="form-input" placeholder="Style description (e.g., anime style)">
                    <div class="form-actions">
                        <button id="saveModel" class="form-btn save-btn">Save</button>
                        <button id="cancelModel" class="form-btn cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Default models
        let models = [
            { name: "Pollinations", style: "pollinations" },
            { name: "Flux", style: "flux realism" },
            { name: "SD", style: "realistic vision" },
            { name: "D.F", style: "deepfloyd if" },
            { name: "SD3", style: "stable diffusion 3" },
            { name: "SD2", style: "sd 2" }
        ];

        let isGenerating = false;

        // DOM elements
        const promptInput = document.getElementById('promptInput');
        const generateBtn = document.getElementById('generateBtn');
        const imagesContainer = document.getElementById('imagesContainer');
        const modelsToggle = document.getElementById('modelsToggle');
        const modelsContent = document.getElementById('modelsContent');
        const modelsList = document.getElementById('modelsList');
        const addModelToggle = document.getElementById('addModelToggle');
        const addModelForm = document.getElementById('addModelForm');
        const newModelName = document.getElementById('newModelName');
        const newModelStyle = document.getElementById('newModelStyle');
        const saveModel = document.getElementById('saveModel');
        const cancelModel = document.getElementById('cancelModel');

        // Initialize
        renderModels();

        // Event listeners
        generateBtn.addEventListener('click', generateImages);
        promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                generateImages();
            }
        });

        modelsToggle.addEventListener('click', toggleModelsPanel);
        addModelToggle.addEventListener('click', toggleAddModelForm);
        saveModel.addEventListener('click', addNewModel);
        cancelModel.addEventListener('click', () => {
            toggleAddModelForm();
            clearAddModelForm();
        });

        // Close models panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!modelsToggle.contains(e.target) && !modelsContent.contains(e.target)) {
                closeModelsPanel();
            }
        });

        function generateImages() {
            const prompt = promptInput.value.trim();
            
            // If prompt is empty, do nothing
            if (!prompt || isGenerating) return;

            isGenerating = true;
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';

            // Clear previous images
            imagesContainer.innerHTML = '';

            // Show loading indicator
            showLoadingIndicator();

            // Generate images for all models
            const imagePromises = models.map(model => {
                const fullPrompt = prompt + " in the style of " + model.style;
                const imageUrl = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(fullPrompt)}?width=512&height=512\`;
                
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve({ url: imageUrl, modelName: model.name });
                    img.onerror = () => resolve({ url: imageUrl, modelName: model.name });
                    img.src = imageUrl;
                });
            });

            // Wait for all images and display them
            Promise.all(imagePromises).then(images => {
                hideLoadingIndicator();
                displayImages(images);
                isGenerating = false;
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generate';
            });
        }

        function showLoadingIndicator() {
            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'loadingIndicator';
            loadingDiv.className = 'loading';
            loadingDiv.innerHTML = \`
                <div class="loading-spinner"></div>
                <div>Generating images...</div>
            \`;
            imagesContainer.appendChild(loadingDiv);
        }

        function hideLoadingIndicator() {
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
        }

        function displayImages(images) {
            images.forEach(image => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                
                imageItem.innerHTML = \`
                    <img src="\${image.url}" alt="Generated image for \${image.modelName}" class="generated-image" loading="lazy">
                    <div class="image-label">\${image.modelName}</div>
                \`;
                
                imagesContainer.appendChild(imageItem);
            });
        }

        function toggleModelsPanel() {
            const isOpen = modelsContent.classList.contains('open');
            if (isOpen) {
                closeModelsPanel();
            } else {
                openModelsPanel();
            }
        }

        function openModelsPanel() {
            modelsContent.classList.add('open');
            const arrow = modelsToggle.querySelector('.arrow-icon');
            arrow.classList.add('rotated');
        }

        function closeModelsPanel() {
            modelsContent.classList.remove('open');
            const arrow = modelsToggle.querySelector('.arrow-icon');
            arrow.classList.remove('rotated');
            // Also close add model form
            addModelForm.classList.remove('show');
            clearAddModelForm();
        }

        function toggleAddModelForm() {
            addModelForm.classList.toggle('show');
            if (addModelForm.classList.contains('show')) {
                newModelName.focus();
            }
        }

        function clearAddModelForm() {
            newModelName.value = '';
            newModelStyle.value = '';
        }

        function addNewModel() {
            const name = newModelName.value.trim();
            const style = newModelStyle.value.trim();

            if (!name || !style) {
                alert('Please enter both model name and style');
                return;
            }

            if (models.some(model => model.name.toLowerCase() === name.toLowerCase())) {
                alert('A model with this name already exists');
                return;
            }

            models.push({ name, style });
            renderModels();
            toggleAddModelForm();
            clearAddModelForm();
        }

        function removeModel(index) {
            if (confirm('Are you sure you want to remove this model?')) {
                models.splice(index, 1);
                renderModels();
            }
        }

        function renderModels() {
            modelsList.innerHTML = '';
            models.forEach((model, index) => {
                const modelItem = document.createElement('div');
                modelItem.className = 'model-item';
                
                modelItem.innerHTML = \`
                    <span class="model-name">\${model.name}</span>
                    <button class="remove-btn" onclick="removeModel(\${index})">×</button>
                \`;
                
                modelsList.appendChild(modelItem);
            });
        }

        // Make removeModel available globally
        window.removeModel = removeModel;
    </script>
</body>
</html>
      ` }} />
    </div>
  );
};

export default Index;
