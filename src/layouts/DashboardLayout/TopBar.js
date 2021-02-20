import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Logo from 'src/components/Logo';
import api from 'src/services/api';
import config from 'src/config';
import { useDispatch } from 'react-redux';
import { setSnackbar } from 'src/redux/ducks/snackbar';
import { fetchLogout } from 'src/redux/ducks/auth';

const { backendUrl } = config;

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  },
  mobile: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const [notifications] = useState([]);

  const logout = () => new Promise((resolve, reject) => {
    api(backendUrl)
      .post('auth/logout')
      .then((response) => {
        resolve(response.data);
      }).catch((error) => {
        reject(error.response.data);
      });
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // TODO ERROR
    } finally {
      dispatch(fetchLogout());
      dispatch(setSnackbar({ message: 'Logout Success' }));
      navigate('/login', {
        replace: true,
      });
      // dispatch(setSnackbar({ color: 'error', message: error.message }));
    }
  };

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <Hidden mdDown>
          <RouterLink to="/">
            <Logo />
          </RouterLink>
          <Box flexGrow={1} />
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
          <Box flexGrow={1} />
          <RouterLink to="/">
            <Logo />
          </RouterLink>
          <Box flexGrow={1} />
          <IconButton color="inherit" onClick={handleLogout}>
            <InputIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
