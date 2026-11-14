import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import { CanvasTexture, Group, OrthographicCamera, SRGBColorSpace } from 'three';
import { SchoolModel, smooth } from './school-world';

function Rounded({position,size,color,radius=.08}: {position:[number,number,number];size:[number,number,number];color:string;radius?:number}) {
  return <RoundedBox args={size} radius={radius} smoothness={3} position={position} castShadow><meshStandardMaterial color={color} roughness={.65}/></RoundedBox>;
}
function phoneTexture() {
  const c=document.createElement('canvas');c.width=600;c.height=1100;
  const ctx=c.getContext('2d')!;
  ctx.fillStyle='#f8f9f4';ctx.fillRect(0,0,600,1100);
  const text=(t:string,x:number,y:number,size:number,color='#293f4b',weight=500)=>{ctx.font=`${weight} ${size}px "Hanken Grotesk", sans-serif`;ctx.fillStyle=color;ctx.fillText(t,x,y);};
  const round=(x:number,y:number,w:number,h:number,r:number,color:string)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();};
  text('9:41',40,50,22);text('•••',500,50,24);text('okuldaş',40,132,36,'#3f566b',700);
  text('Amara',40,191,28);text('Güneş Odası · Anaokulu 2',40,228,18,'#7c8e7a');
  round(30,262,540,88,18,'#dce9d7');text('BUGÜN',55,298,16,'#81957a');text('Mevcut',55,329,25,'#426449');
  round(30,382,540,270,18,'#e8eddb');
  ctx.fillStyle='#a7bea0';ctx.beginPath();ctx.ellipse(300,653,400,130,0,0,Math.PI*2);ctx.fill();
  round(148,470,63,120,8,'#e2b999');round(203,443,122,48,8,'#ecd49a');round(323,510,63,78,8,'#89afb0');
  text('Bu sabah su masası',48,696,25);text('10:30 · EN → TR',48,729,18,'#8a9980');
  round(30,767,540,83,15,'#f0e6d8');text('Öğle yemeğinin çoğunu yedi',53,810,22);text('11:45 · Çevrildi',53,837,16,'#8b9780');
  round(30,878,540,83,15,'#e3eadf');text('42 dakika uyudu',53,919,23);text('13:38 · Çevrildi',53,945,16,'#8b9780');
  text('Ana Sayfa       Mesajlar       Takvim',48,1030,18,'#72846a');round(225,1060,150,7,4,'#3f566b');
  const texture=new CanvasTexture(c);texture.colorSpace=SRGBColorSpace;return texture;
}
function labelTexture(title:string,body:string,color:string) {
  const c=document.createElement('canvas');c.width=700;c.height=230;const ctx=c.getContext('2d')!;
  ctx.fillStyle='#fbfcf7';ctx.fillRect(0,0,700,230);ctx.fillStyle=color;ctx.beginPath();ctx.arc(69,74,28,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#3f566b';ctx.font='600 32px "Hanken Grotesk", sans-serif';ctx.fillText(title,118,85);
  ctx.fillStyle='#829079';ctx.font='400 23px "Hanken Grotesk", sans-serif';ctx.fillText(body,45,166);
  const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;return t;
}
function MessageCard({title,body,color,position,rotation}: {title:string;body:string;color:string;position:[number,number,number];rotation:[number,number,number]}) {
  const texture=useMemo(()=>labelTexture(title,body,color),[title,body,color]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <group position={position} rotation={rotation}><Rounded position={[0,0,0]} size={[2.75,.91,.10]} color="#eff2e8"/><mesh position={[0,0,.057]}><planeGeometry args={[2.63,.8]}/><meshBasicMaterial map={texture}/></mesh></group>;
}
function ParentWorld({progress}: {progress:MutableRefObject<number>}) {
  const root=useRef<Group>(null);const cards=useRef<Group>(null);
  const texture=useMemo(phoneTexture,[]);useEffect(()=>()=>texture.dispose(),[texture]);
  useFrame(()=>{
    if(!root.current)return;
    const p=progress.current;const enter=smooth(.77,.96,p);
    root.current.visible=enter>.002;root.current.position.set(2.2,1.2+enter*.65,1.0);
    root.current.rotation.set(.25*(1-enter)-.32*enter,-1.3*(1-enter)+.58*enter,-.08*enter);
    root.current.scale.setScalar(enter);
    if(cards.current) {cards.current.rotation.y=(1-enter)*.8;cards.current.rotation.z=(1-enter)*.25;}
  });
  return <group ref={root} scale={0}>
    <Rounded position={[0,0,0]} size={[2.05,3.85,.23]} color="#344b58" radius={.16}/>
    <mesh position={[0,0,.122]}><planeGeometry args={[1.83,3.62]}/><meshBasicMaterial map={texture}/></mesh>
    <Rounded position={[0,1.71,.14]} size={[.61,.09,.04]} color="#344b58" radius={.02}/>
    <Rounded position={[1.04,.85,0]} size={[.035,.5,.06]} color="#6b8590" radius={.01}/>
    <group ref={cards}>
      <MessageCard title="Tek mesaj · Her dilde" body="EN · Garden trip tomorrow at 9" color="#c8dac2" position={[-1.65,1.45,.6]} rotation={[0,.12,.10]}/>
      <MessageCard title="Öğretmen onaylar" body="Yapay zeka sınıf hikayeleri ve özetleri" color="#e9d5ae" position={[1.55,-.7,.6]} rotation={[0,-.3,-.08]}/>
    </group>
  </group>;
}
function CameraChoreography({progress}: {progress:MutableRefObject<number>}) {
  const {camera,size}=useThree();
  useFrame(()=>{
    const p=progress.current;const mobile=size.width<700;
    const assembled=smooth(0,.20,p);const close=smooth(.22,.40,p)*(1-smooth(.46,.61,p));
    const exploded=smooth(.55,.74,p);const end=smooth(.80,1,p);
    const base=Math.min(size.width/(mobile?10.8:10.6),size.height/(mobile?8:7));
    (camera as OrthographicCamera).zoom=base*(.68+assembled*.42+close*.37-exploded*.31+end*.20);
    camera.position.set(8-close*3,7-close*3+exploded*1.5,9-close*1.7);
    camera.lookAt(end*.4,1.05+exploded*.95-end*.8,0);
    camera.updateProjectionMatrix();
  });
  return null;
}
export default function ScrollWorld({progress}: {progress:MutableRefObject<number>}) {
  return <Canvas orthographic camera={{position:[8,7,9],zoom:85}} shadows dpr={[1,1.5]} gl={{alpha:true,antialias:true}} aria-label="Kaydırma ile birleşen, dönen ve katmanlarına ayrılan üç boyutlu anaokulu">
    <CameraChoreography progress={progress}/>
    <ambientLight intensity={1.5}/>
    <directionalLight position={[3,9,7]} intensity={3} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-.002}/>
    <Suspense fallback={null}><SchoolModel progress={progress}/><ParentWorld progress={progress}/><ContactShadows position={[0,-.56,0]} opacity={.22} scale={22} blur={3.4} far={8} resolution={256} frames={1}/></Suspense>
  </Canvas>;
}