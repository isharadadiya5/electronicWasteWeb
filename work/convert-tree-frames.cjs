const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const folder = path.resolve("public/tree-frames");

(async () => {
  for (let frame = 1; frame <= 150; frame += 1) {
    const number = String(frame).padStart(3, "0");
    const source = path.join(folder, `frame_${number}.png`);
    const target = path.join(folder, `frame_${number}.webp`);
    await sharp(source).webp({ quality: 78, effort: 5 }).toFile(target);
  }
  const files = await fs.readdir(folder);
  const total = await Promise.all(files.filter((name) => name.endsWith(".webp")).map(async (name) => (await fs.stat(path.join(folder, name))).size));
  process.stdout.write(`Converted ${total.length} frames to WebP (${(total.reduce((sum, size) => sum + size, 0) / 1024 / 1024).toFixed(2)} MB total).\n`);
})().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exitCode = 1;
});
