import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const disciplinas = ["Ilustración","Animación","Música","3D","Pixel Art","Game Dev","Cine"];
const estilos = ["Cartoon","Realista","Anime","Low Poly","Pintura Digital"];
const temas = ["Fantasy","Sci-Fi","Horror","Slice of Life","Cyberpunk"];

async function upsert(names: string[], category: "DISCIPLINA"|"ESTILO"|"TEMA") {
  for (const name of names) {
    await prisma.tag.upsert({
      where: { name },
      create: { name, category },
      update: {}
    });
  }
}

async function main() {
  await upsert(disciplinas, "DISCIPLINA");
  await upsert(estilos, "ESTILO");
  await upsert(temas, "TEMA");
  console.log("Seed listo ✅");
}

main().finally(()=>prisma.$disconnect());
