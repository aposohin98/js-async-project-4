import path from 'path';

const removeFileExtension = (file) => {
  const { name } = path.parse(file);

  return name;
};

export default removeFileExtension;
