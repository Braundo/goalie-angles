// NHL regulation dimensions (in inches)
const GOAL_WIDTH = 72;  // 6 feet
const GOAL_HEIGHT = 48; // 4 feet
const CREASE_RADIUS = 72; // 6 feet
const GOALIE_HEIGHT = 60; // 5 feet

// Goalie dimensions based on stance
const GOALIE_STANDUP_WIDTH = 30; // inches
const GOALIE_STANDUP_HEIGHT = 60; // inches
const GOALIE_BUTTERFLY_WIDTH = 54; // inches (wider in butterfly)
const GOALIE_BUTTERFLY_HEIGHT = 36; // inches (shorter in butterfly)

// Scale for rendering (pixels per inch)
const TOP_SCALE = 4;
const FRONT_SCALE = 8;

// Rink dimensions for top view
const RINK_WIDTH = 200 * TOP_SCALE;  // 200 inches wide area
const RINK_DEPTH = 300 * TOP_SCALE;  // 300 inches deep area

// State
let state = {
    puck: { x: 150, y: 200 }, // Position in inches from goal line center
    goalie: { x: 0, y: 36 }, // Position in inches (x from center, y from goal line)
    showShootingArea: true,
    stance: 'standup', // 'standup' or 'butterfly'
    dragging: null
};

// Canvas contexts
const topCanvas = document.getElementById('topCanvas');
const frontCanvas = document.getElementById('frontCanvas');
const topCtx = topCanvas.getContext('2d');
const frontCtx = frontCanvas.getContext('2d');

// Convert inches to canvas pixels for top view
function topInchesToPixels(inches) {
    return inches * TOP_SCALE;
}

// Convert inches to canvas pixels for front view
function frontInchesToPixels(inches) {
    return inches * FRONT_SCALE;
}

// Get goalie dimensions based on stance
function getGoalieDimensions() {
    if (state.stance === 'butterfly') {
        return {
            width: GOALIE_BUTTERFLY_WIDTH,
            height: GOALIE_BUTTERFLY_HEIGHT
        };
    }
    return {
        width: GOALIE_STANDUP_WIDTH,
        height: GOALIE_STANDUP_HEIGHT
    };
}

// Draw realistic goalie in standup stance (top-down view)
function drawGoalieTopStandup(ctx, x, y, width) {
    const depth = 12;

    // Leg pads (two rectangles)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - width * 0.4, y - depth/2, width * 0.35, depth);
    ctx.fillRect(x + width * 0.05, y - depth/2, width * 0.35, depth);

    // Body/chest protector (white jersey)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - width * 0.25, y - depth/2, width * 0.5, depth);

    // Glove (left side) - white
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - width * 0.45, y, depth * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Blocker (right side) - white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + width * 0.3, y - depth * 0.3, width * 0.2, depth * 0.6);
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + width * 0.3, y - depth * 0.3, width * 0.2, depth * 0.6);

    // Stick
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + width * 0.4, y);
    ctx.lineTo(x + width * 0.5, y + depth);
    ctx.stroke();

    // Helmet - white
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, depth * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - width/2, y - depth/2, width, depth);
}

// Draw realistic goalie in butterfly stance (top-down view)
function drawGoalieTopButterfly(ctx, x, y, width) {
    const depth = 12;

    // Leg pads spread wide in butterfly
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - width * 0.48, y - depth/2, width * 0.45, depth);
    ctx.fillRect(x + width * 0.03, y - depth/2, width * 0.45, depth);

    // Body (compressed in butterfly) - white jersey
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - width * 0.2, y - depth/2, width * 0.4, depth);

    // Glove extended - white
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - width * 0.48, y, depth * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Blocker extended - white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + width * 0.35, y - depth * 0.4, width * 0.18, depth * 0.8);
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + width * 0.35, y - depth * 0.4, width * 0.18, depth * 0.8);

    // Stick horizontal across
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - width * 0.2, y + depth * 0.4);
    ctx.lineTo(x + width * 0.4, y + depth * 0.4);
    ctx.stroke();

    // Helmet - white
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, depth * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - width/2, y - depth/2, width, depth);
}

// Draw realistic goalie in standup stance (front view)
function drawGoalieFrontStandup(ctx, x, y, width, height) {
    // Leg pads - white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - width * 0.35, y - height * 0.45, width * 0.3, height * 0.45);
    ctx.fillRect(x + width * 0.05, y - height * 0.45, width * 0.3, height * 0.45);
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width * 0.35, y - height * 0.45, width * 0.3, height * 0.45);
    ctx.strokeRect(x + width * 0.05, y - height * 0.45, width * 0.3, height * 0.45);

    // Pants - light grey
    ctx.fillStyle = '#BBBBBB';
    ctx.fillRect(x - width * 0.25, y - height * 0.65, width * 0.5, height * 0.25);
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width * 0.25, y - height * 0.65, width * 0.5, height * 0.25);

    // Chest protector / Jersey - white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - width * 0.3, y - height * 0.88, width * 0.6, height * 0.3);
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width * 0.3, y - height * 0.88, width * 0.6, height * 0.3);

    // Shoulders - white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - width * 0.42, y - height * 0.92, width * 0.2, height * 0.15);
    ctx.fillRect(x + width * 0.22, y - height * 0.92, width * 0.2, height * 0.15);
    ctx.strokeStyle = '#CCCCCC';
    ctx.strokeRect(x - width * 0.42, y - height * 0.92, width * 0.2, height * 0.15);
    ctx.strokeRect(x + width * 0.22, y - height * 0.92, width * 0.2, height * 0.15);

    // Glove (left side, raised) - white
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - width * 0.45, y - height * 0.75, width * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Blocker (right side, lower) - white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + width * 0.25, y - height * 0.68, width * 0.22, height * 0.2);
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + width * 0.25, y - height * 0.68, width * 0.22, height * 0.2);

    // Stick
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + width * 0.35, y - height * 0.5);
    ctx.lineTo(x + width * 0.42, y);
    ctx.stroke();

    // Stick blade
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + width * 0.38, y - height * 0.05, width * 0.15, height * 0.05);

    // Helmet/mask - white
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y - height * 0.92, width * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Mask cage - dark grey
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * width * 0.05, y - height * 0.98);
        ctx.lineTo(x + i * width * 0.05, y - height * 0.86);
        ctx.stroke();
    }

    // Helmet outline
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - height * 0.92, width * 0.18, 0, Math.PI * 2);
    ctx.stroke();

    // Overall outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - width/2, y - height, width, height);
}

// Draw realistic goalie in butterfly stance (front view)
function drawGoalieFrontButterfly(ctx, x, y, width, height) {
    // Leg pads - spread wide and flat - white
    ctx.fillStyle = '#FFFFFF';
    // Left pad
    ctx.fillRect(x - width * 0.5, y - height * 0.6, width * 0.45, height * 0.6);
    // Right pad
    ctx.fillRect(x + width * 0.05, y - height * 0.6, width * 0.45, height * 0.6);

    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width * 0.5, y - height * 0.6, width * 0.45, height * 0.6);
    ctx.strokeRect(x + width * 0.05, y - height * 0.6, width * 0.45, height * 0.6);

    // Pad straps
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x - width * 0.48, y - height * (0.5 - i * 0.15));
        ctx.lineTo(x - width * 0.08, y - height * (0.5 - i * 0.15));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + width * 0.08, y - height * (0.5 - i * 0.15));
        ctx.lineTo(x + width * 0.48, y - height * (0.5 - i * 0.15));
        ctx.stroke();
    }

    // Body/chest protector/jersey (compressed, lower) - white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - width * 0.25, y - height * 0.85, width * 0.5, height * 0.3);
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width * 0.25, y - height * 0.85, width * 0.5, height * 0.3);

    // Glove extended out - white
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - width * 0.55, y - height * 0.65, width * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Arm to glove - white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - width * 0.45, y - height * 0.72, width * 0.22, height * 0.15);
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width * 0.45, y - height * 0.72, width * 0.22, height * 0.15);

    // Blocker extended out - white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + width * 0.4, y - height * 0.7, width * 0.25, height * 0.18);
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + width * 0.4, y - height * 0.7, width * 0.25, height * 0.18);

    // Arm to blocker - white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + width * 0.22, y - height * 0.72, width * 0.22, height * 0.15);
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + width * 0.22, y - height * 0.72, width * 0.22, height * 0.15);

    // Stick horizontal across pads
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - width * 0.3, y - height * 0.15);
    ctx.lineTo(x + width * 0.55, y - height * 0.15);
    ctx.stroke();

    // Stick blade
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + width * 0.48, y - height * 0.2, width * 0.18, height * 0.08);

    // Helmet (lower position) - white
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y - height * 0.82, width * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Mask cage - dark grey
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * width * 0.06, y - height * 0.88);
        ctx.lineTo(x + i * width * 0.06, y - height * 0.76);
        ctx.stroke();
    }

    // Helmet outline
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - height * 0.82, width * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Overall outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - width/2, y - height, width, height);
}

// Draw the top-down view
function drawTopView() {
    const ctx = topCtx;
    const width = topCanvas.width;
    const height = topCanvas.height;

    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, width, height);

    // Center of goal line
    const centerX = width / 2;
    const goalLineY = 100; // pixels from top

    // Draw ice markings
    ctx.strokeStyle = '#4169E1';
    ctx.lineWidth = 2;

    // Goal line
    ctx.beginPath();
    ctx.moveTo(0, goalLineY);
    ctx.lineTo(width, goalLineY);
    ctx.stroke();

    // Draw goal
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    const goalWidth = topInchesToPixels(GOAL_WIDTH);
    ctx.fillRect(centerX - goalWidth/2, goalLineY - 10, goalWidth, 10);
    ctx.strokeRect(centerX - goalWidth/2, goalLineY - 10, goalWidth, 10);

    // Draw crease
    ctx.strokeStyle = '#4169E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, goalLineY, topInchesToPixels(CREASE_RADIUS), 0, Math.PI);
    ctx.stroke();

    // Convert goalie position to canvas coordinates
    const goalieCanvasX = centerX + topInchesToPixels(state.goalie.x);
    const goalieCanvasY = goalLineY + topInchesToPixels(state.goalie.y);

    // Draw puck position
    const puckCanvasX = centerX + topInchesToPixels(state.puck.x);
    const puckCanvasY = goalLineY + topInchesToPixels(state.puck.y);

    // Draw lines and shading if shooting area is enabled
    if (state.showShootingArea) {
        // Goal posts in inches
        const leftPostX = -GOAL_WIDTH / 2;
        const rightPostX = GOAL_WIDTH / 2;
        const postY = 0;

        // Draw lines from puck to goal posts
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // Left post line
        ctx.beginPath();
        ctx.moveTo(puckCanvasX, puckCanvasY);
        ctx.lineTo(centerX + topInchesToPixels(leftPostX), goalLineY + topInchesToPixels(postY));
        ctx.stroke();

        // Right post line
        ctx.beginPath();
        ctx.moveTo(puckCanvasX, puckCanvasY);
        ctx.lineTo(centerX + topInchesToPixels(rightPostX), goalLineY + topInchesToPixels(postY));
        ctx.stroke();

        ctx.setLineDash([]);

        // Calculate and shade uncovered areas
        const goalieDim = getGoalieDimensions();
        const goalieLeft = state.goalie.x - goalieDim.width / 2;
        const goalieRight = state.goalie.x + goalieDim.width / 2;

        // Calculate angles and coverage
        const coverage = calculateCoverage();

        // Draw shaded areas (simplified representation in top view)
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';

        // Left uncovered area
        if (goalieLeft > leftPostX) {
            ctx.beginPath();
            ctx.moveTo(puckCanvasX, puckCanvasY);
            ctx.lineTo(centerX + topInchesToPixels(leftPostX), goalLineY);
            ctx.lineTo(centerX + topInchesToPixels(goalieLeft), goalLineY + topInchesToPixels(state.goalie.y));
            ctx.closePath();
            ctx.fill();
        }

        // Right uncovered area
        if (goalieRight < rightPostX) {
            ctx.beginPath();
            ctx.moveTo(puckCanvasX, puckCanvasY);
            ctx.lineTo(centerX + topInchesToPixels(rightPostX), goalLineY);
            ctx.lineTo(centerX + topInchesToPixels(goalieRight), goalLineY + topInchesToPixels(state.goalie.y));
            ctx.closePath();
            ctx.fill();
        }
    }

    // Draw goalie (top-down view - realistic)
    const goalieDim = getGoalieDimensions();
    const goalieWidthPx = topInchesToPixels(goalieDim.width);

    if (state.stance === 'butterfly') {
        drawGoalieTopButterfly(ctx, goalieCanvasX, goalieCanvasY, goalieWidthPx);
    } else {
        drawGoalieTopStandup(ctx, goalieCanvasX, goalieCanvasY, goalieWidthPx);
    }

    // Draw puck
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(puckCanvasX, puckCanvasY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('GOAL', centerX - 20, goalLineY - 20);
    ctx.fillText('PUCK', puckCanvasX + 15, puckCanvasY + 5);
}

// Draw the front view
function drawFrontView() {
    const ctx = frontCtx;
    const width = frontCanvas.width;
    const height = frontCanvas.height;

    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const bottomY = height - 50;

    // Draw goal
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 4;
    const goalWidthPx = frontInchesToPixels(GOAL_WIDTH);
    const goalHeightPx = frontInchesToPixels(GOAL_HEIGHT);

    // Goal frame
    ctx.strokeRect(
        centerX - goalWidthPx/2,
        bottomY - goalHeightPx,
        goalWidthPx,
        goalHeightPx
    );

    // Goal net pattern
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX - goalWidthPx/2 + (goalWidthPx * i / 6), bottomY - goalHeightPx);
        ctx.lineTo(centerX - goalWidthPx/2 + (goalWidthPx * i / 6), bottomY);
        ctx.stroke();
    }
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX - goalWidthPx/2, bottomY - goalHeightPx + (goalHeightPx * i / 4));
        ctx.lineTo(centerX + goalWidthPx/2, bottomY - goalHeightPx + (goalHeightPx * i / 4));
        ctx.stroke();
    }

    // Calculate perspective: how the goalie appears from puck position
    // Distance from puck to goalie
    const distance = Math.sqrt(
        Math.pow(state.puck.x - state.goalie.x, 2) +
        Math.pow(state.puck.y - state.goalie.y, 2)
    );

    // Apparent size based on distance (perspective)
    const scaleFactor = Math.max(0.3, 150 / (distance + 50));

    // Horizontal offset based on goalie's x position relative to puck angle
    const angleToGoalie = Math.atan2(state.goalie.x - state.puck.x, state.puck.y - state.goalie.y);
    const angleToCenter = Math.atan2(-state.puck.x, state.puck.y);
    const relativeAngle = angleToGoalie - angleToCenter;

    // Apparent horizontal position
    const apparentX = centerX + (relativeAngle * 1000);

    const goalieDim = getGoalieDimensions();
    const goalieWidthPx = frontInchesToPixels(goalieDim.width) * scaleFactor;
    const goalieHeightPx = frontInchesToPixels(goalieDim.height) * scaleFactor;

    // Draw shooting area visualization if enabled
    if (state.showShootingArea) {
        // Draw lines from puck perspective to goal posts
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);

        // Lines to posts
        ctx.beginPath();
        ctx.moveTo(centerX - goalWidthPx/2, bottomY);
        ctx.lineTo(centerX - goalWidthPx/2, bottomY + 30);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + goalWidthPx/2, bottomY);
        ctx.lineTo(centerX + goalWidthPx/2, bottomY + 30);
        ctx.stroke();

        ctx.setLineDash([]);

        // Calculate covered area
        const coverage = calculateCoverage();

        // Draw red shaded areas for uncovered parts
        ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';

        // Left side uncovered
        const leftEdge = apparentX - goalieWidthPx/2;
        const leftPost = centerX - goalWidthPx/2;
        if (leftEdge > leftPost) {
            ctx.fillRect(
                leftPost,
                bottomY - goalHeightPx,
                Math.min(leftEdge - leftPost, goalWidthPx),
                goalHeightPx
            );
        }

        // Right side uncovered
        const rightEdge = apparentX + goalieWidthPx/2;
        const rightPost = centerX + goalWidthPx/2;
        if (rightEdge < rightPost) {
            ctx.fillRect(
                Math.max(rightEdge, leftPost),
                bottomY - goalHeightPx,
                rightPost - Math.max(rightEdge, leftPost),
                goalHeightPx
            );
        }

        // Top uncovered (if goalie is shorter than goal)
        const goalieTop = bottomY - goalieHeightPx;
        const goalTop = bottomY - goalHeightPx;
        if (goalieTop > goalTop) {
            const overlapLeft = Math.max(leftEdge, leftPost);
            const overlapRight = Math.min(rightEdge, rightPost);
            if (overlapRight > overlapLeft) {
                ctx.fillRect(
                    overlapLeft,
                    goalTop,
                    overlapRight - overlapLeft,
                    goalieTop - goalTop
                );
            }
        }
    }

    // Draw goalie (front view - realistic)
    if (state.stance === 'butterfly') {
        drawGoalieFrontButterfly(ctx, apparentX, bottomY, goalieWidthPx, goalieHeightPx);
    } else {
        drawGoalieFrontStandup(ctx, apparentX, bottomY, goalieWidthPx, goalieHeightPx);
    }

    // Add label
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('NET', centerX - 20, bottomY + 45);
}

// Calculate net coverage percentage
function calculateCoverage() {
    const goalieDim = getGoalieDimensions();

    // Calculate angles from puck to goal posts
    const leftPostX = -GOAL_WIDTH / 2;
    const rightPostX = GOAL_WIDTH / 2;
    const postY = 0;

    // Angle from puck to each post
    const angleToLeftPost = Math.atan2(leftPostX - state.puck.x, postY - state.puck.y);
    const angleToRightPost = Math.atan2(rightPostX - state.puck.x, postY - state.puck.y);
    const totalAngle = angleToRightPost - angleToLeftPost;

    // Angles from puck to goalie edges
    const goalieLeftX = state.goalie.x - goalieDim.width / 2;
    const goalieRightX = state.goalie.x + goalieDim.width / 2;
    const goalieY = state.goalie.y;

    const angleToGoalieLeft = Math.atan2(goalieLeftX - state.puck.x, goalieY - state.puck.y);
    const angleToGoalieRight = Math.atan2(goalieRightX - state.puck.x, goalieY - state.puck.y);

    // Calculate overlap
    const overlapLeft = Math.max(angleToLeftPost, angleToGoalieLeft);
    const overlapRight = Math.min(angleToRightPost, angleToGoalieRight);
    const coveredAngle = Math.max(0, overlapRight - overlapLeft);

    // Horizontal coverage
    const horizontalCoverage = (coveredAngle / totalAngle) * 100;

    // Vertical coverage (simplified)
    const verticalCoverage = Math.min(100, (goalieDim.height / GOAL_HEIGHT) * 100);

    // Combined coverage (weighted toward horizontal)
    const coverage = (horizontalCoverage * 0.7 + verticalCoverage * 0.3);

    return Math.max(0, Math.min(100, coverage));
}

// Update coverage display
function updateCoverage() {
    const coverage = calculateCoverage();
    document.getElementById('coverage').textContent = coverage.toFixed(1) + '%';

    const coverageEl = document.getElementById('coverage');
    if (coverage < 40) {
        coverageEl.style.color = '#f44336';
    } else if (coverage < 70) {
        coverageEl.style.color = '#FF9800';
    } else {
        coverageEl.style.color = '#4CAF50';
    }
}

// Render both views
function render() {
    drawTopView();
    drawFrontView();
    updateCoverage();
}

// Toggle shooting area
function toggleShootingArea() {
    state.showShootingArea = !state.showShootingArea;
    const btn = document.getElementById('shootingToggle');
    btn.textContent = state.showShootingArea ? 'ON' : 'OFF';
    btn.classList.toggle('off');
    render();
}

// Toggle stance
function toggleStance() {
    state.stance = state.stance === 'standup' ? 'butterfly' : 'standup';
    const btn = document.getElementById('stanceToggle');
    btn.textContent = state.stance.toUpperCase();
    render();
}

// Mouse handling for top canvas
topCanvas.addEventListener('mousedown', (e) => {
    const rect = topCanvas.getBoundingClientRect();
    const scaleX = topCanvas.width / rect.width;
    const scaleY = topCanvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const centerX = topCanvas.width / 2;
    const goalLineY = 100;

    // Check if clicking on puck
    const puckCanvasX = centerX + topInchesToPixels(state.puck.x);
    const puckCanvasY = goalLineY + topInchesToPixels(state.puck.y);
    const distToPuck = Math.sqrt(Math.pow(mouseX - puckCanvasX, 2) + Math.pow(mouseY - puckCanvasY, 2));

    // Check if clicking on goalie
    const goalieCanvasX = centerX + topInchesToPixels(state.goalie.x);
    const goalieCanvasY = goalLineY + topInchesToPixels(state.goalie.y);
    const goalieDim = getGoalieDimensions();
    const goalieWidthPx = topInchesToPixels(goalieDim.width);
    const goalieDepthPx = topInchesToPixels(12);

    if (distToPuck < 15) {
        state.dragging = 'puck-top';
    } else if (
        mouseX >= goalieCanvasX - goalieWidthPx/2 &&
        mouseX <= goalieCanvasX + goalieWidthPx/2 &&
        mouseY >= goalieCanvasY - goalieDepthPx/2 &&
        mouseY <= goalieCanvasY + goalieDepthPx/2
    ) {
        state.dragging = 'goalie-top';
        state.dragOffsetX = mouseX - goalieCanvasX;
        state.dragOffsetY = mouseY - goalieCanvasY;
    }
});

topCanvas.addEventListener('mousemove', (e) => {
    if (!state.dragging || !state.dragging.includes('top')) return;

    const rect = topCanvas.getBoundingClientRect();
    const scaleX = topCanvas.width / rect.width;
    const scaleY = topCanvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const centerX = topCanvas.width / 2;
    const goalLineY = 100;

    if (state.dragging === 'puck-top') {
        state.puck.x = (mouseX - centerX) / TOP_SCALE;
        state.puck.y = (mouseY - goalLineY) / TOP_SCALE;
        // Constrain puck
        state.puck.x = Math.max(-100, Math.min(100, state.puck.x));
        state.puck.y = Math.max(12, Math.min(280, state.puck.y));
    } else if (state.dragging === 'goalie-top') {
        state.goalie.x = (mouseX - centerX - state.dragOffsetX) / TOP_SCALE;
        state.goalie.y = (mouseY - goalLineY - state.dragOffsetY) / TOP_SCALE;
        // Constrain goalie
        state.goalie.x = Math.max(-50, Math.min(50, state.goalie.x));
        state.goalie.y = Math.max(6, Math.min(100, state.goalie.y));
    }

    render();
});

topCanvas.addEventListener('mouseup', () => {
    if (state.dragging && state.dragging.includes('top')) {
        state.dragging = null;
    }
});

topCanvas.addEventListener('mouseleave', () => {
    if (state.dragging && state.dragging.includes('top')) {
        state.dragging = null;
    }
});

// Mouse handling for front canvas
frontCanvas.addEventListener('mousedown', (e) => {
    const rect = frontCanvas.getBoundingClientRect();
    const scaleX = frontCanvas.width / rect.width;
    const scaleY = frontCanvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const centerX = frontCanvas.width / 2;
    const bottomY = frontCanvas.height - 50;

    // Calculate goalie position in front view
    const distance = Math.sqrt(
        Math.pow(state.puck.x - state.goalie.x, 2) +
        Math.pow(state.puck.y - state.goalie.y, 2)
    );
    const scaleFactor = Math.max(0.3, 150 / (distance + 50));
    const angleToGoalie = Math.atan2(state.goalie.x - state.puck.x, state.puck.y - state.goalie.y);
    const angleToCenter = Math.atan2(-state.puck.x, state.puck.y);
    const relativeAngle = angleToGoalie - angleToCenter;
    const apparentX = centerX + (relativeAngle * 1000);

    const goalieDim = getGoalieDimensions();
    const goalieWidthPx = frontInchesToPixels(goalieDim.width) * scaleFactor;
    const goalieHeightPx = frontInchesToPixels(goalieDim.height) * scaleFactor;

    if (
        mouseX >= apparentX - goalieWidthPx/2 &&
        mouseX <= apparentX + goalieWidthPx/2 &&
        mouseY >= bottomY - goalieHeightPx &&
        mouseY <= bottomY
    ) {
        state.dragging = 'goalie-front';
        state.dragStartX = mouseX;
        state.dragStartGoalieX = state.goalie.x;
        state.dragStartGoalieY = state.goalie.y;
    }
});

frontCanvas.addEventListener('mousemove', (e) => {
    if (state.dragging !== 'goalie-front') return;

    const rect = frontCanvas.getBoundingClientRect();
    const scaleX = frontCanvas.width / rect.width;
    const scaleY = frontCanvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const deltaX = mouseX - state.dragStartX;

    // Move goalie horizontally
    // Convert screen delta to angle delta to world position
    const angleDelta = deltaX / 1000;
    const angleToCenter = Math.atan2(-state.puck.x, state.puck.y);
    const newAngle = angleToCenter + angleDelta;

    // Calculate new goalie X position
    const distance = state.goalie.y;
    state.goalie.x = state.dragStartGoalieX + deltaX / 10; // Simplified movement

    // Constrain
    state.goalie.x = Math.max(-50, Math.min(50, state.goalie.x));

    render();
});

frontCanvas.addEventListener('mouseup', () => {
    if (state.dragging === 'goalie-front') {
        state.dragging = null;
    }
});

frontCanvas.addEventListener('mouseleave', () => {
    if (state.dragging === 'goalie-front') {
        state.dragging = null;
    }
});

// Touch support for mobile
function addTouchSupport(canvas, type) {
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
}

addTouchSupport(topCanvas, 'top');
addTouchSupport(frontCanvas, 'front');

// Initial render
render();
