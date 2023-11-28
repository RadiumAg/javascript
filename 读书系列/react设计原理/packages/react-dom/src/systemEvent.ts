import type { Props } from 'shared/reactTypes';

const elementPropsKey = '__props';

interface DOMElement extends Element {
  [elementPropsKey]: Props;
}

function updateFiberProps(node: DOMElement, props: Props) {
  node[elementPropsKey] = props;
}

export type { DOMElement };
export { updateFiberProps };
