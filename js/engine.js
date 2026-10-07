/* Kirani Next Lesson — reusable interaction engine
   Offline, dependency-free, teacher version. */
(function () {
  'use strict';

  const STATE_KEY = 'kirani_next_lesson_phase3_v1';
  const STATE_VERSION = 3;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function escapeHTML(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  function normalizeExpression(value) {
    return String(value ?? '')
      .trim().toLowerCase()
      .replaceAll('×', '*').replaceAll('÷', '/')
      .replaceAll('−', '-').replaceAll('–', '-')
      .replace(/\s+/g, '')
      .replace(/\[/g, '(').replace(/\]/g, ')');
  }

  function numericEqual(a, b, tolerance = 1e-9) {
    if (a === '' || a === null || typeof a === 'undefined') return false;
    const x = Number(String(a).replace(',', '.'));
    const y = Number(b);
    return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) <= tolerance;
  }

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  class StateStore {
    constructor(key = STATE_KEY) {
      this.key = key;
      this.state = this.load();
    }
    defaults() {
      return {
        version: STATE_VERSION,
        currentSection: 'cover',
        activityIndex: { warmup: 0, lesson: 0, transfer: 0 },
        activities: {},
        independentTransferResults: {},
        history: []
      };
    }
    load() {
      try {
        const parsed = JSON.parse(localStorage.getItem(this.key) || 'null');
        if (!parsed || parsed.version !== STATE_VERSION) return this.defaults();
        return Object.assign(this.defaults(), parsed);
      } catch (_) { return this.defaults(); }
    }
    save() {
      try { localStorage.setItem(this.key, JSON.stringify(this.state)); } catch (_) {}
    }
    activity(id) {
      if (!this.state.activities[id]) {
        this.state.activities[id] = {
          completed: false,
          passed: false,
          guidedViewed: false,
          structureCorrect: false,
          calculationCorrect: false,
          hintLevel: 0,
          responses: {},
          attempts: 0,
          choiceSwitches: {},
          lastFeedback: ''
        };
      }
      return this.state.activities[id];
    }
    patchActivity(id, patch) {
      Object.assign(this.activity(id), patch);
      this.save();
      return this.activity(id);
    }
    setResponse(id, key, value) {
      const s = this.activity(id);
      s.responses[key] = clone(value);
      this.save();
    }
    setSection(section) { this.state.currentSection = section; this.save(); }
    setIndex(section, index) { this.state.activityIndex[section] = index; this.save(); }
    recordHistory(entry) {
      this.state.history.push(Object.assign({ at: Date.now() }, entry));
      if (this.state.history.length > 60) this.state.history = this.state.history.slice(-60);
      this.save();
    }
    reset() {
      this.state = this.defaults();
      this.save();
    }
  }

  function feedbackClass(kind) {
    if (kind === 'success') return 'success';
    if (kind === 'partial') return 'partial';
    if (kind === 'warning') return 'warning';
    return '';
  }

  class InteractionEngine {
    constructor(store) {
      this.store = store;
      this.instances = [];
      this.current = null;
      this.mount = null;
      this.feedbackEl = null;
      this.onComplete = null;
    }

    render(activity, mount, feedbackEl, onComplete) {
      this.current = activity;
      this.mount = mount;
      this.feedbackEl = feedbackEl;
      this.onComplete = onComplete || (() => {});
      this.instances = [];
      mount.innerHTML = '';
      feedbackEl.className = 'feedback';
      feedbackEl.textContent = '';

      const state = this.store.activity(activity.id);
      if (activity.type === 'pair') state.guidedViewed = true;
      this.store.save();

      if (activity.intro) {
        const intro = document.createElement('div');
        intro.className = 'engine-intro';
        intro.innerHTML = `<p>${escapeHTML(activity.intro)}</p>`;
        mount.appendChild(intro);
      }

      if (activity.type === 'pair') this.renderPair(activity, mount, state);
      else this.renderInteractive(activity, mount, state, activity.id);

      this.restoreCompletion(activity, state);
    }

    restoreCompletion(activity, state) {
      if (state.completed) {
        this.showFeedback('success', state.lastFeedback || 'Path found. This activity is already complete.');
        this.onComplete(true);
      } else {
        this.onComplete(false);
      }
    }

    renderPair(activity, mount, state) {
      const pair = document.createElement('section');
      pair.className = 'guided-pair';
      pair.dataset.pairId = activity.pairId || activity.id;

      const guide = document.createElement('article');
      guide.className = 'pair-card guide-card';
      guide.innerHTML = this.guidedHTML(activity.guided);

      const reveal = document.createElement('div');
      reveal.className = 'pair-reveal-row';
      reveal.innerHTML = `<button type="button" class="primary-btn show-try-btn">Show Try Yourself →</button><span>Keep the Guided Example open while you try the parallel problem.</span>`;

      const trySlot = document.createElement('div');
      trySlot.className = 'try-slot';

      const attempt = document.createElement('article');
      attempt.className = 'pair-card try-card';
      attempt.innerHTML = `<div class="pair-label try-label">TRY YOURSELF</div><div class="try-mount"></div>`;

      const showTry = () => {
        pair.classList.add('try-visible');
        attempt.hidden = false;
        reveal.hidden = true;
        this.store.setResponse(activity.id, '__tryShown', true);
      };

      const tryWasShown = Boolean(state.responses?.__tryShown || state.completed);
      attempt.hidden = !tryWasShown;
      reveal.hidden = tryWasShown;
      if (tryWasShown) pair.classList.add('try-visible');

      trySlot.append(reveal, attempt);
      pair.append(guide, trySlot);
      mount.appendChild(pair);

      $('.show-try-btn', reveal).addEventListener('click', showTry);
      this.renderInteractive(activity.try, $('.try-mount', attempt), state, activity.id);
    }

    guidedHTML(g) {
      const steps = (g.steps || []).map((s, i) => `<li><span>${i + 1}</span><p>${escapeHTML(s)}</p></li>`).join('');
      const diagram = g.diagram ? this.geometrySVG(g.diagram, true) : '';
      return `
        <div class="pair-label guide-label">GUIDED EXAMPLE</div>
        ${g.title ? `<h3>${escapeHTML(g.title)}</h3>` : ''}
        ${g.story ? `<div class="story-box">${escapeHTML(g.story)}</div>` : ''}
        ${diagram}
        ${g.ask ? `<div class="ask-box"><small>WHAT IS BEING ASKED?</small><strong>${escapeHTML(g.ask)}</strong></div>` : ''}
        ${g.model ? `<div class="model-box"><small>MATHEMATICAL MODEL</small><code>${escapeHTML(g.model)}</code></div>` : ''}
        ${steps ? `<ol class="worked-steps">${steps}</ol>` : ''}
        ${g.answer ? `<div class="guided-answer"><small>FINAL ANSWER</small><strong>${escapeHTML(g.answer)}</strong></div>` : ''}
      `;
    }

    renderInteractive(spec, mount, activityState, activityId) {
      if (spec.heading) {
        const h = document.createElement('div');
        h.className = 'interaction-heading';
        h.innerHTML = `<h3>${escapeHTML(spec.heading)}</h3>${spec.story ? `<div class="story-box">${escapeHTML(spec.story)}</div>` : ''}`;
        mount.appendChild(h);
      } else if (spec.story) {
        const story = document.createElement('div');
        story.className = 'story-box'; story.textContent = spec.story; mount.appendChild(story);
      }

      if (spec.type === 'compound') {
        const compound = document.createElement('div');
        compound.className = 'compound-task';
        mount.appendChild(compound);
        for (const part of spec.parts) {
          const partWrap = document.createElement('section');
          partWrap.className = 'compound-part';
          if (part.label) partWrap.innerHTML = `<p class="part-label">${escapeHTML(part.label)}</p>`;
          compound.appendChild(partWrap);
          this.renderComponent(part, partWrap, activityState, activityId);
        }
        this.addCheckButton(spec, mount, activityId);
      } else {
        this.renderComponent(spec, mount, activityState, activityId);
        if (!['tfMatrix'].includes(spec.type) || spec.manualCheck !== false) this.addCheckButton(spec, mount, activityId);
      }
    }

    renderComponent(spec, mount, activityState, activityId) {
      const type = spec.type;
      if (type === 'numeric') return this.componentNumeric(spec, mount, activityState, activityId);
      if (type === 'expression') return this.componentExpression(spec, mount, activityState, activityId);
      if (type === 'tokenBuilder') return this.componentTokenBuilder(spec, mount, activityState, activityId);
      if (type === 'eventOrder') return this.componentEventOrder(spec, mount, activityState, activityId);
      if (type === 'irrelevant') return this.componentIrrelevant(spec, mount, activityState, activityId);
      if (type === 'tfMatrix') return this.componentTF(spec, mount, activityState, activityId);
      if (type === 'compareModels') return this.componentCompare(spec, mount, activityState, activityId);
      if (type === 'matching') return this.componentMatching(spec, mount, activityState, activityId);
      if (type === 'pattern') return this.componentPattern(spec, mount, activityState, activityId);
      if (type === 'mystery') return this.componentMystery(spec, mount, activityState, activityId);
      if (type === 'geometry') return this.componentGeometry(spec, mount, activityState, activityId);
      throw new Error(`Unknown interaction type: ${type}`);
    }

    bindResponse(activityId, key, initial, getter, evaluate, dimension, root) {
      const inst = { key, get: getter, evaluate, dimension: dimension || 'structure', root };
      this.instances.push(inst);
      if (typeof initial !== 'undefined' && initial !== null) this.store.setResponse(activityId, key, initial);
      return inst;
    }

    noteChoiceSwitch(activityId, key, previous, next) {
      if (previous === null || typeof previous === 'undefined' || previous === next) return;
      const st = this.store.activity(activityId);
      if (!st.choiceSwitches || typeof st.choiceSwitches !== 'object') st.choiceSwitches = {};
      st.choiceSwitches[key] = (st.choiceSwitches[key] || 0) + 1;
      this.store.save();
      // Repeated option cycling should lead back to reasoning, not reveal which option is correct.
      if (st.choiceSwitches[key] >= 3 && st.hintLevel === 0) this.showHint();
    }

    componentNumeric(spec, mount, st, id) {
      const key = spec.key || `numeric_${this.instances.length}`;
      const wrap = document.createElement('div'); wrap.className = 'input-block';
      wrap.innerHTML = `${spec.prompt ? `<label>${escapeHTML(spec.prompt)}</label>` : ''}<div class="input-with-unit"><input inputmode="decimal" autocomplete="off" aria-label="${escapeHTML(spec.prompt || 'Numeric answer')}"><span>${escapeHTML(spec.unit || '')}</span></div>`;
      mount.appendChild(wrap);
      const input = $('input', wrap); input.value = st.responses[key] ?? '';
      input.addEventListener('input', () => this.store.setResponse(id, key, input.value));
      this.bindResponse(id, key, undefined, () => input.value, () => numericEqual(input.value, spec.answer, spec.tolerance), spec.dimension || 'calculation', wrap);
    }

    componentExpression(spec, mount, st, id) {
      const key = spec.key || `expr_${this.instances.length}`;
      const wrap = document.createElement('div'); wrap.className = 'input-block';
      wrap.innerHTML = `${spec.prompt ? `<label>${escapeHTML(spec.prompt)}</label>` : ''}<input class="expression-input" autocomplete="off" spellcheck="false" aria-label="Expression answer" placeholder="Build the expression">`;
      mount.appendChild(wrap);
      const input = $('input', wrap); input.value = st.responses[key] ?? '';
      input.addEventListener('input', () => this.store.setResponse(id, key, input.value));
      const answers = (spec.answers || [spec.answer]).map(normalizeExpression);
      this.bindResponse(id, key, undefined, () => input.value, () => answers.includes(normalizeExpression(input.value)), spec.dimension || 'structure', wrap);
    }

    componentTokenBuilder(spec, mount, st, id) {
      const key = spec.key || `tokens_${this.instances.length}`;
      const wrap = document.createElement('div'); wrap.className = 'token-builder';
      wrap.innerHTML = `${spec.prompt ? `<p class="builder-prompt">${escapeHTML(spec.prompt)}</p>` : ''}<div class="token-output" aria-live="polite"></div><div class="token-palette"></div><button class="mini-btn token-undo" type="button">Undo</button><button class="mini-btn token-clear" type="button">Clear</button>`;
      mount.appendChild(wrap);
      let built = Array.isArray(st.responses[key]) ? st.responses[key].slice() : [];
      const out = $('.token-output', wrap), palette = $('.token-palette', wrap);
      const repaint = () => { out.textContent = built.length ? built.join(' ') : 'Build here…'; this.store.setResponse(id, key, built); };
      for (const token of spec.tokens || []) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'token-btn'; b.textContent = token;
        b.addEventListener('click', () => { built.push(token); repaint(); }); palette.appendChild(b);
      }
      $('.token-undo', wrap).addEventListener('click', () => { built.pop(); repaint(); });
      $('.token-clear', wrap).addEventListener('click', () => { built = []; repaint(); });
      repaint();
      this.bindResponse(id, key, undefined, () => built.slice(), () => normalizeExpression(built.join('')) === normalizeExpression(spec.answer), spec.dimension || 'structure', wrap);
    }

    componentEventOrder(spec, mount, st, id) {
      const key = spec.key || `order_${this.instances.length}`;
      const wrap = document.createElement('div'); wrap.className = 'event-order';
      wrap.innerHTML = `${spec.prompt ? `<p>${escapeHTML(spec.prompt)}</p>` : ''}<div class="event-bank"></div><div class="route-arrow">↓</div><div class="event-route"></div><button class="mini-btn order-reset" type="button">Reset route</button>`;
      mount.appendChild(wrap);
      let route = Array.isArray(st.responses[key]) ? st.responses[key].slice() : [];
      const bank = $('.event-bank', wrap), routeEl = $('.event-route', wrap);
      const render = () => {
        bank.innerHTML = ''; routeEl.innerHTML = '';
        (spec.events || []).forEach((ev, idx) => {
          if (!route.includes(idx)) {
            const b = document.createElement('button'); b.type='button'; b.className='event-chip'; b.textContent=ev;
            b.addEventListener('click', () => { route.push(idx); this.store.setResponse(id, key, route); render(); }); bank.appendChild(b);
          }
        });
        route.forEach((idx, i) => {
          const b = document.createElement('button'); b.type='button'; b.className='route-step'; b.innerHTML=`<span>${i+1}</span>${escapeHTML(spec.events[idx])}`;
          b.addEventListener('click', () => { route.splice(i,1); this.store.setResponse(id, key, route); render(); }); routeEl.appendChild(b);
        });
      };
      $('.order-reset', wrap).addEventListener('click', () => { route=[]; this.store.setResponse(id,key,route); render(); });
      render();
      this.bindResponse(id, key, undefined, () => route.slice(), () => JSON.stringify(route) === JSON.stringify(spec.answer), spec.dimension || 'structure', wrap);
    }

    componentIrrelevant(spec, mount, st, id) {
      const key = spec.key || `irrelevant_${this.instances.length}`;
      const wrap = document.createElement('div'); wrap.className = 'clue-grid';
      if (spec.prompt) wrap.innerHTML = `<p>${escapeHTML(spec.prompt)}</p>`;
      let selected = Number.isInteger(st.responses[key]) ? st.responses[key] : null;
      const repaint = () => $$('.clue-card', wrap).forEach((b, i) => b.classList.toggle('selected', i === selected));
      (spec.clues || []).forEach((clue, i) => {
        const b=document.createElement('button'); b.type='button'; b.className='clue-card'; b.textContent=clue;
        b.addEventListener('click', () => { const prev=selected; selected=i; this.noteChoiceSwitch(id,key,prev,selected); this.store.setResponse(id,key,selected); repaint(); }); wrap.appendChild(b);
      });
      mount.appendChild(wrap); repaint();
      this.bindResponse(id,key,undefined,()=>selected,()=>selected===spec.answer,spec.dimension||'structure',wrap);
    }

    componentTF(spec, mount, st, id) {
      const key = spec.key || `tf_${this.instances.length}`;
      const wrap = document.createElement('div'); wrap.className='tf-matrix';
      if (spec.prompt) wrap.innerHTML=`<p class="matrix-prompt">${escapeHTML(spec.prompt)}</p>`;
      let responses = Array.isArray(st.responses[key]) ? st.responses[key].slice() : Array((spec.statements||[]).length).fill(null);
      const table=document.createElement('div'); table.className='tf-table';
      (spec.statements||[]).forEach((statement,i)=>{
        const row=document.createElement('div'); row.className='tf-row';
        row.innerHTML=`<p><b>${String.fromCharCode(65+i)}.</b> ${escapeHTML(statement)}</p><div class="tf-options"><button type="button" data-v="true">BENAR</button><button type="button" data-v="false">SALAH</button></div>`;
        $$('button',row).forEach(btn=>btn.addEventListener('click',()=>{
          const prev=responses[i]; responses[i]=btn.dataset.v==='true'; this.noteChoiceSwitch(id,`${key}_${i}`,prev,responses[i]); this.store.setResponse(id,key,responses);
          $$('button',row).forEach(x=>x.classList.toggle('selected',(x.dataset.v==='true')===responses[i]));
          this.updateCheckAvailability();
        }));
        table.appendChild(row);
      });
      wrap.appendChild(table); mount.appendChild(wrap);
      $$('.tf-row',wrap).forEach((row,i)=>$$('button',row).forEach(x=>x.classList.toggle('selected',responses[i]!==null && (x.dataset.v==='true')===responses[i])));
      this.bindResponse(id,key,undefined,()=>responses.slice(),()=>responses.every(v=>v!==null) && JSON.stringify(responses)===JSON.stringify(spec.answer),spec.dimension||'structure',wrap);
    }

    componentCompare(spec, mount, st, id) {
      const modelKey = spec.key || `model_${this.instances.length}`;
      const evidenceKey = `${modelKey}_evidence`;
      const wrap=document.createElement('div'); wrap.className='compare-models';
      let selected=st.responses[modelKey] ?? null;
      let evidence=st.responses[evidenceKey] ?? '';
      const modelGrid=document.createElement('div'); modelGrid.className='model-grid';
      (spec.models||[]).forEach((m,i)=>{
        const b=document.createElement('button'); b.type='button'; b.className='model-choice'; b.innerHTML=`<strong>${escapeHTML(m.name)}</strong><code>${escapeHTML(m.expression)}</code>`;
        b.addEventListener('click',()=>{const prev=selected; selected=i; this.noteChoiceSwitch(id,modelKey,prev,selected); this.store.setResponse(id,modelKey,selected); repaint();}); modelGrid.appendChild(b);
      });
      const evidenceWrap=document.createElement('div'); evidenceWrap.className='input-block evidence-block';
      if (spec.evidenceOptions) {
        evidenceWrap.innerHTML=`<label>${escapeHTML(spec.evidencePrompt||'Show evidence')}</label><select><option value="">Choose evidence…</option>${spec.evidenceOptions.map(o=>`<option value="${escapeHTML(o.value)}">${escapeHTML(o.label)}</option>`).join('')}</select>`;
        const select=$('select',evidenceWrap); select.value=evidence; select.addEventListener('change',()=>{const prev=evidence;evidence=select.value;this.noteChoiceSwitch(id,evidenceKey,prev,evidence);this.store.setResponse(id,evidenceKey,evidence);});
      } else {
        evidenceWrap.innerHTML=`<label>${escapeHTML(spec.evidencePrompt||'Correct the model')}</label><input class="expression-input" autocomplete="off">`;
        const input=$('input',evidenceWrap); input.value=evidence; input.addEventListener('input',()=>{evidence=input.value;this.store.setResponse(id,evidenceKey,evidence);});
      }
      wrap.append(modelGrid,evidenceWrap); mount.appendChild(wrap);
      const repaint=()=>$$('.model-choice',wrap).forEach((b,i)=>b.classList.toggle('selected',i===selected)); repaint();
      this.bindResponse(id,modelKey,undefined,()=>selected,()=>selected===spec.answerModel,spec.dimension||'structure',modelGrid);
      this.bindResponse(id,evidenceKey,undefined,()=>evidence,()=>{
        if (spec.evidenceOptions) return (spec.answerEvidence||[]).includes(evidence);
        return (spec.answerEvidence||[]).map(normalizeExpression).includes(normalizeExpression(evidence));
      },spec.dimension||'structure',evidenceWrap);
    }

    componentMatching(spec, mount, st, id) {
      const key=spec.key||`match_${this.instances.length}`;
      const wrap=document.createElement('div'); wrap.className='matching-board';
      if(spec.prompt)wrap.innerHTML=`<p>${escapeHTML(spec.prompt)}</p>`;
      let matches=(st.responses[key]&&typeof st.responses[key]==='object')?Object.assign({},st.responses[key]):{};
      let selectedLeft=null;
      const left=document.createElement('div'), right=document.createElement('div'); left.className='match-column'; right.className='match-column';
      (spec.left||[]).forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.className='match-card';b.dataset.left=i;b.textContent=item;b.addEventListener('click',()=>{selectedLeft=i;repaint();});left.appendChild(b);});
      (spec.right||[]).forEach((item,j)=>{const b=document.createElement('button');b.type='button';b.className='match-card';b.dataset.right=j;b.textContent=item;b.addEventListener('click',()=>{if(selectedLeft===null)return;matches[selectedLeft]=j;this.store.setResponse(id,key,matches);selectedLeft=null;repaint();});right.appendChild(b);});
      const repaint=()=>{
        $$('[data-left]',left).forEach(b=>{const i=Number(b.dataset.left);b.classList.toggle('selected',i===selectedLeft);b.classList.toggle('matched',Object.prototype.hasOwnProperty.call(matches,i));});
        $$('[data-right]',right).forEach(b=>{const j=Number(b.dataset.right);b.classList.toggle('matched',Object.values(matches).includes(j));});
      };
      wrap.append(left,right); mount.appendChild(wrap); repaint();
      this.bindResponse(id,key,undefined,()=>Object.assign({},matches),()=>JSON.stringify(matches)===JSON.stringify(spec.answer),spec.dimension||'structure',wrap);
    }

    componentPattern(spec,mount,st,id){
      const key=spec.key||`pattern_${this.instances.length}`;
      const key2=`${key}_power`;
      const wrap=document.createElement('div');wrap.className='pattern-task';
      wrap.innerHTML=`<div class="pattern-sequence">${(spec.sequence||[]).map(x=>`<span>${escapeHTML(x)}</span>`).join('<i>→</i>')}</div><div class="pattern-inputs"><label>${escapeHTML(spec.prompt||'Missing term')}<input inputmode="numeric"></label>${spec.powerAnswer?`<label>${escapeHTML(spec.powerPrompt||'Write it as a power')}<input class="expression-input"></label>`:''}</div>`;
      mount.appendChild(wrap);
      const inputs=$$('input',wrap); inputs[0].value=st.responses[key]??''; inputs[0].addEventListener('input',()=>this.store.setResponse(id,key,inputs[0].value));
      this.bindResponse(id,key,undefined,()=>inputs[0].value,()=>numericEqual(inputs[0].value,spec.answer),spec.dimension||'calculation',wrap);
      if(spec.powerAnswer){inputs[1].value=st.responses[key2]??'';inputs[1].addEventListener('input',()=>this.store.setResponse(id,key2,inputs[1].value));this.bindResponse(id,key2,undefined,()=>inputs[1].value,()=>normalizeExpression(inputs[1].value)===normalizeExpression(spec.powerAnswer),spec.powerDimension||'structure',wrap);}
    }

    componentMystery(spec,mount,st,id){
      const routeKey=spec.key||`mystery_${this.instances.length}`; const answerKey=`${routeKey}_answer`;
      const wrap=document.createElement('div');wrap.className='mystery-task';
      wrap.innerHTML=`<div class="mystery-equation">${escapeHTML(spec.equation)}</div><p>${escapeHTML(spec.prompt||'Choose the useful undo move, then find the mystery number.')}</p><div class="route-options"></div><div class="input-block"><label>${escapeHTML(spec.answerPrompt||'Mystery number')}<input inputmode="decimal"></label></div>`;
      mount.appendChild(wrap);
      let route=st.responses[routeKey]??null; const routeEl=$('.route-options',wrap);
      (spec.routes||[]).forEach((r,i)=>{const b=document.createElement('button');b.type='button';b.className='route-option';b.textContent=r;b.addEventListener('click',()=>{const prev=route;route=i;this.noteChoiceSwitch(id,routeKey,prev,route);this.store.setResponse(id,routeKey,route);repaint();});routeEl.appendChild(b);});
      const repaint=()=>$$('.route-option',wrap).forEach((b,i)=>b.classList.toggle('selected',i===route));repaint();
      const input=$('input',wrap);input.value=st.responses[answerKey]??'';input.addEventListener('input',()=>this.store.setResponse(id,answerKey,input.value));
      this.bindResponse(id,routeKey,undefined,()=>route,()=>route===spec.answerRoute,spec.routeDimension||'structure',routeEl);
      this.bindResponse(id,answerKey,undefined,()=>input.value,()=>numericEqual(input.value,spec.answer),spec.answerDimension||'calculation',wrap);
    }

    geometrySVG(diagram, staticOnly=false){
      const w=diagram.width||320,h=diagram.height||190;
      const rectX=55, rectY=35, rectW=210, rectH=105;
      const gate=diagram.gate||0;
      const gatePx=gate?Math.min(80,Math.max(28,gate*12)):0;
      const gapStart=rectX+(rectW-gatePx)/2;
      const topLine=gate?`<line x1="${rectX}" y1="${rectY}" x2="${gapStart}" y2="${rectY}"/><line x1="${gapStart+gatePx}" y1="${rectY}" x2="${rectX+rectW}" y2="${rectY}"/>`:`<line x1="${rectX}" y1="${rectY}" x2="${rectX+rectW}" y2="${rectY}"/>`;
      return `<div class="geometry-visual"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHTML(diagram.label||'Rectangle diagram')}"><g class="shape-lines">${topLine}<line x1="${rectX}" y1="${rectY}" x2="${rectX}" y2="${rectY+rectH}"/><line x1="${rectX+rectW}" y1="${rectY}" x2="${rectX+rectW}" y2="${rectY+rectH}"/><line x1="${rectX}" y1="${rectY+rectH}" x2="${rectX+rectW}" y2="${rectY+rectH}"/></g><text x="${rectX+rectW/2}" y="${rectY+rectH+28}" text-anchor="middle">${escapeHTML(diagram.lengthLabel||'length')}</text><text x="${rectX-24}" y="${rectY+rectH/2}" text-anchor="middle" transform="rotate(-90 ${rectX-24} ${rectY+rectH/2})">${escapeHTML(diagram.widthLabel||'width')}</text>${gate?`<text x="${rectX+rectW/2}" y="${rectY-12}" text-anchor="middle">${escapeHTML(diagram.gateLabel||`${gate} m opening`)}</text>`:''}${diagram.shaded?`<rect class="area-shade" x="${rectX+75}" y="${rectY+30}" width="82" height="48" rx="4"/><text x="${rectX+116}" y="${rectY+58}" text-anchor="middle">${escapeHTML(diagram.shadedLabel||'covered')}</text>`:''}</svg><small class="diagram-note">Diagram not to scale</small></div>`;
    }

    componentGeometry(spec,mount,st,id){
      const wrap=document.createElement('div');wrap.className='geometry-task';wrap.innerHTML=this.geometrySVG(spec.diagram||{});mount.appendChild(wrap);
      (spec.fields||[]).forEach(field=>this.componentNumeric({type:'numeric',key:field.key,prompt:field.prompt,unit:field.unit,answer:field.answer,dimension:field.dimension||'calculation'},wrap,st,id));
    }

    addCheckButton(spec,mount,activityId){
      const row=document.createElement('div');row.className='engine-check-row';
      const button=document.createElement('button');button.type='button';button.className='primary-btn engine-check';button.textContent=spec.checkLabel||'Check';
      row.appendChild(button);mount.appendChild(row);button.addEventListener('click',()=>this.check(activityId));
      button.dataset.engineCheck='true';
      this.updateCheckAvailability();
    }

    updateCheckAvailability(){
      const btn=this.mount? $('[data-engine-check="true"]',this.mount):null;
      if(!btn)return;
      // Benar/Salah matrices are intentionally unavailable until every row is answered.
      const tfInstances=this.instances.filter(i=>i.root?.classList?.contains('tf-matrix'));
      if(tfInstances.length){
        const allAnswered=tfInstances.every(inst=>Array.isArray(inst.get()) && inst.get().every(v=>v!==null));
        btn.disabled=!allAnswered;
      }
    }

    check(activityId){
      const st=this.store.activity(activityId); st.attempts += 1;
      const results=this.instances.map(inst=>({inst,ok:Boolean(inst.evaluate()),dimension:inst.dimension}));
      const structural=results.filter(r=>r.dimension==='structure');
      const calculations=results.filter(r=>r.dimension==='calculation');
      const structureCorrect=structural.length?structural.every(r=>r.ok):true;
      const calculationCorrect=calculations.length?calculations.every(r=>r.ok):true;
      const complete=results.length>0 && results.every(r=>r.ok);
      const activity=this.current;
      let feedback=''; let kind='';
      if(complete){kind='success';feedback=activity.success||'Path found. The reasoning and calculation both work.';}
      else if(structureCorrect && !calculationCorrect){kind='partial';feedback='Your strategy works. Check the calculation.';}
      else {kind='warning';feedback=activity.structureFeedback||activity.try?.structureFeedback||'Look back at the reasoning route. Which mathematical structure fits the situation?';}
      this.store.patchActivity(activityId,{structureCorrect,calculationCorrect,completed:complete,passed:false,lastFeedback:feedback});
      this.store.recordHistory({activityId,action:'check',structureCorrect,calculationCorrect,complete});
      this.showFeedback(kind,feedback);
      this.onComplete(complete);
    }

    showHint(){
      if(!this.current)return '';
      const st=this.store.activity(this.current.id);
      const hints=this.current.hints || this.current.try?.hints || [];
      if(!hints.length)return 'No additional hint is attached to this activity.';
      st.hintLevel=Math.min(hints.length,st.hintLevel+1); this.store.save();
      const msg=hints[st.hintLevel-1]; this.showFeedback('partial',msg); return msg;
    }

    showFeedback(kind,message){
      if(!this.feedbackEl)return;
      this.feedbackEl.className=`feedback ${feedbackClass(kind)}`.trim();
      this.feedbackEl.textContent=message;
    }
  }

  window.KiraniEngine = { StateStore, InteractionEngine, normalizeExpression, numericEqual };
})();
