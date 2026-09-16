import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Grid Plane
    const planeGeo = new THREE.PlaneGeometry(80, 80, 50, 50);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x888888,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const gridPlane = new THREE.Mesh(planeGeo, planeMat);
    gridPlane.position.set(0, -3, -8);
    gridPlane.rotation.x = -Math.PI / 2.2;
    scene.add(gridPlane);

    // Particles
    const particleCount = 40;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x888888,
      transparent: true,
      opacity: 0.3,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      gridPlane.rotation.x = -Math.PI / 2.2 + Math.sin(elapsed * 0.1) * 0.02;
      particles.rotation.y = elapsed * 0.015;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      planeGeo.dispose();
      planeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10 pointer-events-none" />;
}
