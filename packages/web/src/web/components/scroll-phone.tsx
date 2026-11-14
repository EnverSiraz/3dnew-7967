import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export default function ScrollPhone({children}: {children:ReactNode}) {
  const target=useRef<HTMLDivElement>(null);const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target,offset:['start end','end start']});
  const rotateY=useTransform(scrollYProgress,[0,.45,1],[-48,-8,27]);
  const rotateX=useTransform(scrollYProgress,[0,.45,1],[22,0,-14]);
  const rotateZ=useTransform(scrollYProgress,[0,.5,1],[-9,2,12]);
  const y=useTransform(scrollYProgress,[0,.5,1],[110,0,-85]);
  const scale=useTransform(scrollYProgress,[0,.45,1],[.82,1.05,.94]);
  return <motion.div className="scroll-phone-shell" ref={target} style={reduced?undefined:{rotateY,rotateX,rotateZ,y,scale,transformPerspective:1100}}>{children}</motion.div>;
}