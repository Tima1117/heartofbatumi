"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

type Lang = "en" | "ru" | "ka";
type Text = Record<Lang, string>;
const t = (en: string, ru: string, ka: string): Text => ({ en, ru, ka });

const phone = "+995568940515";
const whatsapp = "https://wa.me/995568940515";
const map = "https://www.google.com/maps/search/?api=1&query=Heart+of+Batumi+11+Mazniashvili+Batumi";
const mapEmbed = "https://www.openstreetmap.org/export/embed.html?bbox=41.6385%2C41.6499%2C41.6405%2C41.6519&layer=mapnik&marker=41.6509%2C41.6395";
const instagram = "https://www.instagram.com/heart_of_batumi/";

type MenuItem = { name: Text; desc: Text; price: string };
type MenuSection = { title: Text; items: MenuItem[] };

const menu: MenuSection[] = [
  {
    title: t("Salads","Салаты","სალათები"),
    items: [
      { name:t("Caesar","Цезарь","კეისარი"), desc:t("Romaine, croutons, parmesan, Caesar dressing","Ромен, крутоны, пармезан, соус Цезарь","რომენი, კრუტონები, პარმეზანი, ცეზარის სოუსი"), price:"30" },
      { name:t("With shrimp","С креветками","კრევეტებით"), desc:t("Mixed greens, shrimp, cherry tomatoes","Микс-салат, креветки, томаты черри","მიქს-სალათი, კრევეტები, ჩერი-პომიდორი"), price:"35" },
    ],
  },
  {
    title: t("Starters","Закуски","მიმირთმევები"),
    items: [
      { name:t("Pkhali","Пхали","ფხალი"), desc:t("Walnut-herb balls: spinach, beet, bean","Шарики из шпината, свёклы, фасоли с грецким орехом","კაკლის-მწვანილის ბურთულები: ისპანახი, ჭარხალი, ლობიო"), price:"15" },
      { name:t("Eggplant rolls","Баклажаны с орехами","ბადრიჯნის გრეხილი"), desc:t("Grilled eggplant rolled with walnut paste","Запечённый баклажан с ореховой пастой","შემწვარი ბადრიჯანი კაკლის პასტით"), price:"17" },
      { name:t("Cheese selection","Сырное ассорти","ყველის ასორტი"), desc:t("Local Georgian cheeses with honey and walnuts","Местные грузинские сыры с мёдом и грецкими орехами","ადგილობრივი ქართული ყველი თაფლით და კაკლით"), price:"25" },
      { name:t("Mushrooms on keci","Грибы на кеци","სოკო კეცზე"), desc:t("Oyster mushrooms baked on traditional clay pan","Вешенки, запечённые на традиционной керамической сковороде","სოკო გამომცხვარი ტრადიციულ კეცზე"), price:"26" },
      { name:t("Dolma","Долма","დოლმა"), desc:t("Vine leaves stuffed with spiced meat and rice","Виноградные листья с пряным мясом и рисом","ვაზის ფოთლები სანელებელიანი ხორცითა და ბრინჯით"), price:"20" },
    ],
  },
  {
    title: t("Soups","Супы","სუპები"),
    items: [
      { name:t("Kharcho","Харчо","ხარჩო"), desc:t("Spiced beef soup with rice and tkemali","Пряный говяжий суп с рисом и ткемали","სანელებელიანი საქონლის სუპი ბრინჯითა და ტყემლით"), price:"15" },
      { name:t("Chikhirtma","Чихиртма","ჩიხირთმა"), desc:t("Traditional chicken broth with eggs and herbs","Традиционный куриный бульон с яйцами и зеленью","ტრადიციული ქათმის ბულიონი კვერცხებითა და მწვანილებით"), price:"14" },
      { name:t("Khashlama","Хашлама","ხაშლამა"), desc:t("Slow-cooked lamb with vegetables","Томлёная баранина с овощами","ნელ-ნელა მოხარშული ცხვარი ბოსტნეულით"), price:"19" },
    ],
  },
  {
    title: t("Hot dishes","Горячее","მთავარი კერძები"),
    items: [
      { name:t("Shkmeruli","Шкмерули","შქმერული"), desc:t("Whole chicken in creamy garlic sauce","Целая курица в сливочно-чесночном соусе","მთელი ქათამი ნაღების-ნივრის სოუსში"), price:"30" },
      { name:t("Ojakhuri","Оджахури","ოჯახური"), desc:t("Pan-fried pork with potatoes and onion","Жареная свинина с картофелем и луком","გამომცხვარი ღორის ხორცი კარტოფილით და ხახვით"), price:"27" },
      { name:t("Satsivi","Сациви","საცივი"), desc:t("Chicken in walnut and spice sauce","Курица в ореховом соусе со специями","ქათამი კაკლის სოუსში სანელებლებით"), price:"27" },
      { name:t("Chakhokhbili","Чахохбили","ჩახოხბილი"), desc:t("Chicken stewed with tomatoes and herbs","Курица, тушённая с помидорами и зеленью","ქათამი ჩაშუშული პომიდვრებით და მწვანილებით"), price:"18" },
      { name:t("Quail with blueberry","Перепёлка с черникой","მწყერი მოცვის სოუსით"), desc:t("Grilled quail, blueberry sauce, microgreens","Перепёлка на гриле, черничный соус, микрозелень","გრილის მწყერი, მოცვის სოუსი, მიკრომწვანილი"), price:"26" },
    ],
  },
  {
    title: t("Grill","Мангал","მანგალი"),
    items: [
      { name:t("Salmon","Лосось","ორაგული"), desc:t("Atlantic salmon fillet, grilled vegetables","Атлантический лосось-гриль, овощи гриль","ატლანტური ორაგული, გრილის ბოსტნეული"), price:"37" },
      { name:t("Dorado","Дорадо","დორადო"), desc:t("Whole grilled sea bass with herbs","Целый дорадо-гриль с зеленью","მთელი გრილის დორადო მწვანილებით"), price:"35" },
      { name:t("Mtsvadi (beef)","Мцвади говядина","მცვადი საქონლის"), desc:t("Traditional Georgian beef skewers","Традиционный грузинский шашлык из говядины","ტრადიციული ქართული საქონლის მცვადი"), price:"30" },
      { name:t("Pork ribs","Рёбрышки","ღორის ნეკნები"), desc:t("Slow-marinated pork ribs on the grill","Рёбрышки в длительном маринаде на углях","ნელი მარინადის ღორის ნეკნები ნახშირზე"), price:"28" },
    ],
  },
  {
    title: t("Khachapuri","Хачапури","ხაჭაპური"),
    items: [
      { name:t("Adjarian","Аджарский","აჭარული"), desc:t("Boat-shaped, egg on top, butter","Лодочка с яйцом и маслом","ნავი კვერცხით და კარაქით"), price:"21" },
      { name:t("Imeruli","Имерули","იმერული"), desc:t("Round, filled with fresh Imeruli cheese","Круглый, с имерийским сыром","მრგვალი, ახალი იმერული ყველით"), price:"20" },
      { name:t("Megruli","Мегрули","მეგრული"), desc:t("Double-cheese: inside and on top","Двойной сыр: внутри и снаружи","ორმაგი ყველი: შიგნიდან და გარეთ"), price:"24" },
    ],
  },
];

const gallery = [
  "/images/hob-exterior.webp",
  "/images/hob-interior.webp",
  "/images/hob-food1.webp",
  "/images/hob-food2.webp",
  "/images/hob-food3.webp",
  "/images/hob-food4.webp",
  "/images/hob-food5.webp",
  "/images/restaurant-terrace.webp",
];

const copy = {
  en: {
    nav_menu:"Menu", nav_about:"Story", nav_visit:"Visit",
    eyebrow:"BATUMI · OLD CITY · EST. 2014",
    headline:"HEART\nOF BATUMI",
    tagline:"Georgian cuisine in the heart of the Old City",
    cta_menu:"Explore the menu",
    cta_book:"Book a table",
    scroll:"SCROLL TO EXPLORE",
    menuEyebrow:"WHAT WE SERVE",
    menuTitle:"Georgian classics,\nhonestly made.",
    menuNote:"Prices in GEL. Menu may vary seasonally.",
    galEyebrow:"THE ATMOSPHERE",
    galTitle:"Art café in the Old City.",
    galText:"Handcrafted décor, terrace seating and an intimate space that feels nothing like a standard Georgian restaurant — because it isn't.",
    aboutEyebrow:"OUR STORY",
    aboutTitle:"Since 2014.",
    aboutText:"Heart of Batumi began as an art café — a small, personal space in the Old City where Georgian flavours meet artisan craftsmanship. Ten years later, it still feels that way.",
    visitEyebrow:"COME SEE US",
    visitTitle:"Easy to find.\nHard to leave.",
    address:"11 Giorgi Mazniashvili St, Old City, Batumi",
    hours:"Every day · 11:00–23:00",
    directions:"Get directions",
    phone:"Call us",
    book:"Book via WhatsApp",
    mapTitle:"Find us on the map",
    foot:"A concept redesign for Heart of Batumi.",
    reserve_title:"Book a table",
    reserve_text:"We'll confirm your reservation via WhatsApp.",
    reserve_btn:"Open WhatsApp",
    rating:"4.6 · 5 700+ Google reviews",
  },
  ru: {
    nav_menu:"Меню", nav_about:"О нас", nav_visit:"Контакты",
    eyebrow:"БАТУМИ · СТАРЫЙ ГОРОД · С 2014",
    headline:"СЕРДЦЕ\nБАТУМИ",
    tagline:"Грузинская кухня в сердце Старого города",
    cta_menu:"Смотреть меню",
    cta_book:"Забронировать стол",
    scroll:"ЛИСТАЙ НИЖЕ",
    menuEyebrow:"ЧТО МЫ ГОТОВИМ",
    menuTitle:"Грузинская классика,\nприготовленная честно.",
    menuNote:"Цены в лари. Меню может меняться в зависимости от сезона.",
    galEyebrow:"АТМОСФЕРА",
    galTitle:"Арт-кафе в Старом городе.",
    galText:"Декор ручной работы, открытая терраса и камерное пространство, непохожее на обычный грузинский ресторан — потому что это не он.",
    aboutEyebrow:"НАША ИСТОРИЯ",
    aboutTitle:"С 2014 года.",
    aboutText:"Heart of Batumi начинался как арт-кафе — небольшое, личное пространство в Старом городе, где грузинские вкусы встречаются с авторским оформлением. Десять лет спустя ощущение не изменилось.",
    visitEyebrow:"ПРИХОДИТЕ К НАМ",
    visitTitle:"Легко найти.\nСложно уйти.",
    address:"ул. Гиорги Мазниашвили 11, Старый город, Батуми",
    hours:"Каждый день · 11:00–23:00",
    directions:"Построить маршрут",
    phone:"Позвонить",
    book:"Написать в WhatsApp",
    mapTitle:"Найдите нас на карте",
    foot:"Демо-редизайн для Heart of Batumi.",
    reserve_title:"Бронирование",
    reserve_text:"Подтвердим бронь через WhatsApp.",
    reserve_btn:"Открыть WhatsApp",
    rating:"4.6 · 5 700+ отзывов на Google",
  },
  ka: {
    nav_menu:"მენიუ", nav_about:"ჩვენ შესახებ", nav_visit:"კონტაქტი",
    eyebrow:"ბათუმი · ძველი ქალაქი · 2014 წლიდან",
    headline:"ბათუმის\nგული",
    tagline:"ქართული სამზარეულო ძველი ქალაქის გულში",
    cta_menu:"მენიუს ნახვა",
    cta_book:"მაგიდის დაჯავშნა",
    scroll:"ჩამოსქროლეთ",
    menuEyebrow:"ჩვენი კერძები",
    menuTitle:"ქართული კლასიკა,\nმომზადებული გულწრფელად.",
    menuNote:"ფასები ლარში. მენიუ შეიძლება შეიცვალოს სეზონის მიხედვით.",
    galEyebrow:"ატმოსფერო",
    galTitle:"არტ-კაფე ძველ ქალაქში.",
    galText:"ხელნაკეთი დეკორი, ტერასა და კამერული სივრცე, განსხვავებული ჩვეულებრივი ქართული რესტორნისგან — რადგან ეს ის არ არის.",
    aboutEyebrow:"ჩვენი ისტორია",
    aboutTitle:"2014 წლიდან.",
    aboutText:"Heart of Batumi დაიწყო არტ-კაფეს სახით — პატარა, პერსონალური სივრცე ძველ ქალაქში, სადაც ქართული გემო ხვდება ხელოსნურ ოსტატობას. ათი წლის შემდეგ ეს შეგრძნება არ შეცვლილა.",
    visitEyebrow:"მოგვინახულეთ",
    visitTitle:"ადვილია მოძებნა.\nძნელია წასვლა.",
    address:"გიორგი მაზნიაშვილის ქ. 11, ძველი ქალაქი, ბათუმი",
    hours:"ყოველდღე · 11:00–23:00",
    directions:"მარშრუტის ნახვა",
    phone:"დარეკვა",
    book:"WhatsApp-ზე წერა",
    mapTitle:"გვიპოვეთ რუკაზე",
    foot:"Heart of Batumi-ს კონცეპტუალური რედიზაინი.",
    reserve_title:"ჯავშანი",
    reserve_text:"WhatsApp-ით დავადასტურებთ ჯავშანს.",
    reserve_btn:"WhatsApp-ის გახსნა",
    rating:"4.6 · 5 700+ შეფასება Google-ზე",
  },
};

// ─── Parallax Hero ────────────────────────────────────────────────────────────
function ParallaxHero({ lang, c }: { lang: Lang; c: typeof copy["en"] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (reduce) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMouse({ x, y });
  }, [reduce]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const layer = (speedX: number, speedY: number) => ({
    transform: `translate(${mouse.x * speedX * -1}px, ${mouse.y * speedY * -1}px)`,
    transition: reduce ? "none" : "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  });

  return (
    <section
      ref={containerRef}
      className="parallax-hero"
      aria-label="Heart of Batumi restaurant"
    >
      {/* Layer 0 — deep background: city / sky */}
      <div className="parallax-layer parallax-bg" style={layer(8, 4)}>
        <Image src="/images/batumi-bg.webp" alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
        <div className="parallax-darken" />
      </div>

      {/* Layer 1 — mid: food atmosphere */}
      <div className="parallax-layer parallax-mid" style={layer(18, 10)}>
        <Image src="/images/hob-food3.webp" alt="" fill sizes="80vw" style={{ objectFit: "cover", objectPosition: "center" }} />
        <div className="parallax-vignette" />
      </div>

      {/* Layer 2 — overlay texture */}
      <div className="parallax-layer parallax-overlay" style={layer(4, 2)} />

      {/* Layer 3 — text: moves slightly */}
      <div className="parallax-layer parallax-text" style={layer(6, 4)}>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="hero-eyebrow">
            <span className="eyebrow-line" />{c.eyebrow}
          </p>
          <h1 className="hero-headline">
            {c.headline.split("\n").map((line, i) => <span key={i}>{line}</span>)}
          </h1>
          <p className="hero-tagline">{c.tagline}</p>
          <div className="hero-rating">
            <span className="stars">★★★★★</span>
            <span>{c.rating}</span>
          </div>
          <div className="hero-actions">
            <a className="btn btn-light" href="#menu">{c.cta_menu}<span>↓</span></a>
            <a className="btn btn-outline-light" href={whatsapp} target="_blank" rel="noopener noreferrer">{c.cta_book}<span>↗</span></a>
          </div>
        </motion.div>
      </div>

      {/* Layer 4 — decorative Georgian ornament SVG (foreground, moves most) */}
      <div className="parallax-layer parallax-ornament" style={layer(28, 16)} aria-hidden>
        <svg width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="170" cy="170" r="168" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <circle cx="170" cy="170" r="130" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          {[0,45,90,135,180,225,270,315].map((a, i) => (
            <g key={i} transform={`rotate(${a} 170 170)`}>
              <path d="M170 42 C175 70, 185 80, 170 95 C155 80, 165 70, 170 42Z" fill="rgba(180,120,60,0.22)" />
            </g>
          ))}
          <circle cx="170" cy="170" r="8" fill="rgba(180,120,60,0.5)" />
        </svg>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-hint"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span>{c.scroll}</span>
        <span className="scroll-arrow">↓</span>
      </motion.div>
    </section>
  );
}

// ─── Menu section ─────────────────────────────────────────────────────────────
function MenuSection({ lang, c }: { lang: Lang; c: typeof copy["en"] }) {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <section className="menu-sec" id="menu">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow-dark"><span className="eyebrow-line" />{c.menuEyebrow}</p>
          <h2 className="section-title">
            {c.menuTitle.split("\n").map((l, i) => <span key={i}>{l}</span>)}
          </h2>
        </div>

        {/* Category tabs */}
        <div className="menu-tabs" role="group">
          {menu.map((sec, i) => (
            <button
              key={i}
              className={`menu-tab${activeSection === i ? " active" : ""}`}
              onClick={() => setActiveSection(i)}
            >
              {sec.title[lang]}
            </button>
          ))}
        </div>

        {/* Menu items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            className="menu-grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {menu[activeSection].items.map((item, i) => (
              <motion.div
                key={i}
                className="menu-item"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <div className="menu-item-top">
                  <h3>{item.name[lang]}</h3>
                  <span className="menu-price">{item.price} ₾</span>
                </div>
                <p>{item.desc[lang]}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="menu-note">{c.menuNote}</p>
      </div>
    </section>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function GallerySection({ lang, c }: { lang: Lang; c: typeof copy["en"] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className="gallery-sec" id="gallery">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow-light"><span className="eyebrow-line" />{c.galEyebrow}</p>
          <h2 className="section-title light">{c.galTitle}</h2>
          <p className="section-lede light">{c.galText}</p>
        </div>
        <div className="gallery-grid">
          {gallery.map((src, i) => (
            <motion.button
              key={i}
              className={`gallery-thumb ${i === 0 ? "wide" : i === 3 ? "tall" : ""}`}
              onClick={() => setLightbox(src)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              aria-label={`Photo ${i + 1}`}
            >
              <Image src={src} alt={`Heart of Batumi photo ${i + 1}`} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" style={{ objectFit: "cover" }} />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="lightbox-img"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={lightbox} alt="Photo" fill style={{ objectFit: "contain" }} sizes="100vw" />
              <button className="lightbox-close" onClick={() => setLightbox(null)}>×</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection({ lang, c }: { lang: Lang; c: typeof copy["en"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.0]);
  const reduce = useReducedMotion();

  return (
    <section className="about-sec" id="story" ref={ref}>
      <div className="container about-grid">
        <div className="about-text">
          <p className="eyebrow-dark"><span className="eyebrow-line" />{c.aboutEyebrow}</p>
          <h2>{c.aboutTitle}</h2>
          <p>{c.aboutText}</p>
          <a className="btn btn-dark" href={instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
        </div>
        <div className="about-visual">
          <motion.div className="about-img-wrap" style={reduce ? undefined : { scale: imgScale }}>
            <Image src="/images/hob-interior.webp" alt="Heart of Batumi interior" fill style={{ objectFit: "cover" }} sizes="(max-width: 800px) 90vw, 45vw" />
          </motion.div>
          <div className="about-badge">HEART OF<br />BATUMI ✦</div>
        </div>
      </div>
    </section>
  );
}

// ─── Visit / Booking ──────────────────────────────────────────────────────────
function VisitSection({ lang, c }: { lang: Lang; c: typeof copy["en"] }) {
  return (
    <section className="visit-sec" id="visit">
      <div className="container">
        <div className="visit-grid">
          <div className="visit-info">
            <p className="eyebrow-dark"><span className="eyebrow-line" />{c.visitEyebrow}</p>
            <h2>{c.visitTitle.split("\n").map((l, i) => <span key={i}>{l}</span>)}</h2>
            <div className="visit-details">
              <p className="visit-address">{c.address}</p>
              <p className="visit-hours">{c.hours}</p>
              <div className="visit-actions">
                <a className="btn btn-dark" href={map} target="_blank" rel="noopener noreferrer">{c.directions}<span>↗</span></a>
                <a className="btn btn-outline" href={`tel:${phone}`}>{c.phone}<span>↗</span></a>
              </div>
            </div>
          </div>
          <div className="booking-card">
            <h3>{c.reserve_title}</h3>
            <p>{c.reserve_text}</p>
            <a className="btn btn-green" href={whatsapp} target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              {c.reserve_btn}
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="map-wrap">
          <iframe src={mapEmbed} title={c.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      </div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const c = copy[lang];

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  return (
    <>
      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top">HEART <b>OF BATUMI</b></a>
          <nav className={`nav${mobileOpen ? " open" : ""}`}>
            <a href="#menu" onClick={() => setMobileOpen(false)}>{c.nav_menu}</a>
            <a href="#story" onClick={() => setMobileOpen(false)}>{c.nav_about}</a>
            <a href="#visit" onClick={() => setMobileOpen(false)}>{c.nav_visit}</a>
          </nav>
          <div className="header-actions">
            <div className="languages">
              {(["en","ru","ka"] as Lang[]).map(l => (
                <button key={l} className={lang === l ? "active" : ""} onClick={() => { setLang(l); setMobileOpen(false); }} aria-pressed={lang === l}>
                  {l === "ka" ? "GE" : l.toUpperCase()}
                </button>
              ))}
            </div>
            <a className="header-cta" href={whatsapp} target="_blank" rel="noopener noreferrer">{c.cta_book}<span>↗</span></a>
            <button className="mobile-toggle" aria-label="Toggle menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <ParallaxHero lang={lang} c={c} />
        <div className="marquee" aria-hidden><div>GEORGIAN CUISINE <span>✳</span> OLD CITY BATUMI <span>✳</span> ART CAFÉ <span>✳</span> EST. 2014 <span>✳</span> GEORGIAN CUISINE <span>✳</span> OLD CITY BATUMI <span>✳</span> ART CAFÉ <span>✳</span> EST. 2014 <span>✳</span></div></div>
        <MenuSection lang={lang} c={c} />
        <GallerySection lang={lang} c={c} />
        <AboutSection lang={lang} c={c} />
        <VisitSection lang={lang} c={c} />
      </main>

      <footer>
        <div className="container footer-inner">
          <a className="footer-brand" href="#top">HEART <b>OF BATUMI</b> <span>✳</span></a>
          <p>{c.foot}</p>
          <a href={instagram} target="_blank" rel="noopener noreferrer">INSTAGRAM ↗</a>
        </div>
      </footer>
    </>
  );
}
