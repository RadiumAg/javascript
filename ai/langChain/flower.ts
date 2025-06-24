/**
 * rag实例
 *
 *
 */
import path from 'path';
import fs from 'fs';
import PdfParse from 'pdf-parse/lib/pdf-parse';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const loadFile = async (path: string) => {
  if (path.endsWith('.pdf')) {
    const dataBuffer = fs.readFileSync(path);
    const data = await PdfParse(dataBuffer);
    return data;
  }
};

const filePath = path.resolve(
  './doc',
  '2208_professional-javascript-for-web-developers-5-ed.pdf'
);

const docContent = await loadFile(filePath);

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 250,
});

if (docContent) {
  const docSplits = await textSplitter.splitText(docContent.text);
  console.log(docSplits);
}
