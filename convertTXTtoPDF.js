const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Function to remove character Ð from content
function removeCharacter(content) {
  return content.replaceAll('Ð', '');
}

// Function to convert txt files to PDFs
async function convertToPdf(txtFilePath, pdfFilePath) {
  const content = fs.readFileSync(txtFilePath, 'utf-8');
  const sanitizedContent = removeCharacter(content);

  const lines = sanitizedContent.split('\n');
  const pdfDoc = new PDFDocument();
  const stream = fs.createWriteStream(pdfFilePath);

  pdfDoc.pipe(stream);
  pdfDoc.fontSize(12);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '-----------') {
      pdfDoc.addPage();
    } else {
      pdfDoc.text(line, { align: 'left' });
    }
  }

  pdfDoc.end();

  await new Promise((resolve) => {
    stream.on('finish', resolve);
  });
}

// Function to create subfolders recursively
function createOutputSubfolders(inputDir, outputDir) {
  const subFolders = fs.readdirSync(inputDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const subFolder of subFolders) {
    const subFolderPath = path.join(outputDir, subFolder);
    fs.mkdirSync(subFolderPath, { recursive: true });
  }
}

// Function to convert all files in the specified input/output directories
async function convertFiles(inputDir, outputDir) {
  console.log('Starting file conversion...');

  try {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Output directory created: ${outputDir}`);
  } catch (error) {
    console.error('Error creating output directory:', error.message);
    return;
  }

  createOutputSubfolders(inputDir, outputDir);

  const subFolders = fs.readdirSync(inputDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const subFolder of subFolders) {
    const txtFilePath = path.join(inputDir, subFolder, 'english.txt');
    const pdfFilePath = path.join(outputDir, subFolder, 'pdf.pdf');

    try {
      await convertToPdf(txtFilePath, pdfFilePath);
      console.log(`File converted for ${subFolder}: ${pdfFilePath}`);
    } catch (error) {
      console.error(`Error converting file for ${subFolder}:`, error.message);
    }
  }

  console.log('File conversion completed.');
}

// Replace 'outputs' and 'books' with your input and output directories respectively
const inputDir = path.join(__dirname, 'outputs');
const outputDir = path.join(__dirname, 'books');

convertFiles(inputDir, outputDir)
  .then(() => console.log('All files converted successfully.'))
  .catch((error) => console.error('Error converting files:', error));
