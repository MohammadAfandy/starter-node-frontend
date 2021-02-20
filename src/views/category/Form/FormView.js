import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  TextField,
  makeStyles
} from '@material-ui/core';
import api from 'src/services/api';
import config from 'src/config';
import formError from 'src/utils/formError';
import { useDispatch, useSelector } from 'react-redux';
import { reloadCategory } from 'src/redux/ducks/category';
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

const FormView = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formAction } = useSelector((state) => state.baseDialog);
  const { categoryDetail } = useSelector((state) => state.category);
  // const navigate = useNavigate();

  const createCategory = (user) => new Promise((resolve, reject) => {
    api(backendUrl)
      .post('category', user)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });

  const editCategory = (data, id) => new Promise((resolve, reject) => {
    api(backendUrl)
      .put(`category/${id}`, data)
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
        id: categoryDetail.id || '',
        code: categoryDetail.code || '',
        name: categoryDetail.name || '',
        description: categoryDetail.description || '',
      }}
      validationSchema={
        Yup.object().shape({
          code: Yup.string().min(5).max(20).required('Category Code is required'),
          name: Yup.string().min(3).max(255).required('Category Name is required'),
          description: Yup.string().max(500),
        })
      }
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        try {
          if (formAction === 'create') {
            await createCategory(values);
            dispatch(setSnackbar({ message: 'Create Category Success' }));
          } else if (formAction === 'edit') {
            await editCategory(values, values.id);
            dispatch(setSnackbar({ message: 'Edit Category Success' }));
          }
          dispatch(reloadCategory());
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
              label="Category Code"
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
              label="Category Name"
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
              label="Category Description"
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

export default FormView;
