/**
 * Генерирует TypeScript объявления API из спецификации Swagger (OpenAPI).
 *
 * @param {Object} argv Объект аргументов командной строки, обработанный с помощью yargs.
 * @param {string} argv.name Имя выходного файла. По умолчанию 'api.d.ts'.
 * @param {string} argv.input Путь к входному файлу спецификации Swagger (OpenAPI).
 * @param {string} argv.output Путь к директории, куда будет сохранён выходной файл. По умолчанию './@types'.
 *
 * Этот скрипт поддерживает настройку входных и выходных путей, имени выходного файла,
 * а также дополнительную кастомизацию сгенерированного кода через параметры командной строки.
 *
 * Пример использования:
 * ```bash
 * node generate-api.mjs -n api.d.ts -i ./path/to/swagger.json -o ./path/to/output/directory
 * ```
 *
 * Кастомизация генерации кода реализуется через функцию `codeGenConstructs`, позволяя изменять форматирование
 * или добавлять специфические аннотации к полям типов. Например, поля типов могут быть помечены как `readonly`,
 * если это указано в спецификации Swagger.
 */

import path from 'path';
import {fileURLToPath} from 'url';

import {generateApi} from 'swagger-typescript-api';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

import 'dotenv/config';
import * as process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {argv} = yargs(hideBin(process.argv)).options({
    name: {type: 'string', demandOption: true, alias: 'n', default: 'api.d.ts'},
    input: {
        type: 'string',
        demandOption: true,
        alias: 'i',
        default: path.resolve(__dirname, './@types/swagger.json'),
    },
    output: {type: 'string', demandOption: true, alias: 'o', default: './@types'},
});

const {name, input, output} = argv as { name: string; input: string; output: string };
const inputPath = path.resolve(process.cwd(), input);
const outputPath = path.resolve(process.cwd(), output);

generateApi({
    name,
    url: `${process.env.VITE_API_URL}/docs.json`,
    input: inputPath,
    output: outputPath,
    httpClientType: 'axios',
    typePrefix: 'Api',
    templates: path.resolve(__dirname, './templates'),
    codeGenConstructs: constructs => ({
        ...constructs,
        TypeField: ({readonly, key, value}) =>
                [...(readonly ? ['readonly'] : []), key, ': ', value].join(''),
    }),
}).finally(() => process.exit(0));
