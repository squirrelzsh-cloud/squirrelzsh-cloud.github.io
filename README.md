# 小浩作品集

UI/UX 与产品体验设计作品集。

**在线访问：https://squirrelzsh-cloud.github.io/**

网站无需登录。页面包含桌面与手机布局、触控导航以及移动端图片资源。

## 文件结构

- `site/`：完整静态网站源码、图片、样式和交互脚本。
- `.github/workflows/pages.yml`：自动发布配置。
- Releases 中的 `xiaohao-portfolio-site.zip`：首次迁移的完整网站备份。

修改 `site/` 后提交到 `main`，GitHub Actions 会自动部署网站。

## 本地预览

```sh
python -m http.server 8000 --directory site
```

打开 http://localhost:8000 。
