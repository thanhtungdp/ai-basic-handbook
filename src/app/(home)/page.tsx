'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './home.module.css'

const modules = [
  {
    week: '01',
    title: 'AI Foundation',
    subtitle: 'Quay về nền tảng',
    description: 'Hiểu LLM, prompting có kiểm chứng, structured content và cách biến một việc lặp thành workflow.',
    output: 'Claude Project · Skill · Workflow pack',
    tone: 'orange',
  },
  {
    week: '02',
    title: 'Product Design & Front-End',
    subtitle: 'Biến ý tưởng thành trải nghiệm',
    description: 'Từ problem statement đến UX flow, prototype và một ReactJS front-end responsive.',
    output: 'UX flow · Prototype · ReactJS app',
    tone: 'blue',
  },
  {
    week: '03',
    title: 'Backend, Database & Mobile',
    subtitle: 'Hiểu hệ thống phía sau',
    description: 'Nắm client-server, REST API, .NET, database và kết nối sản phẩm với mobile.',
    output: '.NET API · Database · Mobile app',
    tone: 'green',
  },
  {
    week: '04',
    title: 'Data, ML & DevOps',
    subtitle: 'Đưa sản phẩm vào vận hành',
    description: 'Đọc dữ liệu, hiểu ML ở mức thực dụng, làm việc với Git và tự động hóa CI/CD.',
    output: 'Notebook · GitHub · CI/CD pipeline',
    tone: 'purple',
  },
  {
    week: '05',
    title: 'Integrated Capstone',
    subtitle: 'Ship và bảo vệ sản phẩm',
    description: 'Hoàn thiện business model, pricing, go-to-market, demo công khai và portfolio.',
    output: 'Deployed product · Portfolio · Demo',
    tone: 'dark',
  },
]

const heroStages = [
  { key: 'understand', label: 'understand', copy: 'Hiểu hệ thống', status: 'foundation / verified' },
  { key: 'build', label: 'build', copy: 'Tạo sản phẩm', status: 'prototype / working' },
  { key: 'defend', label: 'defend', copy: 'Bảo vệ lựa chọn', status: 'demo / portfolio' },
]

const journeySteps = [
  {
    number: '01',
    title: 'Ask',
    subtitle: 'Đặt câu hỏi đúng',
    label: 'Problem statement',
    copy: 'Bạn bắt đầu bằng một vấn đề có thật — không phải bằng một tool đang hot.',
    visual: 'problem',
    artifact: '“Làm sao giúp nhóm bán hàng giảm thời gian tạo báo giá?”',
  },
  {
    number: '02',
    title: 'Understand',
    subtitle: 'Hiểu hệ thống',
    label: 'System map',
    copy: 'Bạn nhìn thấy người dùng, dữ liệu, quy trình và những điểm cần kiểm chứng.',
    visual: 'system',
    artifact: 'Input → Process → Decision → Output',
  },
  {
    number: '03',
    title: 'Build',
    subtitle: 'Tạo sản phẩm',
    label: 'Working prototype',
    copy: 'Bạn biến insight thành một sản phẩm có thể chạm, thử và cải thiện.',
    visual: 'build',
    artifact: 'ReactJS · API · Database · AI workflow',
  },
  {
    number: '04',
    title: 'Ship',
    subtitle: 'Đưa vào thực tế',
    label: 'Deployed product',
    copy: 'Bạn đưa sản phẩm ra khỏi laptop để nhận feedback từ người thật.',
    visual: 'ship',
    artifact: 'https://your-product.vercel.app',
  },
  {
    number: '05',
    title: 'Defend',
    subtitle: 'Bảo vệ lựa chọn',
    label: 'Portfolio & demo',
    copy: 'Bạn giải thích được mình đã xây gì, vì sao xây nó và điều gì cần làm tiếp.',
    visual: 'defend',
    artifact: 'README · Demo · Business model · Interview',
  },
]

const teachers = [
  {
    initials: 'TT',
    name: 'Phan Thanh Tung',
    module: 'Module 1 & Module 5',
    focus: 'AI Foundation · Business Model · Capstone & Portfolio',
  },
  {
    initials: 'BT',
    name: 'Brian Truong',
    module: 'Module 2',
    focus: 'Product Design · UX · ReactJS · Front-End',
  },
  {
    initials: 'PP',
    name: 'Pham Hoang Phat',
    module: 'Module 3',
    focus: 'Backend .NET · Database · REST API · Mobile',
  },
  {
    initials: 'DT',
    name: 'Dan Truong',
    module: 'Module 4',
    focus: 'Data · Machine Learning · Git · DevOps · CI/CD',
  },
]

const principles = [
  ['01', 'Manual first', 'Làm thủ công trước để hiểu bản chất. Sau đó mới dùng AI để tăng tốc.', 'hand'],
  ['02', 'Critical questioning', 'Không chỉ nhận output. Học cách hỏi ngược, kiểm tra và bảo vệ quyết định.', 'search'],
  ['03', 'One product', 'Mỗi module bàn giao cho module tiếp theo trên cùng một sản phẩm.', 'nodes'],
  ['04', 'Proof of work', 'Tốt nghiệp bằng sản phẩm đã build, đã deploy và có thể trình bày.', 'check'],
]

function PrincipleIcon({ type }: { type: string }) {
  if (type === 'hand') {
    return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 25V12a2.5 2.5 0 0 1 5 0v10-14a2.5 2.5 0 0 1 5 0v14-12a2.5 2.5 0 0 1 5 0v13-9a2.5 2.5 0 0 1 5 0v14c0 8-5 12-11 12h-3c-5 0-7-3-9-7l-3-6a2.6 2.6 0 0 1 4-3l2 2Z" /><path d="M10 8c-2 2-3 5-3 8M38 8c2 2 3 5 3 8" /></svg>
  }
  if (type === 'search') {
    return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="21" cy="21" r="11" /><path d="m29 29 10 10M21 15v12M15 21h12" /><path className="iconPulseLine" d="M10 39h22" /></svg>
  }
  if (type === 'nodes') {
    return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="9" cy="24" r="4" /><circle cx="39" cy="12" r="4" /><circle cx="39" cy="36" r="4" /><path d="M13 23h10c5 0 6-9 12-10M13 25h10c5 0 6 9 12 10" /><path className="iconFlow" d="M17 24h14" /></svg>
  }
  return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16" /><path d="m15 24 6 6 13-14" /><path className="iconPulseLine" d="M24 3v5M24 40v5" /></svg>
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isVisible)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 },
    )
    root.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return ref
}

function HeroPlayground() {
  const [active, setActive] = useState(0)
  const stage = heroStages[active]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % heroStages.length)
    }, 2100)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className={`${styles.heroOrbit} ${styles.heroPlayground}`} aria-label="AI journey playground">
      <div className={styles.orbitGlow} />
      <div className={styles.orbitRing} />
      <div className={styles.orbitRingSmall} />
      <div className={styles.orbitTrail} />
      <div className={styles.orbitCore} key={stage.key}>
        <span>AI</span>
        <small>{stage.status}</small>
      </div>
      {heroStages.map((item, index) => (
        <button
          type="button"
          className={`${styles.orbitLabel} ${styles[`orbit${item.key}`]} ${active === index ? styles.orbitLabelActive : ''}`}
          key={item.key}
          onClick={() => setActive(index)}
          aria-label={`${item.label}: ${item.copy}`}
        >
          <i />{item.label}
        </button>
      ))}
      <div className={styles.orbitCaption} key={stage.key}>
        <span>NOW EXPLORING</span>
        <b>{stage.copy}</b>
      </div>
    </div>
  )
}

function JourneyPlayground() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const step = journeySteps[active]

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setActive((current) => {
        if (current >= journeySteps.length - 1) {
          setPlaying(false)
          return current
        }
        return current + 1
      })
    }, 2200)
    return () => window.clearInterval(timer)
  }, [playing])

  return (
    <div className={styles.journeyPlayground}>
      <div className={styles.playgroundToolbar}>
        <div>
          <span className={styles.playgroundEyebrow}>PRODUCT JOURNEY / LIVE VIEW</span>
          <strong>Bấm từng bước để xem sản phẩm lớn lên</strong>
        </div>
        <div className={styles.playgroundControls}>
          <button type="button" onClick={() => setPlaying((value) => !value)}>
            {playing ? 'Pause' : 'Play journey'} <span>{playing ? 'Ⅱ' : '▶'}</span>
          </button>
          <button type="button" className={styles.resetButton} onClick={() => { setPlaying(false); setActive(0) }}>
            Reset
          </button>
        </div>
      </div>

      <div className={styles.playgroundBody}>
        <div className={styles.playgroundSteps} role="tablist" aria-label="Các bước trong hành trình">
          {journeySteps.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={active === index}
              className={`${styles.playgroundStep} ${active === index ? styles.playgroundStepActive : ''}`}
              key={item.number}
              onClick={() => { setActive(index); setPlaying(false) }}
            >
              <span>{item.number}</span>
              <b>{item.title}</b>
              <small>{item.subtitle}</small>
            </button>
          ))}
        </div>

        <div className={`${styles.playgroundScreen} ${styles[`visual${step.visual}`]}`}>
          <div className={styles.screenTopbar}><span /><span /><span /><small>kada / {step.title.toLowerCase()}</small></div>
          <div className={styles.screenContent}>
            <div className={styles.screenLabel}>{step.label}</div>
            <div className={styles.screenArtifact}>{step.artifact}</div>
            <div className={styles.screenFakeLines}><i /><i /><i /></div>
            <div className={styles.screenStatus}><span className={styles.statusDot} /> {active === 0 ? 'needs clarity' : active === 1 ? 'mapped' : active === 2 ? 'in progress' : active === 3 ? 'live' : 'ready to defend'}</div>
          </div>
          <div className={styles.screenCorner}>{step.number} / 05</div>
        </div>

        <div className={styles.playgroundCaption} key={step.number}>
          <span className={styles.captionNumber}>{step.number}</span>
          <p>{step.copy}</p>
        </div>
      </div>
      <div className={styles.playgroundProgress}>
        <span style={{ width: `${((active + 1) / journeySteps.length) * 100}%` }} />
      </div>
    </div>
  )
}

export default function HomePage() {
  const revealRoot = useReveal()

  return (
    <main ref={revealRoot} className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />
        <div className={styles.heroFrame}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <span className={styles.liveDot} />
              KADA Vietnam · 5 tuần · 23 ngày học
            </div>
            <h1>
              <span>Đừng bắt đầu bằng <em>công cụ.</em></span>
              <span>Hãy bắt đầu bằng nền tảng.</span>
            </h1>
            <p className={styles.heroLead}>
              Một hành trình được thiết kế để bạn hiểu AI từ gốc, xây được sản phẩm thật,
              và biết vì sao sản phẩm đó đáng được sử dụng.
            </p>
            <div className={styles.heroActions}>
              <Link href="/docs" className={styles.primaryButton}>
                Khám phá hành trình <span>↗</span>
              </Link>
              <a href="#roadmap" className={styles.textButton}>
                Xem roadmap <span>↓</span>
              </a>
            </div>
            <div className={styles.heroMeta}>
              <span><b>40–45</b> học viên / cohort</span>
              <span className={styles.metaDivider} />
              <span><b>01</b> sản phẩm xuyên suốt</span>
              <span className={styles.metaDivider} />
              <span><b>05</b> module liên kết</span>
            </div>
          </div>
          <HeroPlayground />
          <div className={styles.scrollHint}><span /> kéo xuống để bắt đầu</div>
        </div>
      </section>

      <section className={`${styles.statement} ${styles.container}`} data-reveal>
        <div className={styles.sectionKicker}>01 — Tư duy chương trình</div>
        <div className={styles.statementLayout}>
          <h2>AI không thay thế<br /><span>năng lực nền tảng.</span></h2>
          <div className={styles.statementCopy}>
            <p className={styles.largeCopy}>AI chỉ khuếch đại những gì bạn đã hiểu — hoặc khuếch đại sự nhầm lẫn.</p>
            <p>KADA đưa bạn quay lại những câu hỏi căn bản: hệ thống hoạt động thế nào, vấn đề thật sự là gì, dữ liệu có đáng tin không, và output này có thể kiểm chứng không.</p>
            <p>Rồi từ nền tảng đó, bạn học cách dùng AI như một người xây dựng — không phải một người chỉ biết yêu cầu AI làm thay.</p>
          </div>
        </div>
        <div className={styles.handwritten}>back to basics <span>↗</span></div>
      </section>

      <section className={styles.darkStory} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionKickerLight}>02 — Câu chuyện học tập</div>
          <div className={styles.storyHeader}>
            <h2>Từ một câu hỏi<br /><span>đến một sản phẩm.</span></h2>
            <p>Không học từng công cụ rời rạc. Bạn đi qua một roadmap có chủ đích — mỗi bước tạo nền cho bước tiếp theo.</p>
          </div>
          <div className={styles.storyPath}>
            <svg className={styles.pathSvg} viewBox="0 0 1100 240" preserveAspectRatio="none" aria-hidden="true">
              <path className={styles.pathBase} d="M0,185 C150,185 130,50 280,55 S420,210 555,168 S710,28 820,74 S940,208 1100,45" />
              <path className={styles.pathActive} d="M0,185 C150,185 130,50 280,55 S420,210 555,168 S710,28 820,74 S940,208 1100,45" />
            </svg>
            {journeySteps.map((item, index) => (
              <div className={`${styles.pathNode} ${styles[`node${index + 1}`]}`} key={item.number}>
                <span>{item.number}</span><b>{item.title}</b><small>{item.subtitle}</small>
              </div>
            ))}
          </div>
          <JourneyPlayground />
        </div>
      </section>

      <section id="roadmap" className={`${styles.roadmap} ${styles.container}`} data-reveal>
        <div className={styles.sectionKicker}>03 — Roadmap 5 tuần</div>
        <div className={styles.roadmapIntro}>
          <h2>Mỗi tuần một<br /><span>năng lực mới.</span></h2>
          <p>Ý tưởng của bạn không bị bỏ lại ở cuối một buổi workshop. Nó lớn lên từng tuần — từ problem statement đến một sản phẩm có thể demo trước người thật.</p>
        </div>
        <div className={styles.moduleList}>
          {modules.map((module, index) => (
            <article key={module.week} className={`${styles.moduleCard} ${styles[`tone${module.tone}`]}`} data-reveal>
              <div className={styles.moduleWeek}>W{module.week}</div>
              <div className={styles.moduleBody}>
                <div className={styles.moduleSubtitle}>{module.subtitle}</div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <div className={styles.moduleOutput}><span>Output</span>{module.output}</div>
              </div>
              <div className={styles.moduleArrow}>↗</div>
              {index < modules.length - 1 && <div className={styles.connector} />}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.principles} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionKicker}>04 — Cách học</div>
          <div className={styles.principleTop}>
            <h2>Học để <em>làm chủ</em>,<br />không học để chạy theo.</h2>
            <p>AI thay đổi mỗi ngày. Năng lực suy nghĩ, xây dựng và kiểm chứng là thứ ở lại với bạn lâu hơn bất kỳ tool nào.</p>
          </div>
          <div className={styles.principleGrid}>
            {principles.map(([number, title, copy, icon]) => (
              <div className={styles.principleCard} key={number}>
                <div className={styles.principleIcon}><PrincipleIcon type={icon} /></div>
                <span className={styles.principleNumber}>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.teachers} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionKicker}>05 — Đội ngũ giảng viên</div>
          <div className={styles.teachersIntro}>
            <h2>Người dẫn đường<br /><span>cho từng chặng.</span></h2>
            <p>Mỗi module được dẫn dắt bởi người đang làm thật trong lĩnh vực của mình — để kiến thức luôn gắn với cách sản phẩm được xây dựng ngoài đời.</p>
          </div>
          <div className={styles.teacherGrid}>
            {teachers.map((teacher) => (
              <article className={styles.teacherCard} key={teacher.name}>
                <div className={styles.avatarPlaceholder} aria-label={`Avatar placeholder của ${teacher.name}`}>
                  {teacher.initials}
                </div>
                <div className={styles.teacherInfo}>
                  <div className={styles.teacherModule}>{teacher.module}</div>
                  <h3>{teacher.name}</h3>
                  <p>{teacher.focus}</p>
                </div>
                <span className={styles.teacherArrow}>↗</span>
              </article>
            ))}
          </div>
          <div className={styles.avatarNote}>Avatar sẽ được cập nhật sau <span>·</span> circle hiện tại là placeholder</div>
        </div>
      </section>

      <section className={`${styles.finalCta} ${styles.container}`} data-reveal>
        <div className={styles.ctaMark}>KADA</div>
        <div className={styles.ctaContent}>
          <div className={styles.sectionKicker}>06 — Điểm đến</div>
          <h2>Đến cuối hành trình,<br /><span>bạn có gì trong tay?</span></h2>
          <p>Một sản phẩm đã deploy. Một portfolio có thể mở ra cơ hội. Và quan trọng nhất — khả năng giải thích rõ bạn đã xây gì, vì sao bạn xây nó, và AI đã giúp bạn đi xa hơn như thế nào.</p>
          <Link href="/docs" className={styles.primaryButton}>Bắt đầu hành trình <span>↗</span></Link>
        </div>
        <div className={styles.ctaStamp}>BUILD<br />WITH<br />INTENT</div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <span>KADA Vietnam</span>
          <span>Back to basics. Forward with AI.</span>
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  )
}
