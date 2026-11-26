/// <reference types="vite/client" />
import React from 'react';
import ReactDOM from 'react-dom';
import './harness.css';

interface CaseModule {
  default: () => unknown;
  title?: string;
  note?: string;
  reset?: () => void;
}

const AUTO_PLAY_MS = 5000;

// 用例即文件：cases/ 下丢一个默认导出组件的 .tsx 就自动进侧栏，下划线开头的文件跳过
const modules = import.meta.glob('./cases/*.tsx', {
  eager: true,
}) as Record<string, CaseModule>;

const cases = Object.entries(modules)
  .filter(([path]) => !path.split('/').pop()?.startsWith('_'))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => {
    const file = path.split('/').pop() ?? path;
    return {
      file,
      title: mod.title ?? file.replace(/\.tsx$/, ''),
      note: mod.note ?? '',
      Component: mod.default,
      reset: mod.reset,
    };
  });

const listEl = document.querySelector('#case-list') as HTMLElement;
const noteEl = document.querySelector('#case-note') as HTMLElement;
const stageWrapEl = document.querySelector('#stage-wrap') as HTMLElement;
const rerunEl = document.querySelector('#rerun') as HTMLButtonElement;
const playEl = document.querySelector('#auto-play') as HTMLButtonElement;

let active = -1;
let timer: ReturnType<typeof setInterval> | null = null;

function renderList() {
  listEl.replaceChildren();
  cases.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = item.title;
    btn.className = index === active ? 'case-btn case-btn--active' : 'case-btn';
    btn.onclick = () => select(index);
    listEl.append(btn);
  });
}

function select(index: number) {
  const item = cases[index];
  if (!item) {
    return;
  }
  active = index;
  item.reset?.();
  noteEl.textContent = `${item.file} — ${item.note}`;

  // 连容器节点一起换掉：createRoot().render() 内的 initEvent 不去重，
  // 复用同一个节点会让 click 监听器逐次叠加，一次点击被派发 N 遍
  const stage = document.createElement('div');
  stage.id = 'stage';
  stageWrapEl.querySelector('#stage')?.replaceWith(stage);

  ReactDOM.createRoot(stage).render(React.createElement(item.Component));

  console.log(`%c▶ ${item.title}`, 'color:#7c3aed;font-weight:600');
  if (item.note) {
    console.log(`  ${item.note}`);
  }
  renderList();
}

function stopPlay() {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
  playEl.textContent = '▶ 自动播放';
}

function startPlay() {
  timer = setInterval(() => select((active + 1) % cases.length), AUTO_PLAY_MS);
  playEl.textContent = '⏸ 停止播放';
}

rerunEl.onclick = () => select(active);
playEl.onclick = () => (timer === null ? startPlay() : stopPlay());

renderList();
select(0);
