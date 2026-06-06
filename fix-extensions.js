const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.js')) {
          results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let count = 0;
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // If the file contains JSX syntax or React imports
    if (content.includes('import React') || content.includes('<div') || content.includes('/>') || content.includes('</') || content.match(/<\w+/)) {
        const newFile = file + 'x';
        fs.renameSync(file, newFile);
        console.log(`Renamed ${file} to ${newFile}`);
        count++;
    }
});
console.log(`Renamed ${count} files.`);
