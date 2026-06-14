import fs from 'fs';

const channelsDataPath = './src/channelsData.ts';
const parsedDataStr = fs.readFileSync('parsed_channels.json', 'utf8');
const channelsData = JSON.parse(parsedDataStr);

let originalCode = fs.readFileSync(channelsDataPath, 'utf8');

const updatedChannelsString = JSON.stringify(channelsData, null, 2).replace(/"([^"]+)":/g, '$1:');

// Replace the end of the array with our new content. We just append the entries at the end.
const arrayEnd = originalCode.lastIndexOf('];');

if (arrayEnd !== -1) {
    const rawChannelsToAdd = updatedChannelsString.substring(1, updatedChannelsString.length - 1);
    
    const newCode = originalCode.substring(0, arrayEnd - 1) + ',\n  // Custom Additions\n' + rawChannelsToAdd + '\n];\n' + originalCode.substring(arrayEnd + 2);

    fs.writeFileSync(channelsDataPath, newCode);
    console.log("Successfully updated channelsData.ts");
} else {
    console.log("Could not find end of array in channelsData.ts");
}
