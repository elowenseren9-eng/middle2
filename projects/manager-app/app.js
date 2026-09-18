"use strict";

const STORAGE_KEY = "homework5.yunnan.places";
const form = document.querySelector("#place-form");
const list = document.querySelector("#place-list");
const message = document.querySelector("#form-message");
const count = document.querySelector("#collection-count");
const searchInput = document.querySelector("#search-input");
const submitButton = document.querySelector("#submit-button");
const cancelEditButton = document.querySelector("#cancel-edit");
const exportButton = document.querySelector("#export-button");
const storageTestButton = document.querySelector("#storage-test-button");
const storageResult = document.querySelector("#storage-result");
const DEBUG_MODE = new URLSearchParams(window.location.search).has("debug");

let places = [];
let editingId = null;
let searchTerm = "";

const debugLog = (eventName, details) => {
  if (DEBUG_MODE) console.log(`[debug] ${eventName}`, details);
};

const formatLocalDate = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, "0"),
  String(date.getDate()).padStart(2, "0")
].join("-");

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const showMessage = (text, type = "error") => {
  message.textContent = text;
  message.classList.toggle("success", type === "success");
};

const readForm = () => ({
  id: editingId || createId(),
  name: form.elements.name.value.trim(),
  region: form.elements.region.value,
  type: form.elements.type.value,
  season: form.elements.season.value,
  rating: Number(form.elements.rating.value),
  note: form.elements.note.value.trim()
});

const isValidPlace = (place) => (
  place && typeof place.id === "string" && typeof place.name === "string" && place.name.trim() !== "" &&
  typeof place.region === "string" && place.region !== "" && typeof place.type === "string" && place.type !== "" &&
  typeof place.season === "string" && typeof place.note === "string" && place.note.length <= 160 &&
  Number.isInteger(place.rating) && place.rating >= 1 && place.rating <= 5
);

const loadPlaces = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new TypeError("收藏数据不是数组");
    return parsed.filter(isValidPlace);
  } catch (error) {
    console.warn("收藏数据读取失败，已使用空列表。", error);
    showMessage("旧数据无法读取，已安全恢复为空收藏夹");
    return [];
  }
};

const savePlaces = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    debugLog("savePlaces", { count: places.length });
    return true;
  } catch (error) {
    console.warn("收藏数据保存失败。", error);
    showMessage("浏览器存储空间不足，本次修改未能保存");
    return false;
  }
};

const resetForm = () => {
  editingId = null;
  form.reset();
  form.elements.rating.value = "5";
  submitButton.textContent = "添加到收藏";
  cancelEditButton.hidden = true;
};

const startEdit = (id) => {
  const place = places.find((item) => item.id === id);
  if (!place) return;

  editingId = id;
  form.elements.name.value = place.name;
  form.elements.region.value = place.region;
  form.elements.type.value = place.type;
  form.elements.season.value = place.season;
  form.elements.rating.value = String(place.rating);
  form.elements.note.value = place.note;
  submitButton.textContent = "保存修改";
  cancelEditButton.hidden = false;
  showMessage(`正在编辑：${place.name}`, "success");
  form.elements.name.focus();
  window.scrollTo({ top: 360, behavior: "smooth" });
};

const deletePlace = (id) => {
  const place = places.find((item) => item.id === id);
  if (!place || !window.confirm(`确定删除“${place.name}”吗？`)) return;
  places = places.filter((item) => item.id !== id);
  if (editingId === id) resetForm();
  showMessage(`已删除：${place.name}`, "success");
  savePlaces();
  render();
};

const render = () => {
  list.replaceChildren();
  const normalizedTerm = searchTerm.toLocaleLowerCase("zh-CN");
  const visiblePlaces = places.filter((place) => (
    [place.name, place.region, place.type, place.season, place.note]
      .some((value) => value.toLocaleLowerCase("zh-CN").includes(normalizedTerm))
  ));
  debugLog("render", {
    total: places.length,
    visible: visiblePlaces.length,
    editingId,
    searchTerm
  });
  count.textContent = searchTerm ? `找到 ${visiblePlaces.length} / ${places.length} 个地点` : `共 ${places.length} 个地点`;

  if (visiblePlaces.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const title = document.createElement("strong");
    title.textContent = places.length === 0 ? "收藏夹还是空的" : "没有匹配的地点";
    const hint = document.createElement("span");
    hint.textContent = places.length === 0 ? "从上方添加第一个想去的地点吧。" : "换一个关键词再试试。";
    empty.append(title, hint);
    list.appendChild(empty);
    return;
  }

  visiblePlaces.forEach((place) => {
    const card = document.createElement("article");
    card.className = "place-card";
    card.dataset.id = place.id;

    const top = document.createElement("div");
    top.className = "card-top";
    const identity = document.createElement("div");
    const chip = document.createElement("span");
    chip.className = "type-chip";
    chip.textContent = place.type;
    const title = document.createElement("h3");
    title.textContent = place.name;
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `${place.region} · ${place.season}`;
    identity.append(chip, title, meta);

    const rating = document.createElement("span");
    rating.className = "rating";
    rating.setAttribute("aria-label", `期待评分 ${place.rating} 分`);
    rating.textContent = `${place.rating} / 5`;
    top.append(identity, rating);

    const note = document.createElement("p");
    note.className = "note";
    note.textContent = place.note || "暂未填写旅行备注。";
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.dataset.action = "edit";
    editButton.textContent = "编辑";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "删除";
    actions.append(editButton, deleteButton);

    card.append(top, note, actions);
    list.appendChild(card);
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const place = readForm();

  if (!isValidPlace(place)) {
    showMessage("请填写地点名称、区域、类型，并输入 1～5 的整数评分");
    return;
  }

  if (editingId) {
    places = places.map((item) => item.id === editingId ? place : item);
    showMessage("地点信息已更新", "success");
  } else {
    places.unshift(place);
    showMessage("地点已加入收藏", "success");
  }
  savePlaces();
  resetForm();
  render();
});

cancelEditButton.addEventListener("click", () => {
  resetForm();
  showMessage("已取消编辑", "success");
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  render();
});

// 事件委托：无论渲染多少张卡片，都只在父容器上注册一个单击监听器。
list.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  const card = event.target.closest(".place-card");
  if (!actionButton || !card || !list.contains(card)) return;

  if (actionButton.dataset.action === "edit") startEdit(card.dataset.id);
  if (actionButton.dataset.action === "delete") deletePlace(card.dataset.id);
});

exportButton.addEventListener("click", () => {
  const exportData = {
    app: "云南旅行收藏夹",
    exportedAt: new Date().toISOString(),
    count: places.length,
    places
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = objectUrl;
  downloadLink.download = `云南旅行收藏-${formatLocalDate(new Date())}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  showMessage(`已导出 ${places.length} 条收藏数据`, "success");
});

storageTestButton.addEventListener("click", async () => {
  const testKey = "homework5.storage.pressure-test";
  const previousValue = localStorage.getItem(testKey);
  const step = 256 * 1024;
  const maximum = 12 * 1024 * 1024;
  let lastSuccessfulSize = 0;

  storageTestButton.disabled = true;
  storageResult.textContent = "正在写入临时数据并寻找容量边界……";

  try {
    for (let size = step; size <= maximum; size += step) {
      localStorage.setItem(testKey, "云".repeat(size));
      lastSuccessfulSize = size;
      if (size % (1024 * 1024) === 0) {
        storageResult.textContent = `已成功写入约 ${(size / 1024 / 1024).toFixed(0)} MiB 字符数据，继续测试……`;
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }
    storageResult.textContent = `达到实验上限 12 MiB 字符仍未触发配额错误；临时数据已清理。`;
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      storageResult.textContent = `已捕获 QuotaExceededError；最后成功写入约 ${(lastSuccessfulSize / 1024 / 1024).toFixed(2)} MiB 字符数据，临时数据已清理。`;
    } else {
      console.warn("容量实验遇到非配额错误。", error);
      storageResult.textContent = `实验遇到 ${error.name || "未知错误"}；临时数据已清理。`;
    }
  } finally {
    if (previousValue === null) localStorage.removeItem(testKey);
    else localStorage.setItem(testKey, previousValue);
    storageTestButton.disabled = false;
  }
});

places = loadPlaces();
render();
