// check-css-vars.js
import fs from "fs";
import path from "path";
import glob from "glob";

const projectDir = "./src"; // pasta do seu projeto
const cssFiles = glob.sync(`${projectDir}/**/*.css`);

const varMap = {}; // { nomeVariavel: [{file, line}] }

cssFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, idx) => {
    const match = line.match(/^\s*--([\w-]+)\s*:/);
    if (match) {
      const varName = match[1];
      if (!varMap[varName]) varMap[varName] = [];
      varMap[varName].push({ file, line: idx + 1 });
    }
  });
});

let duplicatesFound = false;
for (const [varName, occurrences] of Object.entries(varMap)) {
  if (occurrences.length > 1) {
    duplicatesFound = true;
    console.log(`\nVariável duplicada: --${varName}`);
    occurrences.forEach((occ) =>
      console.log(`  Arquivo: ${occ.file}, Linha: ${occ.line}`)
    );
  }
}

if (!duplicatesFound) console.log("Nenhuma variável duplicada encontrada entre arquivos.");
