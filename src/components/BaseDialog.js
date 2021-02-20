import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  makeStyles,
  Typography
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { setBaseDialog } from 'src/redux/ducks/baseDialog';

const useStyles = makeStyles(() => ({
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}));

const BaseDialog = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    open,
    fullWidth,
    maxWidth,
    disableBackdropClick,
    dialogTitle,
    dialogContent,
    dialogAction,
  } = useSelector((state) => state.baseDialog);

  const handleClose = () => {
    dispatch(setBaseDialog({ open: false }));
  };

  return (
    <Dialog
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      disableBackdropClick={disableBackdropClick}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle
        disableTypography
        id="form-dialog-title"
        className={classes.dialogTitle}
      >
        <Typography
          color="textPrimary"
          variant="h4"
        >
          {dialogTitle}
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {dialogContent}
      </DialogContent>
      <DialogActions>
        {dialogAction}
        {/* <Button
          onClick={handleClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleClose}
          color="primary"
        >
          Subscribe
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default BaseDialog;
