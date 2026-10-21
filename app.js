(() => {
 const $ = id => document.getElementById(id);
 const ready = window.SUPABASE_URL && !window.SUPABASE_URL.startsWith("YOUR_") && window.SUPABASE_ANON_KEY && !window.SUPABASE_ANON_KEY.startsWith("YOUR_");
 const client = ready ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;
 let lang = "en", profile = null, skills = [], projects = [], socials = [];
 const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function setText(id, text) { if ($(id)) $(id).textContent = text || ""; }
 function setLanguage() {
   document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
   document.querySelectorAll("[data-en]").forEach(el => el.innerHTML = lang === "ar" ? el.dataset.ar : el.dataset.en);
   $("langBtn").textContent = lang === "ar" ? "English" : "العربية";
   renderSkills(); renderProjects(); renderSocials();
 }
 $("langBtn").addEventListener("click", () => { lang = lang === "en" ? "ar" : "en"; setLanguage(); });
 function renderSkills() {
   const grid = $("skillsGrid");
   if (!skills.length) { grid.innerHTML = `<div class="empty-state">${lang==="ar"?"أضف مهاراتك من لوحة التحكم.":"Add your skills from the admin dashboard."}</div>`; return; }
   grid.innerHTML = skills.map(s => `<article class="skill-card glass"><div class="skill-top"><span class="skill-icon">${esc((s.name||"?").slice(0,2).toUpperCase())}</span><span class="skill-percent">${Number(s.level)||0}%</span></div><h3>${esc(lang==="ar" && s.name_ar ? s.name_ar : s.name)}</h3><div class="progress"><span style="width:${Math.min(100,Math.max(0,Number(s.level)||0))}%"></span></div></article>`).join("");
 }
 function renderProjects() {
   const grid = $("projectsGrid");
   if (!projects.length) { grid.innerHTML = `<div class="empty-state">${lang==="ar"?"مشروعاتك المنشورة هتظهر هنا بعد إضافتها من لوحة التحكم.":"Your published projects will appear here after you add them in the admin dashboard."}</div>`; return; }
   grid.innerHTML = projects.map(p => `<article class="project-card glass">${p.image_url?`<img class="project-image" src="${esc(p.image_url)}" alt="" loading="lazy">`:`<div class="project-placeholder"><span>✦</span></div>`}<div class="project-content"><h3>${esc(lang==="ar"&&p.title_ar?p.title_ar:p.title)}</h3><p>${esc(lang==="ar"&&p.description_ar?p.description_ar:p.description||"")}</p><div class="tech-tags">${(p.technologies||[]).map(t=>`<span>${esc(t)}</span>`).join("")}</div><div class="project-links">${p.project_url?`<a href="${esc(p.project_url)}" target="_blank" rel="noopener">Live ↗</a>`:""}${p.github_url?`<a href="${esc(p.github_url)}" target="_blank" rel="noopener">GitHub ↗</a>`:""}</div></div></article>`).join("");
 }
 function renderSocials() {
   const box = $("socialLinks");
   const defaults = socials.length ? socials : [{platform:"LinkedIn",url:"https://www.linkedin.com/in/hussein-junaidy"},{platform:"GitHub",url:"https://github.com/ehoss2ohs-art"},{platform:"Nafezly",url:"https://nafezly.com/u/hussein_Junaidy"},{platform:"TikTok",url:"https://www.tiktok.com/@hussein_junaidy"},{platform:"Phone",url:"tel:01149109446"}];
   box.innerHTML = defaults.map(s=>`<a class="contact-link" href="${esc(s.url)}" ${s.url.startsWith("http")?'target="_blank" rel="noopener"':""}><span>${esc(s.platform)}</span><b>↗</b></a>`).join("");
 }
 async function load() {
   $("year").textContent = new Date().getFullYear();
   if (!client) { $("skillsGrid").innerHTML = '<div class="empty-state">Connect Supabase by editing <code>config.js</code> to load live content.</div>'; renderSocials(); return; }
   const [p, s, pr, so] = await Promise.all([
     client.from("profiles").select("*").eq("is_public",true).limit(1).maybeSingle(),
     client.from("skills").select("*").eq("is_published",true).order("created_at"),
     client.from("projects").select("*").eq("is_published",true).order("created_at",{ascending:false}),
     client.from("social_links").select("*").eq("is_public",true).order("created_at")
   ]);
   if (p.data) { profile=p.data; setText("heroName",profile.full_name); setText("cardName",profile.full_name); setText("heroTitle",profile.job_title); setText("heroBio",profile.bio); setText("aboutBio",profile.bio); setText("cardRole",profile.job_title); if(profile.avatar_url) $("avatar").innerHTML=`<img src="${esc(profile.avatar_url)}" alt="${esc(profile.full_name)}">`; }
   if (s.data) skills=s.data; if (pr.data) projects=pr.data; if (so.data) socials=so.data;
   setText("skillCount",`${skills.length}+`); setText("projectCount",String(projects.length)); setLanguage();
 }
 load().catch(err=>console.error(err));
})();