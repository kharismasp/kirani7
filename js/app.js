/* Kirani Next Lesson — complete lesson controller (Phase 3 content) */
(function(){
  'use strict';
  const data = window.KIRANI_LESSON_DATA;
  const {StateStore, InteractionEngine} = window.KiraniEngine;
  const store = new StateStore();
  const engine = new InteractionEngine(store);

  const sections = ['cover','warmup','zoomBreak','lesson','transfer','finish'];
  const activitySections = ['warmup','lesson','transfer'];
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));

  const refs = {
    back: $('#backBtn'), pass: $('#teacherPass'), jump: $('#teacherJump'), home: $('#homeBtn'), progress: $('#progressFill'), dots: $('#progressDots'),
    start: $('#startLesson'), breakContinue: $('#breakContinue'),
    warmContent: $('#warmContent'), warmFeedback: $('#warmFeedback'), warmCounter: $('#warmCounter'), warmTag: $('#warmTag'), warmHint: $('#warmHint'), warmNext: $('#warmNext'),
    lessonContent: $('#lessonContent'), lessonFeedback: $('#lessonFeedback'), lessonCounter: $('#lessonCounter'), lessonTag: $('#lessonTag'), lessonHint: $('#lessonHint'), lessonNext: $('#lessonNext'), lessonTabs: $('#lessonTabs'),
    transferContent: $('#transferContent'), transferFeedback: $('#transferFeedback'), transferCounter: $('#transferCounter'), transferTag: $('#transferTag'), transferHint: $('#transferHint'), transferNext: $('#transferNext'), transferNav: $('#transferNavigator'),
    finishSummary: $('#finishSummary'), finishMenu: $('#finishMenu'), restart: $('#restartSession'), toast: $('#toast'),
    jumpModal: $('#teacherJumpModal'), jumpClose: $('#teacherJumpClose'), jumpList: $('#teacherJumpList')
  };

  function list(section){ return data.sections[section] || []; }
  function currentIndex(section){ return Math.max(0, Math.min((store.state.activityIndex[section]||0), Math.max(0,list(section).length-1))); }
  function currentActivity(section){ return list(section)[currentIndex(section)] || null; }

  function toast(message){ refs.toast.textContent=message; refs.toast.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>refs.toast.classList.remove('show'),1800); }

  function setScene(section){
    store.setSection(section);
    $$('.scene').forEach(el=>el.classList.toggle('active',el.id===section));
    refs.pass.style.visibility = activitySections.includes(section) ? 'visible' : 'hidden';
    refs.back.disabled = section==='cover';
    updateProgress();
    if(section==='warmup') renderActivitySection('warmup');
    if(section==='lesson') renderActivitySection('lesson');
    if(section==='transfer') renderActivitySection('transfer');
    if(section==='finish') renderFinish();
    window.scrollTo({top:0,behavior:'instant'});
  }

  function updateProgress(){
    const section=store.state.currentSection;
    const sectionIndex=sections.indexOf(section);
    let fraction=sectionIndex/(sections.length-1);
    if(activitySections.includes(section)){
      const arr=list(section); const idx=currentIndex(section); const base=sectionIndex/(sections.length-1); const next=(sectionIndex+1)/(sections.length-1);
      fraction=base+(next-base)*((idx+0.25)/Math.max(1,arr.length));
    }
    refs.progress.style.width=`${Math.max(0,Math.min(100,fraction*100))}%`;
    refs.dots.innerHTML='';
    ['Warm','Zoom','Lesson','Transfer','Finish'].forEach((_,i)=>{const d=document.createElement('i');d.classList.toggle('done',fraction>=((i+1)/5)-0.02);refs.dots.appendChild(d);});
  }

  function renderActivitySection(section){
    const arr=list(section); const idx=currentIndex(section); const activity=arr[idx]; if(!activity)return;
    store.setIndex(section,idx);
    const config = section==='warmup' ? {
      content:refs.warmContent,feedback:refs.warmFeedback,counter:refs.warmCounter,tag:refs.warmTag,hint:refs.warmHint,next:refs.warmNext
    } : section==='lesson' ? {
      content:refs.lessonContent,feedback:refs.lessonFeedback,counter:refs.lessonCounter,tag:refs.lessonTag,hint:refs.lessonHint,next:refs.lessonNext
    } : {
      content:refs.transferContent,feedback:refs.transferFeedback,counter:refs.transferCounter,tag:refs.transferTag,hint:refs.transferHint,next:refs.transferNext
    };
    config.counter.textContent=`${idx+1} / ${arr.length}`; config.tag.textContent=activity.tag||'ACTIVITY'; config.next.disabled=true;
    config.next.textContent = idx===arr.length-1 ? (section==='warmup'?'Back to Zoom':section==='lesson'?'Independent Transfer':'Finish') : 'Next';
    engine.render(activity,config.content,config.feedback,(complete)=>{
      config.next.disabled=!complete;
      if(section==='transfer'){
        const ast=store.activity(activity.id);
        store.state.independentTransferResults[activity.id]={structureCorrect:ast.structureCorrect,calculationCorrect:ast.calculationCorrect,completed:ast.completed,passed:ast.passed};
        store.save();
        updateTransferNavigator();
      }
    });
    config.hint.onclick=()=>engine.showHint();
    config.next.onclick=()=>advance(section);
    if(section==='lesson') updateLessonTabs();
    if(section==='transfer') updateTransferNavigator();
    updateProgress();
  }

  function advance(section){
    const arr=list(section); const idx=currentIndex(section);
    if(idx < arr.length-1){store.setIndex(section,idx+1);renderActivitySection(section);return;}
    if(section==='warmup') setScene('zoomBreak');
    else if(section==='lesson') setScene('transfer');
    else if(section==='transfer') setScene('finish');
  }

  function passCurrent(){
    const section=store.state.currentSection; if(!activitySections.includes(section))return;
    const a=currentActivity(section); if(!a)return;
    store.patchActivity(a.id,{passed:true,completed:false,lastFeedback:'Passed by teacher — no mastery awarded.'});
    if(section==='transfer'){
      const ast=store.activity(a.id);
      store.state.independentTransferResults[a.id]={structureCorrect:ast.structureCorrect,calculationCorrect:ast.calculationCorrect,completed:false,passed:true};
      store.save();
    }
    store.recordHistory({activityId:a.id,action:'pass'}); toast('Passed — no mastery awarded.'); advance(section);
  }

  function goBack(){
    const section=store.state.currentSection;
    if(section==='cover')return;
    if(section==='zoomBreak'){store.setIndex('warmup',Math.max(0,list('warmup').length-1));setScene('warmup');return;}
    if(section==='finish'){store.setIndex('transfer',Math.max(0,list('transfer').length-1));setScene('transfer');return;}
    if(activitySections.includes(section)){
      const idx=currentIndex(section);
      if(idx>0){store.setIndex(section,idx-1);renderActivitySection(section);return;}
      if(section==='warmup')setScene('cover');
      if(section==='lesson')setScene('zoomBreak');
      if(section==='transfer'){store.setIndex('lesson',Math.max(0,list('lesson').length-1));setScene('lesson');}
    }
  }

  function updateLessonTabs(){
    const arr=list('lesson'), idx=currentIndex('lesson'); const active=arr[idx];
    const tabs=[];
    arr.forEach((a,i)=>{if(!tabs.some(t=>t.label===a.tab))tabs.push({label:a.tab||'Lesson',index:i});});
    refs.lessonTabs.innerHTML='';
    tabs.forEach(t=>{const b=document.createElement('button');b.type='button';b.textContent=t.label;b.classList.toggle('active',active.tab===t.label);b.addEventListener('click',()=>{store.setIndex('lesson',t.index);renderActivitySection('lesson');});refs.lessonTabs.appendChild(b);});
  }

  function updateTransferNavigator(){
    refs.transferNav.innerHTML='';
    list('transfer').forEach((a,i)=>{const st=store.activity(a.id);const b=document.createElement('button');b.type='button';b.textContent=String(i+1);b.classList.toggle('active',i===currentIndex('transfer'));b.classList.toggle('done',st.completed);b.classList.toggle('passed',st.passed);b.addEventListener('click',()=>{store.setIndex('transfer',i);renderActivitySection('transfer');});refs.transferNav.appendChild(b);});
  }

  function jumpGroup(title, section, activities){
    const wrap=document.createElement('section'); wrap.className='jump-group';
    const h=document.createElement('h3'); h.textContent=title; wrap.appendChild(h);
    const grid=document.createElement('div'); grid.className='jump-problem-grid';
    activities.forEach(({a,i})=>{
      const st=store.activity(a.id);
      const b=document.createElement('button'); b.type='button'; b.className='jump-problem';
      if(st.completed)b.classList.add('done'); if(st.passed)b.classList.add('passed');
      b.innerHTML=`<strong>${a.id}</strong><span>${a.title||a.tag||'Activity'}</span>`;
      b.addEventListener('click',()=>{store.setIndex(section,i);closeTeacherJump();setScene(section);});
      grid.appendChild(b);
    });
    wrap.appendChild(grid); return wrap;
  }

  function buildTeacherJump(){
    refs.jumpList.innerHTML='';
    refs.jumpList.appendChild(jumpGroup('Warming Up','warmup',list('warmup').map((a,i)=>({a,i}))));
    const lesson=list('lesson');
    const lessonTabs=[];
    lesson.forEach((a,i)=>{
      const label=a.tab||'Lesson with Miss';
      let group=lessonTabs.find(g=>g.label===label);
      if(!group){group={label,items:[]};lessonTabs.push(group);}
      group.items.push({a,i});
    });
    lessonTabs.forEach(g=>refs.jumpList.appendChild(jumpGroup(g.label,'lesson',g.items)));
    refs.jumpList.appendChild(jumpGroup('Independent Transfer','transfer',list('transfer').map((a,i)=>({a,i}))));
  }

  function openTeacherJump(){
    buildTeacherJump(); refs.jumpModal.hidden=false; document.body.classList.add('jump-open');
    const first=$('.jump-problem',refs.jumpModal); if(first)first.focus();
  }
  function closeTeacherJump(){ refs.jumpModal.hidden=true; document.body.classList.remove('jump-open'); refs.jump.focus(); }

  function renderFinish(){
    const all=activitySections.flatMap(s=>list(s));
    const completed=all.filter(a=>store.activity(a.id).completed).length;
    const passed=all.filter(a=>store.activity(a.id).passed).length;
    const structure=all.filter(a=>store.activity(a.id).structureCorrect).length;
    const calculation=all.filter(a=>store.activity(a.id).calculationCorrect).length;
    refs.finishSummary.innerHTML=`
      <div><strong>${completed}</strong><span>activities complete</span></div>
      <div><strong>${passed}</strong><span>teacher-passed (not mastery)</span></div>
      <div><strong>${structure}</strong><span>structure checks preserved</span></div>
      <div><strong>${calculation}</strong><span>calculation checks preserved</span></div>`;
  }

  refs.start.addEventListener('click',()=>setScene('warmup'));
  refs.breakContinue.addEventListener('click',()=>setScene('lesson'));
  refs.pass.addEventListener('click',passCurrent);
  refs.jump.addEventListener('click',openTeacherJump);
  refs.jumpClose.addEventListener('click',closeTeacherJump);
  $$('[data-jump-close]').forEach(b=>b.addEventListener('click',closeTeacherJump));
  document.addEventListener('keydown',(e)=>{if(e.key==='Escape' && !refs.jumpModal.hidden)closeTeacherJump();});
  refs.back.addEventListener('click',goBack);
  refs.home.addEventListener('click',()=>setScene('cover'));
  refs.finishMenu.addEventListener('click',()=>setScene('cover'));
  refs.restart.addEventListener('click',()=>{store.reset();toast('Lesson state reset.');setScene('cover');});
  $$('[data-section-target]').forEach(b=>b.addEventListener('click',()=>setScene(b.dataset.sectionTarget)));

  // Recover only valid section/state. If a stale state points elsewhere, return safely to cover.
  const recovered = sections.includes(store.state.currentSection) ? store.state.currentSection : 'cover';
  setScene(recovered);
})();
