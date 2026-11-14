import { lazy, Suspense, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion, type MotionValue } from 'motion/react';
import { ArrowDown, Check, Globe2, Layers3, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import { useChapterSnap } from './use-chapter-snap';
const ScrollWorld = lazy(() => import('./scroll-world'));

const chapters = [
  {label:'TEK PLATFORM',title:'Okul gününde ihtiyaç duyulan her şey, nihayet tek yerde.',body:'Artık WhatsApp grupları, kağıt kayıtlar ve dağınık tablolar yok. Okuldaş, öğrencinin okuldaki tüm gününü kapsar.',rail:'Tek platform',tag:'Tek günlük akış',icon:Layers3},
  {label:'GÜNLÜK OPERASYONLAR',title:'Birleşik günlük akış',body:'Yoklama, öğünler, uyku, sağlık notları ve paylaşımlar her çocuk için tek bir net akışta toplanır.',rail:'Günlük akış',tag:'08:30 · Maya L. giriş yaptı',icon:Sun},
  {label:'SAĞLIK VE GÜVENLİK',title:'Sağlık kayıtları ve onay',body:'Tıbbi profil, ilaç programları ve ilaç kayıtları. Bu modül için onay her veliden ayrı ayrı alınır.',rail:'Sağlık ve güvenlik',tag:'Onay her veliden ayrı alınır',icon:ShieldCheck},
  {label:'AİLE İLETİŞİMİ',title:'Yapay zeka sınıf hikayeleri ve özetleri',body:'Öğretmenin başlattığı bu anlatılar sayesinde gün, içten ve yaşa uygun güncellemelere, haftalık özetlere dönüşür.',rail:'Yapay zeka',tag:'Yapay zeka hazırlar · Öğretmen onaylar',icon:Sparkles},
  {label:'VELİNİN CEBİNDE',title:'Tek akış, tek gelen kutusu, tek dokunuşla kendi dilleri.',body:'Mesajlar, duyurular ve paylaşımlar tek dokunuşla 12 dile çevrilir.',rail:'12 dil',tag:'Tek mesaj · Her dilde',icon:Globe2},
];
function Chapter({index,progress,active,reduced}: {index:number;progress:MotionValue<number>;active:number;reduced:boolean|null}) {
  const c=chapters[index];const start=index/5,end=(index+1)/5;
  const fadeEnd=Math.min(1,end+.015);
  const opacity=useTransform(progress,index===0?[0,end-.035,fadeEnd]:[start-.015,start+.035,end-.035,fadeEnd],index===0?[1,1,0]:[0,1,1,0]);
  const y=useTransform(progress,[start,start+.05,end-.035,fadeEnd],[35,0,0,-35]);
  return <motion.article className="cinema-copy" aria-hidden={reduced?false:active!==index} style={reduced?undefined:{opacity,y}}>
    <span className="eyebrow"><c.icon size={14}/>{c.label}</span>
    <h2>{c.title}</h2><p>{c.body}</p>
    <div className="cinema-tag"><Check size={13}/>{c.tag}</div>
  </motion.article>;
}
export default function ScrollStory() {
  const target=useRef<HTMLElement>(null);const stage=useRef<HTMLDivElement>(null);const worldProgress=useRef(0);const reduced=useReducedMotion();const [active,setActive]=useState(0);
  const snapToChapter=useChapterSnap(target,!!reduced);
  const {scrollYProgress}=useScroll({target,offset:['start start','end end']});
  const backdrop=useTransform(scrollYProgress,[0,.24,.5,.73,1],['#eef2e8','#e5eee3','#f1e8da','#e1e9e5','#e8edf0']);
  const ringScale=useTransform(scrollYProgress,[0,.3,.6,1],[.65,1.35,.8,1.5]);
  const ringRotation=useTransform(scrollYProgress,[0,1],[-30,100]);
  const dashY=useTransform(scrollYProgress,[0,1],[70,-100]);
  if(reduced)worldProgress.current=.24;
  useMotionValueEvent(scrollYProgress,'change',(p)=>{
    worldProgress.current=reduced ? .24 : p;
    const next=Math.min(4,Math.floor(p*5));setActive(old=>old===next?old:next);
    if(stage.current) {stage.current.dataset.progress=p.toFixed(4);stage.current.style.setProperty('--scene-progress',String(p));}
  });
  const goTo=(index:number)=>{
    if(!target.current)return;
    if(reduced){document.getElementById('veliler')?.scrollIntoView({behavior:'instant'});return;}
    snapToChapter(index);
  };
  return <section className={`scroll-cinema ${reduced?'cinema-reduced':''}`} id="bir-gun" ref={target} aria-label="Okuldaş üç boyutlu ürün yolculuğu">
    <motion.div className="cinema-stage" ref={stage} style={{backgroundColor:backdrop}} data-chapter={active}>
      <div className="cinema-grid"/>
      <div className="cinema-topline"><span><span className="status-dot"/> OKULDAŞ · GÜNÜN TAMAMI TEK AKIŞTA</span><span className="cinema-page">0{active+1}<i>/ 05</i></span></div>
      <motion.div className="cinema-orbit" style={{scale:ringScale,rotate:ringRotation}}/>
      <motion.div className="cinema-dash" style={{y:dashY}}/>
      <div className="cinema-world"><Suspense fallback={<div className="world-loading">3D görünüm hazırlanıyor…</div>}><ScrollWorld progress={worldProgress}/></Suspense></div>
      <div className="cinema-copies">{chapters.map((c,i)=><Chapter key={c.label} index={i} progress={scrollYProgress} active={active} reduced={reduced}/>)}</div>
      <div className="cinema-bottom"><div className="cinema-scroll-hint"><ArrowDown size={15}/><span>KAYDIRIN · BÖLÜME YERLEŞİR</span></div><nav className="cinema-chapters" aria-label="3D yolculuk bölümleri">{chapters.map((c,i)=><button key={c.label} aria-label={c.rail} aria-current={active===i?'step':undefined} onClick={()=>goTo(i)} className={active===i?'active':''}><span>0{i+1}</span><strong>{c.rail}</strong></button>)}</nav><span className="cinema-note">3D ürün anlatımı · Örnek arayüz</span></div>
      <motion.div className="cinema-progress" style={{scaleX:scrollYProgress}}/>
    </motion.div>
  </section>;
}