"use client";
import { useEffect, useState } from "react";
type Tag = { id: string; name: string; category: "DISCIPLINA"|"ESTILO"|"TEMA" };

const USER_ID = "PON_AQUI_TU_USER_ID";

export default function ComposePage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [ok, setOk] = useState("");

  useEffect(()=>{ (async()=> setTags(await (await fetch("/api/tags")).json()))(); }, []);
  const toggle = (id:string)=> setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);

  const submit = async ()=>{
    const res = await fetch("/api/posts", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ authorId: USER_ID, title, description: desc, imageUrl: imageUrl||null, videoUrl: null, tagIds: selected })
    });
    if(res.ok){ setOk("Creado ✅ — ve al Home /"); setTitle(""); setDesc(""); setImageUrl(""); setSelected([]); }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Crear post</h1>
      <input className="w-full border rounded p-2" placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="w-full border rounded p-2" placeholder="Descripción" value={desc} onChange={e=>setDesc(e.target.value)} />
      <input className="w-full border rounded p-2" placeholder="URL de imagen (opcional)" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
      <div>
        <h2 className="font-medium mb-2">Etiquetas</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(t=>{
            const active = selected.includes(t.id);
            return (
              <button key={t.id}
                className={`px-2 py-1 rounded-full border ${active?"bg-black text-white":""}`}
                onClick={()=>toggle(t.id)}>
                {t.name} · {t.category}
              </button>
            );
          })}
        </div>
      </div>
      <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={submit}>Publicar</button>
      {ok && <p className="text-green-600">{ok}</p>}
    </main>
  );
}
