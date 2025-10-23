# 梦想之家温泉民宿网站

基于 Next.js + Notion + Vercel 的全栈项目，仓库位于  
https://github.com/xylilei5808-droid/dreams-home-website

## 本地连接 GitHub 仓库

```bash
# 若尚未初始化
git init

# 设置默认分支
git branch -M main

# 关联远程仓库（只需执行一次）
git remote add origin https://github.com/xylilei5808-droid/dreams-home-website.git

# 拉取远程最新代码
git pull origin main --rebase

# 提交本地修改
git add .
git commit -m "your commit message"

# 推送到 GitHub（首次推送加上 -u）
git push -u origin main
```

若已存在 `origin` 指向旧地址，可先移除再重新添加：

```bash
git remote remove origin
git remote add origin https://github.com/xylilei5808-droid/dreams-home-website.git
```

## 本地开发

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:3000  
确保 `.env.local` 已配置全部 Notion 数据库 ID 和 Token。

## 验证 Notion 数据读取（含 Home Banners）

1. 启动开发服务器 `npm run dev`  
2. 浏览器访问 `http://localhost:3000/api/preview-data?type=home-banners`，若返回 JSON 数据即表示已成功调用  
3. 访问 `http://localhost:3000/api/test-notion`，在 `homeData.banners` 的计数可看到记录数量  
4. 刷新首页 `http://localhost:3000`，Hero 区域的轮播 Banner 即来源于 Home Banners 数据库

## 更新并部署

```bash
# 拉取远程变更
git pull origin main --rebase
# 开发调试
npm run dev
# 构建验证
npm run build
# 推送同步
git push origin main
```

Vercel 会自动检测仓库更新并触发部署。若需手动在本地执行部署：

```bash
vercel --prod
```

发布前请确认 Vercel 的环境变量与 `.env.local` 一致（如 NOTION_TOKEN、各数据库 ID 等）。

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


