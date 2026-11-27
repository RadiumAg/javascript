import React, { useState } from 'react';
import './04-list-diff.css';

export const title = '列表 diff 算法沙盘';
export const note =
  '复刻 childFibers.ts 的 reconcileChildrenArray：Map 索引 + lastPlacedIndex 游标，逐步看 keep/move/insert/delete 怎么定';

export type DiffOp = 'keep' | 'move' | 'insert' | 'delete';

export interface DiffRow {
  key: string;
  oldIndex: number | null;
  newIndex: number | null;
  cursorBefore: number;
  cursorAfter: number;
  op: DiffOp;
}

/**
 * 与 childFibers.ts:152 reconcileChildrenArray 等价的核心逻辑
 * @param oldKeys 上一轮的 key 顺序
 * @param newKeys 这一轮的 key 顺序
 * @param keyed false 时退化成"用下标当 key"（没写 key 的行为）
 */
export function diffList(
  oldKeys: string[],
  newKeys: string[],
  keyed = true,
): { rows: DiffRow[]; domOps: string[] } {
  const rows: DiffRow[] = [];
  const domOps: string[] = [];
  const existing = new Map<string, number>();

  // 1. 把 current 子链灌进 Map，键 = key ?? index
  oldKeys.forEach((k, i) => existing.set(keyed ? k : String(i), i));

  let lastPlacedIndex = 0;

  // 2. 遍历新数组：查表复用 or 新建，同时决定移动/插入
  newKeys.forEach((rawKey, i) => {
    const lookupKey = keyed ? rawKey : String(i);
    const cursorBefore = lastPlacedIndex;
    const hit = existing.has(lookupKey);
    const oldIndex = hit ? (existing.get(lookupKey) as number) : null;

    let op: DiffOp;
    if (!hit || oldIndex === null) {
      op = 'insert';
      domOps.push(`+ insert  ${rawKey} → 位置${i}`);
    } else {
      existing.delete(lookupKey);
      if (oldIndex < lastPlacedIndex) {
        // 落在游标左边：相对新顺序被往前挪了，只能整块重挂
        op = 'move';
        domOps.push(`↑ append  ${rawKey}（原${oldIndex} → 位置${i}）`);
      } else {
        // 还在该在的位置，DOM 不动，游标推到它
        op = 'keep';
        lastPlacedIndex = oldIndex;
      }
    }

    rows.push({
      key: rawKey,
      oldIndex,
      newIndex: i,
      cursorBefore,
      cursorAfter: lastPlacedIndex,
      op,
    });
  });

  // 3. Map 里剩下的 = 新数组没有的 → 删除
  existing.forEach((oldIndex, lookupKey) => {
    const label = keyed ? lookupKey : `#${lookupKey}`;
    rows.push({
      key: label,
      oldIndex,
      newIndex: null,
      cursorBefore: lastPlacedIndex,
      cursorAfter: lastPlacedIndex,
      op: 'delete',
    });
    domOps.push(`- remove  ${label}（原${oldIndex}）`);
  });

  return { rows, domOps };
}

const SCENARIOS: { name: string; from: string[]; to: string[] }[] = [
  { name: '反转 a,b,c→c,b,a', from: ['a', 'b', 'c'], to: ['c', 'b', 'a'] },
  { name: '中间插 a,b→a,x,b', from: ['a', 'b'], to: ['a', 'x', 'b'] },
  { name: '末尾加 a,b→a,b,c', from: ['a', 'b'], to: ['a', 'b', 'c'] },
  { name: '删首项 a,b,c→b,c', from: ['a', 'b', 'c'], to: ['b', 'c'] },
  { name: '末项提前 a,b,c→c,a,b', from: ['a', 'b', 'c'], to: ['c', 'a', 'b'] },
  {
    name: '前面插x a,b,c→x,a,b,c',
    from: ['a', 'b', 'c'],
    to: ['x', 'a', 'b', 'c'],
  },
];

const OP_LABEL: Record<DiffOp, string> = {
  keep: '= 不动',
  move: '↑ 移动',
  insert: '+ 插入',
  delete: '- 删除',
};

function Row({ id }: { id: string }) {
  const [count, setCount] = useState(0);

  return (
    <li>
      <b>{id}</b>
      <span>计数 {count}</span>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </li>
  );
}

const App = () => {
  const [scenario, setScenario] = useState(0);
  const [keyed, setKeyed] = useState(true);
  const [order, setOrder] = useState(['a', 'b', 'c']);

  const current = SCENARIOS[scenario];
  const { rows, domOps } = diffList(current.from, current.to, keyed);
  const count = (op: DiffOp) => rows.filter((r) => r.op === op).length;
  const domOpCount = count('move') + count('insert') + count('delete');

  return (
    <div>
      <p>
        <button type="button" onClick={() => setKeyed((k) => !k)}>
          key 策略：{keyed ? '稳定 key' : '下标当 key（没写 key）'}
        </button>
        {'　当前：'}
        {current.from.join(',')} → {current.to.join(',')}
      </p>

      <p>
        {SCENARIOS.map((s, i) => (
          <button key={s.name} type="button" onClick={() => setScenario(i)}>
            <b>{i === scenario ? `[${s.name}]` : s.name}</b>
          </button>
        ))}
      </p>

      <table>
        <thead>
          <tr>
            <th>key</th>
            <th>oldIndex</th>
            <th>newIndex</th>
            <th>游标(前)</th>
            <th>游标(后)</th>
            <th>判定</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.key + String(i)}>
              <td>{r.key}</td>
              <td>{String(r.oldIndex)}</td>
              <td>{String(r.newIndex)}</td>
              <td>{r.cursorBefore}</td>
              <td>{r.cursorAfter}</td>
              <td>
                {r.op === 'keep' ? OP_LABEL.keep : <b>{OP_LABEL[r.op]}</b>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        DOM 操作 <b>{domOpCount}</b> 次：移动 {count('move')} / 插入{' '}
        {count('insert')} / 删除 {count('delete')}，原地保留 {count('keep')} 个
      </p>
      <pre>{domOps.length ? domOps.join('\n') : '（无 DOM 操作）'}</pre>

      <h3>真实 diff 对照：每行有自己的计数，反转后看计数跟着谁走</h3>
      <p>
        <button type="button" onClick={() => setOrder((o) => [...o].reverse())}>
          反转列表（当前：{order.join(',')}）
        </button>
      </p>
      <ul>
        {order.map((id, i) => (
          <Row key={keyed ? id : i} id={id} />
        ))}
      </ul>
      <p>
        稳定 key：计数跟着行身份走。
        <br />
        下标当 key：上面的判定表会变成「全部不动」，计数留在原位 ——
        看起来零成本，实际内容串了行。
      </p>
    </div>
  );
};

export default App;
