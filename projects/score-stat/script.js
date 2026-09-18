"use strict";

// 第一步：定义原始成绩数据，其中故意包含两个非法值。
const scores = [
  { name: "李四", score: 92 },
  { name: "王五", score: 45 },
  { name: "赵六", score: 77 },
  { name: "孙七", score: 59 },
  { name: "周八", score: 88 },
  { name: "吴九", score: 105 },
  { name: "郑十", score: -3 }
];

console.log("第一步：原始成绩数据");
console.table(scores);

// 第二步：清洗与统计。每个函数只负责一件事。
const cleanScores = (list) => list.filter(
  (student) => Number.isFinite(student.score) && student.score >= 0 && student.score <= 100
);

const average = (list) => {
  if (list.length === 0) return "0.00";
  const total = list.reduce((sum, student) => sum + student.score, 0);
  return (total / list.length).toFixed(2);
};

const highest = (list) => {
  if (list.length === 0) return null;
  return list.reduce(
    (max, student) => (student.score > max.score ? student : max),
    list[0]
  );
};

const failed = (list) => list
  .filter((student) => student.score < 60)
  .map((student) => student.name);

const validScores = cleanScores(scores);

console.log("第二步：清洗后的有效成绩");
console.table(validScores);
console.log("平均分：", average(validScores));
console.log("最高分：", highest(validScores));
console.log("不及格名单：", failed(validScores));

// 第三步：等级分布与格式化报告。
const toGrade = (score) => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const gradeCount = (list) => {
  const result = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  list.forEach((student) => {
    result[toGrade(student.score)] += 1;
  });
  return result;
};

const report = (list) => {
  const valid = cleanScores(list);
  if (valid.length === 0) return "没有有效成绩";

  const topStudent = highest(valid);
  const distribution = gradeCount(valid);
  const failedNames = failed(valid);

  return [
    `有效人数 ${valid.length} 人，平均 ${average(valid)} 分，最高 ${topStudent.score} 分（${topStudent.name}）`,
    `等级分布：A ${distribution.A} 人，B ${distribution.B} 人，C ${distribution.C} 人，D ${distribution.D} 人，F ${distribution.F} 人`,
    `不及格名单：${failedNames.join("、") || "无"}`
  ].join("\n");
};

try {
  console.log("第三步：完整成绩报告\n" + report(scores));
  console.log("空数组测试：", report([]));
} catch (error) {
  console.error("报告生成失败：", error.message);
}
