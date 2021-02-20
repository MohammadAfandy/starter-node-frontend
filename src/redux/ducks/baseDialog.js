export const SET_BASE_DIALOG = 'starter-app/baseDialog/SET_BASE_DIALOG';

const initialState = {
  open: false,
  fullWidth: true,
  maxWidth: 'sm',
  disableBackdropClick: false,
  dialogTitle: '',
  dialogContent: '',
  dialogAction: '',
  formAction: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BASE_DIALOG: {
      const { type, ...rest } = action;
      return {
        ...state,
        ...rest,
      };
    }
    default: {
      return state;
    }
  }
};

export const setBaseDialog = ({
  open = false,
  fullWidth = true,
  maxWidth = 'sm',
  disableBackdropClick = false,
  dialogTitle = '',
  dialogContent = '',
  dialogAction = '',
  formAction = ''
}) => {
  return {
    type: SET_BASE_DIALOG,
    open,
    fullWidth,
    maxWidth,
    disableBackdropClick,
    dialogTitle,
    dialogContent,
    dialogAction,
    formAction,
  };
};
