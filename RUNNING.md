# 运行说明

## 环境

- Windows 10 或 Windows 11
- Google Chrome 或 Microsoft Edge
- Python 3
- 不需要安装 npm 包，也不需要连接数据库

## 启动

1. 打开 PowerShell。
2. 进入仓库目录：

   ```powershell
   Set-Location 'D:\各科作业\软件开发\big2\major-assignment-2'
   ```

3. 启动本地服务器：

   ```powershell
   py -m http.server 8012
   ```

4. 浏览器打开 <http://localhost:8012/>。
5. 截图和检查完成后，在服务器窗口按 `Ctrl+C` 停止服务。

## 直接入口

- 首页：<http://localhost:8012/>
- 班级成绩统计：<http://localhost:8012/projects/score-stat/>
- 校园生活消费月报：<http://localhost:8012/projects/calc-tool/>
- 交互式任务清单：<http://localhost:8012/projects/todo-app/>
- 云南旅行收藏夹：<http://localhost:8012/projects/manager-app/>
- 旅行收藏夹调试模式：<http://localhost:8012/projects/manager-app/?debug=1>

## 查看输出

班级成绩统计和校园生活消费月报把结果输出到 Console。按 `F12`，选择 `Console` 标签即可查看。任务清单和旅行收藏夹的结果直接显示在页面中。

查看旅行收藏数据：按 `F12`，选择 `Application`，展开 `Local Storage`，点击 `http://localhost:8012`，找到 `homework5.yunnan.places`。

## 常见问题

- 页面打不开：确认服务器窗口没有关闭，并检查端口是否为 8012。
- 端口被占用：把命令和地址中的 8012 同时改为 8013。
- 旧数据影响截图：在 Console 执行 `localStorage.clear()`，然后刷新页面。
- Console 看不到调试日志：确认地址末尾有 `?debug=1`。
- 中文乱码：不要直接双击 HTML；应通过本地 HTTP 地址访问。
