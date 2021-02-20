export const SET_CATEGORY = 'starter-app/baseDialog/SET_CATEGORY';
export const SET_CATEGORY_DETAIL = 'starter-app/baseDialog/SET_CATEGORY_DETAIL';
export const RELOAD_CATEGORY = 'starter-app/baseDialog/RELOAD_CATEGORY';

const initialState = {
  user: [],
  userDetail: {},
  userTotal: 0,
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
        userDetail: action.data,
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

export const setUser = (state) => {
  return {
    type: SET_CATEGORY,
    ...state
  };
};

export const setUserDetail = (state) => {
  return {
    type: SET_CATEGORY_DETAIL,
    ...state
  };
};

export const reloadUser = (state) => {
  return {
    type: RELOAD_CATEGORY,
    ...state,
  };
};
