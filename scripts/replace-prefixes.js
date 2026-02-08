const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'lib');
const changed = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile()) processFile(full);
  }
}

function processFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  let newText = text;

  newText = newText.replace(/process\.env\.ADMIN_PREFIX/g, "process.env.NEXT_PUBLIC_ADMIN_PREFIX ?? process.env.ADMIN_PREFIX ?? '/admin'");
  newText = newText.replace(/process\.env\.USER_PREFIX/g, "process.env.NEXT_PUBLIC_USER_PREFIX ?? process.env.USER_PREFIX ?? '/user'");

  if (newText !== text) {
    fs.writeFileSync(filePath, newText, 'utf8');
    changed.push(path.relative(path.join(__dirname, '..'), filePath));
  }
}

walk(root);

const outPath = path.join(__dirname, '..', 'scripts', 'changed-files-prefixes.json');
fs.writeFileSync(outPath, JSON.stringify(changed, null, 2), 'utf8');
console.log('Changed files written to', outPath);
console.log(JSON.stringify(changed));
