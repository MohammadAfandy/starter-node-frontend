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
import { reloadUser } from 'src/redux/ducks/user';
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
  const { userDetail } = useSelector((state) => state.user);

  const createUser = (user) => new Promise((resolve, reject) => {
    api(backendUrl)
      .post('user', user)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });

  const editUser = (data, id) => new Promise((resolve, reject) => {
    api(backendUrl)
      .put(`user/${id}`, data)
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
        id: userDetail.id || '',
        email: userDetail.email || '',
        username: userDetail.username || '',
        fullname: userDetail.fullname || '',
        phone_number: userDetail.phone_number || '',
      }}
      validationSchema={
        Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          fullname: Yup.string().max(255).required('Full name is required'),
          username: Yup.string().max(255).required('Username is required'),
          phone_number: Yup.string().max(20).required('Phone Number is required'),
        })
      }
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        try {
          if (formAction === 'create') {
            await createUser(values);
            dispatch(setSnackbar({ message: 'Create User Success' }));
          } else if (formAction === 'edit') {
            await editUser(values, values.id);
            dispatch(setSnackbar({ message: 'Edit User Success' }));
          }
          dispatch(reloadUser());
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
        setFieldValue
      }) => (
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={values.id} />
          <TextField
            error={Boolean(touched.fullname && errors.fullname)}
            fullWidth
            helperText={touched.fullname && errors.fullname}
            label="Full Name"
            margin="normal"
            name="fullname"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.fullname}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.username && errors.username)}
            fullWidth
            helperText={touched.username && errors.username}
            label="Username"
            margin="normal"
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.username}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.phone_number && errors.phone_number)}
            fullWidth
            helperText={touched.phone_number && errors.phone_number}
            label="Phone Number"
            margin="normal"
            name="phone_number"
            onBlur={handleBlur}
            onChange={(e) => {
              e.preventDefault();
              const { value } = e.target;
              const regex = /^(\s*|\d+)$/;
              if (regex.test(value.toString())) {
                setFieldValue('phone_number', value);
              }
            }}
            value={values.phone_number}
            variant="outlined"
          />
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
