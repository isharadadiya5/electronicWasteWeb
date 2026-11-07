"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  BatteryWarning,
  Check,
  ChevronDown,
  CirclePlay,
  Clock3,
  Compass,
  Leaf,
  Menu,
  Recycle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

const photo = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const photos = {
  hands: photo("photo-1550041473-d296a3a8a18a", 1000),
  partner: photo("photo-1581091226825-a6a2a5aee158", 900),
  device: photo("photo-1518770660439-4636190af475", 900),
  city: photo("photo-1518005020951-eccb494ad742", 1200),
  partnerOne: photo("photo-1581092160562-40aa08e78837", 900),
  partnerTwo: photo("photo-1581092160607-ee22621dd758", 900),
  partnerThree: photo("photo-1581092162384-8987c1d64718", 900),
  phone: photo("photo-1511707171634-5f897ff02aa9", 1000),
  laptop: photo("photo-1496181133206-80ce9b88a853", 1000),
  headphones: photo("photo-1505740420928-5e560c06d30e", 1000),
  camera: photo("photo-1526170375885-4d8ecf77b99f", 1000),
};

const circularWays = [
  {
    label: "PHONES & TABLETS",
    title: "Small device. Big second act.",
    detail:
      "Working devices can find a new owner. Damaged ones go to an authorized recovery partner.",
    image: photos.phone,
    category: "Smartphone",
    shape: "rounded-[3rem_1.25rem_3rem_1.25rem]",
    route: "Reuse · Recover",
  },
  {
    label: "LAPTOPS & COMPUTERS",
    title: "Keep good tech in play.",
    detail:
      "Back up, sign out, and choose a collection partner for secure, responsible processing.",
    image: photos.laptop,
    category: "Laptop / computer",
    shape: "rounded-[1.25rem_3rem_1.25rem_3rem]",
    route: "Repair · Refurbish",
  },
  {
    label: "AUDIO & ACCESSORIES",
    title: "Untangle the drawer.",
    detail:
      "Cables, headphones and chargers are easier to pass on when they travel together.",
    image: photos.headphones,
    category: "Other electronics",
    shape: "rounded-[3rem_3rem_1.25rem_1.25rem]",
    route: "Reuse · Recycle",
  },
  {
    label: "CAMERAS & GADGETS",
    title: "Give good things another frame.",
    detail:
      "List the condition clearly so a nearby partner can suggest the right next step.",
    image: photos.camera,
    category: "Other electronics",
    shape: "rounded-[1.25rem_1.25rem_3rem_3rem]",
    route: "Reuse · Recover",
  },
];

function RevealWords({ text }: { text: string }) {
  return (
    <span role="text" aria-label={text}>
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          initial={{
            y: "75%",
            opacity: 0,
            filter: "blur(6px)",
            rotateX: index % 2 ? 9 : -9,
          }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)", rotateX: 0 }}
          viewport={{ once: false, amount: 0.85 }}
          transition={{
            duration: 0.95,
            delay: Math.min(index * 0.055, 0.5),
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformPerspective: 700 }}
          className="mr-[.24em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function ParallaxImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  return (
    <motion.img
      ref={imageRef}
      src={src}
      alt={alt}
      style={{ y }}
      className={className}
    />
  );
}

function TreeSequenceCanvas({ progress }: { progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useMotionValueEvent(progress, "change", (value) => {
    setFrameIndex(Math.min(149, Math.max(0, Math.round(value * 149))));
  });

  useEffect(() => {
    let cancelled = false;
    const images = Array.from({ length: 150 }, (_, index) => {
      const image = new Image();
      image.src = `/tree-frames/frame_${String(index + 1).padStart(3, "0")}.webp`;
      return image;
    });
    Promise.all(
      images.map(
        (image) =>
          new Promise<void>((resolve) => {
            if (image.complete) return resolve();
            image.onload = () => resolve();
            image.onerror = () => resolve();
          }),
      ),
    ).then(() => {
      if (cancelled) return;
      imagesRef.current = images;
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imagesRef.current[frameIndex];
    if (!canvas || !ready || !image?.naturalWidth) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      context.fillStyle = "#020b09";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const scale = Math.max(
        canvas.width / image.naturalWidth,
        canvas.height / image.naturalHeight,
      );
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(
        image,
        (canvas.width - width) / 2,
        (canvas.height - height) / 2,
        width,
        height,
      );
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [frameIndex, ready]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}

const partners = [
  {
    name: "ReLoop Materials",
    area: "Indiranagar · 2.4 km",
    rating: "4.9",
    price: "₹1,250",
    img: photos.partnerOne,
    tag: "Verified",
  },
  {
    name: "GreenByte Recovery",
    area: "Koramangala · 3.8 km",
    rating: "4.8",
    price: "₹1,100",
    img: photos.partnerTwo,
    tag: "Verified",
  },
  {
    name: "Circular Works",
    area: "HSR Layout · 5.1 km",
    rating: "4.7",
    price: "₹980",
    img: photos.partnerThree,
    tag: "Self-declared",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<"signin" | "pickup" | "partners" | null>(
    null,
  );
  const [sound, setSound] = useState(false);
  const [light, setLight] = useState(false);
  const [toast, setToast] = useState("");
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("Smartphone");
  const [count, setCount] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress, scrollY } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollY, "change", (latest) =>
    setStickyVisible((current) =>
      current === latest > 680 ? current : latest > 680,
    ),
  );

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1500, 1);
      setCount(Math.floor(62 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const openPickup = (item = "Smartphone") => {
    setCategory(item);
    setStep(1);
    setModal("pickup");
  };

  return (
    <main className={light ? "theme-light" : ""}>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progressScale }}
        className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-[#c9f06d]"
      />
      <header className="absolute z-30 w-full px-5 pt-5 sm:px-10 sm:pt-7">
        <nav className="mx-auto flex max-w-[1420px] items-center justify-between rounded-full border border-white/20 bg-[#142f28]/40 px-5 py-3 text-white backdrop-blur-xl sm:px-7">
          <a
            href="#home"
            className="flex items-center gap-2.5"
            aria-label="EcoCircuit home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9f06d] text-[#17362d]">
              <Recycle size={19} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-[-.04em]">
              eco<span className="font-medium">circuit</span>
            </span>
          </a>
          <div className="hidden items-center gap-8 text-[13px] text-white/80 md:flex">
            <a className="transition hover:text-[#c9f06d]" href="#how">
              How it works
            </a>
            <a className="transition hover:text-[#c9f06d]" href="#paths">
              Explore devices
            </a>
            <a className="transition hover:text-[#c9f06d]" href="#impact">
              Our impact
            </a>
            <a className="transition hover:text-[#c9f06d]" href="#partners">
              Find a partner
            </a>
            <a className="transition hover:text-[#c9f06d]" href="#learn">
              Learn
            </a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setLight(!light)}
              className="rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
            >
              {light ? "Light" : "Dark"} mode
            </button>
            <button
              onClick={() => setModal("signin")}
              className="px-3 py-2 text-sm text-white"
            >
              Log in
            </button>
            <button
              onClick={() => openPickup()}
              className="rounded-full bg-[#c9f06d] px-5 py-2.5 text-sm font-bold text-[#17362d] transition hover:bg-white"
            >
              Get started <ArrowRight className="ml-1 inline" size={15} />
            </button>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2 md:hidden"
            aria-label="Open navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-auto mt-2 grid max-w-[1420px] gap-1 rounded-3xl border border-white/10 bg-[#17362d]/95 p-5 text-white backdrop-blur-lg md:hidden"
            >
              <a className="p-3" href="#how" onClick={() => setMenuOpen(false)}>
                How it works
              </a>
              <a
                className="p-3"
                href="#paths"
                onClick={() => setMenuOpen(false)}
              >
                Explore devices
              </a>
              <a
                className="p-3"
                href="#impact"
                onClick={() => setMenuOpen(false)}
              >
                Our impact
              </a>
              <a
                className="p-3"
                href="#partners"
                onClick={() => setMenuOpen(false)}
              >
                Find a partner
              </a>
              <button
                onClick={() => openPickup()}
                className="mt-2 rounded-full bg-[#c9f06d] p-3 font-bold text-[#17362d]"
              >
                Get started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section
        id="home"
        ref={heroRef}
        className="grain relative flex min-h-[760px] items-end overflow-hidden bg-[#020b09] text-white sm:min-h-[850px] lg:min-h-[900px]"
      >
        <TreeSequenceCanvas progress={heroProgress} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10271f]/90 via-[#10271f]/48 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10271f]/80 via-transparent to-[#10271f]/25" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[7%] top-[23%] z-[5] hidden xl:block"
        >
          <motion.div
            animate={{ y: [0, -11, 0], rotateZ: [2, 0, 2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[250px] rounded-[1.5rem] border border-white/60 bg-[#f7f6ef] p-5 text-[#17362d] shadow-2xl"
          >
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[.18em] text-[#718078]">
              <span>EcoCircuit / 042</span>
              <Recycle size={15} />
            </div>
            <p className="font-display mt-7 text-xl font-bold tracking-[-.04em]">
              A device in motion.
            </p>
            <div className="mt-5 space-y-3 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#88a76f]" />{" "}
                Collection requested{" "}
                <span className="ml-auto text-[#718078]">01</span>
              </div>
              <div className="ml-[3px] h-3 border-l border-dashed border-[#a8b59e]" />
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#c9f06d] ring-2 ring-[#dce8c7]" />{" "}
                Authorized partner{" "}
                <span className="ml-auto text-[#718078]">02</span>
              </div>
              <div className="ml-[3px] h-3 border-l border-dashed border-[#a8b59e]" />
              <div className="flex items-center gap-2 text-[#9aa49a]">
                <span className="h-2 w-2 rounded-full border border-[#aeb7ab]" />{" "}
                Next life recorded <span className="ml-auto">03</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-full bg-[#e8eddf] px-3 py-2 text-[9px] font-semibold">
              <span>Chain of custody</span>
              <span className="flex items-center gap-1 text-[#567d45]">
                <Check size={12} /> In view
              </span>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0], rotateZ: [-5, -2, -5] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute -left-7 top-7 -z-10 h-28 w-24 rounded-[1.2rem] border border-white/15 bg-[#c9f06d]/85 shadow-xl"
          />
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-[1420px] items-end gap-10 px-6 pb-14 pt-40 sm:px-10 sm:pb-20 lg:grid-cols-[1fr_300px] lg:px-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.2em] text-[#d8f69a]">
              <span className="h-px w-9 bg-[#c9f06d]" />A better next life for
              old tech
            </div>
            <h1 className="font-display max-w-4xl text-[clamp(3.2rem,8.2vw,7.7rem)] font-semibold leading-[.98] tracking-[-.075em]">
              <RevealWords text="Your old tech." />
              <br />
              <span className="font-normal italic text-[#c9f06d]">
                <RevealWords text="A better" />
              </span>{" "}
              <RevealWords text="next life." />
            </h1>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-base leading-7 text-white/75 sm:text-lg">
                Pass on the devices you no longer use. We’ll connect you with
                responsible recovery partners near you.
              </p>
              <button
                onClick={() => openPickup()}
                className="group flex w-fit items-center gap-4 rounded-full bg-[#c9f06d] py-2 pl-6 pr-2 text-sm font-bold text-[#17362d] transition hover:bg-white"
              >
                <span>Give your e-waste a new life</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17362d] text-white transition group-hover:rotate-45">
                  <ArrowRight size={18} />
                </span>
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="hidden justify-self-end lg:block"
          >
            <div className="w-64 border-l border-white/30 pl-5">
              <p className="text-xs uppercase tracking-[.15em] text-white/60">
                Global e-waste generated in 2022
              </p>
              <p className="font-display mt-1 text-6xl font-semibold tracking-[-.07em]">
                {count}
                <span className="text-3xl">M</span>
              </p>
              <p className="mt-1 text-sm text-white/70">
                tonnes. Just 22.3% formally collected.
              </p>
              <a
                href="#learn"
                className="mt-4 inline-flex items-center gap-2 text-xs text-[#d8f69a]"
              >
                Why this matters <ArrowRight size={13} />
              </a>
            </div>
          </motion.div>
        </div>
        <button
          onClick={() => setSound(!sound)}
          className="absolute bottom-7 right-7 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/15 px-4 py-2.5 text-xs text-white/75 backdrop-blur-md"
          aria-label="Toggle ambient sound"
        >
          <AudioLines size={15} />
          {sound ? "Sound on" : "Sound off"}
          <span
            className={`ml-1 h-1.5 w-1.5 rounded-full ${sound ? "bg-[#c9f06d]" : "bg-white/40"}`}
          />
        </button>
        <a
          href="#intro"
          aria-label="Scroll down"
          className="absolute bottom-9 left-1/2 z-10 hidden -translate-x-1/2 text-white/65 sm:block"
        >
          <ArrowDown className="animate-bounce" size={18} />
        </a>
      </section>

      <section
        id="intro"
        className="bg-[#f5f4ee] px-6 py-20 sm:px-10 sm:py-28 lg:px-16"
      >
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div className="flex flex-col justify-between">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#668078]">
              A circular future, made personal
            </p>
            <p className="mt-12 hidden max-w-xs text-sm leading-6 text-[#718078] lg:block">
              Less landfill. More purpose. A trusted route for the devices that
              still have somewhere to go.
            </p>
          </div>
          <div>
            <h2 className="font-display max-w-3xl text-4xl font-medium leading-[1.15] tracking-[-.055em] sm:text-6xl">
              <RevealWords text="The things we make should stay in the circle." />
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-7 text-[#65746c] sm:text-lg">
              EcoCircuit helps you find authorized collection partners,
              understand where your device goes, and keep every handover on
              record.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <span className="rounded-full border border-[#d6dacf] px-4 py-2 text-xs text-[#51665e]">
                Authorized local partners
              </span>
              <span className="rounded-full border border-[#d6dacf] px-4 py-2 text-xs text-[#51665e]">
                Clear chain of custody
              </span>
              <span className="rounded-full border border-[#d6dacf] px-4 py-2 text-xs text-[#51665e]">
                You stay in control
              </span>
            </div>
          </div>
        </div>
      </section>

      <div
        className="overflow-hidden bg-[#c9f06d] py-3 text-[#17362d]"
        aria-hidden="true"
      >
        <div className="marquee flex w-max items-center whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {["REUSE", "REPAIR", "RECOVER", "RETURN TO THE CIRCLE"].map(
                (word) => (
                  <span
                    key={`${copy}-${word}`}
                    className="mx-6 flex items-center gap-6 font-display text-xs font-extrabold tracking-[.18em] sm:text-sm"
                  >
                    {word}
                    <Sparkles size={13} />
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <section id="how" className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#668078]">
                Goodbye drawer. Hello circularity.
              </p>
              <h2 className="font-display mt-4 text-4xl font-medium tracking-[-.055em] sm:text-6xl">
                <RevealWords text="A simple way forward." />
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#718078]">
              From your doorstep to its next chapter, follow every step with
              confidence.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <article className="group relative min-h-[470px] overflow-hidden rounded-[2rem] bg-[#dae1d5]">
              <ParallaxImage
                src={photos.device}
                alt="Close-up of electronic components being handled carefully"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12251e]/90 via-[#12251e]/10 to-transparent" />
              <div className="absolute left-6 top-6 rounded-full bg-[#c9f06d] px-3 py-1.5 text-xs font-bold text-[#17362d]">
                01 / Start at home
              </div>
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <h3 className="font-display text-3xl font-semibold tracking-[-.04em]">
                  List what you have.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                  Add the devices, their condition and a few photos. We’ll help
                  you prepare them safely.
                </p>
              </div>
            </article>
            <article className="group relative min-h-[470px] overflow-hidden rounded-[2rem] bg-[#c9d0c2]">
              <ParallaxImage
                src={photos.partner}
                alt="Electronics recovery professional at work"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12251e]/90 via-[#12251e]/5 to-transparent" />
              <div className="absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#17362d]">
                02 / Choose with care
              </div>
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <h3 className="font-display text-3xl font-semibold tracking-[-.04em]">
                  Meet a local partner.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                  Compare nearby quotes, service details and self-declared
                  authorization credentials.
                </p>
              </div>
            </article>
            <article className="group relative min-h-[470px] overflow-hidden rounded-[2rem] bg-[#36483d]">
              <ParallaxImage
                src={photos.city}
                alt="Sustainable architecture surrounded by greenery"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12251e]/90 via-[#12251e]/15 to-transparent" />
              <div className="absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#17362d]">
                03 / Follow its journey
              </div>
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <h3 className="font-display text-3xl font-semibold tracking-[-.04em]">
                  Keep the story.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                  A recorded handover, processing update and digital certificate
                  make the journey visible.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        id="paths"
        className="overflow-hidden bg-[#17362d] px-6 py-20 text-white sm:px-10 sm:py-28 lg:px-16"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c9f06d]">
                A second life looks different for every device
              </p>
              <h2 className="font-display mt-4 max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-.055em] sm:text-6xl">
                <RevealWords text="Pick your tech. Picture its next chapter." />
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/60">
              Hover a card to explore. Every item is handled by an authorized
              partner, with its journey recorded along the way.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {circularWays.map((item, index) => (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8, rotateX: 2, rotateY: -2, scale: 1.01 }}
                style={{ transformPerspective: 900 }}
                className={`group relative isolate min-h-[380px] overflow-hidden border border-white/10 bg-[#28483b] ${item.shape} ${index % 2 === 1 ? "lg:mt-16" : ""}`}
              >
                <ParallaxImage
                  src={item.image}
                  alt={item.label.toLowerCase()}
                  className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b2018]/95 via-[#0b2018]/30 to-[#0b2018]/5 transition duration-700 group-hover:from-[#0b2018]/95 group-hover:via-[#0b2018]/55" />
                <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-[#10271f]/45 px-3 py-1.5 text-[10px] font-bold tracking-[.14em] text-white backdrop-blur-md sm:left-7 sm:top-7">
                  0{index + 1} / {item.label}
                </span>
                <motion.div
                  initial={false}
                  className="absolute inset-x-0 bottom-0 p-5 sm:p-7"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#d8f69a]">
                    {item.route}
                  </p>
                  <h3 className="font-display mt-2 text-2xl font-semibold leading-tight tracking-[-.04em] sm:text-3xl">
                    {item.title}
                  </h3>
                  <div className="grid transition-all duration-500 md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="mt-3 max-w-md text-sm leading-6 text-white/75">
                        {item.detail}
                      </p>
                      <button
                        onClick={() => openPickup(item.category)}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#c9f06d] px-4 py-2.5 text-xs font-bold text-[#17362d] opacity-100 transition hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                      >
                        Start a collection <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition duration-500 group-hover:rotate-45 group-hover:border-[#c9f06d] group-hover:bg-[#c9f06d] group-hover:text-[#17362d]"
                >
                  <ArrowRight size={17} />
                </span>
              </motion.article>
            ))}
          </div>
          <p className="mt-6 text-[10px] text-white/45">
            The best route depends on device condition and partner inspection.
            Quotes are indicative.
          </p>
        </div>
      </section>

      <section
        id="partners"
        className="soft-grid bg-[#e8ebdf] px-6 py-20 sm:px-10 sm:py-28 lg:px-16"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#668078]">
                A little closer to circular
              </p>
              <h2 className="font-display mt-4 text-4xl font-medium tracking-[-.055em] sm:text-6xl">
                <RevealWords text="Partners near you." />
              </h2>
            </div>
            <button
              onClick={() => setModal("partners")}
              className="flex w-fit items-center gap-2 rounded-full border border-[#b9c4b5] px-5 py-3 text-sm font-semibold transition hover:bg-white"
            >
              Explore all partners <ArrowRight size={16} />
            </button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {partners.map((p, i) => (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -7, rotateX: 1.5, rotateY: -1.5 }}
                style={{ transformPerspective: 900 }}
                key={p.name}
                className="group overflow-hidden rounded-[1.75rem] border border-[#dfe4d9] bg-[#f9faf5]"
              >
                <div className="relative h-48">
                  <ParallaxImage
                    src={p.img}
                    alt={`${p.name} recycling facility`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#f9faf5]/95 px-3 py-1.5 text-[11px] font-semibold">
                    <ShieldCheck size={13} className="text-[#668c58]" />
                    {p.tag === "Verified"
                      ? "Verified partner"
                      : "Self-declared authorization"}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-[-.03em]">
                        {p.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-[#77857c]">{p.area}</p>
                    </div>
                    <div className="rounded-full bg-[#edf1e7] px-2.5 py-1 text-xs font-semibold">
                      ★ {p.rating}
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-[#e6e9e1] pt-4">
                    <p>
                      <span className="text-xs text-[#7a897f]">
                        Indicative quote{" "}
                      </span>
                      <span className="font-display font-bold">{p.price}</span>
                    </p>
                    <button
                      onClick={() => openPickup()}
                      className="flex items-center gap-1 text-xs font-bold"
                    >
                      View partner <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-[#718078]">
            Partner authorization details are self-declared unless marked
            verified. Please cross-check credentials on the official CPCB
            portal. Quotes are indicative; final valuation follows inspection.
          </p>
        </div>
      </section>

      <section
        id="impact"
        className="bg-[#18372d] px-6 py-20 text-white sm:px-10 sm:py-28 lg:px-16"
      >
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c9f06d]">
              Small actions, real weight
            </p>
            <h2 className="font-display mt-5 text-4xl font-medium leading-tight tracking-[-.055em] sm:text-6xl">
              <RevealWords text="A lighter footprint starts with one device." />
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/65">
              Every properly recovered device is a chance to keep useful
              materials in circulation and hazardous waste out of the wrong
              places.
            </p>
            <a
              href="#learn"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#c9f06d]"
            >
              Explore the impact <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[.05] p-6 sm:p-9">
              <p className="text-xs text-white/55">
                Global e-waste generated in 2022
              </p>
              <p className="font-display mt-4 text-5xl font-semibold tracking-[-.07em] sm:text-7xl">
                62<span className="text-3xl">M</span>
              </p>
              <p className="mt-2 text-sm text-white/60">metric tonnes</p>
            </div>
            <div className="rounded-[1.75rem] bg-[#c9f06d] p-6 text-[#17362d] sm:p-9">
              <Leaf size={24} />
              <p className="font-display mt-8 text-4xl font-semibold tracking-[-.06em] sm:text-6xl">
                22.3%
              </p>
              <p className="mt-3 text-sm leading-5 text-[#42604b]">
                was documented as formally collected and recycled.
              </p>
            </div>
            <div className="col-span-2 rounded-[1.75rem] border border-white/10 p-5 sm:p-7">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[.16em] text-white/45">
                <span>Generated</span>
                <span>Documented recycled</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[22.3%] rounded-full bg-[#c9f06d]" />
              </div>
              <p className="mt-3 text-xs text-white/55">
                The Global E-waste Monitor 2024 reports a growing gap.
                Responsible handover helps close it.
              </p>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-[1280px] text-[10px] text-white/35">
          Source: Global E-waste Monitor 2024, reporting global e-waste
          generation in 2022.
        </p>
      </section>

      <section id="learn" className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#668078]">
              A mindful handover
            </p>
            <h2 className="font-display mt-4 text-4xl font-medium tracking-[-.055em] sm:text-6xl">
              <RevealWords text="Before it leaves your hands." />
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#718078]">
              A few thoughtful steps protect your data and the people handling
              your device.
            </p>
            <div className="float mt-9 flex max-w-sm items-center gap-4 rounded-2xl bg-[#e8ebdf] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c9f06d]">
                <BatteryWarning size={21} />
              </span>
              <p className="text-xs leading-5 text-[#55685d]">
                Never dismantle devices at home. Keep batteries and damaged
                items intact, and tell your collection partner about them.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-white">
            <div className="grid sm:grid-cols-[.8fr_1.2fr]">
              <div className="relative min-h-[260px] sm:min-h-[420px]">
                <ParallaxImage
                  src={photos.hands}
                  alt="Careful handling of electronics for reuse and recovery"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-9">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7a887f]">
                  <ShieldCheck size={15} className="text-[#78a255]" /> Your
                  data, your call
                </div>
                <h3 className="font-display mt-4 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">
                  <RevealWords text="A quick data-wipe checklist" />
                </h3>
                <ul className="mt-6 space-y-4">
                  {[
                    "Back up anything you want to keep",
                    "Sign out of accounts and remove device locks",
                    "Factory reset your phone, tablet or computer",
                    "Remove SIM and memory cards",
                    "Keep the device intact; let the partner handle recovery",
                  ].map((x, i) => (
                    <li
                      key={x}
                      className="flex items-start gap-3 text-sm leading-5 text-[#53645b]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d9dfd4] text-[10px]">
                        {i + 1}
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openPickup()}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17362d] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#2e5746]"
                >
                  I’m ready to hand it over <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10 sm:pb-28 lg:px-16">
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[2rem] bg-[#dbe2d2] p-7 sm:p-12 lg:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#668078]">
                Curiosity belongs in the circle
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl font-medium tracking-[-.055em] sm:text-6xl">
                <RevealWords text="A few good questions." />
              </h2>
            </div>
            <div className="space-y-2 lg:w-[520px]">
              {[
                "What happens to my device after pickup?",
                "Are partner quotes guaranteed?",
                "What if my device has a swollen battery?",
              ].map((q, i) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-[#cdd6c9] bg-white/50 p-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                    <span>{q}</span>
                    <ChevronDown
                      className="transition group-open:rotate-180"
                      size={17}
                    />
                  </summary>
                  <p className="mt-3 max-w-lg pr-5 text-xs leading-5 text-[#68796d]">
                    {i === 0
                      ? "Your partner records the handover and processing outcome. EcoCircuit connects you and keeps a clear chain-of-custody record; authorized partners carry out the recovery."
                      : i === 1
                        ? "No. Offers are indicative and may change after in-person inspection. Review the final valuation before you agree to proceed."
                        : "Do not charge, open or dismantle it. Keep the item away from heat and let your partner know before pickup so they can handle it safely."}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#10271f] px-6 py-12 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-10 sm:flex-row">
            <div>
              <a href="#home" className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9f06d] text-[#17362d]">
                  <Recycle size={19} />
                </span>
                <span className="font-display text-lg font-extrabold tracking-[-.04em]">
                  eco<span className="font-medium">circuit</span>
                </span>
              </a>
              <p className="mt-4 max-w-xs text-xs leading-5 text-white/50">
                A thoughtful connection between people and authorized e-waste
                recovery partners.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-xs text-white/65">
              <a href="#how">How it works</a>
              <a href="#paths">Explore devices</a>
              <a href="#partners">Find a partner</a>
              <a href="#impact">Our impact</a>
              <a href="#learn">Data-wipe guide</a>
              <a href="#learn">Awareness hub</a>
              <a href="#">Contact</a>
            </div>
            <button
              onClick={() => setSound(!sound)}
              className="flex h-fit items-center gap-2 text-xs text-white/60"
            >
              <AudioLines size={15} />
              {sound ? "Ambient sound on" : "Ambient sound off"}
            </button>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] text-white/35 sm:flex-row">
            <span>© 2025 EcoCircuit. Made for a more circular India.</span>
            <span>We connect. Authorized partners recover.</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {stickyVisible && !modal && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => openPickup()}
            className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-[#17362d]/95 py-2 pl-3 pr-2 text-xs font-bold text-white shadow-2xl shadow-[#10271f]/25 backdrop-blur-xl sm:bottom-7 sm:text-sm"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9f06d] text-[#17362d]">
              <Recycle size={16} />
            </span>
            Start a collection
            <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <ArrowRight size={15} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <Modal
            kind={modal}
            onClose={() => setModal(null)}
            step={step}
            setStep={setStep}
            toast={setToast}
            category={category}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#17362d] px-5 py-3 text-sm text-white shadow-xl"
          >
            <Check className="mr-2 inline text-[#c9f06d]" size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Modal({
  kind,
  onClose,
  step,
  setStep,
  toast,
  category,
}: {
  kind: "signin" | "pickup" | "partners";
  onClose: () => void;
  step: number;
  setStep: (n: number) => void;
  toast: (s: string) => void;
  category: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d1f19]/65 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-[560px] overflow-auto rounded-[2rem] bg-[#f8f9f4] p-6 shadow-2xl sm:p-9"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-[#64756b] hover:bg-[#e9ede3]"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>
        {kind === "signin" && (
          <>
            <p className="text-xs font-bold uppercase tracking-[.17em] text-[#698272]">
              Welcome back
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-.05em]">
              Your circular story awaits.
            </h2>
            <p className="mt-2 text-sm text-[#77857c]">
              Sign in to track your pickups and offers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast("Demo sign in is ready for the backend phase.");
                onClose();
              }}
              className="mt-7 space-y-4"
            >
              <label className="block text-xs font-semibold">
                Email address
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-[#dce1d7] bg-white px-4 py-3 text-sm outline-none focus:border-[#809c6d]"
                />
              </label>
              <label className="block text-xs font-semibold">
                Password
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl border border-[#dce1d7] bg-white px-4 py-3 text-sm outline-none focus:border-[#809c6d]"
                />
              </label>
              <button className="w-full rounded-full bg-[#17362d] py-3.5 text-sm font-bold text-white">
                Log in
              </button>
            </form>
            <button
              onClick={() =>
                toast("Account registration is part of the next build phase.")
              }
              className="mt-5 w-full text-center text-xs text-[#63746a]"
            >
              New here? <b>Create an account</b>
            </button>
          </>
        )}
        {kind === "pickup" && (
          <>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#698272]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5efd4] text-[#476346]">
                0{step}
              </span>{" "}
              Start a collection
            </div>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-[-.05em]">
              Let’s find your device a next life.
            </h2>
            <p className="mt-2 text-sm text-[#77857c]">
              A quick preview of the collection request flow.
            </p>
            <div className="mt-7 flex gap-2">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`h-1 flex-1 rounded-full ${n <= step ? "bg-[#8bab6a]" : "bg-[#e1e5dc]"}`}
                />
              ))}
            </div>
            {step === 1 ? (
              <div className="mt-7 space-y-4">
                <label className="block text-xs font-semibold">
                  What are you passing on?
                  <select
                    defaultValue={category}
                    className="mt-2 w-full rounded-xl border border-[#dce1d7] bg-white px-4 py-3 text-sm"
                  >
                    <option>Smartphone</option>
                    <option>Laptop / computer</option>
                    <option>Tablet</option>
                    <option>Television / monitor</option>
                    <option>Battery or charger</option>
                    <option>Other electronics</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold">
                  Condition
                  <select className="mt-2 w-full rounded-xl border border-[#dce1d7] bg-white px-4 py-3 text-sm">
                    <option>Working</option>
                    <option>Needs repair</option>
                    <option>Not working</option>
                    <option>Damaged / battery issue</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold">
                  Quantity
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="mt-2 w-full rounded-xl border border-[#dce1d7] bg-white px-4 py-3 text-sm"
                  />
                </label>
                <div className="flex gap-3 rounded-xl bg-[#fff4dc] p-3 text-xs leading-5 text-[#775e31]">
                  <BatteryWarning className="mt-0.5 shrink-0" size={17} />
                  Please keep the device intact. Flag swollen batteries or
                  hazardous items for your partner.
                </div>
              </div>
            ) : step === 2 ? (
              <div className="mt-7 space-y-4">
                <label className="block text-xs font-semibold">
                  Pickup pincode
                  <input
                    inputMode="numeric"
                    placeholder="e.g. 560038"
                    className="mt-2 w-full rounded-xl border border-[#dce1d7] bg-white px-4 py-3 text-sm"
                  />
                </label>
                <label className="block text-xs font-semibold">
                  Preferred time
                  <select className="mt-2 w-full rounded-xl border border-[#dce1d7] bg-white px-4 py-3 text-sm">
                    <option>Weekday morning</option>
                    <option>Weekday afternoon</option>
                    <option>Weekend</option>
                  </select>
                </label>
                <div className="rounded-xl bg-[#e8eddf] p-4 text-xs leading-5 text-[#566d5c]">
                  Before pickup, back up your data, sign out and factory reset
                  your device. Remove SIM and memory cards.
                </div>
              </div>
            ) : (
              <div className="mt-7 rounded-2xl bg-white p-5">
                <div className="flex items-center gap-3">
                  <Compass className="text-[#779764]" />
                  <div>
                    <p className="text-sm font-bold">
                      Nearby partners are ready.
                    </p>
                    <p className="mt-1 text-xs text-[#7b887f]">
                      You’ll compare offers before choosing who collects.
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {partners.slice(0, 2).map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-3 rounded-xl bg-[#f5f6f0] p-3"
                    >
                      <img
                        src={p.img}
                        alt=""
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-bold">{p.name}</p>
                        <p className="mt-1 text-[10px] text-[#78867d]">
                          {p.area}
                        </p>
                      </div>
                      <p className="text-sm font-bold">{p.price}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[10px] leading-4 text-[#78867d]">
                  Offers are indicative. Final valuation happens after
                  inspection. Partner credentials should be checked on the
                  official CPCB portal.
                </p>
              </div>
            )}
            <div className="mt-7 flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="rounded-full border border-[#d7ded4] px-5 py-3 text-sm font-semibold"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (step < 3) {
                    setStep(step + 1);
                  } else {
                    toast("Request preview complete.");
                    onClose();
                  }
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#17362d] py-3 text-sm font-bold text-white"
              >
                {step < 3 ? "Continue" : "Compare partner offers"}
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
        {kind === "partners" && (
          <>
            <p className="text-xs font-bold uppercase tracking-[.17em] text-[#698272]">
              Local recovery network
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-.05em]">
              A closer look at partners.
            </h2>
            <p className="mt-2 text-sm text-[#77857c]">
              Compare local providers and their indicative pickup quotes.
            </p>
            <div className="mt-6 space-y-3">
              {partners.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3"
                >
                  <img
                    src={p.img}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-bold">{p.name}</p>
                      {p.tag === "Verified" && (
                        <ShieldCheck
                          size={14}
                          className="shrink-0 text-[#75965c]"
                        />
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-[#77857c]">
                      {p.area} · ★ {p.rating}
                    </p>
                    <p className="mt-1 text-[10px] text-[#89948d]">
                      {p.tag} authorization · Cross-check on the CPCB portal
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{p.price}</p>
                    <p className="text-[9px] text-[#89948d]">indicative</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                onClose();
                setStep(1);
                setTimeout(
                  () => document.querySelector("#home")?.scrollIntoView(),
                  0,
                );
              }}
              className="mt-6 w-full rounded-full bg-[#17362d] py-3.5 text-sm font-bold text-white"
            >
              Create a pickup request
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
