import AppDispatcher from './AppDispatcher.mjs';
import * as ActionTypes from './ActionTypes.mjs';

AppDispatcher.dispatch({
  type: ActionTypes.INCREMENT,
  counterCaption: 'First',
});
