import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowDown, Check, ChevronDown, Sparkles } from 'lucide-react';
import { aiAudiences, aiPoses } from './ai-content';
import { useChapterSnap } from './use-chapter-snap';

const AIWorld = lazy(() => import('./ai-world'));

function AudiencePanel({ index, active, progress, reduced, compact }: { index: number; active: number; progress: MotionValue<number>; reduced: boolean; compact: boolean }) {
  const audience = aiAudiences[index]!;
  const [expanded, setExpanded] = useState(0);
  const start = index / 3, end = (index + 1) / 3;
  const opacity = useTransform(progress, index === 0 ? [0, end - .04, end + .025] : [start - .025, start + .045, end - .035, Math.min(1, end + .025)], index === 0 ? [1, 1, 0] : [0, 1, 1, index === 2 ? 1 : 0]);
  const y = useTransform(progress, [start, start + .06, end - .035, Math.min(1, end + .025)], [25, 0, 0, -25]);
  return <motion.article className={`ai-audience ai-audience-${index}`} aria-hidden={reduced ? false : active !== index} style={reduced ? undefined : { opacity, y, pointerEvents: active === index ? 'auto' : 'none', visibility: active === index ? 'visible' : 'hidden' }}>
    <div className="ai-audience-heading"><span className="ai-role-icon"><audience.icon size={21}/></span><div><span className="eyebrow">0{index + 1} / 03</span><h3>{audience.label}</h3></div></div>
    <span className="ai-mobile-help">Başlıklara dokunarak özellikleri inceleyin.</span>
    <section className="ai-feature-list" aria-label={`${audience.label} — yapay zeka özellikleri`}>
      {audience.features.map((feature, i) => <div className={`ai-feature ${expanded === i ? 'is-expanded' : ''}`} key={feature.title}>
        <button className="ai-feature-toggle" aria-expanded={reduced || !compact || expanded === i} aria-controls={`ai-feature-${index}-${i}`} onClick={() => setExpanded(expanded === i ? -1 : i)} tabIndex={reduced || active === index ? 0 : -1}>
          <feature.icon size={17}/><h4>{feature.title}</h4><ChevronDown className="ai-feature-chevron" size={15}/>
        </button>
        <p id={`ai-feature-${index}-${i}`} hidden={!reduced && compact && expanded !== i}>{feature.body}</p>
      </div>)}
    </section>
    <div className="ai-audience-tag"><Check size={13}/>{audience.tag}</div>
  </motion.article>;
}

export default function AIStory() {
  const section = useRef<HTMLElement>(null); const stage = useRef<HTMLDivElement>(null); const progressRef = useRef(0); const reduced = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width:700px)');
    const update = () => setCompact(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const snap = useChapterSnap(section, reduced, aiPoses);
  const backdrop = useTransform(scrollYProgress, [0, .33, .67, 1], ['#f1efe4', '#e6eee5', '#e9ece6', '#e6ecef']);
  const orbitScale = useTransform(scrollYProgress, [0, .33, .67, 1], [.85, 1.2, .85, 1.05]);
  const orbitRotation = useTransform(scrollYProgress, [0, 1], [-15, 70]);
  if (reduced) progressRef.current = .14;
  useMotionValueEvent(scrollYProgress, 'change', p => {
    progressRef.current = reduced ? .14 : p;
    const next = Math.min(2, Math.floor(p * 3));
    setActive(old => old === next ? old : next);
    if (stage.current) stage.current.dataset.progress = p.toFixed(4);
  });
  return <section className="ai-experience" id="yapay-zeka">
    <div className="ai-intro">
      <span className="ai-intro-mark"><Sparkles size={26}/></span>
      <span className="eyebrow">Yapay zeka, fark yarattığı her yerde</span>
      <h2>Aileler, öğretmenler ve yöneticiler için<br/><span>tek bir yapay zeka sistemi.</span></h2>
      <p>Günlük hikayelerden haftalık özetlere, personel için devamsızlık ve esenlik içgörülerine kadar yapay zeka arka planda çalışır. Yapay zekanın ailelere yönelik hazırladığı her şeyi, veliler görmeden bir öğretmen onaylar.</p>
      <a href="#ai-yolculuk" className="ai-intro-cue"><ArrowDown size={14}/> Üç bakış açısını keşfedin</a>
    </div>
    <section ref={section} id="ai-yolculuk" className={`ai-cinema ${reduced ? 'ai-reduced' : ''}`} aria-label="Aileler, öğretmenler ve yöneticiler için üç boyutlu yapay zeka yolculuğu">
      <motion.div className="ai-stage" ref={stage} data-chapter={active} style={{ backgroundColor: backdrop }}>
        <div className="ai-stage-grid"/>
        <div className="ai-stage-top"><span><Sparkles size={13}/> OKULDAŞ · YAPAY ZEKA</span><span>0{active + 1}<i>/ 03</i></span></div>
        <motion.div className="ai-world-orbit" style={{ scale: orbitScale, rotate: orbitRotation }}/>
        <div className="ai-world"><Suspense fallback={<div className="world-loading">Yapay zeka dünyası hazırlanıyor…</div>}><AIWorld progress={progressRef}/></Suspense></div>
        <div className="ai-audiences">{aiAudiences.map((a, i) => <AudiencePanel key={a.label} index={i} active={active} progress={scrollYProgress} reduced={reduced} compact={compact}/>)}</div>
        <div className="ai-stage-bottom"><span className="ai-stage-hint"><ArrowDown size={13}/> KAYDIRIN · BÖLÜME YERLEŞİR</span><nav aria-label="Yapay zeka kitleleri">{aiAudiences.map((a, i) => <button key={a.label} aria-current={active === i ? 'step' : undefined} className={active === i ? 'active' : ''} onClick={() => snap(i)}><span>0{i + 1}</span>{a.short}</button>)}</nav><small>3D anlatım · Örnek arayüz</small></div>
        <motion.div className="ai-progress" style={{ scaleX: scrollYProgress }}/>
      </motion.div>
    </section>
  </section>;
}