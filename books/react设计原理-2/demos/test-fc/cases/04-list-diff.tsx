import React, { useState } from 'react';
import './04-list-diff.css';

export const title = '列表 diff 算法沙盘';
export const note =
  '复刻 childFibers.ts 的 reconcileChildrenArray：Map 索引 + lastPlacedIndex 游标。每个场景一个独立小组件，互不影响';

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

const OP_LABEL: Record<DiffOp, string> = {
  keep: '= 不动',
  move: '↑ 移动',
  insert: '+ 插入',
  delete: '- 删除',
};

function DiffTable({ rows, domOps }: { rows: DiffRow[]; domOps: string[] }) {
  const count = (op: DiffOp) => rows.filter((r) => r.op === op).length;
  const domOpCount = count('move') + count('insert') + count('delete');

  return (
    <div>
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
    </div>
  );
}

/** 单个算法场景：key 策略是它自己的 state，切换不会带动别的场景 */
function DiffScenario({ from, to }: { from: string[]; to: string[] }) {
  const [keyed, setKeyed] = useState(true);
  const { rows, domOps } = diffList(from, to, keyed);

  return (
    <div>
      <p>
        <b>
          {from.join(',')} → {to.join(',')}
        </b>
        <button type="button" onClick={() => setKeyed((k) => !k)}>
          {keyed ? '稳定 key' : '下标当 key'}
        </button>
      </p>
      <DiffTable rows={rows} domOps={domOps} />
    </div>
  );
}

const SCENARIOS: { from: string[]; to: string[] }[] = [
  { from: ['a', 'b', 'c'], to: ['c', 'b', 'a'] },
  { from: ['a', 'b'], to: ['a', 'x', 'b'] },
  { from: ['a', 'b'], to: ['a', 'b', 'c'] },
  { from: ['a', 'b', 'c'], to: ['b', 'c'] },
  { from: ['a', 'b', 'c'], to: ['c', 'a', 'b'] },
  { from: ['a', 'b', 'c'], to: ['x', 'a', 'b', 'c'] },
];

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

/** 真实 diff 对照：反转 + 行内计数都只驱动这个组件自己 */
function ReorderPlayground() {
  const [keyed, setKeyed] = useState(true);
  const [order, setOrder] = useState(['a', 'b', 'c']);

  return (
    <div>
      <p>
        <button type="button" onClick={() => setOrder((o) => [...o].reverse())}>
          反转列表（当前：{order.join(',')}）
        </button>
        <button type="button" onClick={() => setKeyed((k) => !k)}>
          {keyed ? '稳定 key' : '下标当 key'}
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
}

const App = () => {
  return (
    <div>
      <h3>算法沙盘（每个场景独立 state）</h3>
      {SCENARIOS.map((s) => (
        <DiffScenario
          key={s.from.join() + s.to.join()}
          from={s.from}
          to={s.to}
        />
      ))}

      <h3>真实 diff 对照</h3>
      <ReorderPlayground />
    </div>
  );
};

export default App;
