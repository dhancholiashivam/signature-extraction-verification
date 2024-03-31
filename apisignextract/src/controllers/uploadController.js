const fs = require('fs');
const path = require('path'); // Ensure path is required at the top
const sharp = require('sharp'); // Ensure sharp is required if not already
const { client } = require('../middlewares/textract');
const { AnalyzeDocumentCommand, DetectDocumentTextCommand } = require("@aws-sdk/client-textract"); // Assuming AWS SDK v3

async function extractSignatures(filePath) {
  const documentBytes = fs.readFileSync(filePath);
  const imageMetadata = await sharp(documentBytes).metadata();

  // Extract the image name without extension to use as a suffix
  const imageName = path.basename(filePath, path.extname(filePath));

  // Ensure the extracted_data directory exists
  const outputDir = './extracted_data';
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
  }

  const params = {
      Document: {Bytes: documentBytes},
      FeatureTypes: ['SIGNATURES', 'FORMS']
  };

  try {
      const command = new AnalyzeDocumentCommand(params);
      const response = await client.send(command);

      // Initialize containers for signatures and form data
      const signatures = [];
      const formData = [];

      response.Blocks.forEach(block => {
        if (block.BlockType === 'SIGNATURE') {
            const boundingBox = block.Geometry.BoundingBox;
    
            // Use actual dimensions from the image metadata
            const left = boundingBox.Left * imageMetadata.width;
            const top = boundingBox.Top * imageMetadata.height;
            const width = boundingBox.Width * imageMetadata.width;
            const height = boundingBox.Height * imageMetadata.height;

            if (left >= 0 && top >= 0 && width > 0 && height > 0 && left + width <= imageMetadata.width && top + height <= imageMetadata.height) {
                const outputPath = `${outputDir}/extracted_signature_${imageName}_${signatures.length + 1}.png`;
                sharp(documentBytes)
                    .extract({left: Math.round(left), top: Math.round(top), width: Math.round(width), height: Math.round(height)})
                    .toFile(outputPath, (err, info) => {
                        if (err) throw err;
                        console.log('Signature extracted successfully:', info);
                    });
                signatures.push({left, top, width, height, outputPath});
            } else {
                console.error('Invalid extraction area:', {left, top, width, height});
            }
        } else if (block.BlockType === 'KEY_VALUE_SET' && block.EntityTypes.includes('KEY')) {
            formData.push(block);
        }
    });

    console.log(`Found ${signatures.length} signatures.`);
    signatures.forEach((signature, index) => {
        console.log(`Signature ${index + 1}:`, signature);
    });

    return signatures;

  } catch (error) {
      console.error('Error calling Amazon Textract:', error);
  }
}

// DATA EXTRACTION 
async function extractTextData(filePath) {
  const documentBytes = fs.readFileSync(filePath);
  const imageName = path.basename(filePath, path.extname(filePath));
  const outputDir = './extracted_data';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const params = {
    Document: { Bytes: documentBytes }
  };

  try {
    const command = new DetectDocumentTextCommand(params);
    const response = await client.send(command);
    const textData = response.Blocks.filter(block => block.BlockType === 'LINE').map(line => line.Text);

    if (textData.length > 0) {
      const textDataPath = `${outputDir}/extracted_text_${imageName}.txt`;
      fs.writeFileSync(textDataPath, textData.join('\n'), 'utf8');
      console.log('Text data extracted successfully and saved to', textDataPath);
    } else {
      console.log('No text data found.');
    }
    return textData; // Return the extracted text data
  } catch (error) {
    console.error('Error calling Amazon Textract for text data extraction:', error);
  }
}

async function extractData(req, res) {
  if (!req.file || !req.file.path) {
    console.error('File path is undefined.');
    return res.status(400).json({ error: 'No file uploaded or file path is undefined.' });
  }
  const filePath = req.file.path;
  try {
    const textData = await extractTextData(filePath);
    res.status(200).json({ message: 'Image processed successfully', data: textData });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function extractSign(req, res) {
  if (!req.file || !req.file.path) {
    console.error('File path is undefined.');
    return res.status(400).json({ error: 'No file uploaded or file path is undefined.' });
  }
  const filePath = req.file.path;

  try {
    const signatures = await extractSignatures(filePath);
    // Convert the file paths of the cropped images to URLs
    const signatureUrls = signatures.map(signature => {
      const url = `${req.protocol}://${req.get('host')}/extracted_data/${path.basename(signature.outputPath)}`;
      return url;
    });
    res.status(200).json({ message: 'Signatures extracted successfully', signatures: signatureUrls });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  extractData,
  extractSign
};
