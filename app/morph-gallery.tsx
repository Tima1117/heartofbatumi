"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type MorphPhoto = { src: string; caption: string };
type Phase = "scatter" | "line" | "circle";
type Target = { x: number; y: number; rotation: number; scale: number; opacity: number };

const HIDDEN: Target = { x: 0, y: 0, rotation: 0, scale: 0.6, opacity: 0 };
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

function FlipCard({ photo, target, w, h, label, onOpen }: { photo: MorphPhoto; target: Target; w: number; h: number; label: string; onOpen: (src: string) => void }) {
  return (
    <motion.div
      className="flip-card"
      animate={{ x: target.x, y: target.y, rotate: target.rotation, scale: target.scale, opacity: target.opacity }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{ width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2 }}
    >
      <motion.button
        className="flip-card-inner"
        whileHover={{ rotateY: 180 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => onOpen(photo.src)}
        aria-label={photo.caption}
      >
        <div className="flip-face flip-front">
          <Image src={photo.src} alt="" fill sizes="220px" style={{ objectFit: "cover" }} />
        </div>
        <div className="flip-face flip-back">
          <span className="flip-back-eyebrow">{label}</span>
          <span className="flip-back-cap">{photo.caption}</span>
        </div>
      </motion.button>
    </motion.div>
  );
}

export function MorphGallery({ photos, eyebrow, title, text, hint, label, onOpen }: {
  photos: MorphPhoto[];
  eyebrow: string;
  title: ReactNode;
  text: string;
  hint: string;
  label: string;
  onOpen: (src: string) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(sectionRef, { once: true, margin: "-15% 0px" });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [phase, setPhase] = useState<Phase>("scatter");
  const [scatter, setScatter] = useState<Target[] | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setScatter(photos.map(() => ({
      x: (Math.random() - 0.5) * 1400,
      y: (Math.random() - 0.5) * 900,
      rotation: (Math.random() - 0.5) * 160,
      scale: 0.6,
      opacity: 0,
    })));
  }, [photos]);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setPhase("circle"); return; }
    const t1 = setTimeout(() => setPhase("line"), 300);
    const t2 = setTimeout(() => setPhase("circle"), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, reduce]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const morph = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, 1]), { stiffness: 40, damping: 20 });
  const rotate = useSpring(useTransform(scrollYProgress, [0.3, 1], [0, 1]), { stiffness: 40, damping: 20 });
  const mouseX = useMotionValue(0);
  const smoothMouse = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduce) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseX.set(((e.clientX - r.left) / r.width * 2 - 1) * 60);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mouseX, reduce]);

  const [m, setM] = useState(0);
  const [r, setR] = useState(0);
  const [px, setPx] = useState(0);
  useEffect(() => {
    const a = morph.on("change", setM);
    const b = rotate.on("change", setR);
    const c = smoothMouse.on("change", setPx);
    return () => { a(); b(); c(); };
  }, [morph, rotate, smoothMouse]);

  const topOpacity = useTransform(morph, [0.75, 1], [0, 1]);
  const topY = useTransform(morph, [0.75, 1], [24, 0]);

  const total = photos.length;
  const isMobile = size.width < 768;
  const cardW = isMobile ? 62 : 92;
  const cardH = isMobile ? 84 : 124;

  const targets = photos.map((_, i): Target => {
    if (!size.width) return HIDDEN;
    if (phase === "scatter") return scatter?.[i] ?? HIDDEN;
    if (phase === "line") {
      const spacing = Math.min(cardW + 10, (size.width - 32) / total);
      return { x: i * spacing - ((total - 1) * spacing) / 2, y: 0, rotation: 0, scale: 1, opacity: 1 };
    }
    const minDim = Math.min(size.width, size.height);
    const circleR = Math.min(minDim * 0.36, 320);
    const ca = (i / total) * 360;
    const cr = (ca * Math.PI) / 180;
    const circle = { x: Math.cos(cr) * circleR, y: Math.sin(cr) * circleR, rotation: ca + 90 };

    const arcR = Math.min(size.width, size.height * 1.5) * (isMobile ? 1.4 : 1.1);
    const apexY = size.height * (isMobile ? 0.2 : 0.14);
    const arcCY = apexY + arcR;
    const spread = isMobile ? 100 : 130;
    const start = -90 - spread / 2;
    const step = spread / (total - 1);
    // visible half-angle of the wheel; sweep so the first card enters at one edge and the last leaves at the other
    const visHalf = (Math.asin(Math.min(1, size.width / 2 / arcR)) * 180) / Math.PI;
    const maxOffset = Math.max(0, spread / 2 - visHalf);
    const a = start + i * step + maxOffset * (1 - 2 * clamp01(r));
    const rad = (a * Math.PI) / 180;
    const arc = { x: Math.cos(rad) * arcR + px, y: Math.sin(rad) * arcR + arcCY, rotation: a + 90, scale: isMobile ? 1.35 : 1.7 };

    return {
      x: lerp(circle.x, arc.x, m),
      y: lerp(circle.y, arc.y, m),
      rotation: lerp(circle.rotation, arc.rotation, m),
      scale: lerp(1, arc.scale, m),
      opacity: 1,
    };
  });

  const centerVisible = phase !== "scatter" && m < 0.5;

  return (
    <section className="morph-sec" id="gallery" ref={sectionRef}>
      <div className="morph-stage" ref={stageRef}>
        <motion.div
          className="morph-center"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={centerVisible ? { opacity: 1 - m * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow light"><span className="eyebrow-line" />{eyebrow}<span className="eyebrow-line" /></p>
          <h2 className="section-title light">{title}</h2>
          <p className="morph-hint">{hint} ↓</p>
        </motion.div>

        <motion.div className="morph-top" style={{ opacity: topOpacity, y: topY }}>
          <p className="eyebrow light"><span className="eyebrow-line" />{eyebrow}<span className="eyebrow-line" /></p>
          <h2 className="section-title light">{title}</h2>
          <p className="section-lede light">{text}</p>
        </motion.div>

        <div className="morph-cards" aria-label="Gallery">
          {photos.map((p, i) => (
            <FlipCard key={p.src} photo={p} target={targets[i]} w={cardW} h={cardH} label={label} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
