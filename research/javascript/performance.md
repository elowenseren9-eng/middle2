# 研究三 for 与 reduce 性能实验

## 官方资料

- [MDN console.time](https://developer.mozilla.org/en-US/docs/Web/API/console/time_static)
- [MDN performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)

## 实验设计

程序生成 100000 条相同结构的数据，`for` 和 `reduce` 都执行同一个金额求和任务。两种方法先各预热一次，再各重复 20 次；`console.time` 显示总耗时，`performance.now()` 计算平均每次耗时。两种实现的结果都必须等于 5000000，才能说明比较的是同一任务。

## 结果与结论

一次本机 Node.js 运行得到：`for` 平均约 0.204 ms，`reduce` 平均约 1.476 ms，两者结果都为 5000000。该次运行中 `for` 更快，但耗时会受浏览器版本、JIT 优化、机器负载和计时精度影响，所以结论应表述为“本次环境和数据规模下 for 更快”，不能把一次结果当作所有环境的绝对规律。实际业务中小数据优先考虑可读性，大数据热点路径再用重复基准测试决定。

