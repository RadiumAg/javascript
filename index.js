
import * as Vue from 'vue';

function run (fn) {
  const gen = fn();

  function next (_error, data) {
    const result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

const a = function () {
  return (arg) => { arg(); };
};

function * b () {
  const c = yield a();
  console.log(c);
}

export default {
  name: 'component-doc',
  components: {
    'element-demo0': (function () {
      const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock, resolveComponent: _resolveComponent, withCtx: _withCtx, createVNode: _createVNode } = Vue;

      function render (_ctx, _cache) {
        const _component_el_option = _resolveComponent('el-option');
        const _component_el_select = _resolveComponent('el-select');

        return (_openBlock(), _createBlock('div', null, [
          _createVNode(_component_el_select, {
            modelValue: _ctx.value,
            'onUpdate:modelValue': _cache[1] || (_cache[1] = $event => (_ctx.value = $event)),
            placeholder: '请选择'
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
                return (_openBlock(), _createBlock(_component_el_option, {
                  key: item.value,
                  label: item.label,
                  value: item.value
                }, null, 8 /* PROPS */, ['label', 'value']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue'])
        ]));
      }

      const democomponentExport = {
        data () {
          return {
            options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }],
            value: ''
          };
        }
      };
      return {
        render,
        ...democomponentExport
      };
    })(),
    'element-demo1': (function () {
      const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock, resolveComponent: _resolveComponent, withCtx: _withCtx, createVNode: _createVNode } = Vue;

      function render (_ctx, _cache) {
        const _component_el_option = _resolveComponent('el-option');
        const _component_el_select = _resolveComponent('el-select');

        return (_openBlock(), _createBlock('div', null, [
          _createVNode(_component_el_select, {
            modelValue: _ctx.value,
            'onUpdate:modelValue': _cache[1] || (_cache[1] = $event => (_ctx.value = $event)),
            placeholder: '请选择'
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
                return (_openBlock(), _createBlock(_component_el_option, {
                  key: item.value,
                  label: item.label,
                  value: item.value,
                  disabled: item.disabled
                }, null, 8 /* PROPS */, ['label', 'value', 'disabled']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue'])
        ]));
      }

      const democomponentExport = {
        data () {
          return {
            options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶',
              disabled: true
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }],
            value: ''
          };
        }
      };
      return {
        render,
        ...democomponentExport
      };
    })(),
    'element-demo2': (function () {
      const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock, resolveComponent: _resolveComponent, withCtx: _withCtx, createVNode: _createVNode } = Vue;

      function render (_ctx, _cache) {
        const _component_el_option = _resolveComponent('el-option');
        const _component_el_select = _resolveComponent('el-select');

        return (_openBlock(), _createBlock('div', null, [
          _createVNode(_component_el_select, {
            modelValue: _ctx.value,
            'onUpdate:modelValue': _cache[1] || (_cache[1] = $event => (_ctx.value = $event)),
            disabled: '',
            placeholder: '请选择'
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
                return (_openBlock(), _createBlock(_component_el_option, {
                  key: item.value,
                  label: item.label,
                  value: item.value
                }, null, 8 /* PROPS */, ['label', 'value']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue'])
        ]));
      }

      const democomponentExport = {
        data () {
          return {
            options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }],
            value: ''
          };
        }
      };
      return {
        render,
        ...democomponentExport
      };
    })(),
    'element-demo3': (function () {
      const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock, resolveComponent: _resolveComponent, withCtx: _withCtx, createVNode: _createVNode } = Vue;

      function render (_ctx, _cache) {
        const _component_el_option = _resolveComponent('el-option');
        const _component_el_select = _resolveComponent('el-select');

        return (_openBlock(), _createBlock('div', null, [
          _createVNode(_component_el_select, {
            modelValue: _ctx.value,
            'onUpdate:modelValue': _cache[1] || (_cache[1] = $event => (_ctx.value = $event)),
            clearable: '',
            placeholder: '请选择'
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
                return (_openBlock(), _createBlock(_component_el_option, {
                  key: item.value,
                  label: item.label,
                  value: item.value
                }, null, 8 /* PROPS */, ['label', 'value']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue'])
        ]));
      }

      const democomponentExport = {
        data () {
          return {
            options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }],
            value: ''
          };
        }
      };
      return {
        render,
        ...democomponentExport
      };
    })(),
    'element-demo4': (function () {
      const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock, resolveComponent: _resolveComponent, withCtx: _withCtx, createVNode: _createVNode } = Vue;

      function render (_ctx, _cache) {
        const _component_el_option = _resolveComponent('el-option');
        const _component_el_select = _resolveComponent('el-select');

        return (_openBlock(), _createBlock('div', null, [
          _createVNode(_component_el_select, {
            modelValue: _ctx.value1,
            'onUpdate:modelValue': _cache[1] || (_cache[1] = $event => (_ctx.value1 = $event)),
            multiple: '',
            placeholder: '请选择'
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
                return (_openBlock(), _createBlock(_component_el_option, {
                  key: item.value,
                  label: item.label,
                  value: item.value
                }, null, 8 /* PROPS */, ['label', 'value']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue']),
          _createVNode(_component_el_select, {
            modelValue: _ctx.value2,
            'onUpdate:modelValue': _cache[2] || (_cache[2] = $event => (_ctx.value2 = $event)),
            multiple: '',
            'collapse-tags': '',
            style: { 'margin-left': '20px' },
            placeholder: '请选择'
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
                return (_openBlock(), _createBlock(_component_el_option, {
                  key: item.value,
                  label: item.label,
                  value: item.value
                }, null, 8 /* PROPS */, ['label', 'value']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue'])
        ]));
      }

      const democomponentExport = {
        data () {
          return {
            options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }],
            value1: [],
            value2: []
          };
        }
      };
      return {
        render,
        ...democomponentExport
      };
    })(),
    'element-demo5': (function () {
      const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock, toDisplayString: _toDisplayString, createVNode: _createVNode, resolveComponent: _resolveComponent, withCtx: _withCtx } = Vue;

      const _hoisted_1 = { style: { float: 'left' } };
      const _hoisted_2 = { style: { float: 'right', color: '#8492a6', 'font-size': '13px' } };

      function render (_ctx, _cache) {
        const _component_el_option = _resolveComponent('el-option');
        const _component_el_select = _resolveComponent('el-select');

        return (_openBlock(), _createBlock('div', null, [
          _createVNode(_component_el_select, {
            modelValue: _ctx.value,
            'onUpdate:modelValue': _cache[1] || (_cache[1] = $event => (_ctx.value = $event)),
            placeholder: '请选择'
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.cities, (item) => {
                return (_openBlock(), _createBlock(_component_el_option, {
                  key: item.value,
                  label: item.label,
                  value: item.value
                }, {
                  default: _withCtx(() => [
                    _createVNode('span', _hoisted_1, _toDisplayString(item.label), 1 /* TEXT */),
                    _createVNode('span', _hoisted_2, _toDisplayString(item.value), 1 /* TEXT */)
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ['label', 'value']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue'])
        ]));
      }

      const democomponentExport = {
        data () {
          return {
            cities: [{
              value: 'Beijing',
              label: '北京'
            }, {
              value: 'Shanghai',
              label: '上海'
            }, {
              value: 'Nanjing',
              label: '南京'
            }, {
              value: 'Chengdu',
              label: '成都'
            }, {
              value: 'Shenzhen',
              label: '深圳'
            }, {
              value: 'Guangzhou',
              label: '广州'
            }],
            value: ''
          };
        }
      };
      return {
        render,
        ...democomponentExport
      };
    })(),
    'element-demo6': (function () {
      const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock, resolveComponent: _resolveComponent, withCtx: _withCtx, createVNode: _createVNode } = Vue;

      function render (_ctx, _cache) {
        const _component_el_option = _resolveComponent('el-option');
        const _component_el_option_group = _resolveComponent('el-option-group');
        const _component_el_select = _resolveComponent('el-select');

        return (_openBlock(), _createBlock('div', null, [
          _createVNode(_component_el_select, {
            modelValue: _ctx.value,
            'onUpdate:modelValue': _cache[1] || (_cache[1] = $event => (_ctx.value = $event)),
            placeholder: '请选择'
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.options, (group) => {
                return (_openBlock(), _createBlock(_component_el_option_group, {
                  key: group.label,
                  label: group.label
                }, {
                  default: _withCtx(() => [
                    (_openBlock(true), _createBlock(_Fragment, null, _renderList(group.options, (item) => {
                      return (_openBlock(), _createBlock(_component_el_option, {
                        key: item.value,
                        label: item.label,
                        value: item.value
                      }, null, 8 /* PROPS */, ['label', 'value']));
                    }), 128 /* KEYED_FRAGMENT */))
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1032 /* PROPS, DYNAMIC_SLOTS */, ['label']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue'])
        ]));
      }

      const democomponentExport = {
        data () {
          return {
            options: [{
              label: '热门城市',
              options: [{
                value: 'Shanghai',
                label: '上海'
              }, {
                value: 'Beijing',
                label: '北京'
              }]
            }, {
              label: '城市名',
              options: [{
                value: 'Chengdu',
                label: '成都'
              }, {
                value: 'Shenzhen',
                label: '深圳'
              }, {
                value: 'Guangzhou',
                label: '广州'
              }, {
                value: 'Dalian',
                label: '大连'
              }]
            }],
            value: ''
          };
        }
      };
      return {
        render,
        ...democomponentExport
      };
    })(),
    'element-demo7': (function () {
      const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock, resolveComponent: _resolveComponent, withCtx: _withCtx, createVNode: _createVNode } = Vue;

      function render (_ctx, _cache) {
        const _component_el_option = _resolveComponent('el-option');
        const _component_el_select = _resolveComponent('el-select');

        return (_openBlock(), _createBlock('div', null, [
          _createVNode(_component_el_select, {
            modelValue: _ctx.value,
            'onUpdate:modelValue': _cache[1] || (_cache[1] = $event => (_ctx.value = $event)),
            filterable: '',
            placeholder: '请选择'
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
                return (_openBlock(), _createBlock(_component_el_option, {
                  key: item.value,
                  label: item.label,
                  value: item.value
                }, null, 8 /* PROPS */, ['label', 'value']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue'])
        ]));
      }

      const democomponentExport = {
        data () {
          return {
            options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }],
            value: ''
          };
        }
      };
      return {
        render,
        ...democomponentExport
      };
    })(),
    'element-demo8': (function () {
      const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock, resolveComponent: _resolveComponent, withCtx: _withCtx, createVNode: _createVNode } = Vue;

      function render (_ctx, _cache) {
        const _component_el_option = _resolveComponent('el-option');
        const _component_el_select = _resolveComponent('el-select');

        return (_openBlock(), _createBlock('div', null, [
          _createVNode(_component_el_select, {
            modelValue: _ctx.value,
            'onUpdate:modelValue': _cache[1] || (_cache[1] = $event => (_ctx.value = $event)),
            multiple: '',
            filterable: '',
            remote: '',
            'reserve-keyword': '',
            placeholder: '请输入关键词',
            'remote-method': _ctx.remoteMethod,
            loading: _ctx.loading
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
                return (_openBlock(), _createBlock(_component_el_option, {
                  key: item.value,
                  label: item.label,
                  value: item.value
                }, null, 8 /* PROPS */, ['label', 'value']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue', 'remote-method', 'loading'])
        ]));
      }

      const democomponentExport = {
        data () {
          return {
            options: [],
            value: [],
            list: [],
            loading: false,
            states: ['Alabama', 'Alaska', 'Arizona',
              'Arkansas', 'California', 'Colorado',
              'Connecticut', 'Delaware', 'Florida',
              'Georgia', 'Hawaii', 'Idaho', 'Illinois',
              'Indiana', 'Iowa', 'Kansas', 'Kentucky',
              'Louisiana', 'Maine', 'Maryland',
              'Massachusetts', 'Michigan', 'Minnesota',
              'Mississippi', 'Missouri', 'Montana',
              'Nebraska', 'Nevada', 'New Hampshire',
              'New Jersey', 'New Mexico', 'New York',
              'North Carolina', 'North Dakota', 'Ohio',
              'Oklahoma', 'Oregon', 'Pennsylvania',
              'Rhode Island', 'South Carolina',
              'South Dakota', 'Tennessee', 'Texas',
              'Utah', 'Vermont', 'Virginia',
              'Washington', 'West Virginia', 'Wisconsin',
              'Wyoming']
          };
        },
        mounted () {
          this.list = this.states.map(item => {
            return { value: `value:${item}`, label: `label:${item}` };
          });
        },
        methods: {
          remoteMethod (query) {
            if (query !== '') {
              this.loading = true;
              setTimeout(() => {
                this.loading = false;
                this.options = this.list.filter(item => {
                  return item.label.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
                });
              }, 200);
            } else {
              this.options = [];
            }
          }
        }
      };
      return {
        render,
        ...democomponentExport
      };
    })(),
    'element-demo9': (function () {
      const { renderList: _renderList, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock, resolveComponent: _resolveComponent, withCtx: _withCtx, createVNode: _createVNode } = Vue;

      function render (_ctx, _cache) {
        const _component_el_option = _resolveComponent('el-option');
        const _component_el_select = _resolveComponent('el-select');

        return (_openBlock(), _createBlock('div', null, [
          _createVNode(_component_el_select, {
            modelValue: _ctx.value,
            'onUpdate:modelValue': _cache[1] || (_cache[1] = $event => (_ctx.value = $event)),
            multiple: '',
            filterable: '',
            'allow-create': '',
            'default-first-option': '',
            placeholder: '请选择文章标签'
          }, {
            default: _withCtx(() => [
              (_openBlock(true), _createBlock(_Fragment, null, _renderList(_ctx.options, (item) => {
                return (_openBlock(), _createBlock(_component_el_option, {
                  key: item.value,
                  label: item.label,
                  value: item.value
                }, null, 8 /* PROPS */, ['label', 'value']));
              }), 128 /* KEYED_FRAGMENT */))
            ]),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ['modelValue'])
        ]));
      }

      const democomponentExport = {
        data () {
          return {
            options: [{
              value: 'HTML',
              label: 'HTML'
            }, {
              value: 'CSS',
              label: 'CSS'
            }, {
              value: 'JavaScript',
              label: 'JavaScript'
            }],
            value: []
          };
        }
      };
      return {
        render,
        ...democomponentExport
      };
    })()
  }
};
