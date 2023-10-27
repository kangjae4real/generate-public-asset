/*
 * NOTE:
 * Please use this script in "Application" directory
 * This script depends on the "node", "node/fs", "ts-node", and "commander" libraries.
 *
 * Writer: @kangjae4real
 */

import { Command } from "commander";
import * as fs from "fs";

const program = new Command();

// Please rewrite version when you edit this script.
const VERSION = "0.1.0";

program
  .name("generate-type-and-component-based-asset")
  .description(
    "Generate typescript types and Next Image component using files in the /public directory",
  )
  .version(VERSION, "-V, --version", "Print version");

const makeDirectory = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const makeType = (fileNameList: string[]) => {
  const str = fileNameList.map((name) => `"${name}"`).join(" | ");
  return `export type PublicAssets = ${str};`;
};

const makeComponent = ({
  outputComponentName,
  withAlias,
}: Pick<ComponentExport, "outputComponentName" | "withAlias">) => {
  const importPath = withAlias ? "@/types/asset" : "../types/asset";

  return `
    import { PublicAssets } from "${importPath}";
    import NextImage, { ImageProps as NextImageProps } from "next/image";
  
    interface ${outputComponentName}Props extends Omit<NextImageProps, "src"> {
    \tsrc: string | PublicAssets;
    }
  
    export default function ${outputComponentName}(props: ${outputComponentName}Props) {
    \treturn (
      \t\t<NextImage {...props} /> 
    \t);
    }
  `
    .trim()
    .replaceAll("  ", "")
    .replaceAll("\t", "  ");
};

interface TypeExport {
  entryDir: string;
  outputDir: string;
  outputFileName?: string;
}

interface ComponentExport {
  withComponent?: boolean;
  outputComponentDir: string;
  outputComponentName: string;
  withAlias?: boolean;
}

interface Options extends TypeExport, ComponentExport {}

program
  .requiredOption("-ED, --entryDir <path>", "Directory entry point", "./public")
  .requiredOption(
    "-OD, --outputDir <path>",
    "Directory output point",
    "./src/types",
  )
  .option("-OFN, --outputFileName <name>", "Output file name", "asset")
  .option("-WC, --withComponent", "Output with component", false)
  .option(
    "-OCD, --outputComponentDir <path>",
    "Output component entry point",
    "./src/components",
  )
  .option(
    "-OCN, --outputComponentName <name>",
    "Output component name",
    "Image",
  )
  .option(
    "-WA, --withAlias",
    "Output component import path use alias | alias is '@/'",
    false,
  );

program.parse();

const {
  entryDir,
  outputDir,
  outputFileName,
  withComponent,
  outputComponentDir,
  outputComponentName,
  withAlias,
} = program.opts<Options>();

const output = `${outputDir}/${outputFileName}.ts`;
const componentOutput = `${outputComponentDir}/${outputComponentName}.tsx`;

console.log(`Read : ${entryDir} contents`);

const fileList = fs.readdirSync(entryDir, { recursive: true });
const result = fileList
  .filter((fileName) => fileName.includes("."))
  .map((fileName) => `/${fileName}`);

console.log(`Read Done! : ${entryDir} contents`);

console.log(`Make Type`);

const typeResult = makeType(result);

console.log(`Make Type Done!`);

console.log(`Write Type files : ${output}`);

makeDirectory(outputDir);

fs.writeFileSync(`${output}`, typeResult, { encoding: "utf-8" });

console.log(`Write Type files Done! : ${output}`);

if (!withComponent) {
  process.exit();
}

console.log("Make Component");

const componentResult = makeComponent({
  outputComponentName,
  withAlias,
});

console.log("Make Component Done!");

console.log(`Write Component files : ${componentOutput}`);

makeDirectory(outputComponentDir);

fs.writeFileSync(`${componentOutput}`, componentResult, { encoding: "utf-8" });

console.log(`Write Component files Done! : ${componentOutput}`);
