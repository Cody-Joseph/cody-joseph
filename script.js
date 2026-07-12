async function loadHalf(url, targetId){
  const target = document.getElementById(targetId);
  try{
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok) throw new Error(res.status);
    target.innerHTML = await res.text();
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

loadHalf('cody.html', 'cody-half');
loadHalf('joseph.html', 'joseph-half');
