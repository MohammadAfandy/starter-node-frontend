import { combineReducers, createStore } from 'redux';
import snackbarReducer from './ducks/snackbar';
import baseDialogReducer from './ducks/baseDialog';
import authReducer from './ducks/auth';
import categoryReducer from './ducks/category';
import productReducer from './ducks/product';
import userReducer from './ducks/user';

const reducer = combineReducers({
  snackbar: snackbarReducer,
  baseDialog: baseDialogReducer,
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  user: userReducer,
});

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
