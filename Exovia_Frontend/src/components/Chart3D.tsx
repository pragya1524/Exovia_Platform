import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { BarChart3, RefreshCw } from 'lucide-react';

interface Chart3DProps {
  data: Array<{ name: string; value: number }>;
  type: '3d-bar' | '3d-scatter' | '3d-surface' | '3d-line' | '3d-pie';
  color?: string;
}

interface HoverInfo {
  label: string;
  value: number;
}

const Bar3D = ({ position, height, color, label, onHover }: {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
  onHover?: (info: HoverInfo | null) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, height, 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => { setHovered(true); onHover && onHover({ label, value: height }); }}
        onPointerOut={() => { setHovered(false); onHover && onHover(null); }}
        scale={[1, 0.1, 1]}
      >
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial
          color={hovered ? '#d08467' : color}
          transparent
          opacity={0.85}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      {label && (
        <Text position={[0, -0.8, 0]} fontSize={0.12} color="#6b4f3b" anchorX="center" anchorY="middle">
          {label.length > 8 ? label.substring(0, 8) + '...' : label}
        </Text>
      )}
      <Text position={[0, height + 0.2, 0]} fontSize={0.1} color="#6b4f3b" anchorX="center" anchorY="middle">
        {height.toFixed(1)}
      </Text>
    </group>
  );
};

const ScatterPoint = ({ position, size, color, label, onHover }: {
  position: [number, number, number];
  size: number;
  color: string;
  label: string;
  onHover?: (info: HoverInfo | null) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => { setHovered(true); onHover && onHover({ label, value: position[1] }); }}
        onPointerOut={() => { setHovered(false); onHover && onHover(null); }}
        scale={hovered ? [1.3, 1.3, 1.3] : [1, 1, 1]}
      >
        <sphereGeometry args={[size]} />
        <meshStandardMaterial
          color={hovered ? '#d08467' : color}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      {hovered && label && (
        <Text position={[0, size + 0.3, 0]} fontSize={0.08} color="#6b4f3b" anchorX="center" anchorY="middle">
          {label}
        </Text>
      )}
    </group>
  );
};

const Line3D = ({ data, color }: { data: Array<{ name: string; value: number }>; color: string }) => {
  const points = data.map((item, i) => [i * 2 - (data.length * 2) / 2, item.value, 0]);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
  const material = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(lineGeometry, material);
  return <primitive object={line} />;
};

const AxisLabel = ({ position, text }: { position: [number, number, number]; text: string }) => (
  <Text position={position} fontSize={0.25} color="#6b4f3b" anchorX="center" anchorY="middle">{text}</Text>
);

const Chart3DScene = ({ data, type, color = '#b38b5d', resetView, onHover }: Chart3DProps & { resetView?: boolean; onHover?: (info: HoverInfo | null) => void }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const normalizedData = data.map(d => ({ ...d, value: (d.value / maxValue) * 4 }));
  const { camera } = useThree();

  useEffect(() => {
    if (resetView && camera) {
      camera.position.set(8, 8, 8);
      camera.lookAt(0, 0, 0);
    }
  }, [resetView, camera]);

  const renderChart = () => {
    switch (type) {
      case '3d-bar':
        return normalizedData.map((item, index) => (
          <Bar3D
            key={index}
            position={[index * 2 - (data.length * 2) / 2, 0, 0]}
            height={item.value}
            color={color}
            label={item.name}
            onHover={onHover}
          />
        ));
      case '3d-scatter':
        return normalizedData.map((item, index) => (
          <ScatterPoint
            key={index}
            position={[(index - data.length / 2) * 2, item.value, 0]}
            size={0.15 + (item.value / 4) * 0.2}
            color={color}
            label={item.name}
            onHover={onHover}
          />
        ));
      case '3d-line':
        return <Line3D data={normalizedData} color={color} />;
      case '3d-pie':
        return (
          <group>
            <mesh position={[0, 2, 0]}>
              <torusGeometry args={[2, 0.7, 16, 100]} />
              <meshStandardMaterial color={color} opacity={0.8} transparent />
            </mesh>
            <Text position={[0, 4, 0]} fontSize={0.4} color="#6b4f3b" anchorX="center" anchorY="middle">3D Pie</Text>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={0.3} />
      {renderChart()}
      <gridHelper args={[20, 20, '#e6e0d6', '#d8cfc3']} />
      <AxisLabel position={[6, -0.5, 0]} text="X" />
      <AxisLabel position={[0, 5, 0]} text="Y" />
      <AxisLabel position={[0, 0, 6]} text="Z" />
      <OrbitControls enablePan enableZoom enableRotate maxDistance={15} minDistance={3} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />
    </>
  );
};

const Chart3D = ({ data, type, color }: Chart3DProps) => {
  const [error, setError] = useState<string | null>(null);
  const [resetView, setResetView] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  useEffect(() => {
    setError(null);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-80 lg:h-96 bg-[#fdfaf5] rounded-lg border border-[#e6e0d6]">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#e6e0d6] rounded-lg flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-[#7a7066]" />
          </div>
          <p className="text-[#7a7066] text-sm">No data available for 3D visualization</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-80 lg:h-96 bg-[#fdf1ec] rounded-lg border border-[#f2c4b1]">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#f6ded5] rounded-lg flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-[#c27a68]" />
          </div>
          <p className="text-[#c27a68] text-sm">3D Chart Error</p>
          <p className="text-[#a36855] text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-[#fdfaf5] rounded-lg overflow-hidden border border-[#e6e0d6]">
      <button
        className="absolute top-2 left-2 z-10 bg-[#fdfaf5]/80 hover:bg-[#fdfaf5] text-[#7a7066] rounded-full p-1 shadow border border-[#e6e0d6]"
        title="Reset View"
        onClick={() => { setResetView(true); setTimeout(() => setResetView(false), 100); }}
      >
        <RefreshCw className="w-4 h-4" />
      </button>
      {hoverInfo && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-[#fdfaf5]/90 text-[#6b4f3b] rounded shadow px-3 py-1 text-xs font-semibold border border-[#e6e0d6] pointer-events-none">
          <span className="font-bold">{hoverInfo.label}:</span> {hoverInfo.value}
        </div>
      )}
      <Canvas camera={{ position: [8, 8, 8], fov: 50 }} onError={() => setError('Failed to render 3D chart')}>
        <Chart3DScene data={data} type={type} color={color || '#b38b5d'} resetView={resetView} onHover={setHoverInfo} />
      </Canvas>
      <div className="absolute top-2 right-2 bg-[#a27850]/20 text-[#fdfaf5] text-xs px-2 py-1 rounded">
        3D View
      </div>
    </div>
  );
};

export default Chart3D;
