const element = {
  type: 'h1',
  props: {
    title: 'foo',
    children: 'Hello',
  },
};

const container = document.querySelector('#root');

const node = document.createElement(element.type);

node['title'] = element.props.title;

const text = document.createTextNode('');
text['nodeValue'] = element.props.children;

node.append(text);
container.append(node);
