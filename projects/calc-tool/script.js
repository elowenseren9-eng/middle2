"use strict";

// 原始输入：数组负责保存记录，对象负责描述每一笔消费。
const rawExpenses = [
  { id: 1, date: "2026-09-01", category: "餐饮", merchant: "  一食堂  ", amount: 18.5 },
  { id: 2, date: "2026-09-02", category: "学习", merchant: "校园  书店", amount: 46.8 },
  { id: 3, date: "2026-09-03", category: "交通", merchant: "公交卡充值", amount: 50 },
  { id: 4, date: "2026-09-05", category: "餐饮", merchant: "二食堂", amount: 22 },
  { id: 5, date: "2026-09-06", category: "生活", merchant: "校内超市", amount: 35.6 },
  { id: 6, date: "2026-09-08", category: "学习", merchant: "打印店", amount: 12.4 },
  { id: 7, date: "2026-09-09", category: "餐饮", merchant: "  水果店", amount: 16.8 },
  { id: 8, date: "2026-09-10", category: "娱乐", merchant: "电影票", amount: 38 },
  { id: 9, date: "2026-13-40", category: "餐饮", merchant: "错误日期", amount: 20 },
  { id: 10, date: "2026-09-12", category: "生活", merchant: "负数金额", amount: -9 },
  { id: 11, date: "2026-09-13", category: "未知", merchant: "非法分类", amount: 30 },
  { id: 12, date: "2026-09-14", category: "学习", merchant: "字符串金额", amount: "25" }
];

const allowedCategories = ["餐饮", "学习", "交通", "生活", "娱乐"];

console.group("输入数据");
console.log(`共收到 ${rawExpenses.length} 条原始记录`);
console.table(rawExpenses);
console.groupEnd();

// 研究二：正则先检查 YYYY-MM-DD 结构，再验证真实日历日期。
const isValidDate = (dateText) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateText);
  if (!match) return false;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

// \s 表示空白字符，+ 表示连续一个或多个，g 表示替换全部匹配项。
const normalizeMerchant = (merchant) => merchant.trim().replace(/\s+/g, " ");

// 清洗函数：过滤非法记录，并返回不修改原数组的新对象。
const cleanExpenses = (list) => list
  .filter((item) => (
    Number.isInteger(item.id)
    && isValidDate(item.date)
    && allowedCategories.includes(item.category)
    && typeof item.amount === "number"
    && Number.isFinite(item.amount)
    && item.amount > 0
  ))
  .map((item) => ({
    ...item,
    merchant: normalizeMerchant(item.merchant)
  }));

const calculateTotal = (list) => list.reduce(
  (sum, item) => sum + item.amount,
  0
);

const calculateAverage = (list) => (
  list.length === 0 ? 0 : calculateTotal(list) / list.length
);

const summarizeByCategory = (list) => {
  const summary = list.reduce((result, item) => {
    const previous = result[item.category] ?? { count: 0, total: 0 };
    return {
      ...result,
      [item.category]: {
        count: previous.count + 1,
        total: previous.total + item.amount
      }
    };
  }, {});

  return Object.entries(summary).map(([category, data]) => ({
    category,
    count: data.count,
    total: Number(data.total.toFixed(2))
  }));
};

const findLargestExpense = (list) => {
  if (list.length === 0) return null;
  return list.reduce(
    (largest, item) => (item.amount > largest.amount ? item : largest),
    list[0]
  );
};

const validExpenses = cleanExpenses(rawExpenses);

console.group("清洗与中间统计");
console.log(`有效 ${validExpenses.length} 条，过滤 ${rawExpenses.length - validExpenses.length} 条`);
console.table(validExpenses);
console.table(summarizeByCategory(validExpenses));
console.groupEnd();

console.group("研究二：正则清洗与校验");
console.log("多余空白清洗：", JSON.stringify(normalizeMerchant("  校园   打印店  ")));
console.log("合法日期 2026-09-08：", isValidDate("2026-09-08"));
console.log("非法日期 2026-02-30：", isValidDate("2026-02-30"));
console.log("错误格式 2026/09/08：", isValidDate("2026/09/08"));
console.groupEnd();

const formatCurrency = (amount) => `¥${amount.toFixed(2)}`;

const formatExpenseReport = (list) => {
  if (list.length === 0) return "没有可统计的有效消费记录";

  const total = calculateTotal(list);
  const average = calculateAverage(list);
  const largest = findLargestExpense(list);
  const categoryLines = summarizeByCategory(list)
    .map((item) => `  ${item.category}：${item.count} 笔，共 ${formatCurrency(item.total)}`)
    .join("\n");

  return [
    "校园生活消费月报",
    `有效记录：${list.length} 笔`,
    `消费总额：${formatCurrency(total)}`,
    `平均每笔：${formatCurrency(average)}`,
    `最大单笔：${largest.merchant} ${formatCurrency(largest.amount)}`,
    "分类汇总：",
    categoryLines
  ].join("\n");
};

const runScenario = (title, input) => {
  console.group(title);
  try {
    console.log("原始输入：");
    console.table(input);
    const cleaned = cleanExpenses(input);
    console.log("处理结果：");
    console.log(formatExpenseReport(cleaned));
  } catch (error) {
    console.error("处理失败：", error.message);
  }
  console.groupEnd();
};

runScenario("测试一：正常数据中混入非法记录", rawExpenses);
runScenario("测试二：全部为非法输入", [
  { id: 101, date: "not-a-date", category: "餐饮", merchant: "错误日期", amount: 20 },
  { id: 102, date: "2026-09-01", category: "未知", merchant: "错误分类", amount: 30 },
  { id: 103, date: "2026-09-01", category: "学习", merchant: "错误金额", amount: Number.NaN }
]);
runScenario("测试三：空数据", []);

// 研究一：按“分类顺序”升序，再按“金额”降序。
// sort 会原地修改数组，所以先用展开运算符复制。
const categoryOrder = ["餐饮", "学习", "交通", "生活", "娱乐"];

const sortByCategoryThenAmount = (list) => [...list].sort((first, second) => {
  const categoryDifference = categoryOrder.indexOf(first.category)
    - categoryOrder.indexOf(second.category);

  if (categoryDifference !== 0) return categoryDifference;
  return second.amount - first.amount;
});

const sortedExpenses = sortByCategoryThenAmount(validExpenses);

console.group("研究一：双字段稳定排序");
console.log("规则：先按分类顺序升序，同分类再按金额降序");
console.table(sortedExpenses);

const stabilityInput = [
  { id: "A", category: "餐饮", amount: 20 },
  { id: "B", category: "餐饮", amount: 20 },
  { id: "C", category: "餐饮", amount: 20 }
];
const stabilityOutput = sortByCategoryThenAmount(stabilityInput);
console.log(
  "稳定性测试（相同键仍为 A→B→C）：",
  stabilityOutput.map((item) => item.id).join("→")
);
console.groupEnd();

// 研究三：使用相同数据和相同任务，对比 for 与 reduce 求和。
const sumWithFor = (list) => {
  let total = 0;
  for (let index = 0; index < list.length; index += 1) {
    total += list[index].amount;
  }
  return total;
};

const sumWithReduce = (list) => list.reduce(
  (sum, item) => sum + item.amount,
  0
);

const measureAverageTime = (label, operation, repeatCount = 20) => {
  console.time(label);
  const start = performance.now();
  let result = 0;

  for (let round = 0; round < repeatCount; round += 1) {
    result = operation();
  }

  const elapsed = performance.now() - start;
  console.timeEnd(label);
  return { result, averageMs: elapsed / repeatCount };
};

const performanceData = Array.from({ length: 100000 }, (_, index) => ({
  amount: (index % 100) + 0.5
}));

// 先各运行一次作为预热，减少首次执行带来的偶然影响。
sumWithFor(performanceData);
sumWithReduce(performanceData);

console.group("研究三：for 与 reduce 性能对比");
console.log(`数据规模：${performanceData.length} 条，每种方法重复 20 次`);
const forResult = measureAverageTime(
  "for 求和总耗时",
  () => sumWithFor(performanceData)
);
const reduceResult = measureAverageTime(
  "reduce 求和总耗时",
  () => sumWithReduce(performanceData)
);
console.table([
  { method: "for", result: forResult.result, averageMs: forResult.averageMs.toFixed(3) },
  { method: "reduce", result: reduceResult.result, averageMs: reduceResult.averageMs.toFixed(3) }
]);
console.log(
  "结果一致：",
  forResult.result === reduceResult.result,
  "；单次测量受浏览器和设备状态影响，应多次运行后再下结论。"
);
console.groupEnd();
