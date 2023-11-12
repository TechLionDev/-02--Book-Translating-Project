const fs = require('fs');
const path = require('path');
const { convert } = require('pdf-poppler');

const pdfsFolder = './pdfs';
const imagesFolder = './images';

async function convertPDFToPNG(pdfPath, outputFolder) {
  const pdfName = path.basename(pdfPath, path.extname(pdfPath));
  const outputPath = path.join(outputFolder, pdfName);

  // Create a folder for PNG images if it doesn't exist
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  try {
    const opts = {
      format: 'png',
      out_dir: outputPath,
      out_prefix: `${pdfName}_page_`,
      page: null, // null means all pages
    };

    await convert(pdfPath, opts);

    console.log(`All pages of ${pdfName} converted successfully.`);
  } catch (err) {
    console.error(`Error converting ${pdfName}: ${err.message}`);
  }
}

async function convertAllPDFs() {
  const pdfFiles = fs.readdirSync(pdfsFolder);

  for (const pdfFile of pdfFiles) {
    if (path.extname(pdfFile).toLowerCase() === '.pdf') {
      const pdfPath = path.join(pdfsFolder, pdfFile);
      const outputFolder = path.join(imagesFolder, path.basename(pdfPath, path.extname(pdfPath)));

      console.log(`Converting ${pdfFile}...`);
      await convertPDFToPNG(pdfPath, outputFolder);
    }
  }
}

// Start the conversion process
convertAllPDFs();
