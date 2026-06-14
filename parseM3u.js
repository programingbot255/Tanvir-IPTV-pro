import fs from 'fs';

const text = fs.readFileSync('m3u_input.txt', 'utf8');
const lines = text.split('\n');

const channels = [];

let currentName = '';
let groupTitle = 'OTHERS';
let logoUrl = 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=100&auto=format&fit=crop&q=60';
let currentId = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  if (line.startsWith('#EXTINF:')) {
    const commaIdx = line.indexOf(',');
    if (commaIdx !== -1) {
      currentName = line.substring(commaIdx + 1).trim();
    } else {
      currentName = 'Stream Channel ' + (channels.length + 1);
    }
    
    const groupMatch = line.match(/group-title="([^"]+)"/i);
    const catRaw = groupMatch && groupMatch[1] ? groupMatch[1].toUpperCase() : '';
    
    if (catRaw.includes('FIFA')) {
      groupTitle = 'FIFA';
    } else if (catRaw.includes('BENGALI') || catRaw.includes('BANGLA')) {
      groupTitle = 'BENGALI';
    } else if (catRaw.includes('HINDI')) {
      groupTitle = 'HINDI';
    } else if (catRaw.includes('KID')) {
      groupTitle = 'KIDS';
    } else if (catRaw.includes('MUSIC')) {
      groupTitle = 'MUSICS';
    } else if (catRaw.includes('NEWS')) {
      groupTitle = 'NEWS';
    } else if (catRaw.includes('MOVIE')) {
      groupTitle = 'MOVIES';
    } else if (catRaw.includes('SPORT')) {
      groupTitle = 'SPORTS';
    } else if (catRaw.includes('ENGLISH')) {
      groupTitle = 'ENGLISH';
    } else {
      groupTitle = 'OTHERS';
    }

    const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
    if (logoMatch && logoMatch[1]) {
      logoUrl = logoMatch[1];
    } else {
      logoUrl = 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=100&auto=format&fit=crop&q=60';
    }
  } else if (line.startsWith('http://') || line.startsWith('https://')) {
    channels.push({
      id: 'ext-' + Math.random().toString(36).substring(2, 11),
      name: currentName || 'Stream ' + (channels.length + 1),
      url: line,
      category: groupTitle,
      logo: logoUrl,
      country: 'Global'
    });
    
    currentName = '';
    groupTitle = 'OTHERS';
    logoUrl = 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=100&auto=format&fit=crop&q=60';
  }
}

fs.writeFileSync('parsed_channels.json', JSON.stringify(channels, null, 2));

console.log("Done parsing.");
