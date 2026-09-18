# 研究一 双字段排序与稳定性

## 官方资料

[MDN Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

## 比较函数规则

`compareFn(a, b)` 返回负数时 `a` 排在 `b` 前面，返回正数时 `a` 排在 `b` 后面，返回 `0` 时两者在排序键上相等。比较函数应满足纯函数、稳定、反身、反对称和传递等性质。`sort()` 会修改原数组，所以本项目先使用 `[...list]` 复制，再对副本排序。

项目先按 `categoryOrder` 中的分类位置升序；分类相同后，使用 `second.amount - first.amount` 让金额降序。测试中 A、B、C 三条记录的分类和金额完全相同，排序后仍为 A→B→C，验证现代 ECMAScript 规定的稳定排序行为。

