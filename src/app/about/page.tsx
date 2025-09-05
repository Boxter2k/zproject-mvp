// src/app/about/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { I18nProvider, useLang } from "../../lib/i18n-client";
import { useMemo } from "react";

type Block = {
  id: string;
  year: string;
  title: string;
  text: string;
  img: string | null;   // ruta dentro de /public/about/...
  imgAlt: string;
};

function AboutInner() {
  const { lang } = useLang();

  // ====== TEXTOS LARGOS (tal cual, cálidos) ======
  const content = useMemo(() => {
    const es: Block[] = [
      {
        id: "2017",
        year: "2017",
        title: "El inicio — 6 de noviembre de 2017",
        text:
          "ZProject nació el 6 de noviembre de 2017, cuando dos jóvenes, Boxter y Kuro, con apenas 16 años, se atrevieron a imaginar algo más grande que ellos mismos. Éramos solo dos chicos con una creatividad desbordante y una pregunta que nos unía: ¿y si construimos un lugar donde nuestros sueños puedan crecer? Inspirados por los creadores que ya compartían sus ideas en distintas plataformas, decidimos empezar nuestro propio viaje. Ese fue el primer destello de lo que hoy conocemos como ZProject.",
        img: "/about/2017-kuro-boxter.jpg",
        imgAlt: "Kuro & Boxter, 2017",
      },
      {
        id: "2017-2018",
        year: "2017–2018",
        title: "La primera chispa",
        text:
          "Al principio, exploramos el camino de las redes sociales existentes. Grabábamos, creábamos y compartíamos con el entusiasmo de quienes sueñan con cambiar el mundo. Fue nuestra primera escuela creativa: aprendimos a organizarnos, a dar forma a nuestras ideas y a mantenernos constantes. Durante esa etapa conocimos a Yume, quien con su energía abrió nuevas posibilidades y nos presentó a Kouga. La chispa que había encendido Boxter no tardó en contagiar a más personas.",
        img: "/about/2018-intentos-plataformas.jpg",
        imgAlt: "Primeras creaciones y publicaciones",
      },
      {
        id: "2018",
        year: "2018",
        title: "Avatares con alma",
        text:
          "Queríamos representarnos digitalmente con simples avatares. Pero un día, Boxter dijo algo que lo cambió todo: “¿Y si les damos una historia?”. Aquella idea, tan sencilla como poderosa, hizo que nuestros avatares dejaran de ser dibujos estáticos y comenzaran a tener vida, identidad y emociones. Sin darnos cuenta, lo que empezó como una representación personal se transformó en el inicio de universos completos.",
        img: "/about/2018-avatares.jpg",
        imgAlt: "Bocetos de avatares",
      },
      {
        id: "2019-2020",
        year: "2019–2020",
        title: "Construcción de mundos",
        text:
          "Con el paso de los días, las historias crecieron, los personajes se multiplicaron y los mundos se hicieron más vastos. Ya no era un pasatiempo, era un movimiento creativo que nos impulsaba a seguir soñando. El grupo se amplió a cinco personas, cada una aportando su visión y dejando huella. Algunos siguieron otros caminos, pero todos fueron parte de esta construcción. ZProject aprendió a levantarse incluso en la adversidad, demostrando que los sueños auténticos nunca mueren.",
        img: "/about/2020-mundos.jpg",
        imgAlt: "Arte de mundos y personajes",
      },
      {
        id: "santuario",
        year: "Visión",
        title: "Un refugio para el arte",
        text:
          "Muy pronto comprendimos que las plataformas existentes estaban llenas de métricas, tendencias y algoritmos que podían enterrar el alma de un creador. Nosotros no queríamos que nuestra voz quedara ahogada entre números. ZProject debía ser otra cosa: un refugio, un santuario donde el arte respira, donde las ideas no se olvidan y donde los soñadores encuentran un lugar que los valora por lo que son, no por lo que generan.",
        img: "/about/refugio.gif",
        imgAlt: "Refugio para el arte",
      },
      {
        id: "hoy",
        year: "Hoy",
        title: "Esto apenas comienza",
        text:
          "Después de años de perseverancia, ZProject sigue vivo y en movimiento. Lo que comenzó con dos adolescentes soñando, hoy se levanta como un espacio que busca inspirar, unir y dar esperanza a quienes creen en el poder del arte. No venimos a reemplazar tu mundo, venimos a mejorarlo. Y lo mejor es que esta historia apenas comienza. Si alguna vez soñaste con crear, este lugar también es para ti.",
        img: "/about/hoy.jpg",
        imgAlt: "ZProject hoy",
      },
    ];

    const pt: Block[] = [
      {
        id: "2017",
        year: "2017",
        title: "O início — 6 de novembro de 2017",
        text:
          "ZProject nasceu em 6 de novembro de 2017, quando dois jovens, Boxter e Kuro, com apenas 16 anos, ousaram imaginar algo maior do que eles mesmos. Éramos apenas dois garotos com criatividade de sobra e uma pergunta que nos unia: e se construíssemos um lugar onde nossos sonhos pudessem crescer? Inspirados por criadores que já compartilhavam suas ideias em diferentes plataformas, decidimos iniciar nossa própria jornada. Esse foi o primeiro brilho do que hoje conhecemos como ZProject.",
        img: "/about/2017-kuro-boxter.jpg",
        imgAlt: "Kuro & Boxter, 2017",
      },
      {
        id: "2017-2018",
        year: "2017–2018",
        title: "A primeira faísca",
        text:
          "No começo, exploramos o caminho das redes existentes. Gravávamos, criávamos e compartilhávamos com o entusiasmo de quem sonha em mudar o mundo. Foi nossa primeira escola criativa: aprendemos a nos organizar, a dar forma às ideias e a manter a constância. Nessa etapa conhecemos Yume, que trouxe nova energia e nos apresentou ao Kouga. A faísca acesa por Boxter logo se espalhou.",
        img: "/about/2018-intentos-plataformas.jpg",
        imgAlt: "Primeiras criações e publicações",
      },
      {
        id: "2018",
        year: "2018",
        title: "Avatares com alma",
        text:
          "Queríamos nos representar digitalmente com avatares simples. Mas um dia, Boxter disse algo que mudou tudo: “E se dermos uma história a eles?”. Aquela ideia, simples e poderosa, fez com que os avatares deixassem de ser desenhos estáticos e ganhassem vida, identidade e emoção. Sem perceber, o que começou como uma representação pessoal virou o início de universos inteiros.",
        img: "/about/2018-avatares.jpg",
        imgAlt: "Esboços de avatares",
      },
      {
        id: "2019-2020",
        year: "2019–2020",
        title: "Construção de mundos",
        text:
          "Com o tempo, as histórias cresceram, os personagens se multiplicaram e os mundos ficaram mais vastos. Já não era passatempo: era um movimento criativo que nos impulsionava a continuar sonhando. O grupo cresceu para cinco pessoas; cada uma deixou sua marca. Alguns seguiram outros caminhos, mas todos fizeram parte dessa construção. ZProject aprendeu a levantar-se mesmo na adversidade: sonhos autênticos não morrem.",
        img: "/about/2020-mundos.jpg",
        imgAlt: "Arte de mundos e personagens",
      },
      {
        id: "santuario",
        year: "Visão",
        title: "Um refúgio para a arte",
        text:
          "Percebemos logo que as plataformas existentes estavam cheias de métricas, tendências e algoritmos que podiam enterrar a alma de um criador. Não queríamos nossa voz afogada em números. ZProject precisava ser outra coisa: um refúgio, um santuário onde a arte respira, onde as ideias não se perdem e onde sonhadores são valorizados pelo que são, não pelo que geram.",
        img: "/about/refugio.gif",
        imgAlt: "Refúgio para a arte",
      },
      {
        id: "hoy",
        year: "Hoje",
        title: "Isso está apenas começando",
        text:
          "Depois de anos de perseverança, ZProject segue vivo e em movimento. O que começou com dois adolescentes sonhando hoje ergue-se como um espaço que inspira, une e dá esperança a quem acredita no poder da arte. Não viemos substituir o seu mundo, viemos melhorá-lo. E o melhor é que esta história está apenas começando. Se você já sonhou em criar, este lugar também é seu.",
        img: "/about/hoy.jpg",
        imgAlt: "ZProject hoje",
      },
    ];

    const fr: Block[] = [
      {
        id: "2017",
        year: "2017",
        title: "Le début — 6 novembre 2017",
        text:
          "ZProject est né le 6 novembre 2017, lorsque deux jeunes, Boxter et Kuro, à peine âgés de 16 ans, ont osé imaginer quelque chose de plus grand qu’eux. Nous n’étions que deux garçons débordant de créativité avec une question en tête : et si nous construisions un lieu où nos rêves peuvent grandir ? Inspirés par des créateurs qui partageaient déjà leurs idées sur différentes plateformes, nous avons entamé notre propre voyage. Ce fut la première lueur de ce que l’on appelle aujourd’hui ZProject.",
        img: "/about/2017-kuro-boxter.jpg",
        imgAlt: "Kuro & Boxter, 2017",
      },
      {
        id: "2017-2018",
        year: "2017–2018",
        title: "La première étincelle",
        text:
          "Au début, nous avons exploré la voie des réseaux existants. Nous tournions, créions et partagions avec l’enthousiasme de ceux qui rêvent de changer le monde. Ce fut notre première école créative : apprendre à nous organiser, à donner forme aux idées et à rester constants. Durant cette étape, nous avons rencontré Yume qui nous a présenté Kouga. L’étincelle allumée par Boxter s’est rapidement diffusée.",
        img: "/about/2018-intentos-plataformas.jpg",
        imgAlt: "Premières créations et publications",
      },
      {
        id: "2018",
        year: "2018",
        title: "Des avatars avec une âme",
        text:
          "Nous voulions nous représenter numériquement avec de simples avatars. Puis un jour, Boxter a dit : « Et si on leur donnait une histoire ? ». Cette idée, simple et puissante, a transformé ces dessins statiques en personnages dotés de vie, d’identité et d’émotion. Sans nous en rendre compte, ce qui n’était qu’une représentation personnelle est devenu le début d’univers entiers.",
        img: "/about/2018-avatares.jpg",
        imgAlt: "Esquisses d’avatars",
      },
      {
        id: "2019-2020",
        year: "2019–2020",
        title: "Construction de mondes",
        text:
          "Avec le temps, les histoires ont grandi, les personnages se sont multipliés et les mondes se sont étendus. Ce n’était plus un passe-temps, mais un mouvement créatif nous poussant à continuer de rêver. Le groupe s’est élargi à cinq personnes, chacun laissant son empreinte. Certains ont suivi d’autres chemins, mais tous ont participé à cette construction. ZProject a appris à se relever face à l’adversité : les rêves authentiques ne meurent pas.",
        img: "/about/2020-mundos.jpg",
        imgAlt: "Art de mondes et personnages",
      },
      {
        id: "santuario",
        year: "Vision",
        title: "Un refuge pour l’art",
        text:
          "Très vite, nous avons compris que les plateformes existantes étaient remplies de métriques, de tendances et d’algorithmes capables d’enterrer l’âme d’un créateur. Nous ne voulions pas que notre voix se noie dans les chiffres. ZProject devait être autre chose : un refuge, un sanctuaire où l’art respire, où les idées ne s’oublient pas et où les rêveurs sont valorisés pour ce qu’ils sont, pas pour ce qu’ils produisent.",
        img: "/about/refugio.gif",
        imgAlt: "Refuge pour l’art",
      },
      {
        id: "hoy",
        year: "Aujourd’hui",
        title: "Ce n’est que le début",
        text:
          "Après des années de persévérance, ZProject est bien vivant. Ce qui a commencé avec deux adolescents rêveurs est aujourd’hui un espace qui inspire, unit et redonne espoir à ceux qui croient au pouvoir de l’art. Nous ne sommes pas là pour remplacer ton monde : nous sommes là pour l’améliorer. Et le plus beau, c’est que cette histoire ne fait que commencer. Si tu as déjà rêvé de créer, cet endroit est aussi pour toi.",
        img: "/about/hoy.jpg",
        imgAlt: "ZProject aujourd’hui",
      },
    ];

    const en: Block[] = [
      {
        id: "2017",
        year: "2017",
        title: "The beginning — November 6, 2017",
        text:
          "ZProject was born on November 6, 2017, when two teenagers, Boxter and Kuro, both 16, dared to imagine something bigger than themselves. We were just two kids overflowing with creativity and a question that brought us together: what if we built a place where our dreams could grow? Inspired by creators already sharing ideas across different platforms, we set out on our own journey. That was the first spark of what we now call ZProject.",
        img: "/about/2017-kuro-boxter.jpg",
        imgAlt: "Kuro & Boxter, 2017",
      },
      {
        id: "2017-2018",
        year: "2017–2018",
        title: "The first spark",
        text:
          "At first, we explored existing social platforms. We recorded, created, and shared with the eagerness of those who dream of changing the world. It became our first creative school: we learned to organize, shape ideas, and stay consistent. During this stage, we met Yume, whose energy opened new doors and introduced us to Kouga. The spark Boxter had lit quickly spread.",
        img: "/about/2018-intentos-plataformas.jpg",
        imgAlt: "Early creations and posts",
      },
      {
        id: "2018",
        year: "2018",
        title: "Avatars with soul",
        text:
          "We wanted simple digital avatars to represent us online. Then one day, Boxter said something that changed everything: “What if we give them a story?”. That simple yet powerful idea turned static drawings into characters with life, identity, and emotion. Without noticing, what began as personal representation became the start of whole universes.",
        img: "/about/2018-avatares.jpg",
        imgAlt: "Avatar sketches",
      },
      {
        id: "2019-2020",
        year: "2019–2020",
        title: "Worldbuilding",
        text:
          "As days passed, stories grew, characters multiplied, and worlds expanded. It was no longer a pastime; it was a creative movement pushing us to keep dreaming. The group expanded to five people, each leaving a mark. Some moved on, but everyone helped build this. ZProject learned to rise even through adversity—authentic dreams don’t die.",
        img: "/about/2020-mundos.jpg",
        imgAlt: "World & character concept art",
      },
      {
        id: "santuario",
        year: "Vision",
        title: "A refuge for art",
        text:
          "We soon realized existing platforms were ruled by metrics, trends, and algorithms that could bury a creator’s soul. We didn’t want our voice drowned in numbers. ZProject had to be something else: a refuge, a sanctuary where art breathes, where ideas aren’t forgotten, and where dreamers are valued for who they are—not for what they yield.",
        img: "/about/refugio.gif",
        imgAlt: "A refuge for art",
      },
      {
        id: "hoy",
        year: "Today",
        title: "This is just beginning",
        text:
          "After years of perseverance, ZProject is alive and in motion. What began with two teenagers dreaming now stands as a space that inspires, unites, and gives hope to those who believe in the power of art. We’re not here to replace your world—we’re here to make it better. And the best part is that this story is only beginning. If you’ve ever dreamed of creating, this place is for you.",
        img: "/about/hoy.jpg",
        imgAlt: "ZProject today",
      },
    ];

    return lang === "es" ? es : lang === "pt" ? pt : lang === "fr" ? fr : en;
  }, [lang]);

  return (
    <main className="about-root">
      <section className="container px-6">
        <header className="about-hero">
          <h1 className="about-title">
            ZProject — <span className="thin">Nuestra historia</span>
          </h1>
          <p className="about-sub">
            Un sueño que comenzó en 2017 y que hoy sigue creciendo paso a paso.
          </p>
        </header>

        <div className="timeline">
          <div className="line" aria-hidden />
          {content.map((b, i) => {
            const textOnLeft = i % 2 === 0; // alterna lado del TEXTO
            const Media = b.img ? (
              <div
                className="media-pane"
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="media-wrap">
                  <Image
                    src={b.img}
                    alt={b.imgAlt}
                    width={1200}
                    height={800}
                    className="media-img"
                    sizes="(max-width: 900px) 92vw, 520px"
                    priority={i === 0}
                    draggable={false}
                  />
                  <span className="media-mask" aria-hidden />
                </div>
                <span className="media-caption">{b.imgAlt}</span>
              </div>
            ) : <div />;

            const TextCard = (
              <div className="card settings-card">
                <div className="meta">
                  <span className="badge">{b.year}</span>
                </div>
                <h3 className="card-title">{b.title}</h3>
                <p className="card-text">{b.text}</p>
              </div>
            );

            return (
              <article key={b.id} className="row">
                <div className="dot" aria-hidden />
                {textOnLeft ? (
                  <>
                    <div className="side side-text">{TextCard}</div>
                    <div className="side side-media">{Media}</div>
                  </>
                ) : (
                  <>
                    <div className="side side-media">{Media}</div>
                    <div className="side side-text">{TextCard}</div>
                  </>
                )}
              </article>
            );
          })}
        </div>

        <footer className="about-cta">
          <Link href="/signup" className="btn-primary">Únete al santuario</Link>
          <Link href="/thanks" className="btn-ghost">Apoyar</Link>
        </footer>
      </section>

      <style>{`
        .about-root{ position:relative; z-index:2; }
        .about-hero{ text-align:center; margin: 10px 0 26px 0; }
        .about-title{ font-size: clamp(28px, 5vw, 48px); font-weight: 900; letter-spacing:.2px; margin:0; }
        .about-title .thin{ font-weight: 700; opacity:.95; }
        .about-sub{ opacity:.9; margin: 8px 0 0 0; }

        /* Timeline layout base */
        .timeline{ position:relative; margin: 26px auto 36px auto; max-width: 1100px; }
        .line{ position:absolute; top:0; bottom:0; left:50%; width:2px; transform: translateX(-50%); background: color-mix(in oklab, var(--foreground), transparent 80%); }

        .row{
          position:relative;
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items:start;
          margin: 42px 0;
        }

        .dot{
          position:absolute; top: 10px; left:50%; transform: translate(-50%,-50%);
          width:12px; height:12px; border-radius:999px;
          background: rgba(34,197,94,.85); box-shadow: 0 0 0 4px rgba(34,197,94,.15);
          z-index: 1;
        }

        .side{ min-width: 0; }
        .side-text .card{ display:grid; gap:10px; padding:18px; }
        .meta{ display:flex; align-items:center; justify-content:flex-start; }
        .badge{ display:inline-block; padding:.35rem .6rem; border-radius:.6rem; background: rgba(34,197,94,.14); border:1px solid rgba(34,197,94,.3); color:#c7ffdf; font-size:.82rem; }
        .card-title{ margin:0; font-weight:800; font-size: clamp(18px, 2.4vw, 24px); }
        .card-text{ margin:0; opacity:.92; line-height:1.6; }

        /* Media pane (lado opuesto) */
        .media-pane{ display:grid; gap:6px; justify-items:center; }
        .media-wrap{ position:relative; width:100%; max-width:520px; }
        .media-img{
          width:100%; height:auto; border-radius:12px;
          border: 1px solid color-mix(in oklab, var(--foreground), transparent 88%);
          box-shadow: 0 10px 24px rgba(0,0,0,.22);
          user-select:none; -webkit-user-drag:none; -webkit-touch-callout:none;
        }
        /* Capa transparente para desincentivar drag/guardar */
        .media-mask{
          position:absolute; inset:0; content:""; display:block;
          background: transparent; pointer-events:none;
        }
        .media-caption{ display:block; opacity:.7; font-size:.9rem; text-align:center; }

        .about-cta{ margin: 28px 0 8px 0; display:flex; gap:12px; align-items:center; justify-content:center; }

        /* ====== MOBILE ====== */
        @media (max-width: 900px){
          .timeline{ max-width: 760px; padding-left: 18px; }
          .line{ left: 10px; transform:none; }
          .dot{ left: 10px; transform: translate(-50%,-50%); }
          .row{
            grid-template-columns: 1fr;
            gap: 16px;
            margin: 28px 0;
          }
          /* Orden amigable en móvil: año/título -> imagen -> texto */
          .side-media{ order: 2; }
          .side-text{ order: 3; }
          .media-wrap{ max-width: 100%; }
          .media-img{ border-radius:10px; }
        }
      `}</style>
    </main>
  );
}

export default function AboutPage() {
  return (
    <I18nProvider>
      <AboutInner />
    </I18nProvider>
  );
}
