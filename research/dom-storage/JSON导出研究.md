# JSON 导出研究

实现步骤：

1. 用 `JSON.stringify(data, null, 2)` 把收藏数组转成易读文本。
2. 用 `new Blob()` 在内存中建立 JSON 文件内容。
3. 用 `URL.createObjectURL(blob)` 生成临时 Blob URL。
4. 创建带 `download` 属性的临时链接并触发下载。
5. 移除链接并调用 `URL.revokeObjectURL()` 释放临时 URL，避免不必要的内存占用。

自动测试实际下载并解析了导出文件，确认 `count` 与 `places.length` 都是 2，文件内容是有效 JSON。

参考：[MDN：URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
