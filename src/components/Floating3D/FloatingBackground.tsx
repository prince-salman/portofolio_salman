import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import styled from 'styled-components'

// --- 3D Primitive Component ---
function FloatingShape({
  geometry,
  color,
  position,
  rotationSpeed,
  floatSpeed,
  offset,
}: {
  geometry: THREE.BufferGeometry
  color: string
  position: [number, number, number]
  rotationSpeed: [number, number, number]
  floatSpeed: number
  offset: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    // Base rotation
    meshRef.current.rotation.x += rotationSpeed[0]
    meshRef.current.rotation.y += rotationSpeed[1]
    meshRef.current.rotation.z += rotationSpeed[2]

    // Floating animation (bobbing up and down)
    const yOffset = Math.sin(t * floatSpeed + offset) * 0.5
    
    // Parallax effect based on mouse (pointer is normalized -1 to 1)
    const parallaxX = pointer.x * 0.5
    const parallaxY = pointer.y * 0.5

    meshRef.current.position.set(
      position[0] + parallaxX,
      position[1] + yOffset + parallaxY,
      position[2]
    )
  })

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshBasicMaterial color={color} />
      {/* Thick black edges for cel-shaded/neubrutalism look */}
      <Edges color="black" threshold={15} scale={1.05} />
    </mesh>
  )
}

// --- Scene ---
function Scene() {
  const { viewport } = useThree()
  
  // Calculate responsive positions based on viewport width
  const isMobile = viewport.width < 10

  const shapes = [
    {
      geo: new THREE.BoxGeometry(2, 2, 2),
      color: '#FFE500', // Yellow
      pos: [isMobile ? -2 : -6, 4, -5] as [number, number, number],
      rotSpeed: [0.005, 0.01, 0.005] as [number, number, number],
      floatSpeed: 1.5,
      offset: 0,
    },
    {
      geo: new THREE.OctahedronGeometry(2, 0),
      color: '#0055FF', // Blue
      pos: [isMobile ? 3 : 7, 2, -8] as [number, number, number],
      rotSpeed: [-0.01, -0.005, 0.01] as [number, number, number],
      floatSpeed: 1.2,
      offset: Math.PI / 2,
    },
    {
      geo: new THREE.TorusGeometry(1.5, 0.6, 16, 32),
      color: '#FFFFFF', // White
      pos: [isMobile ? -3 : -7, -3, -6] as [number, number, number],
      rotSpeed: [0.01, 0.01, 0] as [number, number, number],
      floatSpeed: 0.8,
      offset: Math.PI,
    },
    {
      geo: new THREE.ConeGeometry(1.8, 3, 16),
      color: '#00E5B0', // Green
      pos: [isMobile ? 2 : 6, -4, -7] as [number, number, number],
      rotSpeed: [0.005, 0.015, -0.005] as [number, number, number],
      floatSpeed: 1.0,
      offset: Math.PI * 1.5,
    },
  ]

  return (
    <>
      <ambientLight intensity={1} />
      {shapes.map((s, i) => (
        <FloatingShape
          key={i}
          geometry={s.geo}
          color={s.color}
          position={s.pos}
          rotationSpeed={s.rotSpeed}
          floatSpeed={s.floatSpeed}
          offset={s.offset}
        />
      ))}
    </>
  )
}

// --- Wrapper ---
const CanvasWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9997; /* Above background but behind content */
  pointer-events: none; /* Let clicks pass through */
`

export default function FloatingBackground() {
  return (
    <CanvasWrapper>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </CanvasWrapper>
  )
}
