import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { setSnackbar } from 'src/redux/ducks/snackbar';

const MySnackBar = () => {
  const dispatch = useDispatch();
  const { open, color, message } = useSelector((state) => state.snackbar);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(setSnackbar({ open: false, color }));
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={color} variant="filled" elevation={6}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MySnackBar;
