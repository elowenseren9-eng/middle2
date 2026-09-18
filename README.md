# 软件开发综合实践 平时大作业二

本仓库聚合第四、第五次课堂成果，覆盖 JavaScript 数据与函数、DOM 操作、事件处理、表单校验、动态渲染和本地存储。首页提供四个作品的统一入口，源代码不依赖第三方框架或网络资源。

## 作品目录

| 目录 | 作品 | 主要内容 |
|---|---|---|
| `projects/score-stat` | 班级成绩统计 | 数组清洗、平均值、最高分、等级分布、空数组保护 |
| `projects/calc-tool` | 校园生活消费月报 | 对象数组、函数拆分、正则校验、排序、边界测试、性能实验 |
| `projects/todo-app` | 交互式任务清单 | 表单校验、添加、完成、删除、筛选、统一渲染、持久化 |
| `projects/manager-app` | 云南旅行收藏夹 | 六字段信息管理、增删改查、搜索、事件委托、JSON 导出、容量容错 |

## 快速运行

在仓库根目录执行：

```powershell
py -m http.server 8012
```

打开 <http://localhost:8012/>。成绩统计和消费月报的结果位于浏览器开发者工具 Console；另外两个项目直接在页面操作。

完整步骤见 [`RUNNING.md`](RUNNING.md)，重新验证结果见 [`TESTING.md`](TESTING.md)。

## 调试模式

访问以下地址可启用旅行收藏夹的状态日志：

```text
http://localhost:8012/projects/manager-app/?debug=1
```

此模式在每次保存和渲染时输出记录总数、可见数量、编辑状态和搜索词。普通地址不输出调试日志。

## 数据和安全

- 两个交互应用使用不同的 `localStorage` 键。
- 用户内容通过 `textContent` 渲染，没有拼接到 `innerHTML`。
- 本地存储读取和写入都有异常捕获。
- 容量实验只写入专用临时键，并在结束后清理。
- JSON 导出使用本地日期命名，避免 UTC 日期跨日问题。

## GitHub

预定仓库地址：<https://github.com/elowenseren9-eng/major-assignment-2>

远程推送由提交者本人完成。
