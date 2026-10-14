# MeUmy 梦游 · 哈索尔（第一章）

粉丝向、非官方的浏览器冒险解谜游戏切片。以 MeUmy（咩栗 / 呜米）公开设定中的《梦游全世界》首站「哈索尔 / 古埃及」为灵感，原创玩法与程序生成音效；**不包含**任何官方曲目、立绘或 MV 素材。

## 本地运行

在你自己的电脑上克隆并启动（云端 agent 的 `127.0.0.1` / Try Live **不能**当成本机地址打开）：

```bash
git clone https://github.com/gwk18168/glowing-guacamole.git
cd glowing-guacamole
git checkout cursor/chapter-1-hasor-3bed   # 若默认已是该分支可省略
npm install
npm run dev
```

浏览器打开本机：`http://127.0.0.1:4731`（Vite 固定端口，见 `vite.config.ts`）。

其它脚本：

```bash
npm run build    # 类型检查 + 生产构建
npm run preview  # 预览构建产物（同端口 4731）
npm run lint
```

## 本章内容

- 标题页与粉丝向声明 → 大草原入梦对白 → **梦境星图**（五段梦境 + 大结局占位）
- **第一章枢纽**：哈索尔神殿庭院探索、文物收集
- 小游戏 1：**节奏祭典**（四轨节奏点按 / 键盘 D F J K）
- 小游戏 2：**尼罗宝库**（六色三消）
- 两场试炼均通关后收束，预告后续梦境

进度保存在浏览器 `localStorage`。

## 技术栈

Vite + React + TypeScript
