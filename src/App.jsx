import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCompass,
  FiGrid,
  FiMapPin,
  FiMaximize2,
  FiMenu,
  FiMoon,
  FiPhone,
  FiSend,
  FiSun,
  FiX,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import {
  aboutTimeline,
  brands,
  blogs,
  designStyles,
  faqs,
  imagery,
  inspiration,
  materials,
  navLinks,
  processSteps,
  projects,
  services,
  showcaseModules,
  stats,
  testimonials,
  whyChoose,
} from "./data/siteData";

gsap.registerPlugin(ScrollTrigger);

const sectionEase = [0.76, 0, 0.24, 1];

function cn(...values) {
  return values.filter(Boolean).join(" ");
}

function scrollToId(href) {
  const node = document.querySelector(href);
  if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionIntro({ eyebrow, title, copy, align = "left" }) {
  return (
    <div className={cn("section-intro", align === "center" && "section-intro-center")} data-reveal>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function MagneticButton({ children, variant = "primary", className = "", href, onClick, type = "button" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const move = (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.18, y: y * 0.28, duration: 0.45, ease: "power3.out" });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1, 0.35)" });
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  const classes = cn("magnetic-btn", variant === "ghost" ? "magnetic-btn-ghost" : "magnetic-btn-primary", className);

  if (href) {
    return (
      <a ref={ref} className={classes} href={href} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} className={classes} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

function Preloader({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          exit={{ y: "-100%", transition: { duration: 1.05, ease: sectionEase } }}
        >
          <div className="preloader-noise" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="preloader-mark">
            <svg viewBox="0 0 620 180" aria-label="ABC Interiors logo">
              <path className="logo-stroke" d="M44 142 L93 38 L143 142 M67 94 H120" />
              <path
                className="logo-stroke delay-1"
                d="M190 40 H266 C305 40 322 63 306 89 C341 101 333 142 286 142 H190 Z M224 70 H266 C282 70 285 88 266 88 H224 M224 108 H286 C305 108 304 124 286 124 H224"
              />
              <path className="logo-stroke delay-2" d="M425 55 C390 28 329 47 329 91 C329 138 392 157 426 125" />
              <text x="470" y="88" className="logo-text">ABC</text>
              <text x="470" y="126" className="logo-subtext">INTERIORS</text>
            </svg>
            <div className="preloader-line">
              <span />
            </div>
            <p>Drawing your private world</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Header({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      const current = navLinks
        .map((link) => document.querySelector(link.href))
        .filter(Boolean)
        .findLast((section) => section.getBoundingClientRect().top < 180);
      if (current) setActive(`#${current.id}`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={cn("site-header", scrolled && "site-header-scrolled")}>
        <a href="#home" className="brand-lockup" aria-label="ABC Interiors home">
          <span className="brand-monogram">ABC</span>
          <span>
            <strong>ABC Interiors</strong>
            <small>Luxury design studio</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.slice(0, 5).map((link) => (
            <a key={link.href} className={active === link.href ? "active" : ""} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={theme === "dark" ? "Switch to light luxury mode" : "Switch to dark luxury mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <a className="consult-link" href="#contact">Book Consultation</a>
          <button className="menu-trigger" type="button" onClick={() => setOpen(true)} aria-label="Open menu">
            <FiMenu />
            <span>Menu</span>
          </button>
        </div>
      </header>
      <MegaMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MegaMenu({ open, onClose }) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const menuItems = [
    { label: "Residential Worlds", href: "#portfolio", copy: "Villas, apartments, wardrobes, kitchens" },
    { label: "Commercial Atmosphere", href: "#showcase", copy: "Offices, restaurants, retail galleries" },
    { label: "Material Library", href: "#materials", copy: "Stone, veneer, glass, hardware, finishes" },
    { label: "Estimate Your Project", href: "#estimate", copy: "A premium budget range in under a minute" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mega-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="mega-bg"
            style={{ backgroundImage: `url(${imagery.menu[imageIndex % imagery.menu.length]})` }}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.1, ease: sectionEase }}
          />
          <button className="mega-close" type="button" onClick={onClose} aria-label="Close menu">
            <FiX />
          </button>
          <div className="mega-content">
            <div className="mega-brand">
              <span className="eyebrow">ABC Interiors</span>
              <h2>Rooms with the restraint of architecture and the warmth of home.</h2>
              <p>Explore signature spaces, material palettes, and turnkey consultation paths.</p>
            </div>
            <div className="mega-links">
              {menuItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setImageIndex(index)}
                  onFocus={() => setImageIndex(index)}
                  onClick={onClose}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <small>{item.copy}</small>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-bg" style={{ backgroundImage: `url(${imagery.hero})` }} />
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="eyebrow hero-eyebrow" data-reveal>Private residences. Signature commercial spaces.</span>
        <h1 data-split>ABC Interiors</h1>
        <p data-reveal>
          Crafting timeless luxury interiors through editorial design, exacting execution, and materials chosen to age beautifully.
        </p>
        <div className="hero-cta" data-reveal>
          <MagneticButton href="#contact">
            Book Free Consultation <FiArrowRight />
          </MagneticButton>
          <MagneticButton href="#portfolio" variant="ghost">
            Explore Portfolio
          </MagneticButton>
        </div>
      </div>
      <div className="hero-stats" data-reveal>
        {stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="scroll-indicator" aria-hidden="true">
        <span />
        Scroll
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about-section">
      <div className="about-grid">
        <div>
          <SectionIntro
            eyebrow="Studio"
            title="A design house for people who notice quiet details."
            copy="ABC Interiors blends architectural discipline with tactile softness, creating homes and hospitality spaces that feel collected, not decorated."
          />
          <div className="mission-grid" data-reveal>
            <div>
              <span>Mission</span>
              <p>To make refined interiors feel personal, practical, and beautifully made.</p>
            </div>
            <div>
              <span>Vision</span>
              <p>To become India's most trusted luxury turnkey design partner for exacting clients.</p>
            </div>
          </div>
          <div className="timeline">
            {aboutTimeline.map((item) => (
              <article key={item.year} data-reveal>
                <time>{item.year}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="about-visual" data-parallax>
          <img src={imagery.about} alt="A warm luxury living room designed with natural stone and walnut tones" />
          <div className="about-floating">
            <strong>Material-first</strong>
            <span>Every finish is selected against light, touch, and long-term maintenance.</span>
          </div>
        </div>
      </div>
      <div className="why-grid">
        {whyChoose.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="why-card" data-reveal>
              <Icon />
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="section services-section">
      <SectionIntro
        eyebrow="Capabilities"
        title="Residential, commercial, and turnkey interiors under one exacting studio."
        copy="Every service is planned as part of a complete space, so function, finish, lighting, and installation stay aligned from first sketch to handover."
        align="center"
      />
      <div className="services-grid">
        {services.map(([name, Icon], index) => (
          <article className="service-card" key={name} data-reveal style={{ "--delay": `${(index % 8) * 0.04}s` }}>
            <div className="service-icon">
              <Icon />
            </div>
            <h3>{name}</h3>
            <a href="#contact" aria-label={`Learn more about ${name}`}>
              Learn more <FiArrowRight />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const categories = ["All", "Kitchen", "Bedroom", "Living", "Office", "Commercial", "Villa", "Wardrobe", "Ceiling", "Luxury Homes"];
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);

  const visible = active === "All" ? projects : projects.filter((project) => project.category === active);

  return (
    <section id="portfolio" className="section projects-section">
      <div className="section-row">
        <SectionIntro
          eyebrow="Featured Projects"
          title="Portfolio pieces with gallery-depth detail."
          copy="Filter by room type, then open a project to review scale, budget range, materials, timeline, and imagery."
        />
        <div className="filter-bar" aria-label="Project filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={active === category ? "active" : ""}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="project-masonry">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <motion.article
              layout
              key={project.id}
              className={cn("project-card", index % 3 === 0 && "project-card-large")}
              data-reveal
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45 }}
              onClick={() => setSelected(project)}
            >
              <img src={project.cover} alt={`${project.title} interior`} loading="lazy" />
              <button type="button" aria-label={`Open ${project.title} project details`}>
                <FiMaximize2 />
              </button>
              <div>
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.location}</p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    if (project) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  if (!project) return null;

  const detailItems = [
    ["Area", project.area],
    ["Style", project.style],
    ["Budget range", project.budget],
    ["Duration", project.duration],
  ];

  return (
    <>
      <AnimatePresence>
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.article
            className="project-modal"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.55, ease: sectionEase }}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} project details`}
          >
            <button className="modal-close" type="button" onClick={onClose} aria-label="Close project details">
              <FiX />
            </button>
            <div className="modal-hero">
              <img src={project.cover} alt={`${project.title} hero view`} />
            </div>
            <div className="modal-content">
              <span className="eyebrow">{project.category}</span>
              <h2>{project.title}</h2>
              <p>
                A premium turnkey project shaped around proportion, concealed utility, soft light, and a material palette that feels composed in every season.
              </p>
              <div className="modal-details">
                {detailItems.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="material-tags">
                {project.materials.map((material) => (
                  <span key={material}>{material}</span>
                ))}
              </div>
              <div className="modal-gallery">
                {project.gallery.map((image, index) => (
                  <button key={image} type="button" onClick={() => setLightboxIndex(index)} aria-label={`Open gallery image ${index + 1}`}>
                    <img src={image} alt={`${project.title} gallery view ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </motion.article>
        </motion.div>
      </AnimatePresence>
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={Math.max(lightboxIndex, 0)}
        slides={project.gallery.map((src) => ({ src }))}
      />
    </>
  );
}

function HorizontalShowcase() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - section.clientWidth + 80),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - section.clientWidth + 380}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="showcase" ref={sectionRef} className="showcase-section">
      <div className="showcase-sticky">
        <SectionIntro
          eyebrow="Showcase Modules"
          title="Scroll down. The portfolio moves sideways."
          copy="Each module is treated like a room story, with materials, benefits, and a clear consultation path."
        />
        <div className="showcase-track" ref={trackRef}>
          {showcaseModules.map((module, index) => (
            <article className="showcase-card" key={module.title}>
              <img src={module.image} alt={`${module.title} interior`} loading="lazy" />
              <div>
                <span>{module.eyebrow}</span>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <ul>
                  {module.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <div className="showcase-meta">
                  <strong>{module.materials.join(" / ")}</strong>
                  <small>{module.benefits.join(" | ")}</small>
                </div>
                <a href="#contact">
                  Start this room <FiArrowRight />
                </a>
              </div>
              <em>{String(index + 1).padStart(2, "0")}</em>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfter() {
  const [value, setValue] = useState(54);

  return (
    <section className="section comparison-section">
      <div className="comparison-copy">
        <SectionIntro
          eyebrow="Before / After"
          title="Transformations that keep the architecture honest."
          copy="Drag the control to compare a tired room with the completed luxury renovation direction."
        />
        <div className="comparison-notes" data-reveal>
          <div>
            <FiCompass />
            <span>Space planning</span>
          </div>
          <div>
            <FiSun />
            <span>Layered light</span>
          </div>
          <div>
            <FiGrid />
            <span>Material rhythm</span>
          </div>
        </div>
      </div>
      <div className="comparison-widget" data-reveal>
        <div className="compare-frame">
          <img src={imagery.before} alt="Before renovation room" />
          <div className="compare-after" style={{ width: `${value}%` }}>
            <img src={imagery.after} alt="After luxury renovation room" />
          </div>
          <div className="compare-handle" style={{ left: `${value}%` }}>
            <span />
          </div>
          <span className="compare-label before-label">Before</span>
          <span className="compare-label after-label">After</span>
        </div>
        <label className="compare-range">
          <span>Reveal completed design</span>
          <input
            type="range"
            min="8"
            max="92"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            aria-label="Reveal completed design"
          />
        </label>
      </div>
    </section>
  );
}

function DesignStyles() {
  const [active, setActive] = useState(designStyles[0]);

  return (
    <section id="styles" className="section styles-section">
      <SectionIntro
        eyebrow="Design Styles"
        title="Seven signatures, one premium language."
        copy="Move through each style to see how the palette, rhythm, and mood shift while staying unmistakably ABC."
        align="center"
      />
      <div className="style-stage" data-reveal style={{ "--style-accent": active.accent }}>
        <div className="style-image">
          <AnimatePresence mode="wait">
            <motion.img
              key={active.name}
              src={active.image}
              alt={`${active.name} interior style`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.55 }}
            />
          </AnimatePresence>
          <div className="style-orbit" />
        </div>
        <div className="style-list" role="tablist" aria-label="Design style themes">
          {designStyles.map((style) => (
            <button
              key={style.name}
              type="button"
              role="tab"
              aria-selected={active.name === style.name}
              className={active.name === style.name ? "active" : ""}
              onMouseEnter={() => setActive(style)}
              onFocus={() => setActive(style)}
              onClick={() => setActive(style)}
            >
              <span>{style.name}</span>
              <small>{style.tone}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessMaterials() {
  return (
    <section id="materials" className="section process-section">
      <div className="section-row">
        <SectionIntro
          eyebrow="Process"
          title="A calm path from first conversation to final styling."
          copy="The sequence is deliberately structured so each design decision arrives before it is needed on site."
        />
      </div>
      <div className="process-timeline">
        {processSteps.map((step, index) => (
          <article key={step} data-reveal>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step}</h3>
          </article>
        ))}
      </div>
      <div className="materials-panel" data-reveal>
        <div>
          <span className="eyebrow">Materials</span>
          <h2>Premium boards, stones, finishes, glass, and hardware chosen for real living.</h2>
        </div>
        <div className="material-cloud">
          {materials.map((material) => (
            <span key={material}>{material}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CostEstimator() {
  const [property, setProperty] = useState("Apartment");
  const [bhk, setBhk] = useState("3 BHK");
  const [area, setArea] = useState(1600);
  const [style, setStyle] = useState("Luxury");

  const estimate = useMemo(() => {
    const propertyFactor = { Apartment: 1, Villa: 1.34, Office: 0.92, Retail: 1.12 }[property];
    const styleFactor = { Minimal: 0.9, Contemporary: 1, Scandinavian: 1.05, Luxury: 1.32, Classic: 1.22 }[style];
    const bhkFactor = { "1 BHK": 0.88, "2 BHK": 0.96, "3 BHK": 1.08, "4 BHK": 1.2, "5+ BHK": 1.34 }[bhk];
    const baseRate = 2300;
    const low = area * baseRate * propertyFactor * styleFactor * bhkFactor;
    const high = low * 1.38;
    return {
      low: Math.round(low / 100000) / 10,
      high: Math.round(high / 100000) / 10,
      rate: Math.round(baseRate * propertyFactor * styleFactor * bhkFactor),
    };
  }, [property, bhk, area, style]);

  return (
    <section id="estimate" className="section estimator-section">
      <SectionIntro
        eyebrow="Budget Estimator"
        title="Get a premium interior budget range before the first call."
        copy="Choose the project profile and area to receive a practical planning range. Final costing follows site study, drawings, and material selection."
        align="center"
      />
      <div className="estimator-shell" data-reveal>
        <div className="estimator-controls">
          <label>
            <span>Property type</span>
            <select value={property} onChange={(event) => setProperty(event.target.value)}>
              {["Apartment", "Villa", "Office", "Retail"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>BHK</span>
            <select value={bhk} onChange={(event) => setBhk(event.target.value)}>
              {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Area: {area.toLocaleString("en-IN")} sq ft</span>
            <input type="range" min="450" max="8500" step="50" value={area} onChange={(event) => setArea(Number(event.target.value))} />
          </label>
          <label>
            <span>Style</span>
            <select value={style} onChange={(event) => setStyle(event.target.value)}>
              {["Minimal", "Contemporary", "Scandinavian", "Luxury", "Classic"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="estimate-result">
          <span>Estimated interior budget</span>
          <strong>INR {estimate.low} L - {estimate.high} L</strong>
          <p>Indicative blended rate: INR {estimate.rate.toLocaleString("en-IN")} per sq ft</p>
          <MagneticButton href="#contact">
            Refine with a designer <FiArrowRight />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

function BrandsCarousel() {
  return (
    <section className="brands-section" aria-label="Luxury brand partners">
      <span className="eyebrow">Brand Partners</span>
      <Swiper
        modules={[Autoplay, FreeMode]}
        freeMode
        loop
        speed={5500}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        slidesPerView="auto"
        className="brand-swiper"
      >
        {[...brands, ...brands].map((brand, index) => (
          <SwiperSlide key={`${brand.name}-${index}`} className="brand-slide">
            <strong>{brand.name}</strong>
            <span>{brand.role}</span>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function InspirationGallery() {
  return (
    <section className="section inspiration-section">
      <SectionIntro
        eyebrow="Inspiration"
        title="A masonry journal of moods, materials, and memorable corners."
        copy="Pinterest-like cards give visitors a fast, visual way to understand the studio's sense of taste."
        align="center"
      />
      <div className="masonry-gallery">
        {inspiration.map((item) => (
          <article className={cn("pin-card", `pin-${item.height}`)} key={item.label} data-reveal>
            <img src={item.image} alt={item.label} loading="lazy" />
            <span>{item.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function TestimonialsFAQBlog() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <section className="section testimonial-section">
        <SectionIntro
          eyebrow="Clients"
          title="The feeling after handover matters as much as the first reveal."
          copy="Luxury is not only a look. It is clarity, punctuality, craft, and a site team that respects the home."
        />
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonial-card" data-reveal>
              <div>
                {Array.from({ length: item.rating }).map((_, index) => (
                  <FiSun key={index} />
                ))}
              </div>
              <p>"{item.quote}"</p>
              <strong>{item.name}</strong>
              <span>{item.project}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section faq-blog-section">
        <div className="faq-column">
          <SectionIntro eyebrow="FAQ" title="Practical questions, answered plainly." />
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article key={faq.question} className={openFaq === index ? "open" : ""}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <span>{faq.question}</span>
                  {openFaq === index ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </article>
            ))}
          </div>
        </div>
        <div className="blog-column">
          <SectionIntro eyebrow="Journal" title="Ideas for sharper interior decisions." />
          <div className="blog-list">
            {blogs.map((blog) => (
              <a href="#contact" key={blog.title} data-reveal>
                <img src={blog.image} alt={blog.title} loading="lazy" />
                <div>
                  <span>{blog.tag}</span>
                  <h3>{blog.title}</h3>
                </div>
                <FiArrowRight />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ConsultationFooter() {
  return (
    <section id="contact" className="contact-footer">
      <div className="contact-panel">
        <div className="contact-copy">
          <span className="eyebrow">Book Consultation</span>
          <h2>Bring us a plan, a Pinterest board, or just the feeling you want.</h2>
          <p>We will convert it into drawings, budgets, schedules, and a finished space with the polish of a private design house.</p>
          <div className="contact-actions">
            <a href="tel:+919876543210"><FiPhone /> Call Now</a>
            <a href="https://wa.me/919876543210"><FiSend /> WhatsApp</a>
          </div>
        </div>
        <form className="lux-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            <span>Name</span>
            <input type="text" placeholder="Your name" />
          </label>
          <label>
            <span>Phone</span>
            <input type="tel" placeholder="+91" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            <span>City</span>
            <input type="text" placeholder="Bengaluru" />
          </label>
          <label>
            <span>Property Type</span>
            <select>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Office</option>
              <option>Restaurant</option>
              <option>Retail Showroom</option>
            </select>
          </label>
          <label className="full">
            <span>Message</span>
            <textarea rows="4" placeholder="Tell us about your project" />
          </label>
          <button type="submit">
            Book Consultation <FiArrowRight />
          </button>
        </form>
      </div>
      <footer>
        <a href="#home" className="footer-brand">ABC Interiors</a>
        <div>
          <strong>Quick Links</strong>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </div>
        <div>
          <strong>Services</strong>
          {["Luxury Villas", "Modular Kitchens", "Office Interiors", "Turnkey Projects"].map((item) => (
            <a key={item} href="#services">{item}</a>
          ))}
        </div>
        <div>
          <strong>Location</strong>
          <span>Bengaluru / Mumbai / Hyderabad</span>
          <span>hello@abcinteriors.in</span>
          <span>+91 98765 43210</span>
        </div>
        <div className="newsletter">
          <strong>Newsletter</strong>
          <label>
            <span>Join for material notes and project reveals</span>
            <input type="email" placeholder="Email address" />
          </label>
        </div>
      </footer>
      <div className="copyright">Copyright 2026 ABC Interiors. All rights reserved.</div>
    </section>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("abc-theme") || "light");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 2450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("abc-theme", theme);
  }, [theme]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.18,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (loading) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el, index) => {
        gsap.fromTo(
          el,
          { y: 38, opacity: 0, clipPath: "inset(12% 0 0 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            delay: Number(el.style.getPropertyValue("--delay") || 0) || (index % 3) * 0.04,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          },
        );
      });

      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      const splitTarget = document.querySelector("[data-split]");
      if (splitTarget && !splitTarget.dataset.prepared) {
        splitTarget.dataset.prepared = "true";
        const words = splitTarget.textContent.trim().split(/\s+/).map((word) => (
          `<span class="hero-word">${word.split("").map((letter) => `<span>${letter}</span>`).join("")}</span>`
        )).join(" ");
        splitTarget.innerHTML = words;
        gsap.fromTo(
          splitTarget.querySelectorAll("span"),
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.035, ease: "power4.out", delay: 0.15 },
        );
      }
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [loading]);

  useEffect(() => {
    const onMove = (event) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      <Preloader done={!loading} />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <Header theme={theme} setTheme={setTheme} />
      <main className={cn("site-main", loading && "is-loading")}>
        <Hero />
        <About />
        <Services />
        <Projects />
        <HorizontalShowcase />
        <BeforeAfter />
        <DesignStyles />
        <ProcessMaterials />
        <CostEstimator />
        <BrandsCarousel />
        <InspirationGallery />
        <TestimonialsFAQBlog />
        <ConsultationFooter />
      </main>
    </>
  );
}

export default App;
