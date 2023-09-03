import * as ActionTypes from './ActionTypes.mjs';
import AppDispatcher from './AppDispatcher.mjs';

const increment = counterCaption => {
  AppDispatcher.dispatch({
    type: ActionTypes.INCREMENT,
    counterCaption,
  });
};

const decrement = counterCaption => {
  AppDispatcher.dispatch({
    type: ActionTypes.DECREMENT,
    counterCaption,
  });
};

export { increment, decrement };
