const fs = require('fs');
const path = require('path');
const { translate } = require('translate-api');

// Set the target language for translation (English in this case)
const targetLanguage = 'en';

// Function to translate text using libretranslate.com API
async function translateText(text) {
  try {
    const translatedResult = await translate(text, { to: targetLanguage });
    return translatedResult.text;
  } catch (err) {
    console.error('Error translating text:', err);
    return '';
  }
}

// Function to process a file and write the translation
async function processFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const translatedText = await translateText(fileContent);
    const dirname = path.dirname(filePath);
    const translatedFilePath = path.join(dirname, 'english.txt');
    fs.writeFileSync(translatedFilePath, translatedText);
    console.log(`File translated and written to: ${translatedFilePath}`);
  } catch (err) {
    console.error('Error processing file:', err);
  }
}

// Function to recursively traverse directories and process files
function traverseDir(dirPath) {
  fs.readdirSync(dirPath, { withFileTypes: true }).forEach((entry) => {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      traverseDir(entryPath);
    } else if (entry.isFile() && path.extname(entry.name) === '.txt') {
      processFile(entryPath);
    }
  });
}

// Replace 'outputs' with the path to your directory containing the Arabic text files
const directoryPath = path.join(__dirname, 'outputs');

// Start the translation process
traverseDir(directoryPath);
