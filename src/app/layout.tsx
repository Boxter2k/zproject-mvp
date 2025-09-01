// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import { getT } from "../lib/i18n";
import SiteChrome from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "ZProject",
  description: "Un santuario para los creadores",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ⚠️ Next 15: cookies() es async
  const cookieStore = await cookies();

  // === Idioma (SSR inicial) ===
  const langCookie = (cookieStore.get("zproject_lang")?.value || "en").toLowerCase();
  // Nota: t() ya no se usa aquí para header/footer; lo hará el cliente en SiteChrome.
  getT(langCookie);

  // === Tema (SSR) ===
  const storedTheme = (cookieStore.get("zproject_theme")?.value || "system") as
    | "light"
    | "dark"
    | "system";

  // Snapshot del tema ya resuelto si existe (lo pone el cliente):
  const resolvedSnapshot = cookieStore.get("zproject_theme_resolved")?.value as
    | "light"
    | "dark"
    | undefined;

  // === BGFX (SSR) ===
  const rawBg = cookieStore.get("zproject_bgfx")?.value || "lava";
  const normalized = rawBg === "aurora" ? "lava" : rawBg;
  const bgfxMode: "lava" | "stars" | "nebula" | "off" =
    normalized === "stars" ? "stars" :
    normalized === "nebula" ? "nebula" :
    normalized === "off" ? "off" : "lava";

  // Favicon SSR: preferimos el snapshot si existe; si no, inferimos con storedTheme (system => light)
  const resolvedForFavicon: "dark" | "light" =
    resolvedSnapshot ?? (storedTheme === "dark" ? "dark" : storedTheme === "light" ? "light" : "light");

  const favicon = resolvedForFavicon === "dark" ? "/favicon-dark.png" : "/favicon-light.png";

  // Logo (usa PNGs en /public)
  const logoLight = "/logo-light.png";
  const logoDark = "/logo-dark.png";
  const brandLogo = resolvedForFavicon === "dark" ? logoDark : logoLight;

  return (
    <html
      lang={langCookie}
      data-theme={storedTheme}
      // Importante: no renderizamos data-resolved-theme en SSR para evitar hydration mismatch.
      suppressHydrationWarning
    >
      <head>
        <link id="favicon" rel="icon" href={favicon} />
        {/* meta viewport lo suele inyectar Next, pero lo declaramos por seguridad */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>

      <body className="bgfx" data-bg={bgfxMode}>
        {/* ==== LAVA ==== */}
        <div className="lava-stage" aria-hidden>
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
          <span className="blob b4" />
          <span className="blob b5" />
        </div>

        {/* ==== STARS ==== */}
        <canvas id="stars-canvas" className="stars-canvas" aria-hidden suppressHydrationWarning />

        {/* ==== NEBULA ==== */}
        <canvas id="nebula-canvas" className="nebula-canvas" aria-hidden suppressHydrationWarning />

        {/* ==== Filtro SVG para lava (goo) ==== */}
        <svg className="svg-filters" aria-hidden focusable="false" width="0" height="0">
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 24 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </svg>

        {/* ========== THEME RESOLVER (cliente) ========== */}
        <Script id="theme-resolver" strategy="beforeInteractive">{`
(function(){
  var html = document.documentElement;
  function prefersDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function resolveTheme(){
    var chosen = html.getAttribute('data-theme') || 'system';
    var resolved = (chosen === 'dark') ? 'dark' : (chosen === 'light' ? 'light' : (prefersDark() ? 'dark' : 'light'));
    // Seteamos el atributo sólo en cliente (no en SSR) para evitar mismatch
    html.setAttribute('data-resolved-theme', resolved);
    // Guardamos snapshot para próximos SSR
    try {
      document.cookie = 'zproject_theme_resolved=' + resolved + '; Path=/; Max-Age=31536000; SameSite=Lax';
    } catch (e) {}
    return resolved;
  }
  function setFavicon(resolved){
    var link = document.getElementById('favicon');
    if(!link){ link = document.createElement('link'); link.id='favicon'; link.rel='icon'; document.head.appendChild(link); }
    link.setAttribute('href', resolved === 'dark' ? '/favicon-dark.png' : '/favicon-light.png');
  }
  var resolved = resolveTheme();
  setFavicon(resolved);

  // cambia cuando cambia el sistema
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener && mq.addEventListener('change', function(){
    var r = resolveTheme();
    setFavicon(r);
    window.dispatchEvent(new Event('zproject:theme-change'));
  });

  // cambia cuando UI llama applyTheme (desde theme.ts)
  window.addEventListener('zproject:theme-change', function(){
    var r = resolveTheme();
    setFavicon(r);
  });
})();
        `}</Script>

        {/* ========== STARS (simple init) ========== */}
        <Script id="stars-init" strategy="afterInteractive">{`
(function(){
  var canvas = document.getElementById('stars-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var raf = null;
  var mounted = false;

  function size(){
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function colorFromCSS(){
    var cs = getComputedStyle(document.documentElement);
    var dot = cs.getPropertyValue('--stars-dot-rgb').trim() || '210,255,235';
    var line = cs.getPropertyValue('--stars-line-rgb').trim() || '120,255,200';
    var alpha = parseFloat(cs.getPropertyValue('--stars-link-alpha')) || 0.25;
    return { dot, line, alpha };
  }

  function makeStars(){
    stars.length = 0;
    var cs = getComputedStyle(document.documentElement);
    var density = parseFloat(cs.getPropertyValue('--stars-density')) || 0.9;
    var count = Math.floor((window.innerWidth * window.innerHeight) / 1500 * density);
    for(var i=0;i<count;i++){
      stars.push({
        x: Math.random()*window.innerWidth,
        y: Math.random()*window.innerHeight,
        r: Math.random()*1.2 + 0.3,
        vx: (Math.random()-0.5)*0.15,
        vy: (Math.random()-0.5)*0.15,
        tw: Math.random()*Math.PI*2
      });
    }
  }

  function draw(){
    var palette = colorFromCSS();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=0;i<stars.length;i++){
      var s = stars[i];
      s.x += s.vx; s.y += s.vy;
      if(s.x<0) s.x+=window.innerWidth; if(s.x>window.innerWidth) s.x-=window.innerWidth;
      if(s.y<0) s.y+=window.innerHeight; if(s.y>window.innerHeight) s.y-=window.innerHeight;
      s.tw += 0.02;

      ctx.beginPath();
      var twinkle = 0.5 + 0.5*Math.sin(s.tw);
      ctx.fillStyle = 'rgba(' + palette.dot + ',' + (0.6*twinkle) + ')';
      ctx.arc(s.x, s.y, s.r*twinkle, 0, Math.PI*2);
      ctx.fill();
    }
    var maxdist = 140;
    ctx.lineWidth = 0.7;
    for(var a=0;a<stars.length;a++){
      for(var b=a+1;b<stars.length && b<a+200;b++){
        var dx = stars[a].x - stars[b].x;
        var dy = stars[a].y - stars[b].y;
        var d2 = dx*dx + dy*dy;
        if(d2 < maxdist*maxdist){
          var d = Math.sqrt(d2);
          var o = palette.alpha * (1 - d/maxdist);
          ctx.strokeStyle = 'rgba(' + palette.line + ',' + o + ')';
          ctx.beginPath();
          ctx.moveTo(stars[a].x, stars[a].y);
          ctx.lineTo(stars[b].x, stars[b].y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  function start(){
    if(mounted) return;
    mounted = true;
    canvas.style.visibility = 'visible';
    size();
    makeStars();
    raf = requestAnimationFrame(draw);
  }
  function stop(){
    mounted = false;
    if(raf) cancelAnimationFrame(raf);
    raf = null;
    ctx && ctx.clearRect(0,0,canvas.width,canvas.height);
    canvas.style.visibility = 'hidden';
  }

  window.__zstars = { start, stop, resize: function(){ if(!mounted) return; size(); makeStars(); } };
  window.addEventListener('resize', function(){ if(window.__zstars) window.__zstars.resize(); });
  window.addEventListener('zproject:theme-change', function(){ if(window.__zstars && mounted){ window.__zstars.resize(); }});
})();
        `}</Script>

        {/* ========== NEBULA (simple init) ========== */}
        <Script id="nebula-init" strategy="afterInteractive">{`
(function(){
  var canvas = document.getElementById('nebula-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var raf = null;
  var mounted = false;
  var t = 0;

  function size(){
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function palette(){
    var cs = getComputedStyle(document.body);
    var c1 = cs.getPropertyValue('--nebula-c1').trim() || '16,185,129';
    var c2 = cs.getPropertyValue('--nebula-c2').trim() || '34,197,94';
    var c3 = cs.getPropertyValue('--nebula-c3').trim() || '59,130,246';
    var alpha = parseFloat(cs.getPropertyValue('--nebula-alpha')) || 0.22;
    var blur = parseFloat(cs.getPropertyValue('--nebula-blur')) || 24;
    var speed = parseFloat(cs.getPropertyValue('--nebula-speed')) || 0.05;
    return { c1, c2, c3, alpha, blur, speed };
  }

  function draw(){
    var pal = palette();
    t += pal.speed;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    var w = window.innerWidth, h = window.innerHeight;
    var cx = w*0.5, cy = h*0.45;

    ctx.filter = 'blur(' + pal.blur + 'px)';
    for(var i=0;i<3;i++){
      var ang = t*(0.4 + i*0.2) + i*2.1;
      var rx = Math.cos(ang) * (120 + i*60);
      var ry = Math.sin(ang*0.9) * (80 + i*50);

      var grad = ctx.createRadialGradient(cx+rx, cy+ry, 0, cx+rx, cy+ry, 420 + i*120);
      var col = i===0 ? pal.c1 : (i===1 ? pal.c2 : pal.c3);
      grad.addColorStop(0, 'rgba(' + col + ',' + pal.alpha + ')');
      grad.addColorStop(1, 'rgba(' + col + ',0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx+rx, cy+ry, 420 + i*120, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.filter = 'none';

    raf = requestAnimationFrame(draw);
  }

  function start(){
    if(mounted) return;
    mounted = true;
    canvas.style.visibility = 'visible';
    size();
    raf = requestAnimationFrame(draw);
  }
  function stop(){
    mounted = false;
    if(raf) cancelAnimationFrame(raf);
    raf = null;
    ctx && ctx.clearRect(0,0,canvas.width,canvas.height);
    canvas.style.visibility = 'hidden';
  }

  window.__znebula = { start, stop, resize: function(){ if(!mounted) return; size(); } };
  window.addEventListener('resize', function(){ if(window.__znebula) window.__znebula.resize(); });
})();
        `}</Script>

        {/* ===== Favicon / Logo dinámicos ===== */}
        <Script id="brand-logo-dynamic" strategy="afterInteractive">{`
(function(){
  var img = document.getElementById('brandLogo');
  if(!img) return;
  var light='${logoLight}', dark='${logoDark}';

  function currentMode(){
    var html=document.documentElement;
    var chosen=html.getAttribute('data-theme')||'system';
    if (chosen==='dark') return 'dark';
    if (chosen==='light') return 'light';
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  function setLogo(){ var m=currentMode(); img.setAttribute('src', m==='dark' ? dark : light); }

  setLogo();
  window.addEventListener('zproject:theme-change', setLogo);
  var mq=window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener && mq.addEventListener('change', setLogo);
})();
        `}</Script>

        {/* ===== BGFX BOOTSTRAP ===== */}
        <Script id="bgfx-bootstrap" strategy="afterInteractive">{`
(function(){
  var body = document.body;
  function applyMode(){
    var mode = body.getAttribute('data-bg') || 'lava';
    if(window.__zstars) window.__zstars.stop();
    if(window.__znebula) window.__znebula.stop();
    if(mode === 'stars' && window.__zstars){ window.__zstars.start(); }
    else if(mode === 'nebula' && window.__znebula){ window.__znebula.start(); }
  }
  applyMode();
  window.addEventListener('zproject:bgfx-change', applyMode);
  var mo = new MutationObserver(function(muts){
    for(var i=0;i<muts.length;i++){
      if(muts[i].type==='attributes' && muts[i].attributeName==='data-bg'){ applyMode(); break; }
    }
  });
  mo.observe(body, { attributes: true });
})();
        `}</Script>

        {/* ------ Header + Main + Footer con traducción en vivo ------ */}
        <SiteChrome initialLang={langCookie} brandLogo={brandLogo}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}