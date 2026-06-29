
(function(){
  const hamburger=document.getElementById('hamburger');
  const mobileMenu=document.getElementById('mobile-menu');
  if(hamburger&&mobileMenu){
    hamburger.addEventListener('click',()=>{
      mobileMenu.hidden=!mobileMenu.hidden;
      hamburger.setAttribute('aria-expanded', String(!mobileMenu.hidden));
    });
    mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.hidden=true;hamburger.setAttribute('aria-expanded','false');}));
  }
  const lightbox=document.getElementById('lightbox');
  const lightboxImg=document.getElementById('lightbox-img');
  function closeLightbox(){if(lightbox){lightbox.classList.remove('active');document.body.style.overflow='';}}
  document.querySelectorAll('.lightbox-trigger').forEach(img=>{
    img.addEventListener('click',()=>{lightboxImg.src=img.src;lightboxImg.alt=img.alt;lightbox.classList.add('active');document.body.style.overflow='hidden';});
  });
  const close=document.getElementById('lightbox-close');
  const overlay=document.getElementById('lightbox-overlay');
  if(close) close.addEventListener('click',closeLightbox);
  if(overlay) overlay.addEventListener('click',closeLightbox);

  const input=document.getElementById('search-input');
  const results=document.getElementById('search-results');
  const modal=document.getElementById('search-modal');
  const searchBackdrop=document.getElementById('search-backdrop');
  const index=window.HANDBOOK_SEARCH_INDEX||[];
  let activeIndex=-1;
  let currentMatches=[];

  function openSearch(){
    if(!modal||!input) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    setTimeout(()=>input.focus(),0);
  }
  function closeSearch(){
    if(!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    activeIndex=-1;
  }
  function renderResults(query){
    if(!results) return;
    const q=query.trim().toLowerCase();
    if(!q){results.innerHTML='<div class="search-result"><span>Search</span>输入关键词开始搜索</div>';currentMatches=[];return;}
    currentMatches=index.filter(item=>{
      const pageToken=String(item.page);
      return item.text.toLowerCase().includes(q)||item.title.toLowerCase().includes(q)||pageToken===q.replace(/^page\s*/,'');
    }).slice(0,12);
    activeIndex=currentMatches.length?0:-1;
    results.innerHTML=currentMatches.length?currentMatches.map((item,i)=>`<a class="search-result ${i===activeIndex?'is-active':''}" href="${item.url}"><div><span>${item.section}</span>${item.title}</div></a>`).join(''):'<div class="search-result"><span>No Result</span>没有找到匹配内容</div>';
  }
  function moveActive(delta){
    if(!currentMatches.length||!results) return;
    activeIndex=(activeIndex+delta+currentMatches.length)%currentMatches.length;
    results.querySelectorAll('.search-result').forEach((node,i)=>node.classList.toggle('is-active',i===activeIndex));
    const active=results.querySelector('.search-result.is-active');
    if(active) active.scrollIntoView({block:'nearest'});
  }
  if(input){input.addEventListener('input',()=>renderResults(input.value));}
  document.querySelectorAll('[data-open-search],#global-search').forEach(btn=>btn.addEventListener('click',openSearch));
  if(searchBackdrop) searchBackdrop.addEventListener('click',closeSearch);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeLightbox();closeSearch();}
    if(e.key==='/'&&!e.metaKey&&!e.ctrlKey&&!e.altKey){
      const tag=(document.activeElement&&document.activeElement.tagName||'').toLowerCase();
      if(tag!=='input'&&tag!=='textarea'){e.preventDefault();openSearch();}
    }
    if(modal&&modal.classList.contains('is-open')){
      if(e.key==='ArrowDown'){e.preventDefault();moveActive(1);}
      if(e.key==='ArrowUp'){e.preventDefault();moveActive(-1);}
      if(e.key==='Enter'&&activeIndex>=0&&currentMatches[activeIndex]){window.location.href=currentMatches[activeIndex].url;}
    }
  });
  renderResults('');
})();
