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
import { setCategory, setCategoryDetail, reloadCategory } from 'src/redux/ducks/category';
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

const CategoryListView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { category, categoryTotal, reload } = useSelector((state) => state.category);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    column: 'created_at',
    direction: 'desc',
  });

  const deleteCategory = (id) => new Promise((resolve, reject) => {
    api(backendUrl)
      .delete(`category/${id}`)
      .then((response) => {
        dispatch(setSnackbar({ message: 'Delete Category Success' }));
        dispatch(reloadCategory());
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(setSnackbar({ message: 'Delete Category Failed', color: 'error' }));
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
      dialogTitle: 'New Category',
      dialogContent: <FormView />,
      formAction: 'create',
    }));
    dispatch(setCategoryDetail({ data: {} }));
  };

  const handleEdit = (data) => {
    dispatch(setBaseDialog({
      open: true,
      disableBackdropClick: true,
      dialogTitle: 'Edit Category',
      dialogContent: <FormView />,
      formAction: 'edit',
    }));
    dispatch(setCategoryDetail({ data }));
  };

  const handleDelete = (data) => {
    dispatch(setBaseDialog({
      open: true,
      dialogTitle: 'Delete Category',
      dialogContent: `Are you sure you want to delete category ${data.code} ?`,
      dialogAction: (
        <>
          <Button onClick={() => dispatch(setBaseDialog({ open: false }))} color="primary">
            No
          </Button>
          <Button onClick={() => deleteCategory(data.id)} color="primary" autoFocus>
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
      const response = await api(backendUrl).get('category', {
        params: {
          q: search,
          page,
          limit,
          sort: sort && `${sort.column}:${sort.direction}`,
        }
      });
      const { data, total } = response.data.data;
      dispatch(setCategory({
        category: data,
        categoryTotal: total,
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
      title="Category"
    >
      <Container maxWidth={false}>
        <Toolbar
          search={search}
          handleCreate={handleCreate}
          handleSearchChange={handleSearchChange}
        />
        <Box mt={3}>
          <Results
            category={category}
            limit={limit}
            page={page}
            sort={sort}
            total={categoryTotal}
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

export default CategoryListView;
