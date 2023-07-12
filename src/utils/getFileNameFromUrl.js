import path from 'path';

const getFileName = (url) => {
  const [filename, extention = 'html'] = path.basename(url).split('.');

  const { hostname, pathname } = new URL(url);

  const fileNameWithoutExtension = (hostname + path.dirname(pathname) + filename).replace(/[^\w\d]/g, '-');

  return `${fileNameWithoutExtension}.${extention}`;
};

export default getFileName;
