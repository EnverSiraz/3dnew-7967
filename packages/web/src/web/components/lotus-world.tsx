import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Line, OrbitControls, RoundedBox } from '@react-three/drei';
import { CanvasTexture, ExtrudeGeometry, Group, OrthographicCamera, Path, Shape, SRGBColorSpace } from 'three';
import { useReducedMotion } from 'motion/react';
import OrbitFeature, { type Feature } from './lotus-orbit-items';

type V = [number, number, number];
const orbitPeriod = 36;
const orbitPhases = [2.5, .93, 4.07, .14, 1.71, 3.28, 4.85, 5.64];
const orbitFeatures: Feature[] = ['attendance', 'meal', 'media', 'sleep', 'translation'];
function orbitPosition(angle: number): V {
  return [Math.cos(angle) * 3.02, Math.sin(angle) * 2.3 + .1, .7 + Math.sin(angle) * .55];
}
// The outlines follow the actual Okuldaş lotus, not a generic flower.
function lotusShapes() {
  const point = (x: number, y: number): [number, number] => [(x - 483) / 195, (340 - y) / 195];
  const shape = () => new Shape();
  const center = shape();
  center.moveTo(...point(483, 9));
  center.bezierCurveTo(...point(382, 142), ...point(371, 278), ...point(453, 467));
  center.bezierCurveTo(...point(466, 484), ...point(500, 484), ...point(514, 467));
  center.bezierCurveTo(...point(592, 278), ...point(581, 142), ...point(483, 9));
  const inner = shape();
  inner.moveTo(...point(303, 83));
  inner.bezierCurveTo(...point(272, 90), ...point(242, 124), ...point(239, 164));
  inner.bezierCurveTo(...point(237, 179), ...point(310, 237), ...point(361, 280));
  inner.quadraticCurveTo(...point(370, 286), ...point(369, 271));
  inner.lineTo(...point(373, 197));
  inner.quadraticCurveTo(...point(335, 139), ...point(311, 87));
  inner.closePath();
  const rose = shape();
  rose.moveTo(...point(175, 175));
  rose.bezierCurveTo(...point(148, 198), ...point(135, 245), ...point(140, 282));
  rose.lineTo(...point(377, 370));
  rose.quadraticCurveTo(...point(390, 375), ...point(377, 343));
  rose.bezierCurveTo(...point(321, 292), ...point(222, 213), ...point(181, 177));
  rose.closePath();
  const violet = shape();
  violet.moveTo(...point(74, 300));
  violet.bezierCurveTo(...point(53, 335), ...point(59, 385), ...point(78, 410));
  violet.bezierCurveTo(...point(225, 410), ...point(350, 401), ...point(417, 458));
  violet.bezierCurveTo(...point(406, 412), ...point(371, 397), ...point(319, 379));
  violet.lineTo(...point(82, 300));
  violet.closePath();
  const teal = shape();
  teal.moveTo(...point(30, 449));
  teal.bezierCurveTo(...point(-1, 444), ...point(9, 475), ...point(20, 506));
  teal.bezierCurveTo(...point(34, 552), ...point(72, 575), ...point(139, 577));
  teal.lineTo(...point(366, 577));
  teal.bezierCurveTo(...point(405, 576), ...point(417, 549), ...point(418, 526));
  teal.bezierCurveTo(...point(425, 477), ...point(367, 449), ...point(317, 449));
  teal.closePath();
  const nib = shape();
  nib.moveTo(...point(462, 505));
  nib.quadraticCurveTo(...point(483, 511), ...point(504, 505));
  nib.quadraticCurveTo(...point(503, 552), ...point(518, 574));
  nib.lineTo(...point(483, 622));
  nib.lineTo(...point(450, 574));
  nib.quadraticCurveTo(...point(465, 540), ...point(462, 505));
  const hole = new Path();
  const [hx, hy] = point(483, 573);
  hole.absarc(hx, hy, .052, 0, Math.PI * 2, true);
  nib.holes.push(hole);
  return [center, inner, rose, violet, teal, nib];
}

function CeramicLotus() {
  const geometries = useMemo(() => lotusShapes().map(s => new ExtrudeGeometry(s, {
    depth: .22, bevelEnabled: true, bevelSegments: 5, steps: 1,
    bevelSize: .035, bevelThickness: .075, curveSegments: 32,
  })), []);
  useEffect(() => () => geometries.forEach(g => g.dispose()), [geometries]);
  const colors = ['#566c80', '#b0bdc9', '#bb6d7e', '#7b6ba0', '#5d9397', '#566c80'];
  return <group rotation={[0, -.16, -.025]} position={[0, .22, 0]}>
    {geometries.map((geometry, i) => <group key={i}>
      <mesh geometry={geometry} position={[0, 0, i === 0 ? .11 : -.04]} castShadow receiveShadow>
        <meshPhysicalMaterial color={colors[i]} roughness={.38} metalness={.04} clearcoat={.35} clearcoatRoughness={.5}/>
      </mesh>
      {i > 0 && i < 5 && <mesh geometry={geometry} scale={[-1, 1, 1]} castShadow receiveShadow>
        <meshPhysicalMaterial color={colors[i]} roughness={.38} metalness={.04} clearcoat={.35} clearcoatRoughness={.5}/>
      </mesh>}
    </group>)}
  </group>;
}

function Block({ position = [0, 0, 0], size, color, rotation }: { position?: V; size: V; color: string; rotation?: V }) {
  return <RoundedBox args={size} radius={.07} smoothness={4} position={position} rotation={rotation} castShadow receiveShadow>
    <meshPhysicalMaterial color={color} roughness={.44} clearcoat={.22}/>
  </RoundedBox>;
}

function TileLabel({ calendar = false }: { calendar?: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 320;
    const c = canvas.getContext('2d')!;
    c.fillStyle = '#fafaf4'; c.fillRect(0, 0, 512, 320);
    c.fillStyle = '#3f566b';
    c.font = '600 44px "Hanken Grotesk", sans-serif';
    c.fillText(calendar ? 'Takvim' : 'Mesajlar', 40, 64);
    if (calendar) {
      c.font = '500 28px "Hanken Grotesk", sans-serif';
      for (let i = 0; i < 14; i++) {
        const x = 52 + (i % 7) * 65, y = 158 + Math.floor(i / 7) * 83;
        if (i === 10) { c.fillStyle = '#83a995'; c.beginPath(); c.arc(x + 12, y - 9, 27, 0, 7); c.fill(); }
        c.fillStyle = i === 10 ? '#ffffff' : '#849083';
        c.fillText(String(i + 1), x, y);
      }
    } else {
      c.fillStyle = '#d6e8dd'; c.beginPath(); c.roundRect(40, 105, 360, 75, 22); c.fill();
      c.fillStyle = '#8cab9b';
      for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(102 + i * 53, 142, 9, 0, 7); c.fill(); }
      c.fillStyle = '#ebe6dc'; c.beginPath(); c.roundRect(155, 204, 305, 55, 18); c.fill();
      c.fillStyle = '#b9c3b7'; c.fillRect(196, 227, 175, 8);
    }
    const t = new CanvasTexture(canvas); t.colorSpace = SRGBColorSpace; return t;
  }, [calendar]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={[0, 0, .137]}><planeGeometry args={[1.23, .77]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}

function MessageTile() {
  return <group rotation={[.06, .12, -.15]}>
    <Block size={[1.48, 1.02, .24]} color="#fafaf4"/>
    <TileLabel/>
    <mesh position={[-.43, -.46, 0]} rotation={[0, 0, -.5]} castShadow><coneGeometry args={[.16, .29, 3]}/><meshStandardMaterial color="#fafaf4" roughness={.5}/></mesh>
  </group>;
}

function CalendarTile() {
  return <group rotation={[.08, -.24, .12]}>
    <Block size={[1.48, 1.18, .24]} color="#f2dfce"/>
    <group position={[0, -.07, 0]}><TileLabel calendar/></group>
    {[-.4, .4].map(x => <mesh key={x} position={[x, .53, .05]} rotation={[0, Math.PI / 2, 0]} castShadow><torusGeometry args={[.13, .044, 12, 32]}/><meshStandardMaterial color="#657e7b" roughness={.45}/></mesh>)}
  </group>;
}

function LearningObjects() {
  return <group rotation={[.38, -.25, -.13]}>
    <group position={[0, .06, 0]}>
      <Block position={[-.34, 0, 0]} size={[.65, .86, .15]} color="#8db5aa" rotation={[0, -.28, 0]}/>
      <Block position={[.34, 0, 0]} size={[.65, .86, .15]} color="#8db5aa" rotation={[0, .28, 0]}/>
      <Block position={[-.33, .03, .10]} size={[.58, .76, .08]} color="#fff2d8" rotation={[0, -.28, 0]}/>
      <Block position={[.33, .03, .10]} size={[.58, .76, .08]} color="#fff2d8" rotation={[0, .28, 0]}/>
      {[-1, 1].map(side => <group key={side} position={[side * .33, .03, .2]} rotation={[0, side * .28, 0]}>
        {[.2, .05, -.10].map(y => <Block key={y} position={[0, y, 0]} size={[.36, .026, .018]} color="#c7bca2"/>)}
      </group>)}
    </group>
    <Block position={[.71, -.45, .26]} size={[.44, .44, .44]} color="#e9cd81" rotation={[.2, .3, .15]}/>
    <Block position={[.89, -.05, .15]} size={[.32, .32, .32]} color="#dca08f" rotation={[.15, .1, -.16]}/>
    <mesh position={[-.68, -.43, .12]} castShadow><sphereGeometry args={[.19, 32, 24]}/><meshStandardMaterial color="#a5bfce" roughness={.4}/></mesh>
  </group>;
}

function Satellite({ index, mode, reduced }: { index: number; mode: number; reduced: boolean }) {
  const root = useRef<Group>(null);
  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    // An unbounded angle gives a real, uninterrupted full revolution — never a pendulum drift.
    const angle = orbitPhases[index]! + (reduced ? 0 : clock.elapsedTime * Math.PI * 2 / orbitPeriod);
    root.current.position.set(...orbitPosition(angle));
    const target = index < 3 ? (mode === index ? .84 : .73) : .74;
    const scale = reduced ? target : root.current.scale.x + (target - root.current.scale.x) * Math.min(delta * 4, 1);
    root.current.scale.setScalar(scale);
    root.current.rotation.set(reduced ? 0 : Math.sin(clock.elapsedTime * .45 + index) * .055, reduced ? 0 : Math.sin(clock.elapsedTime * .32 + index) * .1, reduced ? 0 : Math.sin(clock.elapsedTime * .6 + index) * .08);
  });
  return <group ref={root} position={orbitPosition(orbitPhases[index]!)} scale={.74} name={`app-satellite-${index}`}>
    {index === 0 ? <MessageTile/> : index === 1 ? <CalendarTile/> : index === 2 ? <LearningObjects/> : <OrbitFeature feature={orbitFeatures[index - 3]!}/>}
  </group>;
}

function LotusScene({ mode }: { mode: number }) {
  const reduced = !!useReducedMotion();
  const root = useRef<Group>(null);
  const { gl } = useThree();
  const orbit = useMemo(() => Array.from({ length: 129 }, (_, i): V => {
    const a = i / 128 * Math.PI * 2;
    return orbitPosition(a);
  }), []);
  useFrame(({ clock }) => {
    gl.domElement.dataset.orbitProgress = reduced ? '0' : String((clock.elapsedTime / orbitPeriod) % 1);
    gl.domElement.dataset.orbitItems = String(orbitPhases.length);
    if (!root.current || reduced) return;
    root.current.position.y = Math.sin(clock.elapsedTime * .5) * .045;
    root.current.rotation.y = Math.sin(clock.elapsedTime * .24) * .045;
  });
  return <group ref={root}>
    <CeramicLotus/>
    <Line points={orbit} color="#b7c9bd" lineWidth={.8} transparent opacity={.55}/>
    {orbitPhases.map((_, i) => <Satellite key={i} index={i} mode={mode} reduced={reduced}/>)}
    <mesh position={[0, -1.64, -.2]} receiveShadow castShadow><cylinderGeometry args={[1.55, 1.63, .17, 96]}/><meshStandardMaterial color="#e5e9de" roughness={.7}/></mesh>
  </group>;
}

function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    (camera as OrthographicCamera).zoom = Math.min(size.width / 7.7, size.height / 6.5);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export default function LotusWorld({ mode = 0 }: { mode?: number }) {
  return <Canvas orthographic shadows camera={{ position: [0, 2.4, 12], zoom: 75 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} aria-label="Mesajlar, takvim, öğrenme, yoklama, öğünler, medya, uyku ve 12 dil nesnelerinin sürekli döndüğü üç boyutlu Okuldaş lotus logosu">
    <FitCamera/>
    <ambientLight intensity={1.8}/>
    <directionalLight position={[-3, 6, 8]} intensity={3.5} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-.001}/>
    <directionalLight position={[4, 1, -3]} intensity={2} color="#d6e6e9"/>
    <Suspense fallback={null}><LotusScene mode={mode}/><ContactShadows position={[0, -1.75, 0]} opacity={.2} scale={10} blur={2.8} far={5}/></Suspense>
    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.15} maxPolarAngle={1.65} minAzimuthAngle={-.6} maxAzimuthAngle={.6} target={[0, .05, 0]}/>
  </Canvas>;
}