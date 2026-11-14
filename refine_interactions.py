from pathlib import Path
p=Path('/home/user/okuldas/packages/web/src/web/pages/home.tsx')
s=p.read_text()
start=s.index('<div className="mini-scene">')
end=s.index('<motion.div key={step}',start)
s=s[:start]+'<div className="mini-scene"><Suspense fallback={<div className="world-loading">3D görünüm hazırlanıyor…</div>}><SchoolWorld mode={step}/></Suspense></div>'+s[end:]
s=s.replace("label:'Güne merhaba'", "label:'Günlük operasyonlar'").replace("label:'Birlikte büyüyoruz'", "label:'Güvenle paylaşılan medya'").replace("label:'Güzel bir günün hikayesi'", "label:'Aile iletişimi'")
s=s.replace("'Günaydın, güzel dünya.'", "'Birleşik günlük akış'").replace("'Birlikte keşfetme zamanı.'", "'Güvenle paylaşılan medya'").replace("'Bugünden güzel bir hikaye.'", "'Yapay zeka sınıf hikayeleri ve özetleri'")
s=s.replace('Amara’in','Amara’nın').replace("'Amara okula geldi'", "'Maya L. giriş yaptı'").replace("'Amara’nın günü başladı.'", "'Maya L. giriş yaptı'")
s=s.replace('Amara geldi','Amara giriş yaptı').replace("'Bugün birlikte bir şehir kurduk.'", "'Ms. Kaur 3 fotoğraf paylaştı'")
p.write_text(s)