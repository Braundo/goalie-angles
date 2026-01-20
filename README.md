# Hockey Goalie Angles Training Tool

An interactive web application designed to help ice hockey goalies understand the critical importance of positioning and angles in net coverage.

## Overview

This educational tool provides real-time visual feedback showing how goalie positioning affects net coverage from different shooting positions. By experimenting with various positions and stances, goalies can develop better spatial awareness and positioning instincts.

## Visual Features

### Realistic Goalie Representation

The app features detailed, realistic goalie silhouettes showing proper equipment:

**Standup Stance:**
- White leg pads positioned side-by-side
- Grey chest protector and shoulder pads
- Red catching glove (left side, raised)
- Blue blocker (right side, with stick)
- Brown wooden stick angled downward
- Dark helmet with visible cage bars

**Butterfly Stance:**
- Leg pads spread wide and flat for maximum coverage
- Pad straps visible across both legs
- Lower, compressed body position
- Extended glove and blocker for wider coverage
- Stick positioned horizontally across the pads
- Helmet in lower, crouched position

Both stances show realistic proportions and proper positioning, helping goalies visualize correct form while learning angles.

## Features

### Dual View System
- **Top-Down View**: Aerial perspective showing the goal, crease, puck position, and goalie
- **Front View**: Shooter's perspective showing the net and goalie from the puck's angle
- Both views are synchronized - changes in one instantly reflect in the other

### Interactive Elements
- **Draggable Puck**: Click and drag the puck anywhere on the ice in the top-down view
- **Draggable Goalie**: Reposition the goalie in either view by clicking and dragging
- **Real-time Updates**: All visualizations update instantly as elements are moved

### Visual Feedback
- **Red Shaded Areas**: Clearly shows uncovered portions of the net where a shooter can score
- **Yellow Shooting Lines**: Dashed lines from puck to goal posts indicate the shooting angle
- **Coverage Percentage**: Live calculation showing what percentage of the net is covered
- **Color-Coded Coverage**:
  - Green (>70%): Excellent positioning
  - Orange (40-70%): Moderate coverage
  - Red (<40%): Poor positioning

### Training Features
- **Shooting Area Toggle**: Turn OFF to hide lines and shaded areas, allowing goalies to practice positioning blind, then toggle ON to see results
- **Stance Toggle**: Switch between STANDUP and BUTTERFLY positions to see how stance affects coverage
  - Standup: 30" wide × 60" tall (5 feet)
  - Butterfly: 54" wide × 36" tall (wider but lower)

### Technical Specifications
- **Official NHL Dimensions**:
  - Goal: 6 feet wide × 4 feet tall
  - Crease: 6 feet radius
  - Goalie: 5 feet tall
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Support**: Full touch screen support for mobile training

## Getting Started

### Installation
No installation required! This is a static web application.

### Running the App
1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Start experimenting with positions

```bash
# If you want to serve it locally:
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

### Basic Usage
1. **Move the Puck**: Click and drag the black puck in the top-down view to simulate different shooting positions
2. **Position the Goalie**: Click and drag the white goalie rectangle in either view
3. **Observe Coverage**: Watch the red shaded areas and coverage percentage
4. **Try Different Stances**: Toggle between STANDUP and BUTTERFLY to see the difference
5. **Practice Blind**: Turn OFF the shooting area, position yourself, then turn it back ON to check

## Educational Objectives

### Key Concepts Demonstrated

1. **Angle Play**: Shows how being centered on the puck angle is more important than simply being centered in the crease
2. **Depth Management**: Demonstrates how moving closer to the shooter (challenging the shot) increases net coverage
3. **Lateral Positioning**: Illustrates the importance of moving side-to-side with the puck
4. **Stance Selection**: Compares coverage differences between standup and butterfly positions

### Common Scenarios to Practice

- **Slot Shot**: Position puck directly in front (0, 200)
- **Corner Shot**: Move puck to extreme angles to see how angles compress
- **Point Shot**: Place puck farther back to simulate point shots
- **Cross-Crease**: Drag puck from corner to corner to practice lateral movement

## File Structure

```
goalie-angles/
├── index.html      # Main HTML structure
├── styles.css      # All styling and layout
├── app.js          # Core application logic and canvas rendering
└── README.md       # This file
```

## Technology Stack

- **HTML5 Canvas**: For rendering the ice rink and interactive elements
- **Vanilla JavaScript**: No frameworks or dependencies
- **CSS3**: Modern styling with gradients and responsive grid layout
- **No Build Process**: Pure static files - just open and run

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (Recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

### Canvas Rendering
- Two independent canvas elements
- Real-time coordinate transformation between world space (inches) and screen space (pixels)
- Efficient rendering using HTML5 Canvas 2D context

### Coordinate System
- World coordinates in inches (NHL standard)
- Origin at center of goal line
- Positive X = right, Positive Y = away from goal

### Coverage Calculation
Uses trigonometry to calculate:
1. Angle from puck to each goal post
2. Angle from puck to each goalie edge
3. Overlap between goal angle and goalie coverage
4. Combined horizontal and vertical coverage (weighted 70/30)

## Future Enhancements (Ideas)

- [ ] Save/load preset scenarios
- [ ] Add shot visualization (puck trajectory)
- [ ] Add tracking of positioning over time
- [ ] Multi-player mode for coaching sessions
- [ ] Export positioning reports
- [ ] Add more goalie sizes (junior, intermediate)
- [ ] Customizable equipment colors and team jerseys

## Contributing

This is an educational tool. Suggestions for improvements are welcome! Consider:
- Improving the perspective calculations
- Adding drill scenarios
- Mobile UX enhancements
- Adding customizable equipment colors

## License

Free to use for educational purposes.

## Credits

Created for hockey goalie training and education. Uses official NHL regulation dimensions for realistic training scenarios.

## Contact

For questions, issues, or suggestions, please open an issue in the repository.
