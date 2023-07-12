import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import saveHtml from '../saveHtml.js';

describe('Тестируем saveHtml', () => {
  let tempDir = '';

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  afterEach(async () => {
    await fs.rmdir(tempDir, { recursive: true, force: true });
  });

  it('Проверяем загрузку изображений', async () => {
    const fixture = `<!-- Используйте этот код, как фикстуру для тестов -->
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="utf-8">
        <title>Курсы по программированию Хекслет</title>
      </head>
      <body>
        <img src="/assets/professions/nodejs.png" alt="Иконка профессии Node.js-программист" />
        <h3>
          <a href="/professions/nodejs">Node.js-программист</a>
        </h3>
      </body>
    </html>`;

    nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(200, fixture)
      .get('/assets/professions/nodejs.png')
      .reply(200, '');

    const options = {
      output: tempDir,
    };

    await saveHtml('https://ru.hexlet.io/courses', options);

    const htmlPath = path.join(tempDir, 'ru-hexlet-io-courses.html');

    const content = await fs.readFile(htmlPath, { encoding: 'utf8' });

    expect(content).toBe(`<!-- Используйте этот код, как фикстуру для тестов --><!DOCTYPE html><html lang="ru"><head>
        <meta charset="utf-8">
        <title>Курсы по программированию Хекслет</title>
      </head>
      <body>
        <img src="ru-hexlet-io-courses_files/ru-hexlet-io-assets-professionsnodejs.png" alt="Иконка профессии Node.js-программист">
        <h3>
          <a href="/professions/nodejs">Node.js-программист</a>
        </h3>
      
    </body></html>`);

    console.log(content);
  });
});
