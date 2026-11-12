import fs from "node:fs";
import path from "node:path";

const raiz = process.cwd();
const gravar = process.argv.includes("--write");
const pacote = path.join(raiz, "node_modules", "@solar-icons", "react-native");
const pastaBarrel = path.join(raiz, "lib", "solar-icons");

if (!fs.existsSync(path.join(pacote, "dist", "icons", "bold"))) {
  console.error("Não achei dist/icons/bold em node_modules/@solar-icons/react-native. Rode npm install antes.");
  process.exit(1);
}
if (!fs.existsSync(pastaBarrel)) {
  console.error("Não achei a pasta lib/solar-icons. Rode o script na raiz do projeto.");
  process.exit(1);
}

const pastasDeEstilo = {
  Bold: "bold",
  BoldDuotone: "bold-duotone",
  Broken: "broken",
  LineDuotone: "line-duotone",
  Linear: "linear",
  Outline: "outline",
};

// 1) Índice do pacote instalado: nome antigo do ícone -> arquivo e nome exportado novo
const indiceNovo = {};
for (const pasta of Object.values(pastasDeEstilo)) {
  indiceNovo[pasta] = {};
  const dir = path.join(pacote, "dist", "icons", pasta);
  for (const arquivo of fs.readdirSync(dir)) {
    if (!arquivo.endsWith(".d.mts")) continue;
    const m = fs.readFileSync(path.join(dir, arquivo), "utf8").match(/export declare const (\w+): Icon/);
    if (!m) continue;
    const nomeAntigo = m[1].endsWith("Icon") ? m[1].slice(0, -4) : m[1];
    indiceNovo[pasta][nomeAntigo] = { arquivo: arquivo.replace(/\.d\.mts$/, ""), exportado: m[1] };
  }
}

// 2) Lê os barrels atuais: (arquivo do barrel, nome exportado) -> estilo e nome original do ícone
const barrel = {};
for (const arquivo of fs.readdirSync(pastaBarrel)) {
  if (!/\.(ts|tsx|js)$/.test(arquivo)) continue;
  const stem = arquivo.replace(/\.(ts|tsx|js)$/, "");
  const texto = fs.readFileSync(path.join(pastaBarrel, arquivo), "utf8");
  const re = /export\s*\{\s*(\w+)(?:\s+as\s+(\w+))?\s*\}\s*from\s*["']@solar-icons\/react-native\/icon\/[^/"']+\/(\w+)\/\w+["']/g;
  let m;
  while ((m = re.exec(texto))) {
    barrel[`${stem}|${m[2] ?? m[1]}`] = { original: m[1], estilo: m[3] };
  }
}

// 3) Percorre o projeto e reescreve os imports do barrel
function listar(dir, saida) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const caminho = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (["node_modules", "android", "ios", ".expo", ".git", "dist", "build"].includes(e.name)) continue;
      if (caminho === pastaBarrel) continue;
      listar(caminho, saida);
    } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) {
      saida.push(caminho);
    }
  }
  return saida;
}

const problemas = [];
let arquivosAlterados = 0;
let importsMigrados = 0;

for (const arquivo of listar(raiz, [])) {
  const rel = path.relative(raiz, arquivo);
  const original = fs.readFileSync(arquivo, "utf8");
  const re = /import\s*\{([\s\S]*?)\}\s*from\s*["'](?!@solar-icons\/)[^"']*\/solar-icons\/(\w+)["']\s*;?/g;

  const novo = original.replace(re, (trecho, lista, stem) => {
    const linhas = [];
    const erros = [];
    for (let item of lista.split(",").map((s) => s.trim()).filter(Boolean)) {
      item = item.replace(/^type\s+/, "");
      const [nome, apelido] = item.split(/\s+as\s+/);
      const info = barrel[`${stem}|${nome}`];
      if (!info) {
        erros.push(`${rel}: "${nome}" não está em lib/solar-icons/${stem}`);
        continue;
      }
      const pasta = pastasDeEstilo[info.estilo];
      const destino = pasta && indiceNovo[pasta][info.original];
      if (!destino) {
        const inicio = info.original.match(/^[A-Z][a-z0-9]*/)?.[0] ?? info.original;
        const parecidos = pasta
          ? Object.keys(indiceNovo[pasta]).filter((n) => n.startsWith(inicio)).slice(0, 8).join(", ")
          : "";
        erros.push(`${rel}: o ícone "${info.original}" (${info.estilo}) não existe no 2.x. Parecidos: ${parecidos || "nenhum"}`);
        continue;
      }
      const local = apelido ?? nome;
      const especificador = local === destino.exportado ? local : `${destino.exportado} as ${local}`;
      linhas.push(`import { ${especificador} } from "@solar-icons/react-native/${pasta}/${destino.arquivo}";`);
    }
    if (erros.length) {
      problemas.push(...erros);
      return trecho;
    }
    importsMigrados += linhas.length;
    return linhas.join("\n");
  });

  if (novo !== original) {
    arquivosAlterados++;
    console.log(`${gravar ? "alterado" : "alteraria"}: ${rel}`);
    if (gravar) fs.writeFileSync(arquivo, novo);
  }
}

console.log(`\n${importsMigrados} ícones em ${arquivosAlterados} arquivos ${gravar ? "migrados" : "(simulação, nada foi gravado)"}.`);
if (problemas.length) {
  console.log("\nPrecisam de atenção manual (esses imports não foram alterados):");
  for (const p of problemas) console.log(" - " + p);
  process.exit(1);
}