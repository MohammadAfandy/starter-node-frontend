export const SET_PRODUCT = 'starter-app/baseDialog/SET_PRODUCT';
export const SET_PRODUCT_DETAIL = 'starter-app/baseDialog/SET_PRODUCT_DETAIL';
export const RELOAD_PRODUCT = 'starter-app/baseDialog/RELOAD_PRODUCT';

const initialState = {
  product: [],
  productDetail: {},
  productTotal: 0,
  reload: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT: {
      const { type, ...rest } = action;
      return {
        ...state,
        ...rest,
      };
    }
    case SET_PRODUCT_DETAIL: {
      return {
        ...state,
        productDetail: action.data,
      };
    }
    case RELOAD_PRODUCT: {
      // = action;
      return {
        ...state,
        reload: state.reload + 1,
      };
    }
    default: {
      return state;
    }
  }
};

export const setProduct = (state) => {
  return {
    type: SET_PRODUCT,
    ...state
  };
};

export const setProductDetail = (state) => {
  return {
    type: SET_PRODUCT_DETAIL,
    ...state
  };
};

export const reloadProduct = (state) => {
  return {
    type: RELOAD_PRODUCT,
    ...state,
  };
};
