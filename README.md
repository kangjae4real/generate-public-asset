## Generate Type and Component based /public assets

이 Script는 보통의 프로젝트에서 사용되는 Asset 디렉토리인 `/public` 디렉토리의 <br />
Resources를 읽어들여 TypeScripit 프로젝트에서 손쉽게 사용할 수 있게 합니다.

이 Script는 CLI 환경에서 구동할 수 있습니다.

**현재 Component Generate는 Next Image component만 지원합니다.**

### Project Specification
- Node.js | 18.17.1
- TypeScript | ^5
- next | 13.5.6

### Project Set up
#### Install dependency
이 프로젝트는 `node`, `node/fs`, `ts-node`, `commander` 패키지들을 의존합니다. <br />
설치해주세요.

```bash
# node package는 이미 설치되어 있다 가정합니다.
$ yarn add ts-node commander
```
#### Edit code
먼저, package.json과 tsconfig.json 수정해야합니다.

1. Script는 TypeScript로 작성되어 있습니다. `ts-node`로 실행해주세요.
2. Script는 `import` 구문을 사용중입니다.(ESM 방식) `type`을 수정해주세요.
```json
// package.json
{
  "scripts": {
    "generate": "ts-node scripts/generate.ts", // Add this package script line.
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "type": "module" // Add this line.
}
```

1. Generate된 Custom Type을 Project에서 사용할 수 있도록 Root를 추가해주세요.
2. ts-node가 package를 찾을 때, ESM 방식으로 찾도록 코드를 수정해주세요.
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "typeRoots": ["node_modules", "./src/types/*"] // Add this line.
  },
  // Add this "ts-node" block.
  "ts-node": {
    "esm": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "./src/types/*"], // Fix this line
  "exclude": ["node_modules"]
}

```
#### Run Script
초기세팅이 끝났다면 Script를 실행할 준비가 되었습니다. <br />
`{PROJECT_ROOT}/scripts/generate.ts` 로 Script를 복사해주세요.

```ts
// scripts/generate.ts
import { Command } from "commander";
import * as fs from "fs";

const program = new Command();

// Please rewrite version when you edit this script.
const VERSION = "0.1.0";

program
  .name("generate-public-asset")
  .description("Generate typescript types and Next Image component using files in the /public directory")
  .version(VERSION, "-V, --version", "Print version");

...
```

방금 작성한 Package Script로 실행해주세요.
```bash
$ yarn generate
> ts-node scripts/generate.ts
```

-h, --help 로 모든 명령어를 확인할 수 있습니다.
```bash
$ yarn generate -h
> Usage: generate-public-asset [options]

Generate typescript types and Next Image component using files in the /public directory

Options:
  -V, --version                       Print version
  -ED, --entryDir <path>              Directory entry point (default: "./public")
  -OD, --outputDir <path>             Directory output point (default: "./src/types")
  -OFN, --outputFileName <name>       Output file name (default: "asset.ts")
  -WC, --withComponent                Output with component (default: false)
  -OCD, --outputComponentDir <path>   Output component entry point (default: "./src/components")
  -OCN, --outputComponentName <name>  Output component name (default: "Image")
  -WA, --withAlias                    Output component import path use alias | alias is '@/' (default: false)
  -h, --help                          display help for command
```
#### Usage
- `-V, --version` | 버전을 출력합니다.
  ```bash
  $ yarn generate -V
  $ yarn generate --version
  ```
- `-ED, --entryDir <path>` | /public Directory 경로.
  ```bash
  $ yarn generate -ED /any/path
  $ yarn generate --entryDir /any/path
  ```
- `-OD, --outputDir <path>` | 생성된 타입을 저장할 Directory 경로.
  ```bash
  $ yarn generate -OD /any/path
  $ yarn generate --outputDir /any/path
  ```
- `-OFN, --outputFileName <name>` | 생성된 타입의 파일명.
  ```bash
  $ yarn generate -OFN file.ts
  $ yarn generate --outputDir file.ts
  ```
- `-WC, --withComponent` | 컴포넌트 생성여부.
  ```bash
  $ yarn generate -WC
  $ yarn generate --withComponent
  ```
- `-OCD, --outputComponentDir <path>` | 생성된 컴포넌트를 저장할 Directory 경로.
  ```bash
  $ yarn generate -OCD /any/path
  $ yarn generate --outputComponentDir /any/path
  ```
- `-OCN, --outputComponentName <name>` | 생성된 컴포넌트의 파일명.
  ```bash
  $ yarn generate -OCN Image
  $ yarn generate --outputComponentName Image
  ```
- `-WA, --withAlias` | Import Path Alias 사용여부.
  ```bash
  $ yarn generate -WA
  $ yarn generate --withAlias
  ```
- `-h, --help` | 명령어 설명 및 사용법.
  ```bash
  $ yarn generate -h
  $ yarn generate --help
  ```
