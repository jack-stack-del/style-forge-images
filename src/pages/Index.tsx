
const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Image Generator</h1>
          <p className="text-gray-600">Generate images using multiple AI models</p>
        </div>

        {/* Prompt Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              id="promptInput"
              placeholder="Enter your prompt (e.g., a cat wearing sunglasses)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <button
              id="generateBtn"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Generate
            </button>
          </div>
          
          {/* Loading indicator */}
          <div id="loadingIndicator" className="hidden text-center py-4">
            <div className="inline-flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Generating images...
            </div>
          </div>
        </div>

        {/* Models Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">AI Models</h2>
            <button
              id="addModelBtn"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              + Add Model
            </button>
          </div>
          
          <div id="modelsList" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"></div>
          
          {/* Add Model Form */}
          <div id="addModelForm" className="hidden mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Add New Model</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                id="modelName"
                placeholder="Model display name (e.g., Anime)"
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                id="modelStyle"
                placeholder="Style string (e.g., anime style)"
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                id="saveModelBtn"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                id="cancelModelBtn"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Generated Images */}
        <div id="imagesContainer" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Images will be dynamically inserted here */}
        </div>

        {/* Instructions */}
        <div className="text-center mt-12 text-gray-500">
          <p>Enter a prompt and click Generate to create images using multiple AI models</p>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
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
          const loadingIndicator = document.getElementById('loadingIndicator');
          const imagesContainer = document.getElementById('imagesContainer');
          const addModelBtn = document.getElementById('addModelBtn');
          const addModelForm = document.getElementById('addModelForm');
          const modelName = document.getElementById('modelName');
          const modelStyle = document.getElementById('modelStyle');
          const saveModelBtn = document.getElementById('saveModelBtn');
          const cancelModelBtn = document.getElementById('cancelModelBtn');
          const modelsList = document.getElementById('modelsList');

          // Initialize the app
          function init() {
            renderModels();
            
            // Event listeners
            generateBtn.addEventListener('click', generateImages);
            addModelBtn.addEventListener('click', showAddModelForm);
            saveModelBtn.addEventListener('click', saveNewModel);
            cancelModelBtn.addEventListener('click', hideAddModelForm);
            
            // Enter key support for prompt input
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
              modelDiv.className = 'flex items-center justify-between p-2 bg-gray-100 rounded text-sm';
              modelDiv.innerHTML = \`
                <span class="font-medium">\${model.name}</span>
                <button onclick="removeModel(\${index})" class="text-red-500 hover:text-red-700 ml-2" title="Remove model">×</button>
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

            // Show loading indicator
            loadingIndicator.classList.remove('hidden');
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';

            // Clear previous images
            imagesContainer.innerHTML = '';

            // Generate images for each model
            models.forEach(model => {
              createImageCard(prompt, model);
            });

            // Hide loading indicator after a short delay
            setTimeout(() => {
              loadingIndicator.classList.add('hidden');
              generateBtn.disabled = false;
              generateBtn.textContent = 'Generate';
            }, 1000);
          }

          // Create image card for a model
          function createImageCard(prompt, model) {
            const fullPrompt = prompt + " in the style of " + model.style;
            const imageUrl = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(fullPrompt)}?width=512&height=512\`;

            const cardDiv = document.createElement('div');
            cardDiv.className = 'bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105';
            
            cardDiv.innerHTML = \`
              <div class="relative">
                <img 
                  src="\${imageUrl}" 
                  alt="Generated image for \${model.name}"
                  class="w-full h-64 object-cover"
                  loading="lazy"
                  onload="this.classList.add('opacity-100')"
                  onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNTYgMjAwQzI3Ny4yIDIwMCAyOTQgMjE2LjggMjk0IDIzOEMyOTQgMjU5LjIgMjc3LjIgMjc2IDI1NiAyNzZDMjM0LjggMjc2IDIxOCAyNTkuMiAyMTggMjM4QzIxOCAyMTYuOCAyMzQuOCAyMDAgMjU2IDIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+PC9wYXRoPgo8L3N2Zz4='"
                  style="opacity: 0; transition: opacity 0.3s ease-in-out;"
                />
                <div class="absolute inset-0 bg-gray-200 animate-pulse"></div>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-800 mb-1">\${model.name}</h3>
                <p class="text-sm text-gray-600">Style: \${model.style}</p>
              </div>
            \`;

            imagesContainer.appendChild(cardDiv);
          }

          // Show add model form
          function showAddModelForm() {
            addModelForm.classList.remove('hidden');
            modelName.focus();
          }

          // Hide add model form
          function hideAddModelForm() {
            addModelForm.classList.add('hidden');
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
        `
      }} />
    </div>
  );
};

export default Index;
