class ContextChain {
  #chain: Record<string, any>[] = [];
  #kvCache: Record<string, any> = {};
  #snapshot: Record<string, any>[] | null = null;

  addContext(stepName: string, data: any) {
    this.#chain.push({ step: stepName, data: structuredClone(data) });
    this.#kvCache[stepName] = data;
  }

  getContext(stepName: string) { 
    return this.#kvCache[stepName];
  }

  getAllSteps() {
    return this.#chain;
  }

  latest() {
    return this.#chain[this.#chain.length - 1];
  }

  snapshot() {
    this.#snapshot = structuredClone(this.#chain);
  }

  restore() {
    if (!this.#snapshot) return;
    this.#chain = structuredClone(this.#snapshot)!;
    this.#kvCache = Object.fromEntries(
      this.#chain.map((step) => [step.step, step.data])
    );
  }
}
