let R;
let gameRoom;
let roomAssets = {}; // Centralized asset storage

function preload() {
    // Load all room assets
    loadRoomAssets();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    R = new Renderer();
    
    // Initialize the game room with loaded assets
    initializeGameRoom();
}

// Centralized asset loading
function loadRoomAssets() {
    roomAssets.images = {
        secondNumber: loadImage('assets/object/secondNumber.png'),
        firstNumber: loadImage('assets/object/firstNumber.png'),
        thirdNumber: loadImage('assets/object/thirdNumber.png'),
    };
    
    // Could add more asset types later:
    // roomAssets.sounds = { ... };
    // roomAssets.backgrounds = { ... };
}

// Streamlined room initialization
function initializeGameRoom() {
    gameRoom = new Room();
    
    // Configure all walls with screen bounds
    const wallBounds = {x: 0, y: 0, w: width, h: height};
    ['north', 'east', 'south', 'west'].forEach(wall => {
        gameRoom.setWallBounds(wall, wallBounds);
    });
    
    // Load room content from data
    loadRoomContent();
}

// Data-driven room content loading
function loadRoomContent() {
    const roomData = {
        north: [
            // No objects on north wall currently
        ],
        east: [
            {
                image: roomAssets.images.secondNumber,
                bounds: {x: 200, y: 850, w: 50, h: 50},
                onClick: () => animateBounce('x', 10)
            }
        ],
        south: [
            {
                image: roomAssets.images.thirdNumber,
                bounds: {x: 700, y: 300, w: 50, h: 50},
            }
        ],
        west: [
            {
                image: roomAssets.images.firstNumber,
                bounds: {x: 200, y: 200, w: 45, h: 50},
                onClick: () => animateBounce('x', -100)
            }
        ]
    };
    
    // Create objects from data and add to walls
    Object.keys(roomData).forEach(wallName => {
        roomData[wallName].forEach(objData => {
            const obj = createInteractableObject(objData);
            gameRoom.addObjectToWall(wallName, obj);
        });
    });
}

// Factory function for creating interactable objects
function createInteractableObject(data) {
    const obj = new InteractableObject(
        data.image,
        [[data.image]], 
        data.bounds
    );
    
    obj.on('click', () => {
        console.log(`🧱 Object clicked on ${gameRoom.currentWall} wall!`);
        data.onClick.call(obj);
    });
    
    return obj;
}

// Reusable animation helper
function animateBounce(axis, offset) {
    const originalValue = this.bounds[axis];
    this.bounds[axis] += offset;
    setTimeout(() => {
        this.bounds[axis] = originalValue;
    }, 200);
}

// Streamlined main game loop
function draw() {
    background(50);
    const dt = deltaTime / 1000;
    
    // Update and render everything through the renderer
    R.update(dt);
    R.draw();
    
    // Update and render current room/wall
    if (gameRoom) {
        updateCurrentRoom(dt);
        renderCurrentRoom();
    }
    
    // Render UI overlay
    renderUI();
}

// Focused room update logic
function updateCurrentRoom(dt) {
    gameRoom.update();
}

// Focused room rendering with visual enhancements
function renderCurrentRoom() {
    gameRoom.draw();
    
    // Render object interaction hints for current wall
    renderObjectHighlights();
}

// Render visual hints for interactable objects
function renderObjectHighlights() {
    const currentWall = gameRoom.getCurrentWall();
    
    currentWall.objects.forEach(obj => {
        const isHovered = obj.isInside(mouseX, mouseY);
        
        if (isHovered) {
            // Glowing hover effect
            drawGlow(obj.bounds, color(255, 200, 100, 150), 4);
            drawGlow(obj.bounds, color(255, 200, 100, 80), 8);
        } else {
            // Subtle idle outline
            drawOutline(obj.bounds, color(120, 120, 130, 100), 1);
        }
    });
}

// Helper function for glow effect
function drawGlow(bounds, glowColor, thickness) {
    noFill();
    stroke(glowColor);
    strokeWeight(thickness);
    rect(bounds.x - thickness/2, bounds.y - thickness/2, 
         bounds.w + thickness, bounds.h + thickness);
}

// Helper function for outline
function drawOutline(bounds, outlineColor, thickness) {
    noFill();
    stroke(outlineColor);
    strokeWeight(thickness);
    rect(bounds.x, bounds.y, bounds.w, bounds.h);
}

// Event handling
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Reconfigure room bounds if needed
    if (gameRoom) {
        const newBounds = {x: 0, y: 0, w: width, h: height};
        ['north', 'east', 'south', 'west'].forEach(wall => {
            gameRoom.setWallBounds(wall, newBounds);
        });
    }
}

function mousePressed() {
    R.dispatch("mousePressed");
    console.log("clicked! : ", mouseX, mouseY);
    
    if (gameRoom) {
        gameRoom.handleClick(mouseX, mouseY);
    }
}

function keyPressed() {
    R.dispatch("keyPressed");
    handleRoomNavigation();
}

function mouseReleased() {
    R.dispatch("mouseReleased");
}

// Separated room navigation logic
function handleRoomNavigation() {
    if (gameRoom) {
        if (keyCode === LEFT_ARROW) {
            gameRoom.rotateCounterClockwise();
        } else if (keyCode === RIGHT_ARROW) {
            gameRoom.rotateClockwise();
        }
    }
}

// Legacy room setup for old view system (keeping for compatibility)
function setupRoom() {
    const v1 = new EventView();
    const v2 = new TimerView();
    const v3 = new MoveView();
    const v4 = new View(238, 130, 238, "Room 4");

    const room = new ViewManager();
    room.addView(v1);
    room.addView(v2);
    room.addView(v3);
    room.addView(v4);
    R.add(room);
}

// Streamlined UI rendering
function renderUI() {
    renderInstructionPanel();
    renderCompass();
}

function renderInstructionPanel() {
    // Instruction panel
    fill(0, 0, 0, 120);
    noStroke();
    rect(10, height - 70, 350, 55, 8);
    
    fill(255, 255, 255, 200);
    textAlign(LEFT);
    textSize(14);
    text("← → Arrow keys to navigate walls", 20, height - 45);
    text("🖱️  Click on objects to interact", 20, height - 25);
}

function renderCompass() {
    const compassX = width - 80;
    const compassY = height - 80;
    const compassRadius = 25;
    
    // Compass background
    fill(0, 0, 0, 100);
    noStroke();
    ellipse(compassX, compassY, compassRadius * 2);
    
    // Compass directions with current wall highlighting
    if (gameRoom) {
        const current = gameRoom.currentWall;
        const directions = [
            {dir: 'N', pos: [compassX, compassY - 15], wall: 'north'},
            {dir: 'E', pos: [compassX + 15, compassY + 5], wall: 'east'},
            {dir: 'S', pos: [compassX, compassY + 18], wall: 'south'},
            {dir: 'W', pos: [compassX - 15, compassY + 5], wall: 'west'}
        ];
        
        textAlign(CENTER);
        textSize(10);
        
        directions.forEach(({dir, pos, wall}) => {
            fill(current === wall ? color(255, 200, 100) : color(255, 255, 255, 150));
            text(dir, pos[0], pos[1]);
        });
    }
    
    // Center dot
    fill(255, 200, 100);
    noStroke();
    ellipse(compassX, compassY, 4);
}