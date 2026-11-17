import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, RoundedBox } from '@react-three/drei';
import { CanvasTexture, CatmullRomCurve3, Group, Mesh, OrthographicCamera, SRGBColorSpace, Vector3 } from 'three';

type V = [number, number, number];
type Progress = MutableRefObject<number>;
const smooth = (a: number, b: number, p: number) => { const t = Math.min(1, Math.max(0, (p - a) / (b - a))); return t * t * (3 - 2 * t); };
function Tile({ size, position = [0, 0, 0], color = '#f6faf9', glass = false }: { size: V; position?: V; color?: string; glass?: boolean }) {
  return <RoundedBox args={size} position={position} radius={Math.min(.13, Math.min(...size) * .4)} smoothness={4}>
    <meshPhysicalMaterial color={color} roughness={glass ? .2 : .35} metalness={glass ? .12 : .18} transparent={glass} opacity={glass ? .56 : 1} clearcoat={.8} depthWrite={!glass}/>
  </RoundedBox>;
}
function Text({ text, position, width = 1.3, color = '#3d6a70' }: { text: string; position: V; width?: number; color?: string }) {
  const label = useMemo(() => {
    const c = document.createElement('canvas'); const ctx = c.getContext('2d')!; ctx.font = '600 52px "Hanken Grotesk", sans-serif';
    c.width = Math.max(130, Math.ceil(ctx.measureText(text).width + 36)); c.height = 108;
    ctx.font = '600 52px "Hanken Grotesk", sans-serif'; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.fillText(text, c.width / 2, 73);
    const texture = new CanvasTexture(c); texture.colorSpace = SRGBColorSpace; return { texture, aspect: c.height / c.width };
  }, [text, color]);
  useEffect(() => () => label.texture.dispose(), [label]);
  return <mesh position={position}><planeGeometry args={[width, width * label.aspect]}/><meshBasicMaterial map={label.texture} transparent depthWrite={false} toneMapped={false}/></mesh>;
}
function Dot({ position, radius = .06, color = '#72bfb3' }: { position: V; radius?: number; color?: string }) {
  return <mesh position={position}><sphereGeometry args={[radius, 16, 12]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.3} metalness={.25} roughness={.25}/></mesh>;
}
function DataRibbon({ points, progress, offset = 0, color = '#8dbfc3' }: { points: V[]; progress: Progress; offset?: number; color?: string }) {
  const packet = useRef<Mesh>(null);
  const curve = useMemo(() => new CatmullRomCurve3(points.map(p => new Vector3(...p))), [points]);
  const path = useMemo(() => curve.getPoints(48).map(v => [v.x, v.y, v.z] as V), [curve]);
  useFrame(() => { if (packet.current) packet.current.position.copy(curve.getPoint((progress.current * 6 + offset) % 1)); });
  return <group><Line points={path} color={color} lineWidth={1.6} transparent opacity={.75}/><Line points={path.map(([x, y, z]): V => [x, y + .045, z - .03])} color={color} lineWidth={5} transparent opacity={.12}/><mesh ref={packet}><sphereGeometry args={[.075, 16, 12]}/><meshStandardMaterial color="#e8fffa" emissive="#69cdbd" emissiveIntensity={.7}/></mesh></group>;
}
const neuralNodes: V[] = Array.from({ length: 12 }, (_, i) => {
  const phi = Math.acos(1 - 2 * (i + .5) / 12); const theta = i * 2.4;
  return [Math.sin(phi) * Math.cos(theta) * .52, Math.sin(phi) * Math.sin(theta) * .52, Math.cos(phi) * .34 + .27];
});
function Processor({ progress }: { progress: Progress }) {
  const root = useRef<Group>(null); const network = useRef<Group>(null); const halo = useRef<Group>(null);
  useFrame(() => {
    const p = progress.current;
    if (root.current) { root.current.position.set(0, -.87 + Math.sin(p * Math.PI) * .20, .1); root.current.rotation.set(-.05, Math.sin(p * Math.PI * 2) * .18, -.04); }
    if (network.current) network.current.rotation.z = p * Math.PI * 1.8;
    if (halo.current) halo.current.rotation.z = -p * Math.PI * 2;
  });
  return <group ref={root}>
    <Tile size={[2.20, 2.20, .18]} color="#c7d9d9" position={[0, 0, -.25]}/>
    <Tile size={[1.93, 1.93, .17]} color="#e8efeb" position={[0, 0, -.02]}/>
    <Tile size={[1.63, 1.63, .18]} position={[0, 0, .20]} color="#fbfdf6"/>
    <Tile size={[1.39, 1.39, .12]} position={[0, .02, .39]} color="#c8f0e7" glass/>
    {[0, 1, 2, 3].map(side => <group key={side} rotation={[0, 0, side * Math.PI / 2]}>{Array.from({ length: 8 }, (_, i) => <Tile key={i} size={[.09, .27, .07]} color="#87aaa7" position={[(i - 3.5) * .22, 1.15, -.12]}/>)}</group>)}
    <group ref={network}>
      {neuralNodes.map((v, i) => <group key={i}><Dot position={v} radius={i % 3 ? .045 : .067}/>{[3, 5].map(n => <Line key={n} points={[v, neuralNodes[(i + n) % 12]!]} color="#7eb9b6" lineWidth={.8} transparent opacity={.75}/>)}</group>)}
    </group>
    <group ref={halo} position={[0, 0, -.36]}>
      <mesh><torusGeometry args={[1.56, .014, 8, 100]}/><meshStandardMaterial color="#80b7b1" emissive="#a1d0c9" emissiveIntensity={.4}/></mesh>
      {[0, 1, 2].map(i => <Dot key={i} position={[Math.cos(i * 2.094) * 1.56, Math.sin(i * 2.094) * 1.56, 0]} radius={.055}/>)}
    </group>
    <Text text="AI" position={[0, -.54, .49]} width={.40} color="#427a77"/>
    <Text text="YAPAY ZEKA" position={[0, -1.43, .04]} width={1.7}/>
  </group>;
}
function Chapter({ index, progress, children }: { index: number; progress: Progress; children: React.ReactNode }) {
  const root = useRef<Group>(null);
  useFrame(() => {
    if (!root.current) return; const p = progress.current;
    const enter = index === 0 ? 1 : smooth(index === 1 ? .27 : .60, index === 1 ? .41 : .76, p);
    const exit = index === 2 ? 0 : smooth(index === 0 ? .26 : .59, index === 0 ? .41 : .75, p);
    root.current.visible = index === 0 ? p < .42 : index === 1 ? p > .26 && p < .76 : p > .59;
    root.current.position.set((1 - enter) * 7 - exit * 7, (1 - enter) * .8 + exit * .4, -(1 - enter + exit) * 2);
    root.current.rotation.y = (1 - enter) * -.5 + exit * .6; root.current.scale.setScalar(1 - (1 - enter + exit) * .3);
  });
  return <group ref={root}>{children}</group>;
}
const familyRoutes: V[][] = [
  [[-2.9, .7, 0], [-2.1, .3, .2], [-1.7, -.6, .3], [-.75, -.55, .5]],
  [[.3, -.05, .4], [.8, .5, .4], [.4, 1.15, .3], [.4, 1.55, .3]],
  [[.9, -.6, .2], [1.6, -.6, .4], [2.35, .15, .3], [2.35, 1, .25]],
];
function Families({ progress }: { progress: Progress }) {
  const output = useRef<Group>(null);
  useFrame(() => { if (output.current) { const t = smooth(0, .23, progress.current); output.current.position.set(.10, 1.51 + (1 - t) * .8, .18); output.current.rotation.y = -.13 - (1 - t) * .55; } });
  return <Chapter index={0} progress={progress}>
    <group position={[-2.78, .66, .03]} rotation={[0, .18, .06]}>
      <Tile size={[1.12, 1.83, .10]} color="#dcebea" glass/>
      <Text text="Sınıf anları" position={[0, .62, .09]} width={.96}/>
      {['Yoklama', 'Öğünler', 'Uyku'].map((text, i) => <group key={text} position={[0, .24 - i * .42, .11]}><Tile size={[.91, .30, .055]} color="#f6faf1"/><Text text={text} position={[0, 0, .04]} width={.73}/></group>)}
    </group>
    {familyRoutes.map((route, i) => <DataRibbon key={i} points={route} progress={progress} offset={i * .29}/>)}
    <group ref={output}>
      <Tile size={[2.43, 1.58, .085]} color="#cee8e4" glass/>
      <Line points={[[-1.13, .70, .08], [-1.13, -.70, .08], [1.13, -.70, .08], [1.13, .70, .08]]} color="#9ac9c1" lineWidth={1}/>
      <Text text="AI · Hikaye taslağı" position={[0, .47, .08]} width={1.94}/>
      {[.12, -.10, -.32].map((y, i) => <Tile key={y} size={[i === 2 ? 1.15 : 1.8, .035, .025]} position={[-(i === 2 ? .32 : 0), y, .09]} color="#89b8b2"/>)}
      <group position={[.95, -.65, .22]}><Tile size={[1.50, .39, .07]} color="#e2efde"/><Text text="Öğretmen onayı" position={[0, 0, .06]} width={1.27}/></group>
    </group>
    <group position={[2.42, .84, .08]} rotation={[0, -.2, -.04]}>
      <Tile size={[1.03, 1.52, .08]} color="#d9e7ed" glass/>
      <Text text="Çeviri" position={[0, .48, .07]} width={.77}/>
      {['TR', 'EN', '12 dil'].map((t, i) => <Text key={t} text={t} position={[0, .10 - i * .32, .09]} width={t.length > 2 ? .59 : .35}/>)}
    </group>
    <group position={[2.5, -1.3, .12]}><Tile size={[1.28, .70, .09]} color="#efe3d0" glass/><Text text="Sohbet denetimi" position={[0, .12, .08]} width={1.14}/><Text text="İnceleme kuyruğu" position={[0, -.15, .08]} width={1.1}/></group>
  </Chapter>;
}
const taskPositions: V[] = [[-2.5, 1.36, .1], [0, 2.0, .1], [2.5, 1.30, .1], [-2.7, -.15, .1], [2.7, -.2, .2]];
const taskRoutes = taskPositions.map(([x, y, z]): V[] => [[x, y, z], [x * .6, y * .65, .35], [x * .22, -.3, .42], [0, -.67, .4]]);
function Teachers({ progress }: { progress: Progress }) {
  const tasks = useRef<Group>(null);
  useFrame(() => { if (tasks.current) { const t = smooth(.33, .55, progress.current); tasks.current.rotation.z = (1 - t) * -.25; tasks.current.scale.setScalar(.80 + t * .20); } });
  return <Chapter index={1} progress={progress}>
    <group ref={tasks}>
      {taskPositions.map((pos, i) => <group key={i} position={pos} rotation={[0, i < 2 ? .12 : -.12, i % 2 ? -.045 : .045]}>
        <Tile size={[1.52, .90, .09]} color={i === 4 ? '#f2ddbc' : '#d8e9e7'} glass/>
        <Dot position={[-.54, .22, .09]} radius={.04} color={i === 4 ? '#d2a55e' : '#77b9ac'}/>
        <Text text={['Yoklama', 'Günlük kayıtlar', 'Onaylar', 'İdari yük', 'Takip gereken'][i]!} position={[.06, .18, .09]} width={1.14}/>
        <Tile size={[.99, .028, .015]} position={[0, -.09, .08]} color={i === 4 ? '#cbaa72' : '#9dbeb8'}/>
        <Tile size={[.65, .028, .015]} position={[-.17, -.23, .08]} color={i === 4 ? '#cbaa72' : '#9dbeb8'}/>
      </group>)}
      {taskRoutes.map((route, i) => <DataRibbon key={i} points={route} progress={progress} offset={i * .17} color={i === 4 ? '#c4a371' : '#87b8bc'}/>)}
    </group>
    <Text text="AI · İş akışı analizi" position={[0, 2.78, .05]} width={2.70}/>
    <Line points={[[1.14, -.7, .4], [1.87, -1.5, .25], [2.5, -1.5, .25]]} color="#c4a371" lineWidth={2}/>
    <Text text="Tıkanma sinyali" position={[2.45, -1.83, .25]} width={1.43} color="#9c7c4a"/>
  </Chapter>;
}
const sensorPositions: V[] = [[-2.6, 1.15, .05], [2.6, 1.0, .15], [-2.6, -.7, .12], [2.6, -.75, .10]];
const sensorRoutes = sensorPositions.map(([x, y, z]): V[] => [[x, y, z], [x * .6, y + .25, .2], [x * .4, -.65, .35], [0, -.8, .5]]);
function Management({ progress }: { progress: Progress }) {
  const globe = useRef<Group>(null);
  useFrame(() => { if (globe.current) { globe.current.rotation.y = progress.current * Math.PI * 1.4; globe.current.rotation.z = .15; globe.current.scale.setScalar(.70 + smooth(.65, .91, progress.current) * .30); } });
  const wave = useMemo(() => Array.from({ length: 25 }, (_, i): V => [i * .046 - .55, Math.sin(i * .54) * .11, .11]), []);
  return <Chapter index={2} progress={progress}>
    <group position={[0, 1.6, .0]}>
      <group ref={globe}>
        <mesh><icosahedronGeometry args={[.82, 1]}/><meshBasicMaterial color="#8bbdb9" wireframe transparent opacity={.55}/></mesh>
        {[0, 1, 2].map(i => <mesh key={i} rotation={[i * Math.PI / 3, .4, 0]}><torusGeometry args={[1.0, .008, 5, 90]}/><meshBasicMaterial color="#a5c9c9"/></mesh>)}
        {neuralNodes.slice(0, 6).map((v, i) => <Dot key={i} position={[v[0] * 1.7, v[1] * 1.7, v[2]]} radius={.045} color={i === 2 ? '#d6b377' : '#7fc2b6'}/>)}
      </group>
      <Text text="AI · Örüntü analizi" position={[0, 1.23, .05]} width={2.35}/>
    </group>
    <DataRibbon points={[[0, -.05, .4], [0, .6, .5], [.12, 1.0, .3], [0, 1.6, .15]]} progress={progress}/>
    {sensorPositions.map((pos, i) => <group key={i} position={pos} rotation={[0, i % 2 ? -.2 : .2, 0]}>
      <Tile size={[1.54, 1.14, .075]} color={i === 2 ? '#efdbd3' : '#d7eae9'} glass/>
      <Text text={['Yoklama', 'Uyku · Öğünler', 'Esenlik', 'Veli katılımı'][i]!} position={[0, .34, .09]} width={1.25}/>
      {i === 0 ? <group>{[.22, .35, .15, .40, .30].map((h, n) => <Tile key={n} size={[.12, h, .025]} position={[n * .2 - .4, h / 2 - .3, .10]} color={n === 2 ? '#d5b77d' : '#87b7ad'}/>)}<Dot position={[0, .11, .12]} radius={.05} color="#d5b77d"/></group> : i < 3 ? <Line points={i === 1 ? wave : [[-.55, 0, .1], [-.28, 0, .1], [-.14, .19, .1], [0, -.20, .1], [.14, .09, .1], [.30, 0, .1], [.55, 0, .1]]} color={i === 1 ? '#7da9b5' : '#c19485'} lineWidth={2}/> : <group>{[0, 1, 2, 3, 4].map(n => <Dot key={n} position={[n * .2 - .4, -.05, .12]} radius={.055}/>)}<Text text="Açılma sayıları" position={[0, -.34, .11]} width={1.09}/></group>}
    </group>)}
    {sensorRoutes.map((route, i) => <DataRibbon key={i} points={route} progress={progress} offset={i * .21}/>)}
    <Text text="İçgörüler · Yalnızca personel" position={[0, -2.62, .1]} width={3.0}/>
  </Chapter>;
}
function Camera({ progress }: { progress: Progress }) {
  const { camera, size } = useThree();
  useFrame(() => {
    const p = progress.current; (camera as OrthographicCamera).zoom = Math.min(size.width / 8.4, size.height / 7.1);
    camera.position.set(2.1 + Math.sin(p * Math.PI * 2) * 1.0, 1.5 - p * .45, 13); camera.lookAt(0, .10, 0); camera.updateProjectionMatrix();
  });
  return null;
}
export default function AITechWorld({ progress }: { progress: Progress }) {
  return <Canvas orthographic camera={{ position: [2, 1.5, 13], zoom: 75 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} aria-label="Yapay zeka işlemcisi, sinir ağı, veri yolları ve üç kitleye özel holografik çıktılar">
    <Camera progress={progress}/><ambientLight intensity={1.8}/><directionalLight position={[-4, 6, 7]} intensity={3}/><directionalLight position={[5, 0, 4]} intensity={1.4} color="#c5eae9"/>
    <Processor progress={progress}/><Families progress={progress}/><Teachers progress={progress}/><Management progress={progress}/>
  </Canvas>;
}