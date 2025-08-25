import Link from 'next/link';

export default function Home() {
  return (
    <section className="text-center">
      <h1 className="mb-4 text-5xl font-extrabold tracking-tight">
        Bienvenido a <span className="text-emerald-400">ZProject</span> 🚀
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-zinc-300">
        Un santuario de creatividad, entretenimiento y colaboración. Conéctate,
        crea y transforma el mundo con nosotros.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/comunidad"
          className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
        >
          Únete a la Comunidad
        </Link>
        <Link
          href="/zshop"
          className="rounded-xl border border-white/10 px-5 py-3 font-medium text-white hover:bg-white/5"
        >
          Explorar ZShop
        </Link>
      </div>
    </section>
  );
}