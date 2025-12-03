import fs from "fs";
import path from "path";
import postcss from "postcss";
import stylelint from "stylelint";

const cssDir = "./src"; // pasta do seu projeto
const files = [];

function walk(dir) {
const items = fs.readdirSync(dir);
items.forEach((item) => {
const fullPath = path.join(dir, item);
if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
else if (fullPath.endsWith(".css")) files.push(fullPath);
});
}
walk(cssDir);

(async () => {
for (const file of files) {
const css = fs.readFileSync(file, "utf-8");
const result = await stylelint.lint({
code: css,
codeFilename: file,
config: {
rules: {
"selector-class-pattern": ["^[a-z][a-z0-9\-]+$", { message: "Use kebab-case" }],
"no-duplicate-selectors": true
}
}
});

if (result.results && result.results.length > 0) {
  const warnings = result.results[0].warnings || [];
  if (warnings.length > 0) {
    console.log(`\nArquivo: ${file}`);
    warnings.forEach((w) => {
      console.log(`  Linha ${w.line}: ${w.text}`);
    });
  }
}


}
})();
