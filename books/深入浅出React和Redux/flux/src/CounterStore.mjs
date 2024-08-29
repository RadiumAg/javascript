import { EventEmitter } from 'stream';
import * as ActionTypes from './ActionTypes.mjs';
import { CHANGE_EVENT } from './Actions.mjs';
import AppDispatcher from './AppDispatcher.mjs';

const counterValues = {
  First: 0,
  Second: 10,
  Third: 30,
};

const CounterStore = Object.assign({}, EventEmitter.prototype, {
  getCounterValues() {
    return counterValues;
  },
  emitChange() {
    this.emitChange(CHANGE_EVENT);
  },
  addEventListener(callback) {
    this.addEventListener(CHANGE_EVENT, callback);
  },
  removeEventListener(callback) {
    this.removeEventListener(CHANGE_EVENT, callback);
  },
});

CounterStore.dispatchToken = AppDispatcher.register(action => {
  if (action.type === ActionTypes.INCREMENT) {
    counterValues[action.counterCaption]++;
    CounterStore.emitChange();
  } else if (action.type === ActionTypes.DECREMENT) {
    counterValues[action.counterCaption]--;
    CounterStore.emitChange();
  }
});

export { CounterStore };
