# stonev5-utils

[![npm](https://img.shields.io/npm/v/stonev5-utils)](https://www.npmjs.com/package/stonev5-utils)
[![npm downloads](https://img.shields.io/npm/dm/stonev5-utils)](https://www.npmjs.com/package/stonev5-utils)
[![CI](https://github.com/IAliceBobI/stonev5-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/IAliceBobI/stonev5-utils/actions/workflows/ci.yml)
[![Publish](https://github.com/IAliceBobI/stonev5-utils/actions/workflows/publish.yml/badge.svg)](https://github.com/IAliceBobI/stonev5-utils/actions/workflows/publish.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**English** | [简体中文](./docs/README.zh-CN.md)

A personal collection of TypeScript utility functions (browser flavor) — pure functions, import from the package root or per module for tree-shaking (`sideEffects: false`). Source lives in [src/](src/), all TypeScript.

## Install

```bash
npm i stonev5-utils
```

All exports are available from the package root. Three modules are thin wrappers around third-party libraries — their dependencies (`ts-md5` / `pinyin-pro` / `uuid`) are declared as regular `dependencies` and install automatically, no manual setup needed:

| Module | Wraps | Usage |
| ------ | ----- | ----- |
| md5 | `ts-md5` | `import { getMd5 } from "stonev5-utils"` |
| pinyin | `pinyin-pro` | `import { getPinyin } from "stonev5-utils"` |
| id | `uuid` | `import { newID } from "stonev5-utils"` |

## Module overview

All modules re-export from the root entry (`import { newID } from "stonev5-utils"`). Subpath imports like `stonev5-utils/lib/time` are also supported for finer tree-shaking control.

| Module | Description |
| ------ | ----------- |
| `lib/array` | Null-safe push family (`pushUniq` / `pushReplaceBy` / `removeFromArr`…), range generation |
| `lib/clipboard` | `copy2clipboard`: write text to the system clipboard |
| `lib/cmd` | `runCmd`: run shell commands asynchronously |
| `lib/desktop` | `osFs` / `osPath`: desktop (SiYuan Note) filesystem & path adapters |
| `lib/dom` | HTML-to-div, zero-width character cleanup and other DOM utilities |
| `lib/file` | `tempFile`: write temporary files |
| `lib/functional` | `into` / `objectToMap` and other functional helpers |
| `lib/global` | `getGlobal` / `setGlobal`: global key-value storage |
| `lib/id` | `newID`: UUID-based unique IDs |
| `lib/md5` | `getMd5`: MD5 hash |
| `lib/object` | `set` / `clone` / `RefObj` / `newProxy`, type guards and numeric validation |
| `lib/parallel` | `pmap` family of concurrent map helpers (failures become null, never abort the batch) |
| `lib/pinyin` | `getPinyin` / `pinyinLongShort`: Chinese-to-pinyin conversion |
| `lib/rand` | Random numbers |
| `lib/string` | `replaceAll` / `htmlEscape` / `toJSON` / `splitByMiddle` etc. |
| `lib/time` | `formatDate` / `getDayStr` / `sleep` / `readableDuration` etc. |

## Quick start

```ts
import { newID, getMd5, getPinyin, formatDate, sleep, pmap } from "stonev5-utils";

const id = newID();                    // uuid
const hash = getMd5("hello");          // md5
const py = getPinyin("中文标题");       // pinyin
const now = formatDate(0);             // current date & time
await sleep(1000);

// Concurrent map: individual failures are skipped, nothing throws
// (use pmapNull if you want nulls kept in the result)
const results = await pmap(urls, (u) => fetch(u).then((r) => r.text()));
```

> For the Node.js flavor see [node-package/](node-package/) (formerly published as `stonev5-utils-node`; that package name has been reclaimed and it is not currently republished).

## Development

```bash
npm test        # jest
npm run build   # tsc compile to lib/
```

## Publishing (automated via GitHub Actions)

Publishing runs entirely on GitHub's infrastructure — no local npm login needed:

1. Configure [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) once on npmjs.com, pointing at this repo's `.github/workflows/publish.yml`;
2. After your changes:

```bash
npm version patch            # bump version, create commit + v* tag
git push && git push --tags  # pushing the tag triggers the release
```

CI verifies tag/version match → runs tests → builds → publishes to npm via OIDC trusted publishing (provenance included automatically), no token required.
