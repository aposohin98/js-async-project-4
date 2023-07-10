import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import https from 'https';

const getFileNameFromUrl = (url) => {
  const { hostname, pathname } = new URL(url);

  const fileName = `${hostname}${pathname}`.replace(/[^\w\d]/g, '-');

  return `${fileName}.html`;
};

const saveHtml = async (url, options) => {
  const dir = options.output ?? process.cwd();
  const fileName = getFileNameFromUrl(url);
  const outputFile = path.join(dir, fileName);

  const httpAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const { data } = await axios.get(url, { httpAgent });

  fs.writeFile(outputFile, data);
};

export default saveHtml;
