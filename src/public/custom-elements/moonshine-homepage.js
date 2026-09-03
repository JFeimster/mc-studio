class MoonshineHomepage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = { intent: 'FUND' };
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  selectIntent(intent) {
    this.state.intent = intent;
    const copy = {
      FUND: {
        eyebrow: 'CAPITAL',
        title: 'Fund the move.',
        body: 'Working capital, equipment, expansion, real estate, acquisitions and other routes to capital.',
        cta: 'SHOW MY FUNDING OPTIONS',
        routeKey: 'homepage.fund.primary'
      },
      BUILD: {
        eyebrow: 'INFRASTRUCTURE',
        title: 'Strengthen the machine.',
        body: 'Business credit, cash-flow visibility, financial operations and automation built for operators.',
        cta: 'BUILD THE BUSINESS',
        routeKey: 'homepage.build.primary'
      },
      BUY: {
        eyebrow: 'OWNERSHIP',
        title: 'Work the deal.',
        body: 'Acquisition finance, deal economics, fundability, valuation logic and buyer-side operating tools.',
        cta: 'EXPLORE ACQUISITIONS',
        routeKey: 'homepage.buy.primary'
      },
      DISTRIBUTE: {
        eyebrow: 'DISTRIBUTION',
        title: 'Become the funding relationship.',
        body: 'Bring capital access to your market as an agent, partner or agency builder.',
        cta: 'EXPLORE THE AGENCY',
        routeKey: 'homepage.distribute.primary'
      }
    }[intent];

    this.shadowRoot.querySelectorAll('[data-intent]').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.intent === intent ? 'true' : 'false');
    });

    this.shadowRoot.querySelector('#intentEyebrow').textContent = copy.eyebrow;
    this.shadowRoot.querySelector('#intentTitle').textContent = copy.title;
    this.shadowRoot.querySelector('#intentBody').textContent = copy.body;
    const cta = this.shadowRoot.querySelector('#intentPrimary');
    cta.textContent = copy.cta;
    cta.dataset.route = copy.routeKey;

    const sticky = this.shadowRoot.querySelector('#stickyCta');
    sticky.textContent = copy.cta;
    sticky.dataset.route = copy.routeKey;

    this.emit('moonshine-intent', { intent, routeKey: copy.routeKey });
  }

  bindEvents() {
    this.shadowRoot.querySelectorAll('[data-intent]').forEach((button) => {
      button.addEventListener('click', () => this.selectIntent(button.dataset.intent));
    });

    this.shadowRoot.querySelectorAll('[data-route]').forEach((button) => {
      button.addEventListener('click', () => {
        this.emit('moonshine-route', {
          routeKey: button.dataset.route,
          intent: this.state.intent,
          surface: button.dataset.surface || 'homepage'
        });
      });
    });

    this.shadowRoot.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = this.shadowRoot.querySelector(link.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    this.selectIntent(this.state.intent);
  }

  render() {
    this.style.display = 'block';
    this.style.width = '100%';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --ink: #090a0c;
          --carbon: #121419;
          --carbon-2: #191c22;
          --bone: #f3efe4;
          --paper: #fffdf7;
          --signal: #ff5a1f;
          --signal-2: #ffcb45;
          --line: rgba(243,239,228,.18);
          --muted: #a9adb5;
          --shadow: 10px 10px 0 #000;
          display: block;
          width: 100%;
          color: var(--bone);
          font-family: Arial, Helvetica, sans-serif;
          background: var(--ink);
        }

        * { box-sizing: border-box; }
        button, a { font: inherit; }
        button { cursor: pointer; }
        a { color: inherit; text-decoration: none; }
        h1,h2,h3,p { margin-top: 0; }
        .mono { font-family: "Courier New", monospace; letter-spacing: .08em; text-transform: uppercase; }
        .wrap { width: min(1440px, calc(100% - 48px)); margin: 0 auto; }

        .shell {
          background:
            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px),
            var(--ink);
          background-size: 40px 40px;
          overflow: hidden;
        }

        .hero {
          min-height: 90vh;
          padding: 54px 0 40px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--line);
          position: relative;
        }

        .hero:before {
          content: "MC // 01";
          position: absolute;
          top: 18px;
          right: 24px;
          font: 700 12px/1 "Courier New", monospace;
          color: var(--muted);
          letter-spacing: .14em;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(390px, .85fr);
          gap: 48px;
          align-items: center;
        }

        .eyebrow {
          display: inline-flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 22px;
          color: var(--signal-2);
          font: 800 12px/1 "Courier New", monospace;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .eyebrow:before { content: ""; width: 44px; height: 3px; background: var(--signal); }

        h1 {
          max-width: 920px;
          font-size: clamp(58px, 7.2vw, 126px);
          line-height: .86;
          letter-spacing: -.06em;
          margin-bottom: 28px;
          text-transform: uppercase;
          font-weight: 900;
        }

        .hero-copy {
          max-width: 760px;
          color: #d3d4d8;
          font-size: clamp(18px, 1.8vw, 25px);
          line-height: 1.45;
        }

        .hero-copy strong { color: var(--paper); }

        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 30px; }

        .btn {
          border: 2px solid var(--bone);
          padding: 16px 20px;
          min-height: 54px;
          background: transparent;
          color: var(--bone);
          font: 800 13px/1 "Courier New", monospace;
          letter-spacing: .08em;
          text-transform: uppercase;
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease;
        }

        .btn:hover { transform: translate(-4px,-4px); box-shadow: 6px 6px 0 #000; }
        .btn.primary { background: var(--signal); border-color: var(--signal); color: #080808; }
        .btn.light { background: var(--bone); color: var(--ink); }

        .micro {
          margin-top: 24px;
          color: var(--muted);
          font: 700 11px/1.5 "Courier New", monospace;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .command {
          border: 2px solid var(--bone);
          background: var(--carbon);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .command-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 16px 18px;
          border-bottom: 1px solid var(--line);
          color: var(--muted);
          font: 700 11px/1 "Courier New", monospace;
          letter-spacing: .1em;
        }

        .intent-list { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--line); }

        .intent {
          min-height: 108px;
          padding: 18px;
          border: 0;
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: transparent;
          color: var(--bone);
          text-align: left;
          transition: background .18s ease, color .18s ease;
        }

        .intent:nth-child(even) { border-right: 0; }
        .intent:nth-child(n+3) { border-bottom: 0; }
        .intent[aria-pressed="true"] { background: var(--signal-2); color: #0a0a0a; }
        .intent small { display: block; margin-bottom: 22px; font: 700 11px/1 "Courier New", monospace; }
        .intent strong { font-size: 25px; letter-spacing: -.04em; text-transform: uppercase; }

        .intent-detail { padding: 26px; }
        .intent-detail .mono { color: var(--signal-2); font-size: 11px; }
        .intent-detail h3 { margin: 10px 0 10px; font-size: clamp(34px,4vw,60px); line-height: .95; letter-spacing: -.05em; text-transform: uppercase; }
        .intent-detail p { color: #c5c7cc; font-size: 17px; line-height: 1.5; }
        .intent-detail .btn { width: 100%; margin-top: 8px; }

        .ticker {
          border-bottom: 1px solid var(--line);
          overflow: hidden;
          background: var(--signal-2);
          color: #0b0b0b;
        }
        .ticker-track {
          display: flex;
          width: max-content;
          gap: 42px;
          padding: 14px 0;
          animation: ticker 24s linear infinite;
          font: 900 13px/1 "Courier New", monospace;
          letter-spacing: .08em;
        }
        .ticker span:after { content: " / "; color: var(--signal); }
        @keyframes ticker { to { transform: translateX(-50%); } }

        .section { padding: 92px 0; border-bottom: 1px solid var(--line); }
        .section-head { display: grid; grid-template-columns: .45fr 1.55fr; gap: 40px; margin-bottom: 42px; }
        .section-kicker { color: var(--signal-2); font: 800 12px/1.4 "Courier New", monospace; text-transform: uppercase; letter-spacing: .12em; }
        .section h2 { margin: 0; max-width: 1000px; font-size: clamp(48px,6vw,96px); line-height: .9; letter-spacing: -.055em; text-transform: uppercase; }
        .lede { max-width: 760px; color: #c3c5ca; font-size: 20px; line-height: 1.55; }

        .router-grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line); }
        .route-card {
          min-height: 300px;
          padding: 26px;
          border: 0;
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          color: var(--bone);
          background: var(--carbon);
          text-align: left;
          position: relative;
          overflow: hidden;
          transition: background .2s ease, color .2s ease;
        }
        .route-card:nth-child(3n) { border-right: 0; }
        .route-card:nth-child(n+4) { border-bottom: 0; }
        .route-card:hover { background: var(--bone); color: var(--ink); }
        .route-card .num { color: var(--signal); font: 900 13px/1 "Courier New", monospace; }
        .route-card h3 { margin: 48px 0 14px; max-width: 310px; font-size: 35px; line-height: .95; letter-spacing: -.045em; text-transform: uppercase; }
        .route-card p { max-width: 330px; color: inherit; opacity: .72; line-height: 1.5; }
        .route-card .arrow { position: absolute; right: 24px; bottom: 22px; font-size: 34px; }
        .route-card:after {
          content: attr(data-watermark);
          position: absolute;
          right: -18px;
          top: 0;
          font-size: 160px;
          line-height: .8;
          font-weight: 900;
          opacity: .035;
        }

        .flow { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin-top: 44px; }
        .flow-card { background: var(--bone); color: var(--ink); padding: 28px; min-height: 230px; border-top: 10px solid var(--signal); }
        .flow-card .num { font: 900 12px/1 "Courier New", monospace; color: #6f7278; }
        .flow-card h3 { margin: 32px 0 12px; font-size: 30px; line-height: 1; text-transform: uppercase; letter-spacing: -.04em; }
        .flow-card p { color: #4f535a; line-height: 1.5; }

        .tool-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 16px; }
        .tool { border: 1px solid var(--line); padding: 30px; min-height: 280px; background: #0e1014; position: relative; }
        .tool:first-child { min-height: 420px; grid-row: span 2; background: var(--signal); color: #080808; }
        .tool h3 { margin: 64px 0 14px; font-size: clamp(32px,3vw,54px); line-height: .94; text-transform: uppercase; letter-spacing: -.045em; }
        .tool p { line-height: 1.5; opacity: .75; }
        .tool .btn { position: absolute; left: 30px; bottom: 28px; }
        .tool:first-child .btn { border-color: #080808; color: #080808; }

        .agency {
          background: var(--bone);
          color: var(--ink);
          padding: 108px 0;
          border-bottom: 12px solid var(--signal);
        }
        .agency-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 64px; align-items: end; }
        .agency h2 { margin: 10px 0 24px; font-size: clamp(60px,7vw,118px); line-height: .84; letter-spacing: -.065em; text-transform: uppercase; }
        .agency-copy { max-width: 700px; font-size: 21px; line-height: 1.55; color: #33363b; }
        .quote-card { background: var(--ink); color: var(--bone); padding: 32px; box-shadow: 10px 10px 0 var(--signal); }
        .quote-card .bad { color: #858992; text-decoration: line-through; }
        .quote-card .good { margin-top: 18px; font-size: 36px; line-height: 1; letter-spacing: -.04em; text-transform: uppercase; font-weight: 900; }

        .manifesto { padding: 120px 0; text-align: center; }
        .manifesto .stack { font-size: clamp(64px,9vw,150px); line-height: .82; letter-spacing: -.07em; text-transform: uppercase; font-weight: 900; }
        .manifesto .stack span { display: block; }
        .manifesto .stack span:nth-child(2) { color: var(--signal); }
        .manifesto .stack span:nth-child(3) { color: var(--signal-2); }
        .manifesto p { max-width: 800px; margin: 34px auto 0; color: #b9bcc3; font-size: 20px; line-height: 1.6; }

        .final { padding: 90px 0 130px; background: var(--carbon); }
        .final h2 { font-size: clamp(54px,7vw,112px); line-height: .88; text-transform: uppercase; letter-spacing: -.06em; }
        .door-grid { display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid var(--line); margin-top: 42px; }
        .door { min-height: 280px; border: 0; border-right: 1px solid var(--line); background: transparent; color: var(--bone); padding: 24px; text-align: left; transition: background .18s ease, color .18s ease; }
        .door:last-child { border-right: 0; }
        .door:hover { background: var(--signal-2); color: #090909; }
        .door .mono { color: var(--signal); font-size: 11px; }
        .door h3 { margin: 62px 0 10px; font-size: 29px; line-height: .98; text-transform: uppercase; }
        .door strong { display: block; margin-top: 38px; font: 800 12px/1 "Courier New", monospace; }

        .sticky {
          position: fixed;
          z-index: 20;
          right: 18px;
          bottom: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--signal);
          color: #080808;
          border: 2px solid #080808;
          box-shadow: 6px 6px 0 #000;
          padding: 13px 15px;
          font: 900 11px/1 "Courier New", monospace;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        @media (max-width: 980px) {
          .wrap { width: min(100% - 30px, 900px); }
          .hero { min-height: auto; padding-top: 70px; }
          .hero-grid, .agency-grid { grid-template-columns: 1fr; }
          .command { max-width: 680px; }
          .section-head { grid-template-columns: 1fr; gap: 18px; }
          .router-grid { grid-template-columns: 1fr 1fr; }
          .route-card:nth-child(3n) { border-right: 1px solid var(--line); }
          .route-card:nth-child(even) { border-right: 0; }
          .route-card:nth-child(n+4) { border-bottom: 1px solid var(--line); }
          .route-card:nth-child(n+5) { border-bottom: 0; }
          .flow { grid-template-columns: 1fr; }
          .tool-grid { grid-template-columns: 1fr 1fr; }
          .tool:first-child { grid-column: span 2; grid-row: auto; }
          .door-grid { grid-template-columns: 1fr 1fr; }
          .door:nth-child(2) { border-right: 0; }
          .door:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
        }

        @media (max-width: 640px) {
          .wrap { width: min(100% - 24px, 600px); }
          .hero { padding: 46px 0 24px; }
          .hero-grid { gap: 30px; }
          h1 { font-size: clamp(48px,15vw,76px); }
          .hero-copy { font-size: 17px; }
          .hero-actions .btn { width: 100%; }
          .intent-list { grid-template-columns: 1fr; }
          .intent, .intent:nth-child(even), .intent:nth-child(n+3) { border-right: 0; border-bottom: 1px solid var(--line); min-height: 78px; }
          .intent:last-child { border-bottom: 0; }
          .intent small { margin-bottom: 10px; }
          .intent strong { font-size: 22px; }
          .section { padding: 68px 0; }
          .section h2 { font-size: clamp(44px,14vw,70px); }
          .router-grid, .tool-grid, .door-grid { grid-template-columns: 1fr; }
          .route-card, .route-card:nth-child(3n), .route-card:nth-child(even), .route-card:nth-child(n+4), .route-card:nth-child(n+5) { border-right: 0; border-bottom: 1px solid var(--line); min-height: 250px; }
          .route-card:last-child { border-bottom: 0; }
          .tool:first-child { grid-column: auto; min-height: 360px; }
          .door, .door:nth-child(2), .door:nth-child(-n+2) { border-right: 0; border-bottom: 1px solid var(--line); min-height: 220px; }
          .door:last-child { border-bottom: 0; }
          .agency { padding: 76px 0; }
          .agency h2 { font-size: clamp(54px,16vw,82px); }
          .manifesto { padding: 86px 0; }
          .sticky { left: 12px; right: 12px; bottom: 12px; justify-content: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *:before, *:after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
        }
      </style>

      <main class="shell">
        <section class="hero" id="start">
          <div class="wrap hero-grid">
            <div>
              <div class="eyebrow">Capital for people actually building something</div>
              <h1>Stop letting capital be the thing that stops you.</h1>
              <p class="hero-copy">You built the business. You found the opportunity. You survived the part nobody puts on LinkedIn. <strong>Now let’s figure out the money.</strong></p>
              <div class="hero-actions">
                <button class="btn primary" data-route="homepage.fund.primary" data-surface="hero">Find my funding</button>
                <a class="btn" href="#router">Explore your options ↓</a>
              </div>
              <div class="micro">Business funding · acquisitions · real estate · credit · financial operations</div>
            </div>

            <aside class="command" aria-label="Choose what you are trying to accomplish">
              <div class="command-head"><span>WHAT ARE YOU TRYING TO DO?</span><span>SELECT_01</span></div>
              <div class="intent-list">
                <button class="intent" data-intent="FUND" aria-pressed="true"><small>01 / CAPITAL</small><strong>Fund it</strong></button>
                <button class="intent" data-intent="BUILD" aria-pressed="false"><small>02 / INFRA</small><strong>Build it</strong></button>
                <button class="intent" data-intent="BUY" aria-pressed="false"><small>03 / OWNERSHIP</small><strong>Buy it</strong></button>
                <button class="intent" data-intent="DISTRIBUTE" aria-pressed="false"><small>04 / DISTRIBUTION</small><strong>Offer it</strong></button>
              </div>
              <div class="intent-detail">
                <div class="mono" id="intentEyebrow">CAPITAL</div>
                <h3 id="intentTitle">Fund the move.</h3>
                <p id="intentBody">Working capital, equipment, expansion, real estate, acquisitions and other routes to capital.</p>
                <button class="btn light" id="intentPrimary" data-route="homepage.fund.primary" data-surface="hero-command">Show my funding options</button>
              </div>
            </aside>
          </div>
        </section>

        <div class="ticker" aria-hidden="true">
          <div class="ticker-track">
            <span>THE BANK IS ONE OPTION</span><span>WE BUILT THE REST OF THE MAP</span><span>COMPARE BEFORE YOU COMMIT</span><span>BUILD OPTIONS BEFORE YOU NEED THEM</span><span>OWN THE RELATIONSHIP</span>
            <span>THE BANK IS ONE OPTION</span><span>WE BUILT THE REST OF THE MAP</span><span>COMPARE BEFORE YOU COMMIT</span><span>BUILD OPTIONS BEFORE YOU NEED THEM</span><span>OWN THE RELATIONSHIP</span>
          </div>
        </div>

        <section class="section" id="router">
          <div class="wrap">
            <div class="section-head">
              <div class="section-kicker">MC // ROUTER_02<br>START WITH THE OUTCOME</div>
              <div>
                <h2>You don’t need another product menu.</h2>
                <p class="lede">You need the right next move. Start with what you are actually trying to accomplish and route from there.</p>
              </div>
            </div>

            <div class="router-grid">
              <button class="route-card" data-route="homepage.fund.business" data-surface="router" data-watermark="01"><span class="num">01 / CAPITAL</span><h3>I need money for my business</h3><p>Working capital, expansion, inventory, payroll, equipment and unexpected opportunities.</p><span class="arrow">↗</span></button>
              <button class="route-card" data-route="homepage.buy.business" data-surface="router" data-watermark="02"><span class="num">02 / OWNERSHIP</span><h3>I’m buying a business</h3><p>Acquisition financing, deal economics, buyer readiness and capital-stack strategy.</p><span class="arrow">↗</span></button>
              <button class="route-card" data-route="homepage.fund.realestate" data-surface="router" data-watermark="03"><span class="num">03 / PROPERTY</span><h3>I’m investing in real estate</h3><p>Bridge, fix-and-flip, commercial, construction and investment-property capital.</p><span class="arrow">↗</span></button>
              <button class="route-card" data-route="homepage.build.credit" data-surface="router" data-watermark="04"><span class="num">04 / CREDIT</span><h3>I want to build business credit</h3><p>Build a stronger company financial profile instead of depending forever on the owner.</p><span class="arrow">↗</span></button>
              <button class="route-card" data-route="homepage.build.finops" data-surface="router" data-watermark="05"><span class="num">05 / FINOPS</span><h3>My finances are a mess</h3><p>Better visibility, better cash-flow decisions and less spreadsheet archaeology.</p><span class="arrow">↗</span></button>
              <button class="route-card" data-route="homepage.distribute.primary" data-surface="router" data-watermark="06"><span class="num">06 / AGENCY</span><h3>I want to offer funding</h3><p>Turn capital access into a capability — or build a business around becoming the funding relationship.</p><span class="arrow">↗</span></button>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="wrap">
            <div class="section-head">
              <div class="section-kicker">MC // CAPITAL_03<br>THE FUNDING SIDE</div>
              <div>
                <h2>Capital shopping should not feel like speed dating with twenty lenders.</h2>
                <p class="lede">Different businesses qualify for different products for different reasons. Start with the situation. Find the fit. Then make the call.</p>
              </div>
            </div>
            <div class="flow">
              <article class="flow-card"><span class="num">STEP 01</span><h3>Tell us the situation</h3><p>What does the business need, how much, how quickly, and what does the financial profile actually look like?</p></article>
              <article class="flow-card"><span class="num">STEP 02</span><h3>Find the fit</h3><p>Compare realistic routes based on the business — not whichever product happens to have the prettiest landing page.</p></article>
              <article class="flow-card"><span class="num">STEP 03</span><h3>Make the call</h3><p>Understand the economics. Choose what makes sense. Or don’t. Capital is a tool; bad capital is expensive.</p></article>
            </div>
          </div>
        </section>

        <section class="section" id="tools">
          <div class="wrap">
            <div class="section-head">
              <div class="section-kicker">MC // BLACK_LAB_04<br>TOOLS, NOT BROCHURES</div>
              <div>
                <h2>Don’t just read about money. Do something.</h2>
                <p class="lede">Run the numbers. Pressure-test the deal. Figure out what matters before somebody turns your uncertainty into a sales funnel.</p>
              </div>
            </div>
            <div class="tool-grid">
              <article class="tool"><div class="mono">FEATURED / READINESS</div><h3>How fundable does the business actually look?</h3><p>Turn the funding conversation into a diagnostic instead of a guessing contest.</p><button class="btn" data-route="homepage.tools.readiness" data-surface="tools">Check readiness</button></article>
              <article class="tool"><div class="mono">ACQUISITION</div><h3>Deal reality check</h3><p>Pressure-test the economics before romance turns into due diligence.</p><button class="btn" data-route="homepage.tools.deal" data-surface="tools">Run the deal</button></article>
              <article class="tool"><div class="mono">CREDIT</div><h3>Business credit</h3><p>Find the gaps between today’s financial profile and a stronger one.</p><button class="btn" data-route="homepage.tools.credit" data-surface="tools">Build the profile</button></article>
              <article class="tool"><div class="mono">CASH FLOW</div><h3>Find the squeeze</h3><p>See where the pressure begins before the checking account announces it.</p><button class="btn" data-route="homepage.tools.cashflow" data-surface="tools">Stress test it</button></article>
              <article class="tool"><div class="mono">FULL LAB</div><h3>Calculators. AI copilots. Playbooks.</h3><p>A growing operating toolkit for funding, acquisitions, credit and finance.</p><button class="btn" data-route="homepage.tools.all" data-surface="tools">Explore all tools</button></article>
            </div>
          </div>
        </section>

        <section class="agency">
          <div class="wrap agency-grid">
            <div>
              <div class="mono">THE DISTRIBUTION SIDE // 05</div>
              <h2>What if you were the person businesses called when they needed capital?</h2>
              <p class="agency-copy">Business owners already ask, “Do you know somebody who can help me get funded?” Most people answer, “Maybe. Let me find a guy.” There is a better answer.</p>
              <button class="btn primary" data-route="homepage.distribute.primary" data-surface="agency">Explore the funding agency</button>
            </div>
            <div class="quote-card">
              <div class="mono">DEFAULT ANSWER</div>
              <p class="bad">“Maybe. Let me find a guy.”</p>
              <div class="mono">BETTER ANSWER</div>
              <div class="good">“Yeah. Me.”</div>
            </div>
          </div>
        </section>

        <section class="manifesto">
          <div class="wrap">
            <div class="stack"><span>More options.</span><span>Better questions.</span><span>Fewer gatekeepers.</span></div>
            <p>Moonshine Capital sits at the intersection of capital, intelligence, infrastructure and distribution — built for operators who would rather move than wait for permission.</p>
          </div>
        </section>

        <section class="final">
          <div class="wrap">
            <div class="section-kicker">YOUR MOVE // 06</div>
            <h2>What are you trying to build?</h2>
            <div class="door-grid">
              <button class="door" data-route="homepage.fund.primary" data-surface="final"><span class="mono">NEED CAPITAL?</span><h3>Find a funding path.</h3><strong>GET FUNDED →</strong></button>
              <button class="door" data-route="homepage.build.primary" data-surface="final"><span class="mono">BUILDING THE COMPANY?</span><h3>Strengthen the financial machine.</h3><strong>EXPLORE SOLUTIONS →</strong></button>
              <button class="door" data-route="homepage.buy.primary" data-surface="final"><span class="mono">BUYING A BUSINESS?</span><h3>Work the deal.</h3><strong>EXPLORE ACQUISITIONS →</strong></button>
              <button class="door" data-route="homepage.distribute.primary" data-surface="final"><span class="mono">WANT TO BE THE PLUG?</span><h3>Build a funding agency.</h3><strong>EXPLORE THE AGENCY →</strong></button>
            </div>
          </div>
        </section>

        <button class="sticky" id="stickyCta" data-route="homepage.fund.primary" data-surface="sticky">SHOW MY FUNDING OPTIONS</button>
      </main>
    `;
  }
}

if (!customElements.get('moonshine-homepage')) {
  customElements.define('moonshine-homepage', MoonshineHomepage);
}
