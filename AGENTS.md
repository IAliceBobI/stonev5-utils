# stonev5-utils — Agent 工作指南

个人 TypeScript 工具函数库（浏览器版），发布为 npm 包 `stonev5-utils`。纯函数，所有模块从根入口 re-export（也兼容 `stonev5-utils/lib/<模块>` 子路径导入），已声明 `sideEffects: false` 支持 tree-shaking。

## 目录

- `src/` — 全部源码，一模块一文件（`array.ts` / `time.ts` / `object.ts`…），编译输出到 `lib/`（gitignore，不提交）
- `test/` — jest 测试（`*.test.ts`）
- `node-package/` — Node.js 变体（`stonev5-utils-node`，包名已回收，暂不发布）
- `docs/README.zh-CN.md` — 中文版 README（英文主版在根 `README.md`）
- `.github/workflows/` — ci.yml（测试+构建）、publish.yml（OIDC 自动发包）

## 常用命令

```bash
TZ=Asia/Shanghai npm test        # jest（时区必须，见下）
npm run build                    # tsc 编译到 lib/
npx jest test/time.test.ts       # 单跑一个测试文件
```

## 关键坑

1. **时区**：`test/time.test.ts` 按本地时区断言日期字符串，必须以 `TZ=Asia/Shanghai` 跑测试（CI 已 pin）。本地其他时区会误报失败。
2. **发布只走 GitHub Actions**，不要本地 `npm publish`（无 token）。流程：`npm version patch` → `git push && git push --tags`。CI 会校验 tag 与 package.json 版本一致后自动发布（OIDC trusted publishing）。`package.json` 里的 `pub`/`pub-node` 脚本是历史遗留，勿用。
3. **根目录只能有一个 `README*` 文件**：npm-packlist 强制把根目录所有 `README*` 变体打进 tarball，npm registry 遇多个 README 会错选中文版当包说明（1.1.35 踩过）。其他语言的 README 一律放 `docs/` 下，双语互链保持 `README.md ↔ docs/README.zh-CN.md`。

## 代码约定

- ESM（`"type": "module"`）；源码相对导入写 `.js` 扩展名（如 `import { strCode } from "./string.js"`），moduleResolution 为 bundler。
- TS strict；全局类型放 `src/types/common.d.ts`。
- 对第三方库的轻封装模块（md5→ts-md5、pinyin→pinyin-pro、id→uuid）声明为正式 `dependencies`（1.2.0 起从 devDependencies 移入），新封装模块照此办理，不要再走"让使用方自行安装"的旧模式。
- 新增模块：`src/<name>.ts` + 在 `src/index.ts` 补 `export *`，加对应 `test/<name>.test.ts`，并在两份 README 的模块总览表中补一行。

## 改动前先读

- `.github/workflows/publish.yml` — 改发布逻辑前
- `README.md` 与 `docs/README.zh-CN.md` — 内容需双语同步
