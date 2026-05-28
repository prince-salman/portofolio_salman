import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Text, useTexture, useGLTF } from '@react-three/drei'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'
import styled from 'styled-components'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import './Lanyard.css'

// @ts-ignore
import defaultLanyardTexture from './lanyard.png'
// @ts-ignore
import cardGLB from './card.glb'

extend({ MeshLineGeometry, MeshLineMaterial })

const LanyardWrapper = styled.div`
  width: 100%;
  height: 600px;
  position: relative;
  z-index: 10;
  touch-action: none; /* Prevent scroll while dragging */

  @media (max-width: 1024px) {
    height: 500px;
  }
  @media (max-width: 600px) {
    height: 400px;
  }
`

function CardFace({ isMobile }: { isMobile: boolean }) {
  const portfolioData = usePortfolioData()
  const hero = portfolioData.hero || {}
  const { nodes, materials } = useGLTF(cardGLB) as any

  return (
    <group position={[0, -1.2, -0.05]}>
      {/* 3D Model from ReactBits */}
      <mesh geometry={nodes.card.geometry}>
        <meshPhysicalMaterial
          map={materials.base.map}
          map-anisotropy={16}
          clearcoat={isMobile ? 0 : 1}
          clearcoatRoughness={0.15}
          roughness={0.9}
          metalness={0.8}
        />
      </mesh>
      <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
      <mesh geometry={nodes.clamp.geometry} material={materials.metal} />

      {/* Salman Portfolio Data Overlay */}
      <group position={[0, 0, 0.01]} scale={0.45}>
        <mesh position={[0, 0.355, 0.006]}>
          <planeGeometry args={[0.71, 0.29]} />
          <meshStandardMaterial color={hero.lanyard.accent1} />
        </mesh>

        <mesh position={[0, 0.205, 0.007]}>
          <planeGeometry args={[0.71, 0.015]} />
          <meshStandardMaterial color={hero.lanyard.accent2} />
        </mesh>

        <mesh position={[0, 0.03, 0.007]}>
          <circleGeometry args={[0.155, 40]} />
          <meshStandardMaterial color={hero.lanyard.accent2} />
        </mesh>

        <Text position={[0, 0.03, 0.009]} fontSize={0.09} color={hero.lanyard.accent1}
          anchorX="center" anchorY="middle" fontWeight="bold">
          {hero.name.substring(0, 2).toUpperCase()}
        </Text>

        <Text position={[0, 0.365, 0.009]} fontSize={0.065} color="#0033CC"
          anchorX="center" anchorY="middle" fontWeight="bold" letterSpacing={0.08}>
          {hero.name.toUpperCase()}
        </Text>

        <Text position={[0, -0.17, 0.007]} fontSize={0.04} color={hero.lanyard.accent1}
          anchorX="center" anchorY="middle">
          {hero.fullName}
        </Text>

        <Text position={[0, -0.24, 0.007]} fontSize={0.032} color="rgba(255,255,255,0.7)"
          anchorX="center" anchorY="middle">
          {hero.role}
        </Text>

        <Text position={[0, -0.3, 0.007]} fontSize={0.025} color="rgba(255,255,255,0.4)"
          anchorX="center" anchorY="middle">
          {hero.school}
        </Text>
      </group>

      {/* BACK Overlay (Mirrored 180 degrees) */}
      {/* Z position pushed to -0.08 to make sure it doesn't clip inside the thick 3D model */}
      <group position={[0, 0, -0.08]} rotation={[0, Math.PI, 0]} scale={0.45}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.71, 0.9]} />
          <meshStandardMaterial color={hero.lanyard.cardBg} roughness={0.3} />
        </mesh>

        <mesh position={[0, 0.35, 0.006]}>
          <planeGeometry args={[0.71, 0.15]} />
          <meshStandardMaterial color={hero.lanyard.accent1} />
        </mesh>

        <Text position={[0, 0.35, 0.01]} fontSize={0.06} color="#0033CC"
          anchorX="center" anchorY="middle" fontWeight="bold">
          PORTFOLIO ID
        </Text>

        <Text position={[0, 0.05, 0.01]} fontSize={0.12} color={hero.lanyard.accent1}
          anchorX="center" anchorY="middle" fontWeight="bold" letterSpacing={0.05}>
          SALMAN
        </Text>

        <Text position={[0, -0.15, 0.01]} fontSize={0.04} color="rgba(255,255,255,0.8)"
          anchorX="center" anchorY="middle">
          SCAN TO CONNECT
        </Text>

        {/* Fake QR Code Pattern */}
        <mesh position={[0, -0.3, 0.01]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, -0.3, 0.011]}>
          <planeGeometry args={[0.15, 0.15]} />
          <meshStandardMaterial color="#0033CC" wireframe />
        </mesh>
      </group>
    </group>
  )
}

function SpringLanyard({ isMobile = false }: { isMobile?: boolean }) {
  const portfolioData = usePortfolioData()
  const hero = portfolioData.hero || {}
  const cardRef = useRef<THREE.Group>(null)
  const bandRef = useRef<any>(null)

  // Load dynamic texture from CMS if exists, otherwise fallback to local asset
  const textureUrl = hero.lanyard?.texture || defaultLanyardTexture
  const texture = useTexture(textureUrl)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]))

  // Physics state
  const state = useRef({
    pos: new THREE.Vector3(0, 0, 0), // Card physical position
    vel: new THREE.Vector3(0, 0, 0),
    rot: new THREE.Vector3(0, 0, 0), // Card angular velocity tracking
    rotVel: new THREE.Vector3(0, 0, 0),
    dragTarget: new THREE.Vector3(),
    isDragging: false,
    dragOffset: new THREE.Vector3()
  })

  const anchor = new THREE.Vector3(0, 3, 0)
  const lanyardLength = 1.8 // Shortened from 3.5

  const vec = new THREE.Vector3()
  const dir = new THREE.Vector3()

  // For pointer cursors
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = state.current.isDragging ? 'grabbing' : 'grab'
      return () => { document.body.style.cursor = 'auto' }
    }
  }, [hovered, state.current.isDragging])

  useFrame((r3fState, delta) => {
    const s = state.current
    const dt = Math.min(delta, 0.05) // Cap delta to prevent explosion on lag

    if (s.isDragging) {
      vec.set(r3fState.pointer.x, r3fState.pointer.y, 0.5).unproject(r3fState.camera)
      dir.copy(vec).sub(r3fState.camera.position).normalize()
      vec.add(dir.multiplyScalar(r3fState.camera.position.length()))
      
      const targetPos = vec.clone().sub(s.dragOffset)
      const pullForce = targetPos.clone().sub(s.pos).multiplyScalar(200)
      
      s.vel.add(pullForce.multiplyScalar(dt))
      s.vel.multiplyScalar(0.7) 

      // Mouse drag generates fluid spin for front-to-back flipping (Y axis)
      // Massive multiplier to ensure the card spins like a globe effortlessly
      s.rotVel.y += pullForce.x * 0.8 * dt
      s.rotVel.x += pullForce.y * 0.05 * dt
    } else {
      s.vel.y -= 40 * dt // Stronger gravity
      s.vel.multiplyScalar(0.98)
    }

    s.pos.add(s.vel.clone().multiplyScalar(dt))

    const distToAnchor = s.pos.distanceTo(anchor)
    if (distToAnchor > lanyardLength) {
      const correction = s.pos.clone().sub(anchor).normalize()
      const overshoot = distToAnchor - lanyardLength
      
      // Rubber band effect: allow stretching, but pull back with strong spring force
      const springForce = correction.clone().multiplyScalar(-overshoot * 400)
      s.vel.add(springForce.multiplyScalar(dt))
      
      // Add a bit of damping when stretched so it doesn't oscillate infinitely
      s.vel.multiplyScalar(0.9)
    }

    // Calculate exact angle of the string pendulum
    const dx = s.pos.x - anchor.x
    const dy = s.pos.y - anchor.y
    const dz = s.pos.z - anchor.z

    // The angle the string makes in the XY plane
    const targetZ = Math.atan2(dx, -dy)
    // The angle the string makes in the ZY plane
    const targetX = Math.atan2(-dz, -dy)

    // Smoothly align the card's tilt (X and Z) to match the string's exact angle
    s.rotVel.z += (targetZ - s.rot.z) * 15 * dt
    s.rotVel.x += (targetX - s.rot.x) * 15 * dt

    // For the Y axis (front/back flipping), let it spin freely but slowly dampen
    // Removing the forced face-forward torque so they can inspect the back easily!
    s.rotVel.y *= 0.98
    
    // Apply angular velocity to rotation
    s.rotVel.multiplyScalar(0.92) 
    s.rot.add(s.rotVel.clone().multiplyScalar(dt))

    // Apply transforms to card
    if (cardRef.current) {
      // s.pos is the clip hole position.
      // The 3D model clip hole is approximately at local offset +1.5 * 2.25 = 3.375?
      // Wait, in ReactBits, the anchor is 1.5 units above RigidBody center.
      // We will just offset the visual card by exactly 1.5 units downwards.
      const cardCenterOffset = new THREE.Vector3(0, -1.5, 0).applyEuler(new THREE.Euler(s.rot.x, s.rot.y, s.rot.z))
      const cardCenterPos = s.pos.clone().add(cardCenterOffset)
      
      cardRef.current.position.copy(cardCenterPos)
      cardRef.current.rotation.set(s.rot.x, s.rot.y, s.rot.z)
    }

    // Update string geometry points
    const p1 = anchor
    const p4 = s.pos // String attaches directly to the clip hole position!
    
    // Middle points for natural curve
    const midY = (p1.y + p4.y) / 2
    const slack = Math.max(0, lanyardLength - p1.distanceTo(p4)) * 0.5
    
    const p2 = new THREE.Vector3(
      p1.x + (p4.x - p1.x) * 0.33,
      midY + slack,
      p1.z + (p4.z - p1.z) * 0.33
    )
    
    const p3 = new THREE.Vector3(
      p1.x + (p4.x - p1.x) * 0.66,
      midY + slack * 0.8,
      p1.z + (p4.z - p1.z) * 0.66
    )

    curve.points[0].copy(p4)
    curve.points[1].copy(p3)
    curve.points[2].copy(p2)
    curve.points[3].copy(p1)
    
    if (bandRef.current) {
      bandRef.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32))
    }
  })

  curve.curveType = 'chordal'

  const handlePointerDown = (e: any) => {
    e.target.setPointerCapture(e.pointerId)
    const s = state.current
    s.isDragging = true
    vec.copy(e.point)
    s.dragOffset.copy(vec).sub(s.pos)
  }

  const handlePointerUp = (e: any) => {
    e.target.releasePointerCapture(e.pointerId)
    state.current.isDragging = false
  }

  return (
    <>
      <group 
        ref={cardRef}
        scale={2.25}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <CardFace isMobile={isMobile} />
      </group>
      <mesh ref={bandRef}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}

export default function Lanyard() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <LanyardWrapper>
      <div className="lanyard-wrapper">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 25 }}
          dpr={[1, isMobile ? 1.5 : 2]}
          gl={{ alpha: true }}
          onCreated={({ gl }) =>
            gl.setClearColor(new THREE.Color(0x000000), 0)
          }
        >
          <ambientLight intensity={Math.PI} />
          
          <SpringLanyard isMobile={isMobile} />

          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Canvas>
      </div>
    </LanyardWrapper>
  )
}
