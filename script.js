// Toggle About Me and Contact Sections
const aboutLink = document.getElementById('about-link');
const contactLink = document.getElementById('contact-link');
const aboutSection = document.getElementById('about');
const contactSection = document.getElementById('contact');

aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    aboutSection.classList.toggle('hidden');
    contactSection.classList.add('hidden'); // Hide Contact section when About Me is shown
});

contactLink.addEventListener('click', (e) => {
    e.preventDefault();
    contactSection.classList.toggle('hidden');
    aboutSection.classList.add('hidden'); // Hide About Me section when Contact is shown
});

// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your message!');
    this.reset();
});

// Three.js Setup for 360° Room
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, 500);
document.getElementById('threejs-container').appendChild(renderer.domElement);

// Load 360° Room Texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('assets/images/room-360.jpg');
const geometry = new THREE.SphereGeometry(500, 60, 40);
const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Camera Position
camera.position.set(0, 0, 0.1);

// Array to store added art pieces
let artPieces = [];

// Enable dragging of gallery images
const artworkImages = document.querySelectorAll('.art-image');
artworkImages.forEach((image) => {
    image.draggable = true;
    image.addEventListener('dragstart', (e) => {
        // Pass the image source URL when dragging starts
        const imageUrl = image.src; // Get the full image URL
        e.dataTransfer.setData('text/plain', imageUrl);
        console.log('Dragging image:', imageUrl); // Debug: Log the image URL
    });
});

// Drag and Drop Functionality
const dragDropZone = document.getElementById('drag-drop-zone');
dragDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropZone.style.backgroundColor = 'rgba(200, 200, 200, 0.8)';
});

dragDropZone.addEventListener('dragleave', () => {
    dragDropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
});

dragDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';

    // Get the image URL from the drag event
    let imageUrl;
    if (e.dataTransfer.files.length > 0) {
        // Handle files dragged from desktop
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
            imageUrl = URL.createObjectURL(file); // Create a URL for the dropped file
        } else {
            alert('Please drag and drop an image file.');
            return;
        }
    } else {
        // Handle images dragged from the gallery
        imageUrl = e.dataTransfer.getData('text/plain');
        console.log('Dropped image URL:', imageUrl); // Debug: Log the dropped image URL
    }

    if (imageUrl) {
        // Store the image URL temporarily
        currentImageUrl = imageUrl;
        // Show the "Convert Image to Virtual Store" button
        convertImageBtn.style.display = 'block';
    } else {
        alert('Please drag and drop an image from the gallery or your desktop.');
    }
});

// Add Art to Wall Function
function addArtToWall(imageUrl) {
    console.log('Loading image from:', imageUrl); // Debug: Log the image URL
    const texture = new THREE.TextureLoader().load(imageUrl, () => {
        // Update the texture once it's loaded
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const geometry = new THREE.PlaneGeometry(10, 10); // Adjust size as needed
        const artPiece = new THREE.Mesh(geometry, material);

        // Position the art piece in front of the camera
        artPiece.position.set(0, 0, -20); // Adjust position as needed
        artPieces.push(artPiece); // Store the art piece for later reference
        scene.add(artPiece);
    }, undefined, (error) => {
        console.error('Error loading image:', error); // Debug: Log the error
        alert('Failed to load the image. Please check the image path.');
    });
}

// Clear All Images Function
function clearAllImages() {
    artPieces.forEach((artPiece) => {
        scene.remove(artPiece); // Remove each art piece from the scene
    });
    artPieces = []; // Clear the array
}

// Add Clear Images Button
const clearImagesBtn = document.getElementById('clear-images-btn');
clearImagesBtn.addEventListener('click', clearAllImages);

// Maximize/Minimize Virtual Store View
const maximizeBtn = document.getElementById('maximize-btn');
const minimizeBtn = document.getElementById('minimize-btn');
const threejsContainer = document.getElementById('threejs-container');

maximizeBtn.addEventListener('click', () => {
    threejsContainer.style.height = '80vh';
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
});

minimizeBtn.addEventListener('click', () => {
    threejsContainer.style.height = '500px';
    renderer.setSize(window.innerWidth, 500);
});

// Mouse Controls for 360° Navigation
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', (e) => {
    isDragging = true;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        // Rotate the camera based on mouse movement
        camera.rotation.y -= deltaX * 0.005;
        camera.rotation.x -= deltaY * 0.005;

        // Clamp vertical rotation to avoid flipping
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
    }
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

// Render Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the sphere slightly for a more immersive effect
    sphere.rotation.y += 0.001;

    // Render the scene
    renderer.render(scene, camera);
}
animate();

// New Feature: Convert Image to Virtual Store
let currentImageUrl = null; // Store the current image URL
const convertImageBtn = document.createElement('button');
convertImageBtn.textContent = 'Convert Image to Virtual Store';
convertImageBtn.style.display = 'none'; // Hide the button by default
convertImageBtn.style.position = 'absolute';
convertImageBtn.style.top = '10px';
convertImageBtn.style.left = '10px';
convertImageBtn.style.zIndex = '1000';
convertImageBtn.style.backgroundColor = '#333';
convertImageBtn.style.color = '#fff';
convertImageBtn.style.border = 'none';
convertImageBtn.style.padding = '0.5rem 1rem';
convertImageBtn.style.cursor = 'pointer';
convertImageBtn.style.borderRadius = '5px';

convertImageBtn.addEventListener('click', () => {
    if (currentImageUrl) {
        addArtToWall(currentImageUrl); // Add the image to the virtual store
        convertImageBtn.style.display = 'none'; // Hide the button after conversion
    }
});

// Add the button to the drag-and-drop zone
dragDropZone.appendChild(convertImageBtn);

// New Feature: Add Photo from Gallery or File Input
const addPhotoBtn = document.createElement('button');
addPhotoBtn.textContent = 'Add Photo';
addPhotoBtn.style.position = 'absolute';
addPhotoBtn.style.top = '60px';
addPhotoBtn.style.left = '10px';
addPhotoBtn.style.zIndex = '1000';
addPhotoBtn.style.backgroundColor = '#333';
addPhotoBtn.style.color = '#fff';
addPhotoBtn.style.border = 'none';
addPhotoBtn.style.padding = '0.5rem 1rem';
addPhotoBtn.style.cursor = 'pointer';
addPhotoBtn.style.borderRadius = '5px';

addPhotoBtn.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            currentImageUrl = imageUrl;
            convertImageBtn.style.display = 'block';
        } else {
            alert('Please select a valid image file.');
        }
    });

    fileInput.click();
});

// Add the button to the drag-and-drop zone
dragDropZone.appendChild(addPhotoBtn);