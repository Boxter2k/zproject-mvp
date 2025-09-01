"use client";
import { useEffect, useMemo, useState } from "react";
type Tag = { id:string; name:string; category:"DISCIPLINA"|"ESTILO"|"TEMA" };

const USER_ID = "PON_AQUI_TU_USER_ID";

export default function OnboardingPage(){
  const [tags,setTags]=useState<Tag[]>([]);
  const [likes,setLikes]=useState<string[]>([]);
  const [dislikes,setDislikes]=useState<string[]>([]);
  const [ok,setOk]=useState("");

  useEffect(()=>{ (async()=> setTags(await (await fetch("/api/tags")).json()))(); }, []);
  const groups = useMemo(()=>({
    DISCIPLINA: tags.filter(t=>t.category==="DISCIPLINA"),
    ESTILO:     tags.filter(t=>t.category==="ESTILO"),
    TEMA:       tags.filter(t=>t.category==="TEMA"),
  }),[tags]);

  const toggle=(list:"likes"|"dislikes",id:string)=>{
    const A = list==="likes"?likes:dislikes;
    const setA = list==="likes"?setLikes:setDislikes;
    setA(A.includes(id)?A.filter(x=>x!==id):[...A,id]);
  };

  const save = async ()=>{
    await fetch("/api/onboarding",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ userId: USER_ID, likes, dislikes })});
    setOk("Preferencias guardadas ✅ — ve al Home /");
  };

  const Block=({title,items}:{title:string;items:Tag[]})=>(
    <section className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map(t=>(
          <div key={t.id} className="flex items-center gap-1">
            <button className={`px-2 py-1 rounded-full border ${likes.includes(t.id)?"bg-green-600 text-white":""}`} onClick={()=>toggle("likes",t.id)}>👍 {t.name}</button>
            <button className={`px-2 py-1 rounded-full border ${dislikes.includes(t.id)?"bg-red-600 text-white":""}`} onClick={()=>toggle("dislikes",t.id)}>👎</button>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Onboarding — gustos y no-gustos</h1>
      <Block title="Disciplinas" items={groups.DISCIPLINA} />
      <Block title="Estilos" items={groups.ESTILO} />
      <Block title="Temas" items={groups.TEMA} />
      <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={save}>Guardar</button>
      {ok && <p className="text-green-600">{ok}</p>}
    </main>
  );
}
