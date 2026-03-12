import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const LiquidEther = ({
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  mouseForce = 20,
  cursorSize = 100,
  isViscous = true,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  resolution = 0.5,
  isBounce = false,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 3000,
  autoRampDuration = 0.6,
  color0 = '#5227FF',
  color1 = '#FF9FFC',
  color2 = '#B19EEF'
}) => {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    // Camera
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0.1,
      1000
    )
    camera.position.z = 1
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * resolution)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Shader Material for Liquid Effect
    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(width, height) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        color1: { value: new THREE.Color(color0) },
        color2: { value: new THREE.Color(color1) },
        color3: { value: new THREE.Color(color2) },
        intensity: { value: autoIntensity },
        viscosity: { value: viscous / 100 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float intensity;
        uniform float viscosity;
        
        varying vec2 vUv;
        
        // Noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vec2 uv = vUv;
          vec2 p = uv * 2.0 - 1.0;
          p.x *= resolution.x / resolution.y;
          
          // Mouse influence
          vec2 mouseInfluence = mouse - uv;
          float mouseDist = length(mouseInfluence);
          float mouseEffect = smoothstep(0.3, 0.0, mouseDist) * intensity;
          
          // Animated noise
          float t = time * 0.2;
          float n1 = snoise(uv * 3.0 + vec2(t * 0.5, t * 0.3)) * 0.5 + 0.5;
          float n2 = snoise(uv * 2.0 - vec2(t * 0.3, t * 0.5)) * 0.5 + 0.5;
          float n3 = snoise(uv * 4.0 + vec2(t * 0.7, -t * 0.4)) * 0.5 + 0.5;
          
          // Add mouse turbulence
          n1 += mouseEffect * 0.5;
          n2 += mouseEffect * 0.3;
          
          // Viscous flow effect
          float flow = mix(n1, n2, viscosity);
          flow = mix(flow, n3, 0.3);
          
          // Color mixing
          vec3 color = mix(color1, color2, flow);
          color = mix(color, color3, n3);
          
          // Add subtle gradients
          color += vec3(0.1) * (1.0 - length(p) * 0.3);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Mouse tracking
    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current.x = (event.clientX - rect.left) / width
      mouseRef.current.y = 1.0 - (event.clientY - rect.top) / height
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('mouseenter', handleMouseEnter)
      containerRef.current.addEventListener('mouseleave', handleMouseLeave)
      containerRef.current.addEventListener('mousemove', handleMouseMove)
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      timeRef.current += 0.01

      // Animate only when hovered
      if (isHovered) {
        material.uniforms.mouse.value.x = mouseRef.current.x
        material.uniforms.mouse.value.y = mouseRef.current.y
        material.uniforms.intensity.value = autoIntensity
      } else {
        // Fade out when not hovering
        material.uniforms.intensity.value *= 0.95
      }

      material.uniforms.time.value = timeRef.current

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight

      camera.left = newWidth / -2
      camera.right = newWidth / 2
      camera.top = newHeight / 2
      camera.bottom = newHeight / -2
      camera.updateProjectionMatrix()

      renderer.setSize(newWidth, newHeight)
      material.uniforms.resolution.value.set(newWidth, newHeight)

      mesh.geometry.dispose()
      mesh.geometry = new THREE.PlaneGeometry(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter)
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave)
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [colors, mouseForce, cursorSize, isViscous, viscous, resolution, autoDemo, autoSpeed, autoIntensity, color0, color1, color2, isHovered])

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        opacity: isHovered ? 1 : 0.3,
        transition: 'opacity 0.5s ease-in-out'
      }}
    />
  )
}

export default LiquidEther
