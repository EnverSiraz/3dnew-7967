import { useEffect, useMemo } from 'react';
import { Line, RoundedBox } from '@react-three/drei';
import { CanvasTexture, ExtrudeGeometry, Shape, SRGBColorSpace } from 'three';

export type Feature = 'attendance' | 'meal' | 'media' | 'sleep' | 'translation';
const features = {
  attendance: { label: 'Yoklama', color: '#d7e8db', ink: '#6b9781' },
  meal: { label: 'Öğünler', color: '#f0dfc3', ink: '#bc9860' },
  media: { label: 'Medya', color: '#dce5ec', ink: '#7c9caf' },
  sleep: { label: 'Uyku', color: '#e2dfee', ink: '#9788b5' },
  translation: { label: '12 dil', color: '#eedbd5', ink: '#b68176' },
};

function Caption({ feature }: { feature: Feature }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 384; canvas.height = 96;
    const context = canvas.getContext('2d')!;
    context.fillStyle = features[feature].color;
    context.fillRect(0, 0, 384, 96);
    context.fillStyle = '#53665f';
    context.textAlign = 'center';
    context.font = '600 44px "Hanken Grotesk", sans-serif';
    context.fillText(features[feature].label, 192, 64);
    const value = new CanvasTexture(canvas);
    value.colorSpace = SRGBColorSpace;
    return value;
  }, [feature]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={[0, -.34, .145]}><planeGeometry args={[.86, .215]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}

function Moon() {
  const geometry = useMemo(() => {
    const s = new Shape();
    s.moveTo(.13, .32);
    s.bezierCurveTo(-.38, .36, -.42, -.32, .05, -.33);
    s.bezierCurveTo(.24, -.34, .37, -.19, .38, -.05);
    s.bezierCurveTo(.08, -.18, -.08, .14, .13, .32);
    return new ExtrudeGeometry(s, { depth: .08, bevelEnabled: true, bevelThickness: .028, bevelSize: .028, bevelSegments: 3, curveSegments: 32 });
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group position={[-.04, .10, .18]}>
    <mesh geometry={geometry} castShadow><meshStandardMaterial color="#b2a2cc" roughness={.4}/></mesh>
    <mesh position={[.31, .30, .07]} rotation={[0, 0, .3]}><octahedronGeometry args={[.083]}/><meshStandardMaterial color="#f1dca5"/></mesh>
    <mesh position={[-.28, -.22, .04]}><sphereGeometry args={[.035, 16, 12]}/><meshStandardMaterial color="#fff8df"/></mesh>
  </group>;
}

function TranslationGlyph() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 192;
    const c = canvas.getContext('2d')!;
    c.fillStyle = '#eedbd5'; c.fillRect(0, 0, 256, 192);
    c.fillStyle = '#ad7e75'; c.font = '600 102px "Hanken Grotesk", sans-serif'; c.fillText('A', 22, 116);
    c.fillStyle = '#6c817a'; c.font = '500 57px "Hanken Grotesk", sans-serif'; c.fillText('TR', 131, 85); c.fillText('EN', 131, 153);
    const t = new CanvasTexture(canvas); t.colorSpace = SRGBColorSpace; return t;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <group>
    <mesh position={[0, .1, .149]}><planeGeometry args={[.8, .6]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>
    <Line points={[[-.25, -.14, .17], [.05, -.14, .17], [-.01, -.20, .17]]} color="#b68176" lineWidth={2}/>
  </group>;
}

export default function OrbitFeature({ feature }: { feature: Feature }) {
  const { color, ink } = features[feature];
  return <group rotation={[.07, feature === 'media' ? -.12 : .12, feature === 'sleep' ? -.1 : .08]}>
    <RoundedBox args={[1.08, 1.08, .23]} radius={.13} smoothness={4} castShadow receiveShadow><meshPhysicalMaterial color={color} roughness={.43} clearcoat={.25}/></RoundedBox>
    <Caption feature={feature}/>
    {feature === 'attendance' && <group position={[0, .12, .17]}>
      <mesh><circleGeometry args={[.33, 48]}/><meshStandardMaterial color="#f9fcf4"/></mesh>
      <Line points={[[-.18, .01, .035], [-.045, -.12, .035], [.19, .15, .035]]} color={ink} lineWidth={5}/>
      <mesh position={[.34, .31, .025]}><sphereGeometry args={[.066, 20, 16]}/><meshStandardMaterial color={ink}/></mesh>
    </group>}
    {feature === 'meal' && <group position={[-.05, .12, .2]}>
      <mesh><torusGeometry args={[.29, .044, 12, 48]}/><meshStandardMaterial color="#fff8eb" roughness={.4}/></mesh>
      <mesh position={[0, 0, -.025]}><circleGeometry args={[.265, 48]}/><meshStandardMaterial color="#e2c496"/></mesh>
      {[[-.08, .04], [.09, .07], [0, -.09]].map(([x, y], i) => <mesh key={i} position={[x!, y!, .03]}><sphereGeometry args={[.07, 20, 16]}/><meshStandardMaterial color={i === 0 ? '#b7cba0' : i === 1 ? '#e3ae88' : '#e9d49e'}/></mesh>)}
      <RoundedBox args={[.038, .4, .05]} radius={.017} position={[.40, -.035, .02]}><meshStandardMaterial color={ink}/></RoundedBox>
      <mesh position={[.40, .20, .02]} scale={[.7, 1, .5]}><sphereGeometry args={[.095, 20, 16]}/><meshStandardMaterial color={ink}/></mesh>
    </group>}
    {feature === 'media' && <group position={[0, .1, .15]}>
      <RoundedBox args={[.79, .59, .045]} radius={.045}><meshStandardMaterial color="#faf9ef"/></RoundedBox>
      <mesh position={[0, .025, .027]}><planeGeometry args={[.64, .43]}/><meshStandardMaterial color="#c2d8de"/></mesh>
      <mesh position={[.17, .15, .04]}><circleGeometry args={[.07, 24]}/><meshStandardMaterial color="#f3d998"/></mesh>
      <mesh position={[-.14, -.04, .05]}><circleGeometry args={[.24, 3]}/><meshStandardMaterial color="#8eb0a1"/></mesh>
      <mesh position={[.12, -.07, .06]}><circleGeometry args={[.20, 3]}/><meshStandardMaterial color="#a9c3ad"/></mesh>
    </group>}
    {feature === 'sleep' && <Moon/>}
    {feature === 'translation' && <TranslationGlyph/>}
  </group>;
}