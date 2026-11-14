from pathlib import Path
import re

p = Path('/home/user/okuldas/packages/web/src/web/pages/home.tsx')
s = p.read_text()
replacements = {
"title:'Küçük bir merhaba.\\nKocaman bir iç rahatlığı.'": "title:'Birleşik günlük akış'",
"body:'Yoklama kaydıyla gün başlar. Öğretmenler sınıfın durumunu tek bakışta görür, veliler günün akışını takip eder.'": "body:'Yoklama, öğünler, uyku, sağlık notları ve paylaşımlar her çocuk için tek bir net akışta toplanır.'",
"title:'Her küçük an,\\nbüyük hikayenin parçası.'": "title:'Güvenle paylaşılan medya'",
"body:'Öğünler, uyku, etkinlikler ve fotoğraflar aynı akışta. Günün güzel anları da önemli ayrıntıları da kaybolmaz.'": "body:'Fotoğraf ve videolar, yalnızca yetkili personel ve ailelerle paylaşılır.'",
"title:'Okulda yaşananlar,\\neve de ulaşır.'": "title:'Yapay zeka ile yazılan\\nsınıf hikayeleri'",
"body:'Yapay zeka günlük hikayenin taslağını hazırlar, öğretmen onaylar. Aileler, tek dokunuşla kendi dillerinde okur.'": "body:'Yoklama, öğünler, uyku gibi gerçek sınıf anları, veliler için içten bir günlük hikayeye dönüşür. Bu hikaye gönderilmeden önce bir öğretmen tarafından incelenir ve onaylanır.'",
"KÜÇÜK DÜNYALAR, GÜÇLÜ BAĞLAR":"OKULLAR İÇİN YAPAY ZEKA",
"<h1>Onların dünyası.<br/>Hepimizin <span className=\"underlined\">geleceği.":"<h1>Okullar için<br/>yapay zeka,<br/><span className=\"underlined\">günün tamamında<br/>yanınızda.",
"Okulun neşesini, öğretmenin emeğini ve velinin iç rahatlığını tek bir dünyada buluşturuyoruz.":"Okuldaş, anaokulları ve kreşler için yapay zeka tabanlı bir operasyon platformudur: yoklamayı, öğünleri, mesajlaşmayı ve medyayı tek çatı altında toplar.",
"Okuldaş’la tanışın":"Demo talep et",
"Bir günü keşfedin":"Nasıl çalışır",
"Öğretmenlerin yanında. Ailelerin cebinde.":"Personel için daha az karmaşa, veliler için daha çok netlik.",
"Güzel bir gün burada başlar.":"Tek günlük akış.",
"Her küçük an, bir hikaye.":"Yapay zeka sınıf hikayeleri ve özetleri",
"Yapay zeka destekli, öğretmen onaylı.":"Öğretmen onaylar, veliler görür.",
"AŞAĞIDA GÜZEL BİR GÜN VAR":"GÜNÜN TAMAMI TEK AKIŞTA",
"BİRLİKTE BÜYÜYEN BİR DÜNYA":"ÇOK ŞUBEYE HAZIR",
"Bir gün. Tek platform.":"Tek günlük akış",
"Dağınık işler, yerini netliğe bırakır.":"Yoklama, öğünler, uyku ve paylaşımlar.",
"12 dil. Aynı yakınlık.":"12 dil",
"Her aile, kendi dilinde.":"Tek dokunuşla çevrilir.",
"Akıllı destek. İnsani dokunuş.":"Yapay zeka sınıf hikayeleri ve özetleri",
"Yapay zeka hazırlar, öğretmen onaylar.":"Öğretmen onaylar.",
"OKULDAŞ İLE BİR OKUL GÜNÜ":"TEK PLATFORM",
"<h2>Gün akıp gider.<br/><span>Siz hiçbir anı kaçırmayın.</span></h2>":"<h2>Okul gününde ihtiyaç duyulan her şey,<br/><span>nihayet tek yerde.</span></h2>",
"Sabahın ilk merhabasından günün son hikayesine,<br className=\"desktop-br\"/> okul hayatının tamamı birbirine bağlı.":"Artık WhatsApp grupları, kağıt kayıtlar ve dağınık tablolar yok.<br className=\"desktop-br\"/> Okuldaş, öğrencinin okuldaki tüm gününü kapsar.",
"BİR GÜNÜN KÜÇÜK MUTLULUKLARI":"SINIF ZAMAN AKIŞI",
"OKUL İLE EV ARASINDA GÜZEL BİR BAĞ":"VELİNİN CEBİNDE",
"<h2>Aklınız okulda<br/>kalmasın.<br/><span>Güzellikler cebinizde.</span></h2>":"<h2>Velilerin gerçekten<br/>kullanmak istediği<br/><span>bir okul uygulaması.</span></h2>",
"“Bugün nasıl geçti?” sorusunun cevabı artık çok yakın. Küçük keşifler, önemli güncellemeler ve öğretmenden bir merhaba. Hepsi tek bir sakin akışta.":"Tek akış, tek gelen kutusu, tek dokunuşla kendi dilleri. Yoklama, öğünler, randevular, sağlık güncellemeleri ve okulun kaydettiği ödeme planı tek bir yerde. Sessize alınacak grup sohbeti yok, gürültüde kaybolan güncelleme yok.",
"Günün tamamı, tek bir akışta":"Günün tamamı tek akışta",
"Güvenle paylaşılan fotoğraf ve anılar":"Güvenle paylaşılan medya",
"Bir dokunuşla kendi dilinizde":"İstenince çeviri",
"Veli deneyimini keşfedin":"Demo talep et",
"Aynı sıcaklık.":"Tek dokunuşla çevrilir.",
"Size özel.":"Güvenle paylaşılan medya.",
"Güvenle paylaşılan.":"Yalnızca yetkili personel ve aileler.",
"TEKNOLOJİ ARKA PLANDA. İNSAN HEP MERKEZDE.":"YAPAY ZEKA, FARK YARATTIĞI HER YERDE",
"<h2>Daha az ekran işi.<br/>Daha çok <span>“iyi ki”.</span></h2>":"<h2>Aileler, öğretmenler ve yöneticiler için<br/><span>tek bir yapay zeka sistemi.</span></h2>",
"Okuldaş, öğretmenin yerini almaz. Ona zaman kazandırır.<br/>Yapay zeka taslakları hazırlar; son söz, çocuğu tanıyan öğretmendedir.":"Günlük hikayelerden haftalık özetlere, personel için devamsızlık ve esenlik içgörülerine kadar yapay zeka arka planda çalışır. Yapay zekanın ailelere yönelik hazırladığı her şeyi, veliler görmeden bir öğretmen onaylar.",
"AKLINIZDAKİLER":"SORULAR, YANITLARIYLA.",
"<h2>Biraz daha<br/>yakından tanıyalım.</h2>":"<h2>Sorular,<br/>yanıtlarıyla.</h2>",
"Sorularınızın cevabı burada.<br/>Bir merhaba uzağınızdayız.":"Kurumunuzdan kısaca bahsedin,<br/>size özel bir tanıtım hazırlayalım.",
"Bizimle konuşun":"Demo talep et",
"GÜZEL GÜNLER, BİRLİKTE BAŞLAR.":"AYLAR DEĞİL, GÜNLER İÇİNDE YAYINDA.",
"<h2>Okulunuzun yeni dünyasıyla<br/>tanışmaya hazır mısınız?</h2>":"<h2>Okuldaş'ı kendi okulunuzun<br/>günüyle görün.</h2>",
"Birlikte keşfedelim":"Demo talep et",
"Size özel demo. Taahhüt yok. Sadece güzel bir başlangıç.":"Taahhüt yok. Bir iş günü içinde size dönüş yapıyoruz.",
"Küçük dünyaları birbirine bağlayan,<br/>büyük bir okul arkadaşı.":"Anaokulları, kreşler ve çok şubeli anaokulu ağları için yapay zeka tabanlı operasyon ve iletişim platformu.",
"Özenle tasarlandı.<br/>Birlikte büyümek için.":"Okuldaş, Edelio'nun<br/>Türkiye markasıdır.",
"Türkiye için, sevgiyle.":"Tüm hakları saklıdır.",
"https://app.okuldas.com\"":"https://app.okuldas.com/login\"",
"Neden Okuldaş?":"Özellikler",
"Bir okul günü":"Nasıl çalışır",
"Deniz":"Amara",
"Küçük anlar. Güzel bir gün.":"Günün tamamı tek akışta",
"Little moments. A lovely day.":"The whole day in one timeline",
"Bugün hayal gücümüzü büyüttük.":"Bu sabah su masası",
"Minik eller, büyük keşifler":"Bu sabah su masası",
"Little hands, big discoveries":"Water table this morning",
"Bugün renkli bloklarla kendi şehrimizi kurduk. Amara, arkadaşlarıyla kocaman bir köprü yaptı!":"Su masası · 6 çocuk etiketlendi",
"Today we built our own city with colorful blocks. Amara made a big bridge with friends!":"Water table · 6 children tagged",
"Yarın bahçe etkinliğimiz var. Lütfen Amara’in şapkasını göndermeyi unutmayın.":"Yarın saat 9'da bahçe gezimiz var, şapka getirin.",
"We have a garden activity tomorrow. Please remember Amara’s hat.":"Garden trip tomorrow at 9 - bring a hat.",
"Bir dokunuş. Kendi diliniz.":"Tek dokunuşla çevrilir",
}
for old,new in replacements.items():
    if old not in s:
        print('NOT FOUND:',old)
    s = s.replace(old,new)
# Source FAQs verbatim from the live site's <details> elements.
faq = '''const faqs = [
  ["Okuldaş hangi dilleri destekliyor?", "Türkçe, Arapça, İngilizce, Almanca, Fransızca, Rusça, Hintçe, Urduca, Filipince, İtalyanca, İspanyolca ve Japonca olmak üzere 12 dil. Mesajlar, duyurular ve yapay zeka özetleri tek dokunuşla çevrilebilir; çeviriyi okumak ücretsizdir."],
  ["Verilerimiz gizli ve mevzuata uygun mu?", "Evet. Okuldaş, her okulun verilerini birbirinden ayrı tutacak şekilde tasarlandı: veri işleme KVKK / GDPR / PDPL uyumludur, personel ve aileler için erişim rol bazlıdır, tıbbi ve esenlik kayıtları içinse onay takip edilir."],
  ["WhatsApp ve Excel'den geçiş yapabilir miyiz?", "Evet. Öğrenci listenizi web üzerinden bir CSV dosyasıyla aktarabilirsiniz, tek seferde en fazla 200 satır. Personel ve veliler davetle katılır. Dağınık sohbetlerin ve tabloların yerini tek bir günlük akış alır."],
  ["Çok şubeli kurumlarda çalışıyor mu?", "Evet. Merkezî görünürlük ve şube bazlı raporlama, çok şubeli kurumlar ve anaokulu ağları için baştan tasarlandı. Duyurular kurumun tamamına, bir şubeye ya da tek bir sınıfa gönderilebilir."],
  ["Yapay zeka çocuk içerikleri için güvenli mi?", "Yapay zekanın ailelere yönelik hazırladığı hikaye ve özetler, öğretmen inceleyip onaylamadan velilere gösterilmez. Sohbet mesajları gönderildikten sonra otomatik denetimden geçer ve işaretlenenler personelin inceleme kuyruğuna düşer. Kontrol sizde kalır."],
  ["Fiyatlandırma nasıl işliyor?", "Fiyatlandırma, okulunuzun büyüklüğüne ve kurulumuna göre değişir. Bir demo talep edin, size uygun planı birlikte belirleyelim."],
  ["Yapay zeka sağlayıcısına ne gönderiliyor?", "Bir metindeki isimler, yapay zeka sağlayıcısına gönderilmeden önce sistemlerimiz tarafından metinden çıkarılır. Bu adım yalnızca isimleri kapsar."],
];'''
s = re.sub(r'const faqs = \[.*?\n\];',lambda _:faq,s,flags=re.S)
# Translation string uses double quotes to retain the website's apostrophe.
s = s.replace("'Yarın saat 9'da bahçe gezimiz var, şapka getirin.'", '"Yarın saat 9\'da bahçe gezimiz var, şapka getirin."')
s = s.replace("faq===4", "faq===1").replace("{i===4&&", "{i===1&&")
p.write_text(s)
html = Path('/home/user/okuldas/packages/web/index.html')
t = html.read_text().replace('Okuldaş — Küçük dünyalar, güçlü bağlar','Okuldaş · Okullar için yapay zeka').replace('Okuldaş, anaokulunun neşesini, öğretmenin emeğini ve velinin iç rahatlığını tek bir dünyada buluşturur.','Okuldaş, anaokulları ve kreşler için yoklama, öğün, mesajlaşma ve veli iletişimini tek platformda toplar; mesajlar tek dokunuşla 12 dile çevrilir.')
html.write_text(t)