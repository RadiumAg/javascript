async function instantiate(module, imports = {}) {
  const { exports } = await WebAssembly.instantiate(module, imports);

  // 获取到内存
  const memory = exports.memory || imports.env.memery;

  return {
    ...exports,
    memory,
  };
}

export const {memery,add} = await instantiate(
  await (async (url) => {
    const isNodeOrBund =
      typeof process === 'object' && typeof require === 'function';

    if (isNodeOrBund) {
      return globalThis.WebAssembly.compile(url);
    } else {
      return await globalThis.WebAssembly.compileStreaming(
        globalThis.fetch('./build/release.wasm')
      );
    }
  })(new URL('release.wasm', import.meta.url))
);
