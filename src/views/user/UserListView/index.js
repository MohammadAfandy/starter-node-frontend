import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import api from 'src/services/api';
import config from 'src/config';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from 'src/redux/ducks/snackbar';
import { setBaseDialog } from 'src/redux/ducks/baseDialog';
import { setUser, setUserDetail, reloadUser } from 'src/redux/ducks/user';
import FormView from '../Form/FormView';
import Results from './Results';
import Toolbar from './Toolbar';

const { backendUrl } = config;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}));

const UserListView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user, userTotal, reload } = useSelector((state) => state.user);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    column: 'created_at',
    direction: 'desc',
  });

  const deleteUser = (id) => new Promise((resolve, reject) => {
    api(backendUrl)
      .delete(`user/${id}`)
      .then((response) => {
        dispatch(setSnackbar({ message: 'Delete User Success' }));
        dispatch(reloadUser());
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(setSnackbar({ message: 'Delete User Failed', color: 'error' }));
        reject(error.response.data);
      })
      .finally(() => {
        dispatch(setBaseDialog({ open: false }));
      });
  });

  const handleCreate = () => {
    dispatch(setBaseDialog({
      open: true,
      disableBackdropClick: true,
      dialogTitle: 'New User',
      dialogContent: <FormView />,
      formAction: 'create',
    }));
    dispatch(setUserDetail({ data: {} }));
  };

  const handleEdit = (data) => {
    dispatch(setBaseDialog({
      open: true,
      disableBackdropClick: true,
      dialogTitle: 'Edit User',
      dialogContent: <FormView />,
      formAction: 'edit',
    }));
    dispatch(setUserDetail({ data }));
  };

  const handleDelete = (data) => {
    dispatch(setBaseDialog({
      open: true,
      dialogTitle: 'Delete User',
      dialogContent: `Are you sure you want to delete user ${data.username} ?`,
      dialogAction: (
        <>
          <Button onClick={() => dispatch(setBaseDialog({ open: false }))} color="primary">
            No
          </Button>
          <Button onClick={() => deleteUser(data.id)} color="primary" autoFocus>
            Yes
          </Button>
        </>
      ),
    }));
  };

  const handleSortChange = (event, column, direction) => {
    if (!direction) {
      setSort({ column, direction: 'asc' });
    } else if (direction === 'asc') {
      setSort({ column, direction: 'desc' });
    } else {
      setSort(null);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const fetchData = async () => {
    try {
      const response = await api(backendUrl).get('user', {
        params: {
          q: search,
          page,
          limit,
          sort: sort && `${sort.column}:${sort.direction}`,
        }
      });
      const { data, total } = response.data.data;
      dispatch(setUser({
        user: data,
        userTotal: total,
      }));
      return data;
    } catch (error) {
      dispatch(setSnackbar({ color: 'error', message: 'Fetching data failed' }));
      return [];
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [reload, page, limit, sort, search]);

  return (
    <Page
      className={classes.root}
      title="User"
    >
      <Container maxWidth={false}>
        <Toolbar
          search={search}
          handleCreate={handleCreate}
          handleSearchChange={handleSearchChange}
        />
        <Box mt={3}>
          <Results
            user={user}
            limit={limit}
            page={page}
            sort={sort}
            total={userTotal}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleSortChange={handleSortChange}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default UserListView;
