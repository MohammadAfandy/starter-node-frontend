export const SET_SNACKBAR = 'starter-app/snackbar/SET_SNACKBAR';

const initialState = {
  open: false,
  color: 'success',
  message: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SNACKBAR: {
      const { open, color, message } = action;
      return {
        ...state,
        open,
        color,
        message,
      };
    }
    default: {
      return state;
    }
  }
};

export const setSnackbar = ({
  open = true,
  color = 'success',
  message = ''
}) => {
  return {
    type: SET_SNACKBAR,
    open,
    color,
    message,
  };
};
