export const SET_CATEGORY = 'starter-app/baseDialog/SET_CATEGORY';
export const SET_CATEGORY_DETAIL = 'starter-app/baseDialog/SET_CATEGORY_DETAIL';
export const RELOAD_CATEGORY = 'starter-app/baseDialog/RELOAD_CATEGORY';

const initialState = {
  category: [],
  categoryDetail: {},
  categoryTotal: 0,
  reload: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORY: {
      const { type, ...rest } = action;
      return {
        ...state,
        ...rest,
      };
    }
    case SET_CATEGORY_DETAIL: {
      return {
        ...state,
        categoryDetail: action.data,
      };
    }
    case RELOAD_CATEGORY: {
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

export const setCategory = (state) => {
  return {
    type: SET_CATEGORY,
    ...state
  };
};

export const setCategoryDetail = (state) => {
  return {
    type: SET_CATEGORY_DETAIL,
    ...state
  };
};

export const reloadCategory = (state) => {
  return {
    type: RELOAD_CATEGORY,
    ...state,
  };
};
