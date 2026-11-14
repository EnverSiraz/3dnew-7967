from pathlib import Path
p=Path('/home/user/okuldas/packages/web/src/web/pages/home.tsx')
s=p.read_text()
s=s.replace("import { useEffect, useRef, useState, lazy, Suspense }", "import { useState, lazy, Suspense }")
s=s.replace("const demo =", "import ScrollStory from '../components/scroll-story';\nimport ScrollPhone from '../components/scroll-phone';\nconst demo =")
a=s.index('const steps = [');b=s.index('const faqs = [',a);s=s[:a]+s[b:]
s=s.replace(" const [step,setStep]=useState(0);", '')
s=s.replace("  const storyRef=useRef<HTMLDivElement>(null); const reduced=useReducedMotion();", "  const reduced=useReducedMotion();")
a=s.index('  useEffect(()=>');b=s.index('  const reveal=',a);s=s[:a]+s[b:]
a=s.index('  <section className="day-section"');b=s.index('  <section className="parents"',a);s=s[:a]+'  <ScrollStory/>\n'+s[b:]
s=s.replace('<ParentPhone/>','<ScrollPhone><ParentPhone/></ScrollPhone>')
s=s.replace("'Maya L. giriş yaptı':'Amara arrived at school'", "'Amara giriş yaptı':'Amara arrived at school'")
s=s.replace('className="avatar">D','className="avatar">A').replace('className="tiny-avatar">D','className="tiny-avatar">A')
p.write_text(s)
html=Path('/home/user/okuldas/packages/web/index.html');s=html.read_text()
s='\n'.join(line for line in s.splitlines() if 'fonts.googleapis.com' not in line and 'fonts.gstatic.com' not in line)
s=s.replace('<link rel="icon"', '<link rel="preload" href="/fonts/unbounded-latin.woff2" as="font" type="font/woff2" crossorigin />\n\t\t<link rel="preload" href="/fonts/hanken-latin.woff2" as="font" type="font/woff2" crossorigin />\n\t\t<link rel="icon"')
html.write_text(s+'\n')