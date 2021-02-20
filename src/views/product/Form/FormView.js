import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  makeStyles
} from '@material-ui/core';
import api from 'src/services/api';
import config from 'src/config';
import formError from 'src/utils/formError';
import { useDispatch, useSelector } from 'react-redux';
import { reloadProduct } from 'src/redux/ducks/product';
import { setSnackbar } from 'src/redux/ducks/snackbar';
import { setBaseDialog } from 'src/redux/ducks/baseDialog';

const { backendUrl } = config;

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxSubmit: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const FormView = ({
  listCategory
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formAction } = useSelector((state) => state.baseDialog);
  const { productDetail } = useSelector((state) => state.product);

  const createProduct = (user) => new Promise((resolve, reject) => {
    api(backendUrl)
      .post('product', user)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });

  const editProduct = (data, id) => new Promise((resolve, reject) => {
    api(backendUrl)
      .put(`product/${id}`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });

  return (
    <Formik
      initialValues={{
        id: productDetail.id || '',
        code: productDetail.code || '',
        name: productDetail.name || '',
        description: productDetail.description || '',
        category_id: productDetail.category_id || '',
      }}
      validationSchema={
        Yup.object().shape({
          code: Yup.string().min(5).max(20).required('Product Code is required'),
          name: Yup.string().min(3).max(255).required('Product Name is required'),
          description: Yup.string().max(500),
          category_id: Yup.string().required('Category is required'),
        })
      }
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        try {
          if (formAction === 'create') {
            await createProduct(values);
            dispatch(setSnackbar({ message: 'Create Product Success' }));
          } else if (formAction === 'edit') {
            await editProduct(values, values.id);
            dispatch(setSnackbar({ message: 'Edit Product Success' }));
          }
          dispatch(reloadProduct());
          dispatch(setBaseDialog({ open: false }));
        } catch (error) {
          if (error.code === 422) {
            setErrors(formError(error.error));
          } else {
            dispatch(setSnackbar({ color: 'error', message: error.message }));
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        // setFieldValue
      }) => (
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={values.id} />
          <div>
            <TextField
              error={Boolean(touched.code && errors.code)}
              fullWidth
              size="small"
              helperText={touched.code && errors.code}
              label="Product Code"
              margin="normal"
              name="code"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.code}
              variant="outlined"
            />
          </div>
          <div>
            <TextField
              error={Boolean(touched.name && errors.name)}
              fullWidth
              size="small"
              helperText={touched.name && errors.name}
              label="Product Name"
              margin="normal"
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              variant="outlined"
            />
          </div>
          <div>
            <TextField
              error={Boolean(touched.description && errors.description)}
              fullWidth
              size="small"
              helperText={touched.description && errors.description}
              label="Product Description"
              margin="normal"
              name="description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              variant="outlined"
              multiline
              rows={4}
            />
          </div>
          <div>
            <Select
              error={Boolean(touched.category_id && errors.category_id)}
              fullWidth
              size="small"
              helperText={touched.category_id && errors.category_id}
              label="Category"
              margin="normal"
              name="category_id"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.category_id}
              variant="outlined"
            >
              {listCategory.map((v) => (
                <MenuItem key={v.id} value={v.id} selected={v.id === productDetail.category_id}>
                  {`${v.code} - ${v.name}`}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={classes.boxSubmit}>
            <Box my={2}>
              <Button
                color="primary"
                disabled={isSubmitting}
                fullWidth
                size="md"
                type="submit"
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          </div>
        </form>
      )}
    </Formik>
  );
};

FormView.propTypes = {
  listCategory: PropTypes.array,
};

export default FormView;
