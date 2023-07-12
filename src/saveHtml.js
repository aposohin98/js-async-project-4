import axios from 'axios';
import path from 'path';
import fsp from 'fs/promises';
import { load } from 'cheerio';
import noop from './utils/noop.js';
import removeFileExtension from './utils/removeFileExtension.js';
import getFileNameFromUrl from './utils/getFileNameFromUrl.js';

class PageLoader {
  constructor(url, options) {
    const { origin } = new URL(url);

    this.domain = origin;
    this.url = url;
    this.dir = options.output ?? process.cwd();
    this.fileName = getFileNameFromUrl(url);
  }

  normalizeUrl(url) {
    const isRelativeUrl = !(url.startsWith('http://') || url.startsWith('https://'));

    return isRelativeUrl ? this.domain + url : url;
  }

  async saveImages(html) {
    const filesDir = `${removeFileExtension(this.fileName)}_files`;
    const filesAbsoluteDir = path.join(this.dir, filesDir);

    await fsp.mkdir(filesAbsoluteDir).catch(noop);

    const $ = load(html);
    const images = $('img');

    const promises = images.map(async (_, el) => {
      const src = this.normalizeUrl($(el).attr('src'));

      const fileName = getFileNameFromUrl(src);
      const outputFile = path.join(filesAbsoluteDir, fileName);

      const { data } = await axios.get(src, {
        responseType: 'arraybuffer',
      });

      await fsp.writeFile(outputFile, data);

      const newSrc = path.join(filesDir, fileName);
      $(el).attr('src', newSrc);
    });

    await Promise.all(promises);

    return $.html();
  }

  async saveHtml() {
    const outputFile = path.join(this.dir, this.fileName);

    const { data } = await axios.get(this.url);

    const html = await this.saveImages(data);

    await fsp.writeFile(outputFile, html);
  }
}

export default async (url, options) => {
  const pageLoader = new PageLoader(url, options);

  await pageLoader.saveHtml();
};
