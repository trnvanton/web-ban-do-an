const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'public', 'uploads');
const destDir = path.join(__dirname, '..', '..', 'fe', 'public', 'uploads');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
let count = 0;
for (const file of files) {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        count++;
    }
}

console.log(`✅ Đã sao chép ${count} ảnh từ be/public/uploads sang fe/public/uploads!`);
