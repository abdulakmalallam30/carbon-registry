# TreeBackground Component

An animated SVG background component for the Blue Carbon Registry that visualizes CO₂ flow through a tree ecosystem.

## Overview

The TreeBackground component creates a large, minimalistic tree outline with animated roots and CO₂ particles that flow continuously from the roots → trunk → branches, representing carbon flow through ecosystems.

## Features

### 1. Tree Structure
- **Large centered tree** that fills most of the screen
- **Trunk**: Vertical main structure (5px stroke width)
- **Branches**: Multiple levels of branches spreading outward
- **Root System**: Extensive underground network spreading across the bottom

### 2. Visual Style
- **Colors**:
  - Background: Dark ocean blue (#041c32)
  - Tree lines: Cyan/teal gradient (#00d9ff → #00bfa5 → #0097a7)
  - CO₂ particles: Light blue glowing dots (#64ffda, #00d9ff)
- **Effects**:
  - Glowing SVG filters for all elements
  - Stronger glow for CO₂ particles
  - Pulsing animations on roots
  - Ambient atmospheric blur effects

### 3. CO₂ Particle Animation

#### Main Particle Paths
The component includes **6 primary particle paths** that flow through the complete system:

1. **Path 1**: Left root → trunk → left branch (12s duration)
2. **Path 2**: Right root → trunk → right branch (12s duration, 3s delay)
3. **Path 3**: Center-left root → trunk → top branches (10s duration, 6s delay)
4. **Path 4**: Center-right root → trunk → top branches (10s duration, 9s delay)
5. **Path 5**: Far left root → trunk → mid branch (13s duration, 1.5s delay)
6. **Path 6**: Far right root → trunk → mid branch (13s duration, 4.5s delay)

Each particle:
- Travels along a custom SVG path
- Has scale animations (grows and shrinks)
- Has opacity transitions (fades in/out)
- Includes a trail effect (secondary particle)
- Loops infinitely

#### Additional Ambient Particles
- **12 smaller ambient particles** flow from various root points toward the trunk
- Create a sense of continuous energy movement
- Staggered delays for natural flow

#### Pulsing Root Energy
- **4 expanding circles** emanate from the trunk base
- Create a "heartbeat" effect where roots connect to trunk
- Suggests energy collection point

### 4. Root Animations

Root segments have:
- **Pulsing opacity**: Roots gently pulse between 0.3-0.7 opacity
- **Variable animation timing**: 3-4 second cycles with different delays
- **Multiple layers**: Primary, secondary, and tertiary root networks

### 5. Responsiveness

- Uses `viewBox="0 0 1920 1080"` for consistent scale
- `preserveAspectRatio="xMidYMid slice"` ensures full coverage
- All paths use relative coordinates
- Tree scales proportionally on all screen sizes

## Technical Implementation

### Technologies Used
- **React**: Component structure
- **Framer Motion**: Animation library
- **SVG**: Vector graphics for tree structure
- **CSS**: Atmospheric effects

### Key Techniques

#### 1. SVG Path Animation
```jsx
<motion.path
  initial={{ pathLength: 0, opacity: 0 }}
  animate={{ pathLength: 1, opacity: 0.7 }}
  transition={{ duration: 2, ease: "easeInOut" }}
/>
```

#### 2. Particle Path Following
Uses CSS `offset-path` with Framer Motion:
```jsx
style={{
  offsetPath: `path('${generatePathString(particleData.path)}')`,
}}
```

#### 3. SVG Filters
- **Glow filter**: Gaussian blur with merge for soft glow
- **Strong glow filter**: Double blur for particle emphasis

#### 4. Gradients
- **Linear gradient**: For tree structure color transitions
- **Radial gradient**: For particle glow effect

## Component Structure

```
TreeBackground.jsx
├── Particle path definitions (6 main paths)
├── SVG container with viewBox
├── Definitions (gradients, filters)
├── Root network (9 animated paths)
├── Trunk (1 main path)
├── Branches (8 paths of varying sizes)
├── CO₂ particles (6 main + 6 trails)
├── Ambient particles (12 additional)
├── Pulsing effects (4 expanding circles)
└── Atmospheric blur effects (3 div elements)
```

## Usage

```jsx
import TreeBackground from './components/TreeBackground'

function App() {
  return (
    <div className="relative min-h-screen">
      <TreeBackground />
      <main className="relative z-10">
        {/* Your content here */}
      </main>
    </div>
  )
}
```

## Customization

### Adjust Animation Speed
Change duration values in `particlePaths` array:
```jsx
duration: 12  // Slower
duration: 6   // Faster
```

### Modify Colors
Update the gradient definitions:
```jsx
<linearGradient id="treeGradient">
  <stop stopColor="#YOUR_COLOR" />
</linearGradient>
```

### Add More Particles
Extend the `particlePaths` array with new path definitions:
```jsx
{
  path: [
    { x: startX, y: startY },
    { x: midX, y: midY },
    { x: endX, y: endY }
  ],
  delay: 0,
  duration: 10
}
```

### Adjust Tree Size
Modify path coordinates in the SVG elements:
- Increase values for larger tree
- Decrease values for smaller tree
- Keep proportions consistent

## Performance Notes

- Uses CSS transforms for optimal performance
- All animations run on GPU via Framer Motion
- SVG filters may impact performance on low-end devices
- Fixed positioning ensures no reflow/repaint on scroll

## Browser Support

- Chrome/Edge (full support)
- Firefox (full support)
- Safari (full support)
- Requires CSS `offset-path` support (modern browsers)

## Accessibility

- Component uses `pointer-events-none` to prevent interaction
- Purely decorative, doesn't interfere with content
- No ARIA labels needed (background decoration)

## Future Enhancements

- Add interactive hover effects on particle paths
- Include seasonal variations (different colors)
- Add sound effects (optional) synced to particle flow
- Create admin controls for animation speed
- Add day/night mode with color transitions

---

**Component Type**: Decorative Background  
**Animation Library**: Framer Motion  
**File Size**: ~8KB  
**Dependencies**: react, framer-motion
