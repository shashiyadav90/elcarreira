import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, animate, useScroll, useSpring } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

/* =========================================================
   IMAGES  — put .jpg files in  src/assets/  (exact names):
   logo, college1..college5, c1..c6, ananya, rahul,
   principal, placement, mission, vision
   Missing images fall back to a soft blue block (no crash).
========================================================= */
const files = import.meta.glob('./assets/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
const IMG = Object.fromEntries(
  Object.entries(files).map(([k, v]) => [k.split('/').pop().replace(/\.[^.]+$/, ''), v])
)

function Img({ n, alt, style }) {
  const src = IMG[n]
  return src ? (
    <img src={src} alt={alt || n} loading="lazy" decoding="async"
      style={{ display: 'block', width: '100%', objectFit: 'cover', ...style }} />
  ) : (
    <div aria-hidden style={{ width: '100%', background: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', ...style }} />
  )
}

function LogoMark() {
  return IMG.logo ? (
    <img
      src={IMG.logo}
      alt="ELCARREIRA"
      decoding="async"
      style={{
        width: 44,
        height: 44,
        objectFit: 'contain',
        display: 'block',
        borderRadius: 0,
        background: 'transparent',
      }}
    />
  ) : (
    <b>E</b>
  )
}

/* =========================================================
   HELPERS
========================================================= */
function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      style={{ willChange: 'transform, opacity' }}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/* Count writes straight to the DOM — no React re-render per frame */
function Count({ to, suffix = '', dec = 0 }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true })
  useEffect(() => {
    if (!seen || !ref.current) return
    const c = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(dec) + suffix
      },
    })
    return () => c.stop()
  }, [seen, to, dec, suffix])
  return <span ref={ref}>{(0).toFixed(dec)}{suffix}</span>
}

function Tabs({ items, value, onChange, id }) {
  return (
    <div className="tabs">
      {items.map((t) => (
        <button key={t} className={'tab ' + (value === t ? 'on' : '')} onClick={() => onChange(t)}>
          {value === t && (
            <motion.div layoutId={id} className="pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
          )}
          <span>{t}</span>
        </button>
      ))}
    </div>
  )
}

function Head({ tag, title, sub }) {
  return (
    <Reveal className="head">
      <span className="eyebrow"><i />{tag}</span>
      <h2>{title}</h2>
      {sub && <p className="lead">{sub}</p>}
    </Reveal>
  )
}

/* =========================================================
   NAV
========================================================= */
function Nav() {
  const { scrollYProgress } = useScroll()
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const links = ['Framework', 'Programs', 'Intelligence', 'Impact', 'About']
  return (
    <>
      <motion.div className="prog" style={{ scaleX: sx }} />
      <motion.nav className="nav" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease }}>
        <div className="wrap">
          <div className="in">
            <a href="#top" className="logo"><LogoMark />ELCARREIRA</a>
            <div className="links">
              {links.map((l) => <a key={l} href={'#' + l.toLowerCase()}>{l}</a>)}
            </div>
            <a href="#demo" className="btn p">Book a demo →</a>
          </div>
        </div>
      </motion.nav>
    </>
  )
}

/* =========================================================
   DASHBOARD
========================================================= */
function Dashboard() {
  const bars = [46, 58, 52, 70, 82, 76, 90]
  return (
    <motion.div
      className="card dash"
      initial={{ opacity: 0, y: 60, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.3, ease }}
      style={{ perspective: 1200, willChange: 'transform, opacity' }}
    >
      <div className="dbar">
        <i /><i /><i />
        <span style={{ marginLeft: 10 }}>elcarreira.com/intelligence</span>
      </div>

      <div className="dgrid">
        <div className="side">
          <span className="on">Overview</span>
          <span>Students</span>
          <span>Placement</span>
          <span>Analytics</span>
        </div>

        <div>
          <div className="kpis">
            <div className="kpi"><small>Employability Index</small><b><Count to={82} /></b><span className="up">↗ 14.8%</span></div>
            <div className="kpi"><small>Market Ready</small><b><Count to={640} /></b><span className="up">of 780 students</span></div>
            <div className="kpi"><small>Placement Rate</small><b><Count to={82} suffix="%" /></b><span className="up">+12.4% this year</span></div>
          </div>

          <div className="chart">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="b"
                style={{ height: h + '%', originY: 1 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.8, delay: 0.8 + i * 0.08, ease }}
              />
            ))}
          </div>
        </div>
      </div>

      <motion.div className="float" style={{ left: -40, top: 120 }}
        animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
        <small>Interview ready</small>🎯 <Count to={71} suffix="%" />
      </motion.div>

      <motion.div className="float" style={{ right: -36, bottom: 60 }}
        animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}>
        <small>Active hiring roles</small>💼 <Count to={124} />
      </motion.div>
    </motion.div>
  )
}

/* =========================================================
   HERO  (blobs are static now — animating a blurred layer caused lag)
========================================================= */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="blob" style={{ width: 380, height: 380, background: '#93c5fd', left: '-6%', top: 90 }} />
      <div className="blob" style={{ width: 300, height: 300, background: '#fed7aa', right: '-4%', top: 200 }} />

      <div className="wrap">
        <motion.span className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <i />Employability Intelligence · Bengaluru
        </motion.span>

        <motion.h1 style={{ marginTop: 22 }} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease }}>
          The 360° system behind India's <span className="grad">most placement-ready</span> campuses
        </motion.h1>

        <motion.p className="lead" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease }}>
          ELCARREIRA turns placement from an annual scramble into a measured, term-over-term discipline — for vice chancellors, placement officers, and the students they place.
        </motion.p>

        <motion.div className="cta" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease }}>
          <a href="#demo" className="btn p">Book a demo →</a>
          <a href="#intelligence" className="btn o">See the dashboard</a>
        </motion.div>

        <Dashboard />
      </div>
    </section>
  )
}

/* =========================================================
   TRUST  (college1..college5 images before each name)
========================================================= */
function Trust() {
  const names = [
    'Sri Siddhartha Institute of Technology',
    'SEA College of Engineering & Technology',
    'SIET Tumkur',
    'KIT College of Engineering',
  ]
  const stats = [
    [2, '+ Cr', 'jobs analysed for market intelligence'],
    [360, '°', 'employability ecosystem, end to end'],
    [60, '+', 'hiring companies engaged'],
    [7, '+', 'institution partners'],
  ]
  return (
    <section className="sec" style={{ paddingTop: 70, paddingBottom: 40 }}>
      <div className="wrap">
        <Reveal>
          <div className="grid4">
            {stats.map(([n, s, l]) => (
              <div key={l} className="card stat">
                <b><Count to={n} suffix={s} /></b>
                <p>{l}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <p style={{ textAlign: 'center', margin: '56px 0 22px', color: 'var(--mut)', fontWeight: 600 }}>
          Trusted by institutions building placement-ready talent
        </p>

        <div className="marq">
          <div className="track">
            {[...names, ...names].map((n, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                <Img n={'college' + ((i % names.length) + 1)} alt={n}
                  style={{ width: 44, height: 44, borderRadius: 12, background: '#fff' }} />
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   GAP
========================================================= */
function Gap() {
  const d = [
    ['Mercer | Mettl — India Graduate Skill Index', 'Employability', 42.6, '%', 'Only 42.6% of Indian graduates are considered employable.'],
    ['Business Standard Hiring Report', 'Hiring', 53, '%', 'Freshers accounted for more than half of all new hires in FY25.'],
    ['ELCARREIRA Intelligence Engine', 'Market intelligence', 2, '+ Cr', 'Jobs analysed to identify emerging skills, hiring trends, and role demand.'],
    ['Aggregated hiring criteria', 'Recruiter expectation', 0, '', 'Companies hire for skills, adaptability, communication, and problem-solving — not just degrees.'],
  ]
  return (
    <section className="sec">
      <div className="wrap">
        <Head
          tag="The gap"
          title="Institutions produce graduates. The market wants professionals who are ready on day one."
          sub="That gap is measurable — and closing it is what the platform is for."
        />
        <div className="grid4">
          {d.map(([src, tag, n, s, t], i) => (
            <Reveal key={src} delay={i * 0.06}>
              <div className="card stat hov" style={{ height: '100%' }}>
                <em>{tag}</em>
                <b style={{ marginTop: 10 }}>
                  {n ? <Count to={n} suffix={s} dec={n % 1 ? 1 : 0} /> : '—'}
                </b>
                <p>{t}</p>
                <p style={{ fontSize: 12, opacity: 0.7 }}>{src}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <h2 style={{ textAlign: 'center', maxWidth: 820, margin: '72px auto 0' }}>
            The future belongs not to the most qualified graduates, but to the most{' '}
            <span className="grad">market-ready</span> professionals.
          </h2>
        </Reveal>
      </div>
    </section>
  )
}

/* =========================================================
   FRAMEWORK
========================================================= */
const steps = [
  ['Market Readiness Assessment', 'Adaptive assessment scores every student on technical, aptitude, and communication readiness. It identifies individual strengths, skill gaps, and areas that need improvement. Students are mapped to suitable roles based on their current capabilities and career goals. This creates a clear readiness profile that guides the next stage of training and placement.'],
  ['Cohort Creation', 'Students are grouped by role fit and gap severity — not by roll number or CGPA band. Each cohort brings together students with similar readiness levels and career requirements. This allows training to be more focused, relevant, and measurable. Cohorts can evolve as student performance and market requirements change.'],
  ['Curated Training', 'Each cohort follows a learning path built from live market demand, not a fixed syllabus. Training focuses on the technical, aptitude, and communication skills required for target roles. Content and practice are adapted based on student progress and identified gaps. This ensures every learner works toward measurable job readiness.'],
  ['Interview Readiness', 'AI and human mock interviews confirm readiness before a recruiter sees the student. Students practise role-specific questions, communication, problem-solving, and technical discussions. Feedback highlights remaining gaps and gives students a clear path to improve. Only students who meet the required readiness level move forward.'],
  ['Placement Intelligence', 'Matched students are connected to live roles based on their skills, readiness, and role fit. Placement teams can track applications, interviews, and conversion outcomes across cohorts. Real placement data reveals which skills and training paths drive better outcomes. These insights then feed directly into the next assessment and training cycle.'],
]

function Framework() {
  const [a, setA] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setA((x) => (x + 1) % 5), 4200)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="sec" id="framework">
      <div className="wrap">
        <Head
          tag="Framework"
          title="Measure, align, train, validate, place — then run it again"
          sub="One loop, run every semester. Placement outcomes feed straight back into the next measurement cycle."
        />

        <div className="grid2" style={{ alignItems: 'stretch' }}>
          <div style={{ display: 'grid', gap: 12, gridTemplateRows: 'repeat(5, 1fr)' }}>
            {steps.map(([t], i) => (
              <motion.button
                key={t}
                onClick={() => setA(i)}
                whileHover={{ x: 6 }}
                className="card"
                style={{
                  padding: '14px 20px', minHeight: 72, textAlign: 'left', display: 'flex', gap: 14, alignItems: 'center',
                  borderColor: a === i ? 'var(--blue)' : undefined,
                  background: a === i ? '#fff' : undefined,
                }}
              >
                <span
                  className="n"
                  style={{
                    width: 36, height: 36, minWidth: 36, borderRadius: 11, display: 'grid', placeItems: 'center',
                    fontWeight: 800, fontSize: 14,
                    background: a === i ? 'var(--blue)' : 'var(--sky)',
                    color: a === i ? '#fff' : 'var(--blue)',
                  }}
                >
                  {i + 1}
                </span>
                <b style={{ fontSize: 15, lineHeight: 1.3 }}>{t}</b>
              </motion.button>
            ))}
          </div>

          <div className="card panel" style={{ margin: 0, minHeight: 408, height: '100%', padding: '28px 34px', display: 'flex', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={a}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
                style={{ width: '100%' }}
              >
                <div className="big" style={{ fontSize: 82, lineHeight: 0.85, marginBottom: 10 }}>0{a + 1}</div>
                <span className="eyebrow" style={{ margin: '12px 0' }}>Step 0{a + 1}</span>
                <h3 style={{ fontSize: 28, marginBottom: 12 }}>{steps[a][0]}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.7, maxWidth: 620 }}>{steps[a][1]}</p>
                <motion.div
                  key={'p' + a}
                  style={{ height: 6, width: '45%', borderRadius: 9, background: 'var(--org)', marginTop: 24, originX: 0 }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 4.2, ease: 'linear' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   PROGRAMS
========================================================= */
const programs = {
  'Market Readiness': {
    tag: 'Flagship program 01',
    title: "The institution's placement operating system",
    p: 'Runs across the full cohort from second year onward. Students are mapped to real industry roles, assessed against what those roles require, and given a personalised path to close the distance.',
    list: ['Industry skill mapping', 'Career role identification', 'Adaptive skill assessment', 'Technical readiness', 'Aptitude & analytical thinking', 'Communication readiness', 'Professional behaviour', 'Corporate expectations'],
    out: [['Market Readiness Score', 'Readiness'], ['Employability Index', 'Skills'], ['Personalised roadmap', 'Career']],
  },
  'Interview Readiness': {
    tag: 'Flagship program 02',
    title: 'Prepare. Practise. Perform.',
    p: 'Final-year students run unlimited AI mock interviews scored on content, structure, and delivery, then face human technical and HR rounds before the real one.',
    list: ['AI mock interviews', 'Technical mock interviews', 'HR mock interviews', 'Group discussions', 'Resume builder & score', 'LinkedIn optimisation', 'Communication coaching', 'Confidence score'],
    out: [['Interview Readiness Score', 'Score'], ['After every interview', 'Feedback'], ['Ranked improvements', 'Resume'], ['Role-specific', 'Prep']],
  },
}

function Programs() {
  const [t, setT] = useState('Market Readiness')
  const d = programs[t]
  return (
    <section className="sec" id="programs">
      <div className="wrap">
        <Head
          tag="Programs"
          title="Built around the outcomes that matter."
          sub="Structured programs that turn institutional priorities into measurable student and placement outcomes."
        />
        <div style={{ textAlign: 'center' }}>
          <Tabs id="prog" items={Object.keys(programs)} value={t} onChange={setT} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={t}
            className="card panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
          >
            <div className="grid2" style={{ alignItems: 'start' }}>
              <div>
                <span className="eyebrow" style={{ marginBottom: 16 }}><i />{d.tag}</span>
                <h3>{d.title}</h3>
                <p>{d.p}</p>
                <ul className="chk">{d.list.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                {d.out.map(([a, b], i) => (
                  <motion.div
                    key={a}
                    className="kpi"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <small>{b}</small>
                    <b style={{ fontSize: 22 }}>{a}</b>
                    <span className="up">Measurable impact ↗</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* =========================================================
   INTELLIGENCE
========================================================= */
function Ring({ v }) {
  const r = 70
  const c = 2 * Math.PI * r
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={r} fill="none" stroke="#dbeafe" strokeWidth="14" />
      <motion.circle
        cx="90" cy="90" r={r} fill="none" stroke="url(#g)" strokeWidth="14" strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - v / 100) }}
        transition={{ duration: 1.2, ease }}
        transform="rotate(-90 90 90)"
      />
      <defs>
        <linearGradient id="g"><stop stopColor="#1d4ed8" /><stop offset="1" stopColor="#ff7a1a" /></linearGradient>
      </defs>
      <text x="90" y="100" textAnchor="middle" fontSize="38" fontWeight="800" fill="#0b1f4d">{v}%</text>
    </svg>
  )
}

const intel = {
  'Placement funnel': { t: 'Placement funnel analytics', p: 'Registered → Applied → Interviewed → Selected → Joined. ELCARREIRA shows where the drop-off is happening while there is still time to fix it.', v: 'funnel' },
  'Readiness dashboard': { t: 'Market readiness dashboard', p: 'Institution, department, and student readiness in one view.', v: 'ring' },
  'Skill gaps': { t: 'Skill gap intelligence', p: 'Top institutional skill gaps, ranked by students blocked.', v: 'gaps' },
  'Talent matchmaking': { t: 'AI talent matchmaking', p: 'Students matched to live hiring roles by readiness signal.', v: 'match' },
}

function Visual({ k }) {
  if (k === 'funnel') {
    return (
      <div className="funnel">
        {[['Registered', 100], ['Applied', 84], ['Interviewed', 61], ['Selected', 43], ['Joined', 38]].map(([l, w], i) => (
          <motion.div key={l} initial={{ width: 0 }} animate={{ width: w + '%' }} transition={{ duration: 0.8, delay: i * 0.08, ease }}>
            <span>{l}</span><span>{w}%</span>
          </motion.div>
        ))}
      </div>
    )
  }
  if (k === 'ring') {
    return (
      <div className="ring">
        <Ring v={82} />
        <p style={{ marginTop: 10, fontWeight: 700 }}>Employability Index · Market Ready</p>
      </div>
    )
  }
  if (k === 'gaps') {
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        {[['SQL', 78], ['REST API design', 64], ['System design', 52], ['Communication', 41]].map(([l, w], i) => (
          <div key={l}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
              <span>{l}</span><span>{w} blocked</span>
            </div>
            <div style={{ height: 10, background: '#dbeafe', borderRadius: 9, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', width: w + '%', originX: 0, borderRadius: 9, background: 'linear-gradient(90deg,#1d4ed8,#ff7a1a)' }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: i * 0.08 }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {[['Software Engineer', 94], ['Graduate Engineer Trainee', 88], ['Data Analyst', 81]].map(([l, m], i) => (
        <motion.div
          key={l}
          className="kpi"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <b style={{ fontSize: 16, margin: 0 }}>{l}</b>
          <span className="up" style={{ fontSize: 14 }}>{m}% match</span>
        </motion.div>
      ))}
    </div>
  )
}

function Intelligence() {
  const [t, setT] = useState('Placement funnel')
  const d = intel[t]

  const phases = [
    ['I', 'Platform', 'Placement Intelligence', ['Real-time placement analytics', 'Skill gap identification', 'Market trend insights']],
    ['II', 'Mentor', 'Market-Aligned Learning', ['Hyper-personalised Market Readiness', 'Technical, aptitude & soft skills', 'Industry projects & assessments']],
    ['III', 'Placement', 'Career Outcomes', ['AI talent matchmaking', 'Dedicated placement assistance', 'Recruiter engagement & hiring drives']],
  ]

  return (
    <section className="sec" id="intelligence">
      <div className="wrap">
        <Head
          tag="The differentiator"
          title="The intelligence layer behind placements"
          sub="Data-driven placement strategy, skill intelligence, and employer matchmaking — in one connected system."
        />
        <div style={{ textAlign: 'center' }}>
          <Tabs id="intel" items={Object.keys(intel)} value={t} onChange={setT} />
        </div>

        <div className="card panel">
          <div className="grid2">
            <AnimatePresence mode="wait">
              <motion.div key={t + 'a'} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h3>{d.t}</h3>
                <p>{d.p}</p>
                <a href="#demo" className="btn p" style={{ marginTop: 24 }}>See it live →</a>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div key={t + 'b'} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Visual k={d.v} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 56 }}>
          {phases.map(([n, a, b, l], i) => (
            <Reveal key={a} delay={i * 0.08}>
              <div className="card step hov" style={{ height: '100%' }}>
                <div className="n">{n}</div>
                <h4>{a} — {b}</h4>
                <ul className="chk" style={{ gridTemplateColumns: '1fr' }}>
                  {l.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   ELI
========================================================= */
function ELI() {
  const [show, setShow] = useState(0)
  const ref = useRef(null)
  const seen = useInView(ref, { once: true })

  useEffect(() => {
    if (!seen) return

    const a = setTimeout(() => setShow(1), 600)
    const b = setTimeout(() => setShow(2), 1800)
    const c = setTimeout(() => setShow(3), 3000)

    return () => [a, b, c].forEach(clearTimeout)
  }, [seen])

  return (
    <section className="sec">
      <div className="wrap grid2" ref={ref}>
        <Reveal>
          <span className="eyebrow">
            <i />
            AI companion
          </span>

          <h2 style={{ margin: '18px 0' }}>
            Meet <span className="grad">ELI</span> — your Employability Intelligence Assistant
          </h2>

          <p className="lead">
            Students don't book appointments with a career counsellor at 11pm the night before a drive.
            ELI answers then — grounded in the same market data behind every readiness score.
          </p>

          <div className="chips">
            {[
              'Which skills should I learn?',
              'Am I market-ready?',
              'Review my resume.',
              'Prepare me for interviews.',
              'Which companies match my profile?',
              'Create my career roadmap.',
            ].map((c) => (
              <span key={c} className="chip">{c}</span>
            ))}
          </div>
        </Reveal>

        <div className="card chat" style={{ justifySelf: 'center', width: '100%' }}>
          <div className="who">
            <div className="av">E</div>
            <div>
              <b>ElCarreira Intelligence</b>
              <small>Ready to assist</small>
            </div>
          </div>

          <AnimatePresence>
            {show >= 1 && (
              <motion.div
                key="u"
                className="msg u"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Am I ready for the drive next week?
              </motion.div>
            )}

            {show === 2 && (
              <motion.div
                key="t"
                className="msg a"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      margin: 2,
                      borderRadius: '50%',
                      background: 'var(--blue)',
                    }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            )}

            {show >= 3 && (
              <motion.div
                key="a"
                className="msg a"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Your technical readiness is 74. This role weights SQL and REST API design heavily —
                both sit below your target. Two modules will take about six hours. Want me to schedule
                them before Thursday?
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   STORIES  (c1..c6 company images, testimonial cards)
========================================================= */

function Stories() {
  const companies = [
    'Myntra',
    'Flipkart',
    'Zensar Technologies',
    'Kennametal',
    'Motherson',
    'INDO-MIM'
  ]

  const ananya = {
    n: 'Ananya',
    img: 'ananya',
    r: 'CSE student — placed in Software Engineering',
    t: 'ELCARREIRA helped me understand my skill gaps and prepared me for interviews with confidence.',
  }

  const others = [
    {
      n: 'Rahul',
      img: 'rahul',
      r: 'ECE student — Graduate Engineer Trainee',
      t: 'The Market Readiness Program gave me clarity on what companies actually expect.'
    },
    {
      n: 'Principal',
      img: 'principal',
      r: 'Engineering Institution Partner',
      t: 'The platform gave us visibility into student readiness and helped us plan placements strategically.'
    },
    {
      n: 'Placement Officer',
      img: 'placement',
      r: 'University Partner',
      t: 'We moved from reactive placement drives to a data-driven placement strategy.'
    },
  ]

  return (
    <section className="sec" id="impact">
      <div className="wrap">

        <Head
          tag="Stories & trust"
          title="Trusted by the career ecosystem."
          sub="Institutions, students, and hiring teams use ElCarreira to create a more connected and market-ready talent journey."
        />

        {/* =====================================================
            COMPANY MARQUEE
        ===================================================== */}
        <div className="marq" style={{ marginBottom: 48 }}>
          <div className="track">
            {[...companies, ...companies].map((n, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <Img
                  n={'c' + ((i % companies.length) + 1)}
                  alt={n}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#fff',
                    objectFit: 'contain'
                  }}
                />
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* =====================================================
            TWO CARDS IN ONE ROW
        ===================================================== */}
        <div
          className="stories-two-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 24,
            alignItems: 'stretch'
          }}
        >

          {/* ANANYA */}
          <Reveal>
            <div
              className="card q hov"
              style={{
                padding: 0,
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <Img
                n={ananya.img}
                alt={ananya.n}
                style={{
                  height: 340,
                  objectPosition: 'center top'
                }}
              />

              <div style={{ padding: '32px 36px 36px' }}>
                <p
                  style={{
                    fontSize: 22,
                    lineHeight: 1.55,
                    fontWeight: 600
                  }}
                >
                  “{ananya.t}”
                </p>

                <div className="who">
                  <div className="av">
                    {ananya.n[0]}
                  </div>

                  <div>
                    <b style={{ fontSize: 17 }}>
                      {ananya.n}
                    </b>
                    <small>
                      {ananya.r}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RAHUL */}
          <Reveal delay={0.08}>
            <div
              className="card q hov"
              style={{
                padding: 0,
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <Img
                n={others[0].img}
                alt={others[0].n}
                style={{
                  height: 340,
                  objectPosition: 'center top'
                }}
              />

              <div style={{ padding: '32px 36px 36px' }}>
                <p
                  style={{
                    fontSize: 22,
                    lineHeight: 1.55,
                    fontWeight: 600
                  }}
                >
                  “{others[0].t}”
                </p>

                <div className="who">
                  <div className="av">
                    {others[0].n[0]}
                  </div>

                  <div>
                    <b style={{ fontSize: 17 }}>
                      {others[0].n}
                    </b>
                    <small>
                      {others[0].r}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

        </div>

        {/* =====================================================
            TWO MORE CARDS IN ONE ROW
        ===================================================== */}
        <div
          className="stories-two-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 24,
            marginTop: 24,
            alignItems: 'stretch'
          }}
        >

          {/* PRINCIPAL */}
          <Reveal delay={0.16}>
            <div
              className="card q hov"
              style={{
                padding: 0,
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <Img
                n={others[1].img}
                alt={others[1].n}
                style={{
                  height: 300,
                  objectPosition: 'center top'
                }}
              />

              <div style={{ padding: '28px 32px 32px' }}>
                <p
                  style={{
                    fontSize: 19,
                    lineHeight: 1.55,
                    fontWeight: 600
                  }}
                >
                  “{others[1].t}”
                </p>

                <div className="who">
                  <div className="av">
                    {others[1].n[0]}
                  </div>

                  <div>
                    <b>
                      {others[1].n}
                    </b>
                    <small>
                      {others[1].r}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* PLACEMENT OFFICER */}
          <Reveal delay={0.24}>
            <div
              className="card q hov"
              style={{
                padding: 0,
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <Img
                n={others[2].img}
                alt={others[2].n}
                style={{
                  height: 300,
                  objectPosition: 'center top'
                }}
              />

              <div style={{ padding: '28px 32px 32px' }}>
                <p
                  style={{
                    fontSize: 19,
                    lineHeight: 1.55,
                    fontWeight: 600
                  }}
                >
                  “{others[2].t}”
                </p>

                <div className="who">
                  <div className="av">
                    {others[2].n[0]}
                  </div>

                  <div>
                    <b>
                      {others[2].n}
                    </b>
                    <small>
                      {others[2].r}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

        </div>

        {/* =====================================================
            METRICS
        ===================================================== */}
        <div
          className="grid4"
          style={{
            marginTop: 56
          }}
        >
          {[
            'Employability Index',
            'Market Readiness Score',
            'Skill gap analytics',
            'Interview readiness',
            'Placement conversion ratio',
            'Average CTC growth',
            'Employer confidence score',
            'Department readiness dashboard'
          ].map((m, i) => (
            <Reveal
              key={m}
              delay={(i % 4) * 0.06}
            >
              <div
                className="card"
                style={{
                  padding: 20,
                  fontWeight: 700,
                  fontSize: 14
                }}
              >
                <span style={{ color: 'var(--org)' }}>
                  ↗
                </span>{' '}
                {m}
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}

/* =========================================================
   ABOUT  (mission.jpg / vision.jpg above each statement)
========================================================= */
function About() {
  const cards = [
    ['Mission', 'mission', 'Turning potential into measurable outcomes.', 'To transform every learner into a market-ready professional by empowering institutions with employability intelligence, data-driven insights, and personalised learning pathways that bridge the gap between education and industry.'],
    ['Vision', 'vision', 'A market-ready talent ecosystem.', "To become India’s most trusted Employability Intelligence Platform by building a market-ready talent ecosystem where institutions, students, and industry connect through actionable intelligence, personalised development pathways, and data-driven outcomes that shape the future of employability."],
  ]

  return (
    <section className="sec" id="about">
      <div className="wrap">
        <Head
          tag="About"
          title="Building a stronger connection between institutions, students and employers."
        />
        <div className="grid2" style={{ alignItems: 'stretch' }}>
          {cards.map(([a, img, b, c], i) => (
            <Reveal key={a} delay={i * 0.08}>
              <div className="card panel hov" style={{ margin: 0, height: '100%', padding: 0, overflow: 'hidden' }}>
                <Img n={img} alt={a} style={{ height: 240 }} />
                <div style={{ padding: 34 }}>
                  <span className="eyebrow" style={{ marginBottom: 14 }}>{a}</span>
                  <h3>{b}</h3>
                  <p>{c}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h2 style={{ textAlign: 'center', maxWidth: 860, margin: '72px auto 0' }}>
            “Grades get you to the door. <span className="grad">Skills, competence, and knowledge</span> get you the seat.”
          </h2>
        </Reveal>
      </div>
    </section>
  )
}

/* =========================================================
   DEMO
========================================================= */
function Demo() {
  const [sent, setSent] = useState(false)
  return (
    <section className="sec" id="demo" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <Reveal>
          <div className="cta-box">
            <div>
              <span className="eyebrow"><i />Partner with us</span>
              <h2 style={{ margin: '18px 0' }}>Ready to build a placement-first institution?</h2>
              <p className="lead">
                Don't just conduct placements — build an employability ecosystem. Book a personalised demo and see how ELCARREIRA improves placement outcomes, strengthens employer trust, and creates market-ready graduates.
              </p>
              <ul className="chk" style={{ color: '#fff' }}>
                {['Market Readiness Program', 'Interview Readiness Program', 'AI Placement Intelligence', 'Dedicated placement assistance', 'Employer matchmaking', 'Real-time market insights'].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            {sent ? (
              <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: 56 }}>✅</div>
                  <h3 style={{ fontSize: 26, margin: '12px 0' }}>Thank you!</h3>
                  <p className="lead">We'll reply within one working day.</p>
                </div>
              </motion.div>
            ) : (
              <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
                <input required placeholder="Full name" />
                <select>
                  <option>Placement Officer / T&P Head</option>
                  <option>Principal / Director</option>
                  <option>Vice Chancellor / Registrar</option>
                  <option>Head of Department</option>
                  <option>Recruiter / Corporate HR</option>
                  <option>Other</option>
                </select>
                <input required placeholder="Institution" />
                <input required type="email" placeholder="Work email" />
                <input placeholder="+91" />
                <button className="btn or" type="submit" style={{ justifyContent: 'center' }}>
                  Book a personalised demo →
                </button>
                <small style={{ color: '#c7d6ff', lineHeight: 1.5 }}>
                  🔒 We reply within one working day. Student data is handled under the DPDP Act 2023, and we never contact your students directly.
                </small>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* =========================================================
   FOOTER
========================================================= */
function Footer() {
  return (
    <footer>
      <div className="wrap fl">
        <div>
          <div className="logo"><LogoMark />ELCARREIRA</div>
          <p style={{ marginTop: 10 }}>India's 360° Employability Intelligence Platform. Bengaluru, India.</p>
        </div>
        <div>Career intelligence · Building a more market-ready talent ecosystem.</div>
        <div>© 2026 ELCARREIRA Technologies Pvt Ltd · #BeFutureReady</div>
      </div>
    </footer>
  )
}

/* =========================================================
   APP
========================================================= */
export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Trust />
      <Gap />
      <Framework />
      <Programs />
      <Intelligence />
      <ELI />
      <Stories />
      <About />
      <Demo />
      <Footer />
    </>
  )
}