import { BookOpen, CalendarDays, CheckCheck, ClipboardCheck, GraduationCap, HeartPulse, Languages, MessageSquare, Moon, Sparkles, TrendingUp, Users } from 'lucide-react';

export const aiPoses = [.14, .50, .88];
export const aiAudiences = [
  {
    label: 'Aileler için', short: 'Aileler', icon: BookOpen, tag: 'Öğretmen inceler ve onaylar.',
    features: [
      { title: 'Yapay zeka ile yazılan sınıf hikayeleri', body: 'Yoklama, öğünler, uyku gibi gerçek sınıf anları, veliler için içten bir günlük hikayeye dönüşür. Bu hikaye gönderilmeden önce bir öğretmen tarafından incelenir ve onaylanır.', icon: BookOpen },
      { title: 'Kişiselleştirilmiş çocuk anlatıları', body: 'Sınıf hikayesinin yanı sıra her çocuk için haftalık bir anlatı taslağı hazırlanır. Öğretmen inceler, düzenler ve onaylar; veliler yalnızca onaylanmış metni görür.', icon: Users },
      { title: 'Yapay zeka haftalık özetleri', body: 'Sınıfın haftası için öğretmene bir özet taslağı hazırlanır. Öğretmen onaylamadan veliler görmez.', icon: CalendarDays },
      { title: 'Yapay zeka ile akademik açıklamalar', body: 'Bir sınıf etkinliğinin neyi ve neden öğrettiğini sade bir dille anlatan bir taslak hazırlanır. Öğretmen onaylayınca veliler görür.', icon: GraduationCap },
      { title: 'İstenince çeviri', body: 'Mesaj, duyuru ve akış paylaşımları, velinin okuduğu yerde tek dokunuşla 12 dilden birine çevrilebilir. Çeviriyi bir kişi başlatır, çeviriyi okumak ücretsizdir.', icon: Languages },
      { title: 'Otomatik sohbet denetimi', body: 'Sohbet mesajları, gönderildikten sonra otomatik denetimden geçer. İşaretlenen içerik personelin inceleme kuyruğuna düşer.', icon: MessageSquare },
    ],
  },
  {
    label: 'Öğretmenler için', short: 'Öğretmenler', icon: ClipboardCheck, tag: 'İdari yük ve takip gereken işler.',
    features: [
      { title: 'Öğretmen iş akışı içgörüleri', body: 'Yapay zeka, öğretmenin gününde nerede tıkanma yaşandığını, idari yük, takip gereken işler, tamamlanmamış kayıtlar, birikmeden önce otomatik olarak ortaya çıkarır.', icon: Sparkles },
    ],
  },
  {
    label: 'Yöneticiler ve sahipler için', short: 'Yöneticiler', icon: TrendingUp, tag: 'Puanı yalnızca personel görür.',
    features: [
      { title: 'Devamsızlık anomali tespiti', body: 'Yoklama örüntüleri yapay zeka tarafından otomatik izlenir; tekrarlayan devamsızlıklar, açıklanamayan seri devamsızlıklar ve düşük katılım eğilimleri sorun büyümeden önce ortaya çıkarılır.', icon: CalendarDays },
      { title: 'Uyku ve öğün örüntü içgörüleri', body: 'Aynı zeka, uykuya ve öğünlere de uygulanarak her çocuktaki olağandışı uyku veya beslenme örüntülerini erken ve otomatik olarak işaretler.', icon: Moon },
      { title: 'Esenlik içgörüleri', body: 'Anomali tespiti esenlik kontrollerine de genişletilir, böylece bir çocuktaki sessiz bir değişiklik gözden kaçmaz.', icon: HeartPulse },
      { title: 'Veli katılım puanlaması', body: 'Bir velinin duyuruları ve akış paylaşımlarını açıp açmadığını sayar; içeriğin ne olduğuna bakmaz. Puanı yalnızca personel görür ve veli için otomatik bir sonucu yoktur.', icon: CheckCheck },
    ],
  },
];