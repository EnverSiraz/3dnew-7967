import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Line, RoundedBox } from '@react-three/drei';
import { CanvasTexture, Group, OrthographicCamera, SRGBColorSpace } from 'three';

type V = [number, number, number];
const ease = (a: number, b: number, v: number) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
function Solid({ size, color = '#f6f4e8', position = [0, 0, 0], rotation, radius = .09 }: { size: V; color?: string; position?: V; rotation?: V; radius?: number }) {
  return <RoundedBox args={size} radius={Math.min(radius, Math.min(...size) * .45)} smoothness={4} position={position} rotation={rotation} castShadow receiveShadow><meshPhysicalMaterial color={color} roughness={.55} clearcoat={.17}/></RoundedBox>;
}
function Label({ text, position, width = 1.5, color = '#617d74' }: { text: string; position: V; width?: number; color?: string }) {
  const label = useMemo(() => {
    const c = document.createElement('canvas'); const ctx = c.getContext('2d')!;
    ctx.font = '600 49px "Hanken Grotesk", sans-serif';
    c.width = Math.max(128, Math.ceil(ctx.measureText(text).width + 44)); c.height = 112;
    ctx.fillStyle = color; ctx.textAlign = 'center';
    ctx.font = '600 49px "Hanken Grotesk", sans-serif'; ctx.fillText(text, c.width / 2, 76);
    const texture = new CanvasTexture(c); texture.colorSpace = SRGBColorSpace;
    return { texture, aspect: c.height / c.width };
  }, [text, color]);
  useEffect(() => () => label.texture.dispose(), [label]);
  return <mesh position={position}><planeGeometry args={[width, width * label.aspect]}/><meshBasicMaterial map={label.texture} transparent depthWrite={false} toneMapped={false}/></mesh>;
}
function CheckSeal({ position = [0, 0, 0], size = 1 }: { position?: V; size?: number }) {
  return <group position={position} scale={size}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[.55, .55, .19, 64]}/><meshStandardMaterial color="#88b69d" roughness={.5}/></mesh>
    <Line points={[[-.26, .02, .12], [-.07, -.17, .12], [.28, .22, .12]]} color="#f4faf0" lineWidth={5}/>
  </group>;
}
function FloatingMoment({ index, progress }: { index: number; progress: MutableRefObject<number> }) {
  const root = useRef<Group>(null);
  useFrame(() => {
    if (!root.current) return;
    const t = ease(0, .25, progress.current);
    const destinations: V[] = [[2.38, 1.52, .65], [-2.32, .49, .55], [-2.28, -.88, .65]];
    const [x, y, z] = destinations[index]!;
    root.current.position.set(x + Math.sin(index * 2.1) * (1 - t) * .6, y + (1 - t) * 1.2, z);
    root.current.scale.setScalar(.85);
    root.current.rotation.set(.2 * (1 - t), -.3 + index * .2, (.22 - index * .15) * (1 - t * .5));
  });
  return <group ref={root}>
    <Solid size={[1.27, .82, .13]} color={['#d7e6d5', '#efddc3', '#dce1eb'][index]}/>
    <Label text={['Yoklama', 'Öğünler', 'Uyku'][index]!} position={[0, .20, .08]} width={1.0}/>
    <Solid size={[.62, .035, .022]} color="#a5b5a0" position={[0, -.03, .08]}/>
    <Solid size={[.44, .035, .022]} color="#a5b5a0" position={[-.09, -.17, .08]}/>
  </group>;
}
function Storybook({ progress }: { progress: MutableRefObject<number> }) {
  const root = useRef<Group>(null); const left = useRef<Group>(null); const right = useRef<Group>(null); const approval = useRef<Group>(null);
  useFrame(() => {
    if (!root.current) return;
    const p = progress.current; const exit = ease(.25, .40, p); const open = ease(0, .20, p);
    root.current.visible = p < .405;
    root.current.position.set(-exit * 5, -.1 + exit * .7, -exit * 1.5);
    root.current.rotation.set(-.13, -.24 + open * .28 - exit * .6, -.08 + exit * .15);
    root.current.scale.setScalar(1 - exit * .5);
    if (left.current) left.current.rotation.y = .95 - open * .75;
    if (right.current) right.current.rotation.y = -.95 + open * .75;
    if (approval.current) { const a = ease(.03, .16, p); approval.current.position.set(1.65, 1.10 + (1 - a) * 1.7, .7); approval.current.scale.setScalar(.45 + a * .55); approval.current.rotation.z = -.15 * (1 - a); }
  });
  return <group ref={root}>
    {[-1, 1].map(side => <group key={side} ref={side < 0 ? left : right}>
      <Solid position={[side * .84, 0, 0]} size={[1.65, 2.65, .22]} color="#6f9d8e"/>
      <Solid position={[side * .82, .01, .145]} size={[1.52, 2.47, .1]} color="#fff2d7"/>
      <Label text={side < 0 ? 'Sınıf hikayesi' : 'Haftalık anlatı'} position={[side * .83, .89, .21]} width={1.35}/>
      {[.55, .32, .09, -.14].map((y, i) => <Solid key={y} position={[side * .82, y, .21]} size={[i === 3 ? .72 : 1.10, .043, .026]} color="#d0c2a5" radius={.01}/>)}
      <Solid position={[side * .82, -.73, .22]} size={[1.06, .53, .06]} color={side < 0 ? '#e4c69c' : '#bfcec1'}/>
      <mesh position={[side * .82, -.7, .27]}><circleGeometry args={[.16, 32]}/><meshStandardMaterial color={side < 0 ? '#f6e3af' : '#94b5a3'}/></mesh>
    </group>)}
    <Solid size={[.09, 2.73, .23]} color="#567e71"/>
    <group ref={approval}><CheckSeal/><Label text="Öğretmen onaylar" position={[0, -.76, .1]} width={1.7}/></group>
    {[0, 1, 2].map(i => <FloatingMoment key={i} index={i} progress={progress}/>)}
    <group position={[1.7, -1.42, .6]} rotation={[0, -.15, -.09]}>
      {['TR', 'EN', 'AR'].map((text, i) => <group key={text} position={[i * .58 - .58, i * .09, i * -.1]} rotation={[0, 0, i * .10]}><Solid size={[.62, .55, .1]} color={['#edf1e6', '#e6dcce', '#d7e3e7'][i]}/><Label text={text} position={[0, 0, .07]} width={.43}/></group>)}
    </group>
    <group position={[-1.85, -1.45, .7]} rotation={[0, .1, .05]}><Solid size={[1.37, .52, .13]} color="#efddbc"/><Label text="İnceleme kuyruğu" position={[0, 0, .08]} width={1.21}/></group>
  </group>;
}
function WorkflowTask({ index, progress }: { index: number; progress: MutableRefObject<number> }) {
  const root = useRef<Group>(null);
  useFrame(() => {
    if (!root.current) return;
    const t = ease(.32, .54, progress.current); const column = index % 3; const row = Math.floor(index / 3);
    root.current.position.set((column - 1) * 1.3 + (1 - t) * Math.sin(index * 2) * 2.2, .55 - row * 1.05 + (1 - t) * 1.9, .23 + (1 - t) * .7);
    root.current.rotation.z = (1 - t) * (index % 2 ? -.4 : .35);
  });
  return <group ref={root}>
    <Solid size={[1.09, .79, .12]} color={index === 4 ? '#efd39e' : '#f5f6e9'}/>
    <Label text={['Yoklama', 'Öğünler', 'Uyku', 'Kayıtlar', 'Takip', 'Onay'][index]!} position={[0, .18, .08]} width={.88}/>
    <Solid size={[.69, .031, .023]} color="#b7c5ac" position={[0, -.02, .08]} radius={.01}/>
    <Solid size={[.46, .031, .023]} color="#b7c5ac" position={[-.12, -.15, .08]} radius={.01}/>
    <mesh position={[.36, -.25, .09]}><sphereGeometry args={[.058, 20, 16]}/><meshStandardMaterial color={index === 4 ? '#bd915c' : '#83a693'}/></mesh>
  </group>;
}
function Workflow({ progress }: { progress: MutableRefObject<number> }) {
  const root = useRef<Group>(null); const focus = useRef<Group>(null);
  useFrame(() => {
    if (!root.current) return;
    const p = progress.current; const enter = ease(.25, .40, p); const exit = ease(.58, .74, p);
    root.current.visible = p > .25 && p < .745;
    root.current.position.set((1 - enter) * 5 - exit * 5, .2, -(1 - enter) * 1.7 - exit * 1.3);
    root.current.rotation.set(-.07, .5 * (1 - enter) - .15 - exit * .4, .06 - exit * .18);
    root.current.scale.setScalar(.7 + enter * .3 - exit * .25);
    if (focus.current) { const t = ease(.40, .56, p); focus.current.position.set(0, -.5, .44 + t * .32); focus.current.rotation.z = .2 * (1 - t); }
  });
  return <group ref={root}>
    <Solid size={[4.45, 3.2, .25]} color="#b9d0c0" radius={.17}/>
    <Label text="Öğretmen iş akışı" position={[0, 1.25, .15]} width={2.45}/>
    {[-.65, .65].map(x => <Solid key={x} size={[.027, 2.07, .025]} position={[x, -.13, .15]} color="#8bac99" radius={.01}/>)}
    {[0, 1, 2, 3, 4, 5].map(i => <WorkflowTask key={i} index={i} progress={progress}/>)}
    <group ref={focus}>
      <Line points={[[-.61, -.43, 0], [.61, -.43, 0], [.61, .43, 0], [-.61, .43, 0], [-.61, -.43, 0]]} color="#bd9960" lineWidth={2.5}/>
      <mesh position={[.64, .46, .01]}><sphereGeometry args={[.11, 24, 20]}/><meshStandardMaterial color="#d2ac6d"/></mesh>
    </group>
    <group position={[1.9, -1.4, .65]} rotation={[0, -.2, -.1]}><CheckSeal size={.6}/></group>
    <Label text="Takip gereken işler" position={[-.65, -1.87, .3]} width={2.3}/>
  </group>;
}
function Analytics({ progress }: { progress: MutableRefObject<number> }) {
  const root = useRef<Group>(null); const bars = useRef<Group>(null); const patterns = useRef<Group>(null); const wellbeing = useRef<Group>(null);
  const wave = useMemo(() => Array.from({ length: 41 }, (_, i): V => [i * .051 - 1, Math.sin(i * .34) * .19 + (i > 27 && i < 33 ? .25 : 0), .1]), []);
  useFrame(() => {
    if (!root.current) return;
    const p = progress.current; const enter = ease(.59, .77, p); const build = ease(.67, .96, p);
    root.current.visible = p > .59;
    root.current.position.set((1 - enter) * 5, .12, -(1 - enter) * 2);
    root.current.rotation.set(-.08, .45 * (1 - enter) - .15 + build * .14, -.04);
    root.current.scale.setScalar(.7 + enter * .3);
    if (bars.current) bars.current.children.forEach((bar, i) => { const h = [.58, .81, .94, .33, .75, .64][i]! * (.35 + build * .65); bar.scale.y = h; bar.position.y = h / 2 - .6; });
    if (patterns.current) { patterns.current.position.set(1.15 + (1 - build) * 1.7, -.37, .4 + (1 - build) * .8); patterns.current.rotation.y = (1 - build) * -.8; }
    if (wellbeing.current) wellbeing.current.scale.setScalar(.6 + build * .4);
  });
  return <group ref={root}>
    <Solid size={[4.6, 3.3, .22]} color="#d6e0e3" radius={.18}/>
    <Label text="Örüntüler ve içgörüler" position={[0, 1.30, .14]} width={2.85}/>
    <group position={[-1.09, .13, .22]}>
      <Solid size={[2.08, 1.9, .15]} color="#f4f5e9"/>
      <Label text="Yoklama" position={[0, .69, .1]} width={1.23}/>
      <group ref={bars}>{[0, 1, 2, 3, 4, 5].map(i => <Solid key={i} position={[i * .27 - .68, 0, .13]} size={[.18, 1, .13]} color={i === 3 ? '#d6af72' : '#93b2a1'} radius={.025}/>)}</group>
      <Line points={[[-.86, -.63, .14], [.85, -.63, .14]]} color="#bdcbbb" lineWidth={1}/>
      <mesh position={[.13, .24, .19]} rotation={[0, 0, Math.PI]}><coneGeometry args={[.09, .18, 3]}/><meshStandardMaterial color="#c79b59"/></mesh>
    </group>
    <group ref={patterns}>
      <Solid size={[2.06, 1.68, .16]} color="#edf0e6"/>
      <Label text="Uyku · Öğünler" position={[0, .61, .10]} width={1.75}/>
      <Line points={wave} color="#8eaaa7" lineWidth={2.5}/>
      <group position={[0, -.33, .01]}><Line points={wave.map(([x, y, z]): V => [x, -y * .5, z])} color="#c8ac76" lineWidth={2}/></group>
      <mesh position={[.53, .15, .13]}><sphereGeometry args={[.08, 20, 16]}/><meshStandardMaterial color="#d3b274"/></mesh>
    </group>
    <group ref={wellbeing} position={[1.6, .76, .55]}>
      <Solid size={[1.46, .74, .18]} color="#efd4ca"/>
      <Line points={[[-.55, 0, .11], [-.32, 0, .11], [-.20, .18, .11], [-.05, -.19, .11], [.1, .09, .11], [.2, 0, .11], [.53, 0, .11]]} color="#bc8b80" lineWidth={2.5}/>
      <Label text="Esenlik" position={[0, -.27, .12]} width={.7}/>
    </group>
    <group position={[-.9, -1.35, .3]}>
      <Solid size={[2.42, .58, .15]} color="#e8e5d2"/>
      <Label text="Açılma sayıları · Yalnızca personel" position={[0, 0, .1]} width={2.23}/>
    </group>
  </group>;
}
function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera, size } = useThree();
  useFrame(() => {
    const p = progress.current;
    (camera as OrthographicCamera).zoom = Math.min(size.width / 8.6, size.height / 6.3) * (1 + Math.sin(p * Math.PI * 2) * .055);
    camera.position.set(2.3 + p * .9, 2.2 - p * .4, 11);
    camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
  });
  return null;
}
export default function AIWorld({ progress }: { progress: MutableRefObject<number> }) {
  return <Canvas orthographic shadows camera={{ position: [2.3, 2.2, 11], zoom: 75 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} aria-label="Kaydırmayla açılan hikaye kitabı, düzenlenen öğretmen iş akışı ve oluşan yönetim içgörüleri panosu">
    <CameraRig progress={progress}/>
    <ambientLight intensity={1.6}/><directionalLight position={[-3, 7, 8]} intensity={3} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-.001}/>
    <directionalLight position={[5, 1, -4]} intensity={1.2} color="#e4ecea"/>
    <Suspense fallback={null}><Storybook progress={progress}/><Workflow progress={progress}/><Analytics progress={progress}/><ContactShadows position={[0, -2.25, 0]} opacity={.19} scale={17} blur={3} far={6} resolution={256} frames={1}/></Suspense>
  </Canvas>;
}