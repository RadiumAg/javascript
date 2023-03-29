import * as ActionTypes from './ActionTypes';
import AppDispatcher from './AppDispatcher';

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
