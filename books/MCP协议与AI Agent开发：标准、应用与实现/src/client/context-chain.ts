class ContextChain {
  chain: Record<string, any>[] = [];
  kvCache: Record<string, any> = {};
  snapshot = null;

  addContext(stepName: string, data: any) {
    this.chain.push({ step: stepName, data: structuredClone(data) });
    this.kvCache[stepName] = data;
  }
}
