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
import { setProduct, setProductDetail, reloadProduct } from 'src/redux/ducks/product';
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

const ProductListView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { product, productTotal, reload } = useSelector((state) => state.product);
  const [listCategory, setListCategory] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({
    column: 'created_at',
    direction: 'desc',
  });

  const deleteProduct = (id) => new Promise((resolve, reject) => {
    api(backendUrl)
      .delete(`product/${id}`)
      .then((response) => {
        dispatch(setSnackbar({ message: 'Delete Product Success' }));
        dispatch(reloadProduct());
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(setSnackbar({ message: 'Delete Product Failed', color: 'error' }));
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
      dialogTitle: 'New Product',
      dialogContent: <FormView listCategory={listCategory} />,
      formAction: 'create',
    }));
    dispatch(setProductDetail({ data: {} }));
  };

  const handleEdit = (data) => {
    dispatch(setBaseDialog({
      open: true,
      disableBackdropClick: true,
      dialogTitle: 'Edit Product',
      dialogContent: <FormView listCategory={listCategory} />,
      formAction: 'edit',
    }));
    dispatch(setProductDetail({ data }));
  };

  const handleDelete = (data) => {
    dispatch(setBaseDialog({
      open: true,
      dialogTitle: 'Delete Product',
      dialogContent: `Are you sure you want to delete product ${data.code} ?`,
      dialogAction: (
        <>
          <Button onClick={() => dispatch(setBaseDialog({ open: false }))} color="primary">
            No
          </Button>
          <Button onClick={() => deleteProduct(data.id)} color="primary" autoFocus>
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
      const response = await api(backendUrl).get('product', {
        params: {
          q: search,
          page,
          limit,
          sort: sort && `${sort.column}:${sort.direction}`,
        }
      });
      const { data, total } = response.data.data;
      dispatch(setProduct({
        product: data,
        productTotal: total,
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

  useEffect(() => {
    const fetchListCategory = async () => {
      try {
        const response = await api(backendUrl).get('category', {
          params: {
            limit: 100,
            sort: 'code:asc',
          }
        });
        const { data } = response.data.data;
        setListCategory(data);
      } catch (error) {
        setListCategory([]);
      }
    };
    fetchListCategory();
  }, []);

  return (
    <Page
      className={classes.root}
      title="Product"
    >
      <Container maxWidth={false}>
        <Toolbar
          search={search}
          handleCreate={handleCreate}
          handleSearchChange={handleSearchChange}
        />
        <Box mt={3}>
          <Results
            product={product}
            limit={limit}
            page={page}
            sort={sort}
            total={productTotal}
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

export default ProductListView;
