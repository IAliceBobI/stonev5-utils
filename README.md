# stonev5-utils

[![npm](https://img.shields.io/npm/v/stonev5-utils)](https://www.npmjs.com/package/stonev5-utils)
[![CI](https://github.com/IAliceBobI/stonev5-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/IAliceBobI/stonev5-utils/actions/workflows/ci.yml)
[![Publish](https://github.com/IAliceBobI/stonev5-utils/actions/workflows/publish.yml/badge.svg)](https://github.com/IAliceBobI/stonev5-utils/actions/workflows/publish.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

个人日常沉淀的 TypeScript 工具函数库（浏览器版），纯函数、零运行时依赖、按模块引用即可 tree-shaking。源码见 [src/](src/)，全部为 TypeScript。

## 安装

```bash
npm i stonev5-utils
```

部分模块是对第三方库的轻封装，使用前需自行安装对应的依赖：

| 模块 | 需要安装 | 用法 |
| ---- | -------- | ---- |
| md5 | `npm i ts-md5` | `import { getMd5 } from "stonev5-utils/lib/md5"` |
| pinyin | `npm i pinyin-pro` | `import { getPinyin } from "stonev5-utils/lib/pinyin"` |
| id | `npm i uuid` | `import { newID } from "stonev5-utils/lib/id"` |

## 模块总览

| 模块 | 说明 |
| ---- | ---- |
| `lib/array` | 空安全的 push 族（`pushUniq` / `pushReplaceBy` / `removeFromArr`…）、范围生成 |
| `lib/cmd` | `runCmd`：异步执行 shell 命令 |
| `lib/desktop` | `osFs` / `osPath`：桌面端（思源笔记）文件系统与路径适配 |
| `lib/dom` | HTML 转 div、清理零宽字符等 DOM 工具 |
| `lib/file` | `tempFile`：写临时文件 |
| `lib/functional` | `into` / `objectToMap` 等函数式小工具 |
| `lib/global` | `getGlobal` / `setGlobal`：全局键值存取 |
| `lib/object` | `set` / `clone` / `RefObj` / `newProxy`、类型守卫与数值校验 |
| `lib/parallel` | `pmap` 系列并发映射（失败转 null，不中断整体） |
| `lib/rand` | 随机数 |
| `lib/string` | `replaceAll` / `htmlEscape` / `toJSON` / `splitByMiddle` 等 |
| `lib/time` | `formatDate` / `getDayStr` / `sleep` / `readableDuration` 等 |
| 根入口 | `copy2clipboard`：`import { copy2clipboard } from "stonev5-utils"` |

## 快速上手

```ts
import { getMd5 } from "stonev5-utils/lib/md5";
import { getPinyin } from "stonev5-utils/lib/pinyin";
import { newID } from "stonev5-utils/lib/id";
import { formatDate, sleep } from "stonev5-utils/lib/time";
import { pmap } from "stonev5-utils/lib/parallel";

const id = newID();                    // uuid
const hash = getMd5("hello");          // md5
const py = getPinyin("中文标题");       // 拼音
const now = formatDate(0);             // 当前日期时间
await sleep(1000);

// 并发执行，单个失败会被跳过、不抛异常（需要保留 null 用 pmapNull）
const results = await pmap(urls, (u) => fetch(u).then((r) => r.text()));
```

> Node.js 环境版本见 [node-package/](node-package/)（曾以 `stonev5-utils-node` 发布，包名已回收，暂未重新发布）。

## 开发

```bash
npm test        # jest
npm run build   # tsc 编译到 lib/
```

## 发布（GitHub Actions 自动发包）

发布完全由 GitHub 的计算资源完成，本地无需登录 npm：

1. npmjs.com 上为本包配置一次 [Trusted Publishing](https://docs.npmjs.com/trusted-publishers)，指向本仓库的 `.github/workflows/publish.yml`；
2. 改完代码后执行：

```bash
npm version patch          # 自动 bump 版本并生成 commit + v* 标签
git push && git push --tags  # 推送标签即触发发布
```

CI 会校验标签与版本一致 → 跑测试 → 构建 → 以 OIDC trusted publishing 方式发布到 npm（自动附带 provenance 证明），全程无需 token。
