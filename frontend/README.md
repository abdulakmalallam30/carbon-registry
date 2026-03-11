# Blue Carbon Registry

A modern, responsive web application for registering, monitoring, and verifying blue carbon ecosystem projects.

## 🌊 Overview

The Blue Carbon Registry is a transparent digital system designed to manage carbon credits from ocean and coastal ecosystems such as mangroves, seagrasses, and salt marshes. Built with cutting-edge web technologies, it provides a clean, modern, and futuristic interface for stakeholders in the carbon credit market.

## ✨ Features

- **Animated Background**: Beautiful tree visualization with animated roots representing flowing energy
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **Smooth Animations**: Powered by Framer Motion for fluid, engaging user interactions
- **Modern UI**: Clean design with ocean-inspired color palette (deep blue, cyan, teal)
- **Fast Performance**: Built with Vite for lightning-fast development and optimized production builds

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **React Router** - Declarative routing for React

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── TreeBackground.jsx  # Animated background component
│   │   ├── Navbar.jsx          # Navigation bar with smooth animations
│   │   └── Footer.jsx          # Footer component
│   ├── pages/
│   │   ├── Home.jsx            # Home page with hero and sections
│   │   └── About.jsx           # About page with mission and technology
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles and Tailwind imports
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## 🎨 Design Features

### Color Palette
- **Deep Blue** (#001f3f) - Primary background
- **Cyan/Teal** (#00bcd4, #00bfa5, #64ffda) - Accents and highlights
- **Ocean Blue** (#0074D9, #00a8e8) - Interactive elements
- **White** - Text and contrast

### Key Components

#### TreeBackground
- Minimalistic tree outline with glowing effects
- Animated roots that flow like underground energy
- Continuous looping animations using Framer Motion
- SVG-based with gradient effects and glow filters

#### Navbar
- Fixed position with scroll-aware background
- Active route highlighting
- Smooth hover animations
- Responsive design

#### Footer
- Quick links and project information
- Animated on scroll
- Gradient borders and backdrop blur effects

### Pages

#### Home Page (/)
1. **Hero Section** - Large title, subtitle, and CTA buttons
2. **What is Blue Carbon** - Educational section with statistics
3. **Why a Registry** - Three key pillars (Transparency, Traceability, Verification)
4. **Key Features** - Interactive feature cards

#### About Page (/about)
1. **Mission Section** - Project goals and vision
2. **Why Blue Carbon Matters** - Ecosystem information (Mangroves, Seagrasses, Salt Marshes)
3. **Technology Section** - MRV Systems, Blockchain, Satellite Monitoring
4. **Call to Action** - Engagement section

## 🛠️ Development

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000/`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎯 Future Enhancements

- Integration with blockchain for carbon credit verification
- Real-time MRV data visualization
- User authentication and dashboard
- Project submission and management interface
- Carbon credit marketplace
- Multi-language support

## 📄 License

This project is part of the Carbon Registry system.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

Built with ❤️ for a sustainable future
