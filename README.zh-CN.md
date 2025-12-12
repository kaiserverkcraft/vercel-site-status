简体中文 | [English](./README.md)

<div align="center">
<h1>vercel-site-status</h1>
<p>一个基于 UptimeRobot API 的在线状态面板</p>
<br />
<img src="https://img.shields.io/github/last-commit/kaiserverkcraft/vercel-site-status" alt="last commit"/>
<img src="https://img.shields.io/github/languages/code-size/kaiserverkcraft/vercel-site-status" alt="code size"/>
<img src="https://img.shields.io/github/stars/kaiserverkcraft/vercel-site-status?style=full" alt="GitHub stars"/>
<img src="https://img.shields.io/github/forks/kaiserverkcraft/vercel-site-status?style=full&color=orange" alt="GitHub followers"/>
<br />
<br />
<img src="https://img.fastmirror.net/s/2025/12/12/693be3777c8a0.png" alt="demo"/>
</div>

## 👀 Demo

- [Kcraftnetwork 服务监测面板](https://status.kaiserver.top/)

## 🎉 特色

- 🌍 多平台部署支持
- 为原版优化了探测日志 以及原本的无法针对PORT监测的不显示Link
- ✨ 优雅且流畅的浏览体验
- 🔐 支持站点密码加密（JWT + Hash）
- 👀 全站状态预览
- ⏲️ 数据定时刷新
- 📱 移动端适配

## 事先准备

- 您需要先到 [UptimeRobot](https://uptimerobot.com/dashboard) 添加站点监控，并在 `My Settings` 页面或者 [API 管理](https://dashboard.uptimerobot.com/integrations) 页面获取类型为 `Read-Only API Key` 的 `API Key`，或者使用用于单独监视器的 `Monitor-specific API keys`（ 不要使用 `Main API key` ）

## 部署

### Cloudflare

本项目默认使用 [Cloudflare Pages](https://pages.cloudflare.com/) 来行部署

- `star` 并 `fork` 本项目 😘
- 可以使用全新的 [NuxtHub](https://hub.nuxt.com/) 来快捷的部署本项目，如果您有在 Vercel 上部署项目的经历，那么过程是大致相同的，当然，也可以使用 [Cloudflare Pages](https://pages.cloudflare.com/) 来部署
- 在点击下一步之前请先配置好环境变量，具体内容请参考 `.env.example` 文件中的内容，其中 `API_KEY` 为必填项
- 若进展顺利，你就可看到项目主页面了

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kaiserverkcraft/vercel-site-status)

- 点击上方按钮以前往部署
- 在环境变量中添加下方的内容（ 重要 ）

  | **变量名称**        | **值** |
  | ------------------- | ------ |
  | DEPLOYMENT_PLATFORM | auto   |
  | API_KEY             |        |

- 大功告成

### 其他托管平台

请参考官方文档：[部署 Nuxt 应用](https://nuxtjs.org.cn/deploy)

## Q & A

### 如何开启站点加密

在环境变量中添加 `SITE_PASSWORD` 和 `SITE_SECRE_KEY`，都必须填写，缺一不可，其中 `SITE_PASSWORD`是站点密码，`SITE_SECRE_KEY` 是加密密钥，可随意填写

## 鸣谢

- [uptime-status](https://github.com/yb/uptime-status) 受此项目启发
