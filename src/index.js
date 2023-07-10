import { program } from 'commander';
import saveHtml from './saveHtml.js';

const app = () => {
  program
    .name('page-loader')
    .description('Page loader utility')
    .version('1.0.0');

  program
    .option('-o, --output [dir]', 'output dir (default: "/home/user/current-dir")');

  program.argument('url').action(saveHtml);

  if (process.argv.length < 3) {
    program.help();
  }

  program.parse();
};

export default app;
