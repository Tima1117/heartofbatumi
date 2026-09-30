"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Lenis from "lenis";
import { menu, type Lang, type Text } from "./menu-data";
import { MorphGallery, type MorphPhoto } from "./morph-gallery";

const t = (en: string, ru: string, ka: string): Text => ({ en, ru, ka });

const phone = "+995568940515";
const phonePretty = "+995 568 94 05 15";
const whatsapp = "https://wa.me/995568940515";
const map = "https://www.google.com/maps/search/?api=1&query=Heart+of+Batumi+11+Mazniashvili+Batumi";
const mapEmbed = "https://www.openstreetmap.org/export/embed.html?bbox=41.6385%2C41.6499%2C41.6405%2C41.6519&layer=mapnik&marker=41.6509%2C41.6395";
const instagram = "https://www.instagram.com/heart_of_batumi/";

const heroCards = [
  { id: 62, cls: "hero-card-a", speed: [22, 14], float: 6.5 },
  { id: 54, cls: "hero-card-b", speed: [32, 20], float: 7.5 },
  { id: 25, cls: "hero-card-c", speed: [14, 9], float: 5.5 },
];
const dish = (id: number) => menu.flatMap(c => c.items).find(i => i.id === id)!;

const venuePhotos = [
  { src: "/images/hob-facade.webp", cap: t("Facade on Mazniashvili St", "Фасад на ул. Мазниашвили", "ფასადი მაზნიაშვილის ქუჩაზე") },
  { src: "/images/hob-hall.webp", cap: t("Main hall", "Основной зал", "მთავარი დარბაზი") },
  { src: "/images/hob-night.webp", cap: t("Evening lights", "Вечерние огни", "საღამოს განათება") },
  { src: "/images/hob-exterior.webp", cap: t("Entrance", "Вход", "შესასვლელი") },
];
const galleryDishIds = [62, 54, 46, 25, 16, 47, 51, 60, 63, 24, 29, 72, 73, 13, 8, 15];
const morphPhotos = (lang: Lang): MorphPhoto[] => {
  const dishes = galleryDishIds.map(id => { const d = dish(id); return { src: d.photo, caption: d.name[lang] }; });
  return venuePhotos.flatMap((v, i) => [{ src: v.src, caption: v.cap[lang] }, ...dishes.slice(i * 4, i * 4 + 4)]);
};

const copy = {
  en: {
    nav_menu: "Menu", nav_gallery: "Gallery", nav_about: "Story", nav_visit: "Visit",
    eyebrow: "ART CAFÉ · OLD CITY · BATUMI",
    headline: "Heart\nof Batumi",
    tagline: "Georgian cuisine in the heart of the Old City",
    cta_menu: "Explore the menu",
    cta_book: "Book a table",
    scroll: "SCROLL",
    strip_addr: "11 Mazniashvili St · Old City",
    strip_hours: "Daily 11:00 – 23:00",
    menuEyebrow: "THE MENU",
    menuTitle: "Georgian classics,\nmade with heart.",
    menuNote: "Prices in GEL. Every dish photographed at the restaurant.",
    galEyebrow: "THE PLACE",
    galTitle: "An art café,\nnot just a restaurant.",
    galText: "Hand-painted signs, white branches under a draped ceiling, coloured lamps — a small, personal space on a quiet Old City street.",
    aboutEyebrow: "OUR STORY",
    aboutTitle: "A yellow house\non Mazniashvili street.",
    aboutText: "Heart of Batumi started as an art café — a place where Georgian home cooking meets handmade décor. Khachapuri from the oven, mtsvadi from the grill, wine from local cellars. Come for lunch and stay for the evening.",
    badge: "Art café\n· Batumi ·",
    visitEyebrow: "FIND US",
    visitTitle: "Easy to find.\nHard to leave.",
    address: "11 Giorgi Mazniashvili St, Old City, Batumi",
    hours: "Every day · 11:00 – 23:00",
    directions: "Get directions",
    phone: "Call us",
    mapTitle: "Heart of Batumi on the map",
    foot: "A concept redesign for Heart of Batumi.",
    reserve_title: "Book a table",
    reserve_text: "Send us a message on WhatsApp — we'll confirm your reservation in the chat.",
    reserve_btn: "Open WhatsApp",
    rating: "4.6 · 5 700+ Google reviews",
    photo: "Photo",
    view: "View",
  },
  ru: {
    nav_menu: "Меню", nav_gallery: "Фото", nav_about: "О нас", nav_visit: "Контакты",
    eyebrow: "АРТ-КАФЕ · СТАРЫЙ ГОРОД · БАТУМИ",
    headline: "Сердце\nБатуми",
    tagline: "Грузинская кухня в сердце Старого города",
    cta_menu: "Смотреть меню",
    cta_book: "Забронировать стол",
    scroll: "ЛИСТАЙТЕ",
    strip_addr: "ул. Мазниашвили 11 · Старый город",
    strip_hours: "Ежедневно 11:00 – 23:00",
    menuEyebrow: "МЕНЮ",
    menuTitle: "Грузинская классика,\nприготовленная с душой.",
    menuNote: "Цены в лари. Все блюда сфотографированы в ресторане.",
    galEyebrow: "МЕСТО",
    galTitle: "Арт-кафе,\nа не просто ресторан.",
    galText: "Расписные вывески, белые ветки под драпированным потолком, цветные лампы — небольшое личное пространство на тихой улице Старого города.",
    aboutEyebrow: "НАША ИСТОРИЯ",
    aboutTitle: "Жёлтый дом\nна улице Мазниашвили.",
    aboutText: "Heart of Batumi начинался как арт-кафе — место, где домашняя грузинская кухня встречается с декором ручной работы. Хачапури из печи, мцвади с мангала, вино из местных погребов. Приходите на обед — и оставайтесь на вечер.",
    badge: "Арт-кафе\n· Батуми ·",
    visitEyebrow: "КАК НАЙТИ",
    visitTitle: "Легко найти.\nСложно уйти.",
    address: "ул. Гиорги Мазниашвили 11, Старый город, Батуми",
    hours: "Ежедневно · 11:00 – 23:00",
    directions: "Построить маршрут",
    phone: "Позвонить",
    mapTitle: "Heart of Batumi на карте",
    foot: "Демо-редизайн для Heart of Batumi.",
    reserve_title: "Бронирование",
    reserve_text: "Напишите нам в WhatsApp — подтвердим бронь в чате.",
    reserve_btn: "Открыть WhatsApp",
    rating: "4.6 · 5 700+ отзывов на Google",
    photo: "Фото",
    view: "Смотреть",
  },
  ka: {
    nav_menu: "მენიუ", nav_gallery: "ფოტო", nav_about: "ჩვენ შესახებ", nav_visit: "კონტაქტი",
    eyebrow: "არტ-კაფე · ძველი ქალაქი · ბათუმი",
    headline: "ბათუმის\nგული",
    tagline: "ქართული სამზარეულო ძველი ქალაქის გულში",
    cta_menu: "მენიუს ნახვა",
    cta_book: "მაგიდის დაჯავშნა",
    scroll: "ჩამოსქროლეთ",
    strip_addr: "მაზნიაშვილის ქ. 11 · ძველი ქალაქი",
    strip_hours: "ყოველდღე 11:00 – 23:00",
    menuEyebrow: "მენიუ",
    menuTitle: "ქართული კლასიკა,\nგულით მომზადებული.",
    menuNote: "ფასები ლარში. ყველა კერძი გადაღებულია რესტორანში.",
    galEyebrow: "ადგილი",
    galTitle: "არტ-კაფე,\nარა უბრალოდ რესტორანი.",
    galText: "ხელით მოხატული აბრები, თეთრი ტოტები დრაპირებული ჭერის ქვეშ, ფერადი ლამპები — პატარა, პერსონალური სივრცე ძველი ქალაქის მშვიდ ქუჩაზე.",
    aboutEyebrow: "ჩვენი ისტორია",
    aboutTitle: "ყვითელი სახლი\nმაზნიაშვილის ქუჩაზე.",
    aboutText: "Heart of Batumi დაიწყო არტ-კაფეს სახით — ადგილი, სადაც ქართული საოჯახო სამზარეულო ხვდება ხელნაკეთ დეკორს. ხაჭაპური ღუმელიდან, მწვადი მანგალიდან, ღვინო ადგილობრივი მარნებიდან. მოდით სადილზე და დარჩით საღამომდე.",
    badge: "არტ-კაფე\n· ბათუმი ·",
    visitEyebrow: "მოგვინახულეთ",
    visitTitle: "ადვილია მოძებნა.\nძნელია წასვლა.",
    address: "გიორგი მაზნიაშვილის ქ. 11, ძველი ქალაქი, ბათუმი",
    hours: "ყოველდღე · 11:00 – 23:00",
    directions: "მარშრუტის ნახვა",
    phone: "დარეკვა",
    mapTitle: "Heart of Batumi რუკაზე",
    foot: "Heart of Batumi-ს კონცეპტუალური რედიზაინი.",
    reserve_title: "ჯავშანი",
    reserve_text: "მოგვწერეთ WhatsApp-ზე — ჯავშანს ჩატში დავადასტურებთ.",
    reserve_btn: "WhatsApp-ის გახსნა",
    rating: "4.6 · 5 700+ შეფასება Google-ზე",
    photo: "ფოტო",
    view: "ნახვა",
  },
};
type Copy = typeof copy["en"];

const lines = (s: string) => s.split("\n").map((l, i) => <span key={i}>{i === 1 ? <em>{l}</em> : l}</span>);

// ─── Smooth scroll ────────────────────────────────────────────────────────────
function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 });
    return () => lenis.destroy();
  }, [reduce]);
  return null;
}

// ─── Parallax Hero ────────────────────────────────────────────────────────────
function ParallaxHero({ lang, c }: { lang: Lang; c: Copy }) {
  const ref = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const yGlow = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const yCards = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yOrn = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const onMove = useCallback((e: MouseEvent) => {
    if (reduce) return;
    setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
  }, [reduce]);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  const layer = (sx: number, sy: number) => ({
    transform: `translate3d(${-mouse.x * sx}px, ${-mouse.y * sy}px, 0)`,
    transition: reduce ? "none" : "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
  });

  return (
    <section ref={ref} className="parallax-hero" aria-label="Heart of Batumi">
      <motion.div className="parallax-layer parallax-bg" style={reduce ? undefined : { y: yBg }}>
        <div className="mouse-fill" style={layer(7, 4)}>
          <Image src="/images/hob-hall.webp" alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 40%" }} />
          <div className="parallax-darken" />
        </div>
      </motion.div>

      <motion.div className="parallax-layer parallax-glow" style={reduce ? undefined : { y: yGlow }} />

      {heroCards.map(({ id, cls, speed, float }) => {
        const d = dish(id);
        return (
          <motion.div key={id} className={`parallax-layer hero-card ${cls}`} style={reduce ? undefined : { y: yCards }} aria-hidden>
            <div style={layer(speed[0], speed[1])}>
              <motion.div
                className="hero-card-inner"
                animate={reduce ? undefined : { y: [0, -9, 0] }}
                transition={{ repeat: Infinity, duration: float, ease: "easeInOut" }}
              >
                <div className="hero-card-photo">
                  <Image src={d.photo} alt="" fill sizes="240px" style={{ objectFit: "cover" }} />
                </div>
                <p className="hero-card-cap">{d.name[lang]} <span>{d.price} ₾</span></p>
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      <motion.div className="parallax-layer parallax-text" style={reduce ? undefined : { y: yText, opacity: fade }}>
        <div className="mouse-fill" style={layer(5, 3)}>
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="hero-eyebrow"><span className="eyebrow-line" />{c.eyebrow}<span className="eyebrow-line" /></p>
            <h1 className="hero-headline">{c.headline.split("\n").map((l, i) => <span key={i}>{l}</span>)}</h1>
            <p className="hero-tagline">{c.tagline}</p>
            <div className="hero-rating"><span className="stars">★★★★★</span><span>{c.rating}</span></div>
            <div className="hero-actions">
              <a className="btn btn-light" href="#menu">{c.cta_menu}<span>↓</span></a>
              <a className="btn btn-outline-light" href={whatsapp} target="_blank" rel="noopener noreferrer">{c.cta_book}<span>↗</span></a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="parallax-layer parallax-ornament" style={reduce ? undefined : { y: yOrn }} aria-hidden>
        <div style={layer(36, 22)}>
          <svg width="360" height="360" viewBox="0 0 360 360" fill="none">
            <circle cx="180" cy="180" r="178" stroke="rgba(212,180,122,0.18)" strokeWidth="1" />
            <circle cx="180" cy="180" r="140" stroke="rgba(212,180,122,0.1)" strokeWidth="1" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <path key={a} transform={`rotate(${a} 180 180)`} d="M180 30 C186 62, 198 74, 180 92 C162 74, 174 62, 180 30Z" fill="rgba(212,180,122,0.16)" />
            ))}
            <circle cx="180" cy="180" r="5" fill="rgba(212,180,122,0.45)" />
          </svg>
        </div>
      </motion.div>

      <div className="parallax-fade" />
      <motion.div className="hero-scroll-hint" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
        <span>{c.scroll}</span><span className="scroll-arrow">↓</span>
      </motion.div>
    </section>
  );
}

// ─── Menu ─────────────────────────────────────────────────────────────────────
function MenuSection({ lang, c, onPhoto }: { lang: Lang; c: Copy; onPhoto: (src: string) => void }) {
  const [active, setActive] = useState(0);
  const cat = menu[active];

  return (
    <section className="menu-sec" id="menu">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow"><span className="eyebrow-line" />{c.menuEyebrow}</p>
          <h2 className="section-title">{lines(c.menuTitle)}</h2>
        </div>

        <div className="menu-tabs" role="tablist">
          {menu.map((sec, i) => (
            <button key={i} role="tab" aria-selected={active === i} className={`menu-tab${active === i ? " active" : ""}`} onClick={() => setActive(i)}>
              {sec.title[lang]}<sup>{sec.items.length}</sup>
            </button>
          ))}
        </div>

        <motion.div key={active} className="menu-grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {cat.items.map((item, i) => (
            <motion.article key={item.id} className="menu-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.04 }}>
              <button className="menu-card-photo" onClick={() => onPhoto(item.photo)} aria-label={`${c.photo}: ${item.name[lang]}`}>
                <Image src={item.photo} alt={item.name[lang]} fill sizes="(max-width: 760px) 96px, 132px" style={{ objectFit: "cover" }} />
              </button>
              <div className="menu-card-body">
                <div className="menu-card-top">
                  <h3>{item.name[lang]}</h3>
                  <span className="menu-dots" aria-hidden />
                  <span className="menu-price">{item.price} ₾</span>
                </div>
                {item.desc[lang] && <p>{item.desc[lang]}</p>}
              </div>
            </motion.article>
          ))}
        </motion.div>

        <p className="menu-note">{c.menuNote}</p>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection({ c }: { c: Copy }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const reduce = useReducedMotion();

  return (
    <section className="about-sec" id="story" ref={ref}>
      <div className="container about-grid">
        <div className="about-visual">
          <motion.div className="about-img-wrap" style={reduce ? undefined : { y }}>
            <Image src="/images/hob-facade.webp" alt="Heart of Batumi facade" fill style={{ objectFit: "cover" }} sizes="(max-width: 960px) 100vw, 50vw" />
          </motion.div>
          <div className="about-badge">{c.badge.split("\n").map((l, i) => <span key={i}>{l}</span>)}</div>
        </div>
        <div className="about-text">
          <p className="eyebrow"><span className="eyebrow-line" />{c.aboutEyebrow}</p>
          <h2 className="section-title">{lines(c.aboutTitle)}</h2>
          <p>{c.aboutText}</p>
          <a className="btn btn-dark" href={instagram} target="_blank" rel="noopener noreferrer">Instagram<span>↗</span></a>
        </div>
      </div>
    </section>
  );
}

// ─── Visit ────────────────────────────────────────────────────────────────────
function VisitSection({ c }: { c: Copy }) {
  return (
    <section className="visit-sec" id="visit">
      <div className="container">
        <div className="visit-grid">
          <div className="visit-info">
            <p className="eyebrow light"><span className="eyebrow-line" />{c.visitEyebrow}</p>
            <h2 className="section-title light">{lines(c.visitTitle)}</h2>
            <p className="visit-address">{c.address}</p>
            <p className="visit-hours">{c.hours} · {phonePretty}</p>
            <div className="visit-actions">
              <a className="btn btn-light" href={map} target="_blank" rel="noopener noreferrer">{c.directions}<span>↗</span></a>
              <a className="btn btn-outline-light" href={`tel:${phone}`}>{c.phone}<span>↗</span></a>
            </div>
          </div>
          <div className="booking-card">
            <h3>{c.reserve_title}</h3>
            <p>{c.reserve_text}</p>
            <a className="btn btn-green" href={whatsapp} target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              {c.reserve_btn}
            </a>
          </div>
        </div>
      </div>
      <div className="map-wrap" data-lenis-prevent>
        <iframe src={mapEmbed} title={c.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const c = copy[lang];
  const photos = useMemo(() => morphPhotos(lang), [lang]);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <SmoothScroll />
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top">Heart <em>of Batumi</em></a>
          <nav className={`nav${mobileOpen ? " open" : ""}`}>
            <a href="#gallery" onClick={() => setMobileOpen(false)}>{c.nav_gallery}</a>
            <a href="#menu" onClick={() => setMobileOpen(false)}>{c.nav_menu}</a>
            <a href="#story" onClick={() => setMobileOpen(false)}>{c.nav_about}</a>
            <a href="#visit" onClick={() => setMobileOpen(false)}>{c.nav_visit}</a>
          </nav>
          <div className="header-actions">
            <div className="languages">
              {(["en", "ru", "ka"] as Lang[]).map(l => (
                <button key={l} className={lang === l ? "active" : ""} onClick={() => { setLang(l); setMobileOpen(false); }} aria-pressed={lang === l}>
                  {l === "ka" ? "GE" : l.toUpperCase()}
                </button>
              ))}
            </div>
            <a className="header-cta" href={whatsapp} target="_blank" rel="noopener noreferrer">{c.cta_book}</a>
            <button className="mobile-toggle" aria-label="Toggle menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <ParallaxHero lang={lang} c={c} />
        <div className="info-strip">
          <div className="container info-strip-inner">
            <span>{c.strip_addr}</span>
            <span className="dot" aria-hidden>✦</span>
            <span>{c.strip_hours}</span>
            <span className="dot" aria-hidden>✦</span>
            <a href={`tel:${phone}`}>{phonePretty}</a>
          </div>
        </div>
        <MorphGallery photos={photos} eyebrow={c.galEyebrow} title={lines(c.galTitle)} text={c.galText} hint={c.scroll} label={c.view} onOpen={setLightbox} />
        <MenuSection lang={lang} c={c} onPhoto={setLightbox} />
        <AboutSection c={c} />
        <VisitSection c={c} />
      </main>

      <footer>
        <div className="container footer-inner">
          <a className="footer-brand" href="#top">Heart <em>of Batumi</em> <span>✦</span></a>
          <p>{c.foot}</p>
          <a href={instagram} target="_blank" rel="noopener noreferrer">INSTAGRAM ↗</a>
        </div>
      </footer>

      <AnimatePresence>
        {lightbox && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setLightbox(null)}>
            <motion.div className="lightbox-img" initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()}>
              <Image src={lightbox} alt="" fill style={{ objectFit: "contain" }} sizes="100vw" />
              <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">×</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
