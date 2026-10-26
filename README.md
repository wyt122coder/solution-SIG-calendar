# openJiuwen Agent Solution SIG 日历

[在线查看日历](https://openjiuwen-solution-sig-calendar.wyt122.chatgpt.site)

每月最后一个周三召开 Agent Solution SIG 会议。页面默认显示 2026 年 10 月，支持月份切换、日期筛选、近 1 个月 / 2 个月 / 半年的会议列表，以及会议详情展开。

## 使用

直接访问上方在线链接，或下载 `sig-calendar.html` 后用浏览器打开。单文件版本内嵌字体、图片、样式和交互，可离线查看。

`index.html`、`calendar.js`、`styles.css` 与 `assets/` 为可编辑源码。修改后执行：

```sh
npm run check
npm run build
```

无需安装第三方依赖。构建生成 `dist/index.html`，并更新 `sig-calendar.html`。

## 更新会议

在 `calendar.js` 顶部的 `MEETING_DETAILS` 中维护平台、会议 ID、参会链接、议题。未提供的月份详情显示“待公布”。

当前状态以 `SNAPSHOT_DAY = '2026-10-26'` 为判断基准，初始月份为 2026 年 10 月；九月会议标题按指定文本保留 `penJiuwen` 拼写。页面只显示已提供的日期，没有虚构具体开会时间。

## 托管

源码托管于 [AtomGit](https://atomgit.com/wyt122/solution-SIG-calendar)，网页通过 Sites 发布。AtomGit 推送与 Sites 发布分别执行；源码仓库有新提交时，需要同步发布才能更新在线页面。

`.openai/hosting.json` 记录 Sites 项目和静态产物目录，不含凭据。`dist/` 为构建产物，不纳入源码提交。

## 视觉来源

页面参照 [openJiuwen 社区日历](https://openjiuwen.com/community/calendar)，保留其布局、样式、Logo、会议图标与字体，并按 Agent Solution SIG 场景调整。原站素材的权利归原权利人所有；该仓库没有为第三方素材重新授予许可。
