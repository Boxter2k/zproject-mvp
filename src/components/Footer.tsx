export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-6 text-center text-sm text-zinc-400">
      <p>
        © {new Date().getFullYear()} ZProject — Hecho con ❤️ y Next.js
      </p>
    </footer>
  );
}