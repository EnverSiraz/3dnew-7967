import { Suspense, useEffect, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei';
import { Group, Object3D, OrthographicCamera, Vector3, Euler } from 'three';
import { useReducedMotion } from 'motion/react';

type V = [number, number, number];
function Box({ position, size, color, radius = .06, rotation }: { position: V; size: V; color: string; radius?: number; rotation?: V }) {
  return <RoundedBox args={size} radius={radius} smoothness={3} position={position} rotation={rotation} castShadow receiveShadow><meshStandardMaterial color={color} roughness={.76} /></RoundedBox>;
}
function Ball({ position, radius, color, scale }: { position: V; radius: number; color: string; scale?: V }) {
  return <mesh position={position} scale={scale} castShadow><sphereGeometry args={[radius, 32, 24]} /><meshStandardMaterial color={color} roughness={.8} /></mesh>;
}
function Tree({ position, size = 1 }: { position: V; size?: number }) {
  return <group position={position} scale={size}><Box position={[0,.6,0]} size={[.16,1.2,.16]} color="#b59a79"/><Ball position={[0,1.3,0]} radius={.58} color="#8abfa4" scale={[.85,1.18,.85]}/><Ball position={[.2,1.65,0]} radius={.4} color="#a5cbb0"/></group>;
}
function Child({ position, color, rotation = 0 }: { position: V; color: string; rotation?: number }) {
  return <group position={position} rotation={[0,rotation,0]}><Box position={[-.09,.12,0]} size={[.12,.24,.16]} color="#4f6475" radius={.035}/><Box position={[.09,.12,0]} size={[.12,.24,.16]} color="#4f6475" radius={.035}/><Ball position={[0,.41,0]} radius={.23} color={color} scale={[1,1.1,.8]}/><Ball position={[0,.75,0]} radius={.19} color="#edc9a7"/><Ball position={[0,.84,-.035]} radius={.17} color="#75604e" scale={[1,.7,.9]}/><Ball position={[-.245,.4,0]} radius={.07} color="#edc9a7"/><Ball position={[.245,.4,0]} radius={.07} color="#edc9a7"/></group>;
}
function Rainbow() {
  return <group position={[-.15,2.02,-1.49]}>{['#d99782','#e1bd77','#a2bd9c','#769d9d'].map((c,i)=><mesh key={c} rotation={[0,0,0]}><torusGeometry args={[.63-i*.12,.057,12,48,Math.PI]}/><meshStandardMaterial color={c}/></mesh>)}</group>;
}
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const smooth = (a: number, b: number, value: number) => { const t = clamp((value-a)/(b-a)); return t*t*(3-2*t); };
export function SchoolModel({ mode = 0, progress }: { mode?: number; progress?: MutableRefObject<number> }) {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  const bases = useRef(new Map<Object3D, { position: Vector3; rotation: Euler; scale: Vector3 }>());
  useFrame(({clock},delta)=>{
    const root = ref.current;
    if(!root) return;
    if (progress) {
      const p = reduced ? .25 : progress.current;
      const assemble = 1-smooth(0,.20,p);
      const explode = smooth(.55,.73,p) * (1-smooth(.85,1,p)*.55);
      const exit = smooth(.83,1,p);
      root.rotation.y = -.38 + smooth(.12,.40,p)*1.1 - smooth(.40,.64,p)*1.8 + smooth(.70,1,p)*1.2;
      root.rotation.x = smooth(.40,.60,p)*.12 - smooth(.65,.85,p)*.12;
      root.scale.setScalar(1-exit*.5);
      root.position.set(-exit*2.15, -exit*.3, 0);
      root.children.forEach((part,i)=>{
        let base = bases.current.get(part);
        if(!base) { base={position:part.position.clone(),rotation:part.rotation.clone(),scale:part.scale.clone()}; bases.current.set(part,base); }
        const b=base.position;
        const sideX = b.x===0 ? (i%2 ? -1 : 1)*.3 : b.x;
        const sideZ = b.z===0 ? (i%3-1)*.5 : b.z;
        const high = b.y>1 ? 2.9 : b.y<0 ? -.4 : .8 + (i%4)*.22;
        part.position.set(b.x + sideX*explode*.66 + Math.sin(i*2.4)*assemble*2.4, b.y + high*explode + (1.8+(i%5)*.48)*assemble, b.z + sideZ*explode*.62 + Math.cos(i*1.9)*assemble*2.4);
        part.rotation.set(base.rotation.x+assemble*Math.sin(i)*.65,base.rotation.y+assemble*Math.cos(i)*.7,base.rotation.z+assemble*Math.sin(i*1.7)*.55);
        part.scale.copy(base.scale).multiplyScalar(1-assemble*.16);
      });
      return;
    }
    if(reduced) return;
    const target = Math.min(window.scrollY / 850, .8) + mode*.22;
    root.rotation.y += (target-root.rotation.y)*Math.min(delta*2,1);
    root.position.y = Math.sin(clock.elapsedTime*.7)*.035;
  });
  return <group ref={ref}>
    <Box position={[0,-.16,0]} size={[5.6,.35,4.9]} radius={.22} color="#b4cdb8"/>
    <Box position={[-.25,.04,-.6]} size={[3.9,.12,3.1]} color="#f0dfbf"/>
    <Box position={[-.25,1.05,-2.06]} size={[4.0,2.15,.18]} color="#f2e8d6"/>
    <Box position={[-2.17,1.05,-.6]} size={[.18,2.15,3.1]} color="#e9dfcb"/>
    <Box position={[-.24,2.19,-2.05]} size={[4.28,.2,.38]} color="#85afa0"/>
    <Box position={[-2.17,2.19,-.62]} size={[.38,.2,3.26]} color="#85afa0"/>
    <Box position={[-2.18,1.08,.88]} size={[.22,2.16,.22]} color="#ecb7a2"/>
    <Box position={[1.68,1.08,-2.04]} size={[.22,2.16,.22]} color="#ecb7a2"/>
    <Rainbow/>
    {[-1.35,1.0].map(x=><group key={x}><Box position={[x,1.17,-1.94]} size={[.67,.84,.1]} color="#b2d1d0"/><Box position={[x,1.17,-1.84]} size={[.06,.84,.06]} color="#f9f3e8"/><Box position={[x,1.17,-1.84]} size={[.67,.06,.06]} color="#f9f3e8"/><Box position={[x,.72,-1.84]} size={[.84,.09,.2]} color="#e3b499"/></group>)}
    <Box position={[-2.04,1.1,-.65]} size={[.1,.8,.95]} color="#aec6c7"/>
    <Box position={[-1.98,1.1,-.65]} size={[.08,.8,.06]} color="#faf4e9"/>
    <Box position={[-1.98,1.1,-.65]} size={[.08,.06,.95]} color="#faf4e9"/>
    <Box position={[-1.52,.42,-1.26]} size={[.9,.67,.42]} color="#cfaa85"/>
    {[-1.8,-1.52,-1.24].map((x,i)=><Box key={x} position={[x,.53,-1.01]} size={[.2,.35,.12]} color={['#769aa2','#c69482','#d5bd79'][i]}/>)}
    <mesh position={[.15,.17,-.17]} rotation={[-Math.PI/2,0,0]} receiveShadow><circleGeometry args={[1.18,64]}/><meshStandardMaterial color={mode===1?'#efd69b':'#b9d0c7'} /></mesh>
    <mesh position={[-.2,.69,-.25]} castShadow><cylinderGeometry args={[.62,.62,.12,48]}/><meshStandardMaterial color="#ecc7a2"/></mesh>
    {[[-.6,-.65],[.2,-.65],[-.6,.15],[.2,.15]].map(([x,z],i)=><Box key={i} position={[x!,.41,z!]} size={[.075,.55,.075]} color="#c3a68a"/>)}
    {[[-.9,.45],[.65,-.28],[.02,-1.08]].map(([x,z],i)=><group key={i}><Box position={[x!,.34,z!]} size={[.43,.12,.42]} color={['#d8af92','#9ebbb0','#ddc888'][i]}/><Box position={[x!,.58,z!+.18]} size={[.43,.48,.07]} color={['#d8af92','#9ebbb0','#ddc888'][i]}/><Box position={[x!-.12,.19,z!]} size={[.06,.28,.06]} color="#c4ac87"/><Box position={[x!+.12,.19,z!]} size={[.06,.28,.06]} color="#c4ac87"/></group>)}
    <Box position={[-.37,.78,-.23]} size={[.2,.08,.18]} color="#c99a85"/><Box position={[.07,.79,-.4]} size={[.16,.09,.17]} color="#e2c16e"/>
    <Child position={[.86,.12,.46]} color="#daaa8d" rotation={-.7}/><Child position={[-.94,.12,-.05]} color="#e1c977" rotation={1.6}/><Child position={[.06,.12,-1.04]} color="#87aeba"/>
    <Box position={[.05,.1,1.35]} size={[1.45,.13,.36]} color="#dfd1b4"/>
    <Box position={[.05,-.005,1.63]} size={[1.65,.12,.3]} color="#e6dabe"/>
    <Tree position={[2.12,.02,-1.53]} size={.95}/><Tree position={[-2.3,.02,1.5]} size={.7}/>
    <group position={[1.85,.04,.48]} rotation={[0,-.15,0]}><Box position={[0,.43,0]} size={[.55,.8,.07]} color="#deb088"/><Box position={[0,.88,.05]} size={[.62,.12,.32]} color="#eac18f"/><Box position={[0,.51,.6]} size={[.57,.1,1.3]} color="#de9c86" rotation={[.6,0,0]}/><Box position={[-.32,.58,.6]} size={[.06,.18,1.32]} color="#f0c8a3" rotation={[.6,0,0]}/><Box position={[.32,.58,.6]} size={[.06,.18,1.32]} color="#f0c8a3" rotation={[.6,0,0]}/></group>
    <Child position={[1.12,.02,1.81]} color="#91b9a3" rotation={-.4}/>
    <Ball position={[.55,.14,1.87]} radius={.16} color="#e3c37a"/>
    {[[-1.5,1.77],[-1.8,1.1],[2.4,1.7]].map(([x,z],i)=><group key={i}><Box position={[x!,.16,z!]} size={[.3,.3,.3]} color={['#d5a695','#b7ccca','#dece94'][i]} radius={.05}/><Box position={[x!,.37,z!]} size={[.23,.17,.23]} color="#e6cf99"/></group>)}
    <mesh position={[-2.51,.03,-1.35]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.22,24]}/><meshStandardMaterial color="#e9c995"/></mesh>
  </group>;
}
function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => { (camera as OrthographicCamera).zoom = Math.min(80, size.width / 8.9); camera.updateProjectionMatrix(); }, [camera,size.width]);
  return null;
}
export default function SchoolWorld({ mode = 0 }: { mode?: number }) {
  return <Canvas orthographic shadows camera={{position:[7,6.5,8],zoom:76}} dpr={[1,1.75]} gl={{antialias:true,alpha:true}} aria-label="Sürükleyerek döndürebileceğiniz üç boyutlu örnek anaokulu">
    <FitCamera/>
    <ambientLight intensity={1.6}/><directionalLight position={[2,8,5]} intensity={3} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-.001}/>
    <Suspense fallback={null}><SchoolModel mode={mode}/><ContactShadows position={[0,-.36,0]} opacity={.25} scale={12} blur={2.8} far={4}/></Suspense>
    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={.55} maxPolarAngle={1.25} minAzimuthAngle={-.8} maxAzimuthAngle={1.5} target={[0,.65,0]} />
  </Canvas>;
}