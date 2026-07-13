async function loadHalf(url, contentId, sectionId){
  const target = document.getElementById(contentId);
  const section = document.getElementById(sectionId);
  try{
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok) throw new Error(res.status);
    target.innerHTML = await res.text();
    applyBackgroundPhoto(target, section);
  }catch(err){
    target.innerHTML = `
      <p class="eyebrow">couldn't load ${url}</p>
      <h2>Fragment not found</h2>
      <p>Make sure <code>${url}</code> sits next to <code>index.html</code>.
      If you're opening this file directly from disk (file://), most browsers block
      fetch() for local files — serve the folder instead, e.g.
      <code>python3 -m http.server</code>, or just push it to GitHub Pages, which serves
      everything over https and works fine.</p>
    `;
  }
}

// Optional background photo: a fragment can include, anywhere in its markup,
// <img class="bg-photo" src="your-image.jpg" alt="">
// This pulls that image's src, applies it as the half's background, and
// removes the <img> itself so it doesn't also render inline as content.
function applyBackgroundPhoto(content, section){
  const bg = content.querySelector('.bg-photo');
  if(!bg) return;
  const src = bg.getAttribute('src');
  if(src){
    section.style.setProperty('--bg-photo', `url("${src}")`);
    section.classList.add('has-bg');
  }
  bg.remove();
}

loadHalf('cody.html', 'cody-content', 'cody-half');
loadHalf('joseph.html', 'joseph-content', 'joseph-half');
