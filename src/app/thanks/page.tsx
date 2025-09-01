// src/app/thanks/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";
import Script from "next/script";

export default async function ThanksPage() {
  // ✅ Next 15: cookies() es asíncrono
  const lang = ((await cookies()).get("zproject_lang")?.value || "en").toLowerCase();

  const L = {
    title:
      lang.startsWith("es") ? "¡Gracias por tu interés!" :
      lang.startsWith("pt") ? "Obrigado pelo seu interesse!" :
      lang.startsWith("fr") ? "Merci pour votre intérêt !" :
      "Thanks for your interest!",

    // 1er párrafo (se mantiene)
    lead:
      lang.startsWith("es") ? "Tu apoyo nos acerca a convertir ZProject en un verdadero santuario para artistas." :
      lang.startsWith("pt") ? "Seu apoio nos aproxima de fazer do ZProject um verdadeiro santuário para artistas." :
      lang.startsWith("fr") ? "Votre soutien nous rapproche de faire de ZProject un véritable sanctuaire pour les artistes." :
      "Your support brings us closer to making ZProject a true sanctuary for creators.",

    // Textos para el bloque formateado (negritas + saltos)
    b1:
      lang.startsWith("es") ? "Estoy invirtiendo mis propios recursos para dar vida a ZProject, paso a paso." :
      lang.startsWith("pt") ? "Estou investindo meus próprios recursos para dar vida ao ZProject, passo a passo." :
      lang.startsWith("fr") ? "J’investis mes propres ressources pour donner vie à ZProject, pas à pas." :
      "I’m investing my own resources to bring ZProject to life, step by step.",

    b2:
      lang.startsWith("es") ? "Tu apoyo funciona como un impulso 🚀" :
      lang.startsWith("pt") ? "Seu apoio funciona como um impulso 🚀" :
      lang.startsWith("fr") ? "Votre soutien agit comme un élan 🚀" :
      "Your support acts like a boost 🚀",

    b2_tail:
      lang.startsWith("es") ? "— nos ayuda a avanzar más rápido, llegar a más creadores y hacer que este santuario crezca con más fuerza." :
      lang.startsWith("pt") ? "— ajuda-nos a avançar mais rápido, alcançar mais criadores e fazer este santuário crescer com mais força." :
      lang.startsWith("fr") ? "— il nous aide à aller plus vite, toucher davantage de créateurs et faire grandir ce sanctuaire avec encore plus de force." :
      "— it helps us move faster, reach more creators, and grow this sanctuary stronger.",

    b3:
      lang.startsWith("es") ? "Seguimos construyendo con cariño y enfoque. Si quieres impulsar el proyecto, aquí tienes cómo:" :
      lang.startsWith("pt") ? "Continuamos construindo com carinho e foco. Se quiser impulsionar o projeto, aqui está como:" :
      lang.startsWith("fr") ? "Nous continuons à construire avec soin et concentration. Pour soutenir le projet, voici comment :" :
      "We keep building with care and focus. If you’d like to help push the project forward, here’s how:",

    ctaKick:
      lang.startsWith("es") ? "Apóyanos en Kickstarter" :
      lang.startsWith("pt") ? "Apoie no Kickstarter" :
      lang.startsWith("fr") ? "Soutenir sur Kickstarter" :
      "Back us on Kickstarter",
      
    ctaDonate:
      lang.startsWith("es") ? "Donación directa" :
      lang.startsWith("pt") ? "Doação direta" :
      lang.startsWith("fr") ? "Don de soutien" :
      "Direct donation",

    ctaKofi:
      lang.startsWith("es") ? "Invítanos un Ko-fi" :
      lang.startsWith("pt") ? "Ofereça um Ko-fi" :
      lang.startsWith("fr") ? "Offrir un Ko-fi" :
      "Support on Ko-fi",

    // Nuevo botón
    story:
      lang.startsWith("es") ? "Conoce nuestra historia" :
      lang.startsWith("pt") ? "Conheça nossa história" :
      lang.startsWith("fr") ? "Découvrez notre histoire" :
      "Learn our story",

    or:
      lang.startsWith("es") ? "o" :
      lang.startsWith("pt") ? "ou" :
      lang.startsWith("fr") ? "ou" :
      "or",

    shareTitle:
      lang.startsWith("es") ? "Comparte ZProject" :
      lang.startsWith("pt") ? "Compartilhe o ZProject" :
      lang.startsWith("fr") ? "Partagez ZProject" :
      "Share ZProject",

    shareText:
      lang.startsWith("es") ? "Ayúdanos a llegar a más creadores." :
      lang.startsWith("pt") ? "Ajude-nos a alcançar mais criadores." :
      lang.startsWith("fr") ? "Aidez-nous à atteindre plus de créateurs." :
      "Help us reach more creators.",

    joinTitle:
      lang.startsWith("es") ? "Únete a la comunidad" :
      lang.startsWith("pt") ? "Junte-se à comunidade" :
      lang.startsWith("fr") ? "Rejoignez la communauté" :
      "Join the community",

    joinText:
      lang.startsWith("es") ? "Sugerencias, feedback y sneak peeks." :
      lang.startsWith("pt") ? "Sugestões, feedbacks e bastidores." :
      lang.startsWith("fr") ? "Suggestions, retours et aperçus." :
      "Suggestions, feedback and sneak peeks.",

    roadmap:
      lang.startsWith("es") ? "Hoja de ruta" :
      lang.startsWith("pt") ? "Roteiro" :
      lang.startsWith("fr") ? "Feuille de route" :
      "Roadmap",

    r1:
      lang.startsWith("es") ? "MVP inicial → El comienzo de ZProject como un refugio donde artistas y público se encuentran." :
      lang.startsWith("pt") ? "MVP inicial → O início do ZProject como um refúgio onde artistas e público se encontram." :
      lang.startsWith("fr") ? "MVP initial → Le début de ZProject comme un sanctuaire où artistes et public se rencontrent." :
      "Initial MVP → The birth of ZProject as a sanctuary where artists and audiences connect.",

    r2:
      lang.startsWith("es") ? "Expansión creativa → Más herramientas y espacio para que los creadores compartan y colaboren." :
      lang.startsWith("pt") ? "Expansão criativa → Mais ferramentas e espaço para que os criadores compartilhem e colaborem." :
      lang.startsWith("fr") ? "Expansion créative → Plus d’outils et d’espace pour que les créateurs partagent et collaborent." :
      "Creative Expansion → More tools and space for creators to share and collaborate.",

    r3:
      lang.startsWith("es") ? "Primeros originales → Lanzamiento de las primeras obras exclusivas de ZProject." :
      lang.startsWith("pt") ? "Primeiros originais → Lançamento das primeiras obras exclusivas do ZProject." :
      lang.startsWith("fr") ? "Premiers originaux → Lancement des premières œuvres exclusives de ZProject." :
      "First Originals → Launch of the first exclusive ZProject productions.",

    r4:
      lang.startsWith("es") ? "Visión a largo plazo → Series, películas, cómics , videojuegos originales como ALT, FBS y mas, nacidos dentro de este santuario creativo." :
      lang.startsWith("pt") ? "Visão a longo prazo → Séries, filmes, quadrinhos e videogames originais como ALT, FBS e mais, nascidos dentro deste santuário criativo." :
      lang.startsWith("fr") ? "Vision à long terme → Séries, films, bandes dessinées et jeux vidéo originaux comme ALT, FBS et plus encore, nés dans ce sanctuaire créatif." :
      "Long-term Vision → Original series, films, comics, and videogames like ALT, FBS, and more, born inside this creative sanctuary.",

    back:
      lang.startsWith("es") ? "Volver" :
      lang.startsWith("pt") ? "Voltar" :
      lang.startsWith("fr") ? "Retour" :
      "Back",

    // Frase inspiradora final
    closing:
      lang.startsWith("es") ? "Cada paso cuenta. Gracias por ser parte de este viaje." :
      lang.startsWith("pt") ? "Cada passo conta. Obrigado por fazer parte desta jornada." :
      lang.startsWith("fr") ? "Chaque pas compte. Merci de faire partie de ce voyage." :
      "Every step matters. Thank you for being part of this journey."
  };

  // Enlaces reales / placeholders
  const KICKSTARTER_URL = "#"; // cuando lo tengas, cámbialo
  const DONATE_URL = "https://buy.stripe.com/eVq7sK85Qaln1KE1dF8AE00";
  const KOFI_URL = "https://ko-fi.com/boxter";
  const FACEBOOK_URL = "https://www.facebook.com/share/1GfFPHHfje/";
  const DISCORD_URL = "https://discord.gg/5Y4Yz2cS";

  // Mensajes para el corazón (una palabra por click)
  const HEART_MSGS =
    lang.startsWith("es") ? ["¡Gracias!", "💚", "✨", "¡Eres genial!"] :
    lang.startsWith("pt") ? ["Obrigado!", "💚", "✨", "Você é incrível!"] :
    lang.startsWith("fr") ? ["Merci !", "💚", "✨", "Tu es top !"] :
    ["Thank you!", "💚", "✨", "You rock!"];

  // Frases del globo (inicio) — sólo para SSR inicial; luego el Script rota
  const BUBBLE_INITIAL =
    lang.startsWith("es") ? "Gracias por estar aquí ✨" :
    lang.startsWith("pt") ? "Obrigado por estar aqui ✨" :
    lang.startsWith("fr") ? "Merci d’être là ✨" :
    "Thanks for being here ✨";

  return (
    <main className="relative min-h-screen">
      {/* ===== Globo de diálogo pegado al icono del header ===== */}
      <div id="tks-bubble" className="talk-bubble" role="status" aria-live="polite">
        {BUBBLE_INITIAL}
      </div>

      {/* Emojis de fondo */}
      <div className="tks-emoji-bg" aria-hidden>
        <span>💚</span><span>✨</span><span>🎨</span><span>🎶</span>
        <span>🕹️</span><span>⭐</span><span>💖</span><span>💫</span>
        <span>💝</span><span>🌟</span><span>💚</span><span>✨</span>
      </div>

      {/* Capa local para efectos */}
      <div id="tks-pop-layer" aria-hidden />

      <section className="container mx-auto px-6 py-16 relative z-10">
        <div className="mb-4">
          <Link href="/" className="footer-link">&larr; {L.back}</Link>
        </div>

        {/* Hero */}
        <div className="settings-card" style={{ padding: "20px 22px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              id="tks-big-heart"
              className="tks-heart"
              style={{
                width: 56, height: 56, borderRadius: 14,
                display: "grid", placeItems: "center",
                border: "1px solid rgba(34,197,94,.45)",
                background: "rgba(0,0,0,.35)",
                boxShadow: "0 0 22px rgba(34,197,94,.22)",
                fontSize: 28
              }}
              aria-hidden
            >
              💚
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight tks-title" style={{ margin: 0 }}>
                {L.title}
              </h1>
              <div className="tks-underline" aria-hidden />
            </div>
          </div>

          <p style={{ marginTop: 10, opacity: .9 }}>{L.lead}</p>

          {/* Bloque formateado (negritas + saltos) */}
          <div style={{ marginTop: 10, opacity: .9 }}>
            <p style={{ margin: "0 0 6px 0" }}>
              <strong>{L.b1}</strong>
            </p>
            <p style={{ margin: "0 0 6px 0" }}>
              <strong>{L.b2}</strong> {L.b2_tail}
            </p>
            <p style={{ margin: 0, opacity: .85 }}>
              {L.b3}
            </p>
          </div>

          {/* CTAs + botón “Historia” alineado a la derecha */}
          <div className="tks-cta-row" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
            <a href={KICKSTARTER_URL} className="btn-primary tks-love">{L.ctaKick}</a>
            <span style={{ alignSelf: "center", opacity: .75 }}>{L.or}</span>
            <a href={DONATE_URL} className="btn-ghost tks-love" target="_blank" rel="noopener noreferrer">{L.ctaDonate}</a>
            <span style={{ alignSelf: "center", opacity: .75 }}>{L.or}</span>
            <a href={KOFI_URL} className="btn-ghost tks-love" target="_blank" rel="noopener noreferrer">Ko-fi</a>

            {/* Botón de historia empujado a la derecha (con pops propios) */}
            <Link href="/about" className="btn-ghost tks-story" style={{ marginLeft: "auto" }}>
              {L.story}
            </Link>
          </div>

          {/* Frase final JUSTO debajo de los botones */}
          <p style={{ marginTop: 12, opacity: .75, fontSize: ".92rem", fontStyle: "italic", textAlign: "center" }}>
            {L.closing}
          </p>
        </div>

        {/* Dos columnas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Izquierda */}
          <div style={{ display: "grid", gap: 14 }}>
            <article className="settings-card" style={{ padding: 16 }}>
              <h2 className="section-title" style={{ marginBottom: 8 }}>{L.shareTitle}</h2>
              <p style={{ opacity: .85, marginBottom: 12 }}>{L.shareText}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <a className="btn-ghost is-disabled" href="#">X / Twitter</a>
                <a className="btn-ghost" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">Facebook</a>
                <a className="btn-ghost is-disabled" href="#">LinkedIn</a>
              </div>
            </article>

            <article className="settings-card" style={{ padding: 16 }}>
              <h2 className="section-title" style={{ marginBottom: 8 }}>{L.joinTitle}</h2>
              <p style={{ opacity: .85, marginBottom: 12 }}>{L.joinText}</p>
              <a href={DISCORD_URL} className="btn-primary tks-love" target="_blank" rel="noopener noreferrer">
                Discord / Comunidad
              </a>
            </article>
          </div>

          {/* Derecha */}
          <article className="settings-card" style={{ padding: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 10 }}>{L.roadmap}</h2>
            <ul style={{ display: "grid", gap: 8, margin: 0, paddingLeft: "1.1rem" }}>
              <li>{L.r1}</li>
              <li>{L.r2}</li>
              <li>{L.r3}</li>
              <li>{L.r4}</li>
            </ul>
          </article>
        </div>
      </section>

      {/* Script de efectos existentes */}
      <Script id="tks-effects" strategy="afterInteractive">{`
        (function(){
          var layer = null;
          function ensureLayer(){ if (!layer) layer = document.getElementById('tks-pop-layer'); return layer || document.body; }
          function append(el){ ensureLayer().appendChild(el); }

          // ===== Pops estándar (corazones/estrellas) =====
          function spawnHearts(x, y){
            var n = 8 + Math.floor(Math.random()*6);
            for(var i=0;i<n;i++){
              var el = document.createElement('span');
              el.className = 'tks-pop-heart';
              var pick = Math.random();
              el.textContent = pick < 0.5 ? '💚' : (pick < 0.8 ? '✨' : '⭐');
              var ang = Math.random()*Math.PI*2;
              var dist = 18 + Math.random()*26;
              var dx = Math.cos(ang)*dist;
              var dy = Math.sin(ang)*dist - 10;
              el.style.left = (x + (Math.random()*8-4)) + 'px';
              el.style.top  = (y + (Math.random()*6-3)) + 'px';
              el.style.setProperty('--dx', dx+'px');
              el.style.setProperty('--dy', dy+'px');
              el.style.fontSize = (16 + Math.random()*10) + 'px';
              append(el);
              setTimeout(function(){ el.remove(); }, 950);
            }
          }

          // ===== Pops para "Conoce nuestra historia" (símbolos de curiosidad) =====
          var STORY_SYMBOLS = ["📖","❓","🌌","🐺"];
          function spawnStory(x, y){
            var n = 8 + Math.floor(Math.random()*6);
            for(var i=0;i<n;i++){
              var el = document.createElement('span');
              el.className = 'tks-pop-heart';
              el.textContent = STORY_SYMBOLS[Math.floor(Math.random()*STORY_SYMBOLS.length)];
              var ang = Math.random()*Math.PI*2;
              var dist = 18 + Math.random()*26;
              var dx = Math.cos(ang)*dist;
              var dy = Math.sin(ang)*dist - 10;
              el.style.left = (x + (Math.random()*8-4)) + 'px';
              el.style.top  = (y + (Math.random()*6-3)) + 'px';
              el.style.setProperty('--dx', dx+'px');
              el.style.setProperty('--dy', dy+'px');
              el.style.fontSize = (16 + Math.random()*10) + 'px';
              append(el);
              setTimeout(function(){ el.remove(); }, 950);
            }
          }

          function spawnWordOnce(x, y, msg){
            var el = document.createElement('span');
            el.className = 'tks-pop-word';
            el.textContent = msg;
            var dx = (Math.random()*40 - 20);
            var dy = -40 - Math.random()*20;
            el.style.left = x + 'px';
            el.style.top  = y + 'px';
            el.style.setProperty('--dx', dx+'px');
            el.style.setProperty('--dy', dy+'px');
            append(el);
            setTimeout(function(){ el.remove(); }, 1200);
          }

          function bind(){
            // Hover: botones de apoyo (corazones/estrellas)
            document.querySelectorAll('.tks-love').forEach(function(a){
              var last = 0;
              a.addEventListener('mouseenter', function(){
                var now = Date.now();
                if (now - last < 350) return;
                last = now;
                var r = a.getBoundingClientRect();
                var x = r.left + r.width/2;
                var y = r.top  + r.height/2;
                spawnHearts(x, y);
              });
            });

            // Hover: botón historia (símbolos de curiosidad)
            document.querySelectorAll('.tks-story').forEach(function(a){
              var last = 0;
              a.addEventListener('mouseenter', function(){
                var now = Date.now();
                if (now - last < 350) return;
                last = now;
                var r = a.getBoundingClientRect();
                var x = r.left + r.width/2;
                var y = r.top  + r.height/2;
                spawnStory(x, y);
              });
            });

            // Click corazón grande: palabras alternadas
            var big = document.getElementById('tks-big-heart');
            if (big){
              big.style.cursor = 'pointer';
              big.dataset.idx = big.dataset.idx || '0';
              var MSGS = ${JSON.stringify(HEART_MSGS)};
              big.addEventListener('click', function(){
                var r = big.getBoundingClientRect();
                var x = r.left + r.width/2;
                var y = r.top  + r.height/2;
                var i = parseInt(big.dataset.idx || '0', 10) || 0;
                spawnWordOnce(x, y, MSGS[i]);
                big.dataset.idx = ((i + 1) % MSGS.length).toString();
              });
            }
          }

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bind);
          } else {
            bind();
          }
        })();
      `}</Script>

      {/* ===== Script del GLOBO (posiciona + rota frases + wiggle) ===== */}
      <Script id="tks-bubble-script" strategy="afterInteractive">{`
        (function(){
          var bubble = document.getElementById('tks-bubble');
          if(!bubble) return;

          // Frases por idioma
          var phrases =
            ${JSON.stringify(lang)}.startsWith('es') ? ["Gracias por estar aquí ✨", "Tu apoyo nos impulsa 💚", "Seguimos creando contigo 🎨"] :
            ${JSON.stringify(lang)}.startsWith('pt') ? ["Obrigado por estar aqui ✨", "Seu apoio nos impulsiona 💚", "Seguimos criando com você 🎨"] :
            ${JSON.stringify(lang)}.startsWith('fr') ? ["Merci d’être là ✨", "Votre soutien nous porte 💚", "On crée avec vous 🎨"] :
            ["Thanks for being here ✨", "Your support lifts us 💚", "Creating with you 🎨"];

          // Rotación persistente
          try {
            var key = 'z_bubble_idx_thanks';
            var prev = Number((window.localStorage && window.localStorage.getItem(key)) || '0');
            var idx = isNaN(prev) ? 0 : prev;
            bubble.textContent = phrases[idx % phrases.length];
            if (window.localStorage) {
              window.localStorage.setItem(key, String((idx + 1) % phrases.length));
            }
          } catch(e){ /* silent */ }

          // Anclaje al icono del header + wiggle
          var icon = document.querySelector('header a svg, header a img, header .site-logo svg, header .site-logo img, [data-logo-icon]');
          if(!icon) return;

          var nav = document.querySelector('header') || document.querySelector('.topbar,.navbar,.nav');
          var navH = (nav && nav.getBoundingClientRect().height) || 56;

          var ARROW_LEFT_PX = 18;     // debe coincidir con CSS
          var EXTRA_LEFT_SHIFT = 8;   // corrimiento leve a la izquierda
          function place(){
            if(!icon || !bubble) return;
            var r = icon.getBoundingClientRect();
            var targetX = r.left + r.width/2;

            var gapY = 10;
            var top = r.bottom + gapY;
            var minTop = navH + 6;
            if (top < minTop) top = minTop;

            var bubbleBox = bubble.getBoundingClientRect();
            var viewportW = window.innerWidth;
            var left = targetX - ARROW_LEFT_PX - EXTRA_LEFT_SHIFT;

            var minLeft = 8;
            var maxLeft = Math.max(minLeft, viewportW - bubbleBox.width - 8);
            if (left < minLeft) left = minLeft;
            if (left > maxLeft) left = maxLeft;

            bubble.style.setProperty('--arrow-left', ARROW_LEFT_PX + 'px');
            bubble.style.top = top + 'px';
            bubble.style.left = left + 'px';
          }

          place();
          window.addEventListener('scroll', place, { passive: true });
          window.addEventListener('resize', place);

          // Wiggle del icono cuando aparece el globo
          icon.classList.add('logo-solo-talk');
          var stop = setTimeout(function(){ icon.classList.remove('logo-solo-talk'); }, 2600);

        })();
      `}</Script>

      {/* Estilos embebidos */}
      <style>{`
        #tks-pop-layer{ position: fixed; inset: 0; pointer-events: none; z-index: 9999; }

        .tks-emoji-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .tks-emoji-bg span { position: absolute; font-size: 3.4rem; opacity: 0.9; animation: tks-float 8s infinite ease-in-out; filter: drop-shadow(0 10px 20px rgba(0,0,0,.28)); }
        .tks-emoji-bg span:nth-child(1){ left:5%;  top:80%; animation-delay:0s;}
        .tks-emoji-bg span:nth-child(2){ left:18%; top:72%; animation-delay:.7s;}
        .tks-emoji-bg span:nth-child(3){ left:36%; top:86%; animation-delay:1.4s;}
        .tks-emoji-bg span:nth-child(4){ left:54%; top:74%; animation-delay:2.1s;}
        .tks-emoji-bg span:nth-child(5){ left:72%; top:82%; animation-delay:2.8s;}
        .tks-emoji-bg span:nth-child(6){ left:14%; top:60%; animation-delay:3.5s;}
        .tks-emoji-bg span:nth-child(7){ left:32%; top:66%; animation-delay:4.2s;}
        .tks-emoji-bg span:nth-child(8){ left:50%; top:62%; animation-delay:4.9s;}
        .tks-emoji-bg span:nth-child(9){ left:68%; top:68%; animation-delay:5.6s;}
        .tks-emoji-bg span:nth-child(10){left:86%; top:63%; animation-delay:6.3s;}
        .tks-emoji-bg span:nth-child(11){left:26%; top:70%; animation-delay:7.0s;}
        .tks-emoji-bg span:nth-child(12){left:46%; top:90%; animation-delay:7.7s;}
        @keyframes tks-float { 0%{transform:translateY(0) scale(1);opacity:.85;} 50%{transform:translateY(-44px) scale(1.15);opacity:1;} 100%{transform:translateY(0) scale(1);opacity:.85;} }

        .tks-heart { position: relative; }
        .tks-heart::after { content:""; position:absolute; inset:-8px; border-radius:18px; box-shadow:0 0 0 0 rgba(34,197,94,.28); animation:tks-pulse 1.8s ease-in-out infinite; }
        @keyframes tks-pulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,.28);} 70%{box-shadow:0 0 0 14px rgba(34,197,94,0);} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0);} }

        .tks-title{ background:linear-gradient(180deg,#d1fae5,rgba(16,185,129,.92)); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .tks-underline{ height:2px; width:140px; margin-top:8px; background:linear-gradient(90deg, rgba(34,197,94,.95), rgba(16,185,129,0)); border-radius:9999px; filter:drop-shadow(0 0 10px rgba(34,197,94,.35)); }

        .is-disabled{ opacity:.6; cursor:not-allowed; pointer-events:none; }

        .tks-pop-heart{ position:absolute; left:0; top:0; transform:translate(-50%,-50%); animation:tks-pop .9s ease forwards; pointer-events:none; will-change:transform,opacity; }
        @keyframes tks-pop{ 0%{transform:translate(calc(-50% + 0px),calc(-50% + 0px)) scale(.9);opacity:0;} 15%{opacity:1;} 70%{opacity:1;} 100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.2);opacity:0;} }

        .tks-pop-word{ position:absolute; left:0; top:0; transform:translate(-50%,-50%); animation:tks-word 1.2s ease forwards; font-weight:800; letter-spacing:.2px; color:#d1fae5; text-shadow: 0 2px 12px rgba(16,185,129,.65); pointer-events:none; }
        @keyframes tks-word{ 0%{transform:translate(calc(-50% + 0px),calc(-50% + 0px)) scale(.9);opacity:0;} 20%{opacity:1;} 100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.05);opacity:0;} }

        @media (max-width: 980px){ .tks-emoji-bg span{ font-size:2.6rem; } }
        @media (max-width: 720px){
          .tks-emoji-bg span{ font-size:2.1rem; }
          section > div[style*="grid-template-columns: 1fr 1fr"]{ grid-template-columns: 1fr !important; }
        }

        /* ===== Globo cómic pegado al icono del header ===== */
        .talk-bubble{
          position: fixed;
          z-index: 10000;
          background: color-mix(in oklab, var(--background), white 8%);
          border: 1px solid rgba(34,197,94,.35);
          padding: 8px 12px;
          border-radius: 12px;
          box-shadow: 0 10px 24px rgba(0,0,0,.18);
          font-size: 13.5px;
          font-weight: 700;
          animation: bubble-in .35s ease, bubble-pulse 2.4s ease infinite;
        }
        .talk-bubble::before{
          content:"";
          position:absolute;
          top:-10px; left: var(--arrow-left, 16px);
          border-left:10px solid transparent;
          border-right:10px solid transparent;
          border-bottom:10px solid rgba(34,197,94,.35);
        }
        .talk-bubble::after{
          content:"";
          position:absolute;
          top:-8px; left: calc(var(--arrow-left, 16px) + 1px);
          border-left:9px solid transparent;
          border-right:9px solid transparent;
          border-bottom:9px solid color-mix(in oklab, var(--background), white 8%);
        }
        @keyframes bubble-in{ from{ transform: translateY(-6px); opacity:0 } to{ transform:none; opacity:1 } }
        @keyframes bubble-pulse{ 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-1px) } }

        /* Wiggle SOLO del iconito (svg/img del header) */
        .logo-solo-talk{ animation: wiggle .6s ease-in-out 3; transform-origin: 50% 50%; }
        @keyframes wiggle{
          0%,100%{ transform: rotate(0) }
          20%{ transform: rotate(-6deg) }
          40%{ transform: rotate(6deg) }
          60%{ transform: rotate(-4deg) }
          80%{ transform: rotate(3deg) }
        }
      `}</style>
    </main>
  );
}
