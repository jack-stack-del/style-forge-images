
const Index = () => {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 30px;
        }

        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 2rem;
        }

        .input-section {
            margin-bottom: 30px;
        }

        .prompt-container {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        #promptInput {
            flex: 1;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.3s;
        }

        #promptInput:focus {
            border-color: #007bff;
        }

        #generateBtn {
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #generateBtn:hover {
            background-color: #0056b3;
        }

        #generateBtn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .models-section {
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }

        .models-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 15px;
        }

        .models-header h3 {
            margin: 0;
            color: #333;
        }

        #addModelBtn {
            padding: 8px 16px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-left: auto;
        }

        #addModelBtn:hover {
            background-color: #218838;
        }

        .models-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin-bottom: 15px;
        }

        .model-item {
            padding: 8px 12px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 6px;
            text-align: center;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .model-name {
            font-weight: 500;
        }

        .remove-btn {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 8px;
        }

        .remove-btn:hover {
            background: #c82333;
        }

        .add-model-form {
            display: none;
            grid-template-columns: 1fr 1fr auto auto;
            gap: 10px;
            align-items: center;
            margin-top: 15px;
        }

        .add-model-form input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .add-model-form button {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        .save-btn {
            background-color: #28a745;
            color: white;
        }

        .cancel-btn {
            background-color: #6c757d;
            color: white;
        }

        .loading {
            text-align: center;
            color: #666;
            font-style: italic;
            margin: 20px 0;
        }

        .images-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .image-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #fafafa;
        }

        .image-item img {
            width: 512px;
            height: 512px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .image-label {
            margin-top: 10px;
            font-weight: 600;
            color: #333;
            font-size: 16px;
        }

        @media (max-width: 600px) {
            .container {
                padding: 20px;
            }

            .prompt-container {
                flex-direction: column;
            }

            .image-item img {
                width: 100%;
                height: auto;
                max-width: 512px;
            }

            .add-model-form {
                grid-template-columns: 1fr;
            }

            .models-list {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI Image Generator</h1>
        
        <div class="input-section">
            <div class="prompt-container">
                <input 
                    type="text" 
                    id="promptInput" 
                    placeholder="Enter your prompt (e.g., a cat wearing sunglasses)"
                >
                <button id="generateBtn">Generate</button>
            </div>
        </div>

        <div class="models-section">
            <div class="models-header">
                <h3>AI Models</h3>
                <button id="addModelBtn">+ Add Model</button>
            </div>
            <div class="models-list" id="modelsList"></div>
            <div class="add-model-form" id="addModelForm">
                <input type="text" id="modelName" placeholder="Model name (e.g., Anime)">
                <input type="text" id="modelStyle" placeholder="Style string (e.g., anime style)">
                <button class="save-btn" id="saveBtn">Save</button>
                <button class="cancel-btn" id="cancelBtn">Cancel</button>
            </div>
        </div>

        <div id="loading" class="loading" style="display: none;">
            Generating images...
        </div>

        <div class="images-container" id="imagesContainer">
        </div>
    </div>

    <script>
        // Initial models configuration
        let models = [
            { name: "Pollinations", style: "pollinations" },
            { name: "Flux", style: "flux realism" },
            { name: "SD", style: "realistic vision" },
            { name: "D.F", style: "deepfloyd if" },
            { name: "SD3", style: "stable diffusion 3" },
            { name: "SD2", style: "sd 2" }
        ];

        // DOM elements
        const promptInput = document.getElementById('promptInput');
        const generateBtn = document.getElementById('generateBtn');
        const loading = document.getElementById('loading');
        const imagesContainer = document.getElementById('imagesContainer');
        const addModelBtn = document.getElementById('addModelBtn');
        const addModelForm = document.getElementById('addModelForm');
        const modelsList = document.getElementById('modelsList');
        const modelName = document.getElementById('modelName');
        const modelStyle = document.getElementById('modelStyle');
        const saveBtn = document.getElementById('saveBtn');
        const cancelBtn = document.getElementById('cancelBtn');

        // Initialize the app
        function init() {
            renderModels();
            
            // Event listeners
            generateBtn.addEventListener('click', generateImages);
            addModelBtn.addEventListener('click', showAddModelForm);
            saveBtn.addEventListener('click', saveNewModel);
            cancelBtn.addEventListener('click', hideAddModelForm);
            
            // Enter key support
            promptInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    generateImages();
                }
            });
        }

        // Render models list
        function renderModels() {
            modelsList.innerHTML = '';
            models.forEach((model, index) => {
                const modelDiv = document.createElement('div');
                modelDiv.className = 'model-item';
                modelDiv.innerHTML = \`
                    <span class="model-name">\${model.name}</span>
                    <button class="remove-btn" onclick="removeModel(\${index})" title="Remove model">×</button>
                \`;
                modelsList.appendChild(modelDiv);
            });
        }

        // Generate images for all models
        function generateImages() {
            const prompt = promptInput.value.trim();
            if (!prompt) {
                alert('Please enter a prompt');
                return;
            }

            // Show loading
            loading.style.display = 'block';
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';

            // Clear previous images
            imagesContainer.innerHTML = '';

            // Generate images for each model
            models.forEach(model => {
                createImageItem(prompt, model);
            });

            // Hide loading after a short delay
            setTimeout(() => {
                loading.style.display = 'none';
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generate';
            }, 1000);
        }

        // Create image item for a model
        function createImageItem(prompt, model) {
            const fullPrompt = prompt + " in the style of " + model.style;
            const imageUrl = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(fullPrompt)}?width=512&height=512\`;

            const imageDiv = document.createElement('div');
            imageDiv.className = 'image-item';
            
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = \`Generated image for \${model.name}\`;
            img.loading = 'lazy';
            
            const label = document.createElement('div');
            label.className = 'image-label';
            label.textContent = model.name;
            
            imageDiv.appendChild(img);
            imageDiv.appendChild(label);
            imagesContainer.appendChild(imageDiv);
        }

        // Show add model form
        function showAddModelForm() {
            addModelForm.style.display = 'grid';
            modelName.focus();
        }

        // Hide add model form
        function hideAddModelForm() {
            addModelForm.style.display = 'none';
            modelName.value = '';
            modelStyle.value = '';
        }

        // Save new model
        function saveNewModel() {
            const name = modelName.value.trim();
            const style = modelStyle.value.trim();

            if (!name || !style) {
                alert('Please enter both model name and style');
                return;
            }

            // Check for duplicate names
            if (models.some(model => model.name.toLowerCase() === name.toLowerCase())) {
                alert('A model with this name already exists');
                return;
            }

            models.push({ name, style });
            renderModels();
            hideAddModelForm();
        }

        // Remove model
        function removeModel(index) {
            if (confirm('Are you sure you want to remove this model?')) {
                models.splice(index, 1);
                renderModels();
            }
        }

        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    </script>
</body>
</html>
      `
    }} />
  );
};

export default Index;
