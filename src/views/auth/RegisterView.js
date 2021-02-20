import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import api from 'src/services/api';
import config from 'src/config';
import formError from 'src/utils/formError';
import { useDispatch } from 'react-redux';
import { setSnackbar } from 'src/redux/ducks/snackbar';

const { backendUrl } = config;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const RegisterView = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  const registerUser = (user) => new Promise((resolve, reject) => {
    api(backendUrl)
      .post('auth/register', user)
      .then((response) => {
        resolve(response.data);
      }).catch((error) => {
        reject(error.response.data);
      });
  });

  return (
    <Page
      className={classes.root}
      title="Register"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              username: '',
              fullname: '',
              phone_number: '',
              password: '',
              password_confirmation: '',
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                fullname: Yup.string().max(255).required('Full name is required'),
                username: Yup.string().max(255).required('Username is required'),
                phone_number: Yup.string().max(20).required('Phone Number is required'),
                password: Yup.string().max(255).required('Password is required'),
                password_confirmation: Yup.string().max(255).required('Password Confirmation is required'),
              })
            }
            onSubmit={async (values, { setErrors, setSubmitting }) => {
              try {
                const response = await registerUser(values);
                navigate('/login', {
                  replace: true,
                  state: { credential: response.data.username }
                });
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
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Create new account
                  </Typography>
                </Box>
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
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password_confirmation && errors.password_confirmation)}
                  fullWidth
                  helperText={touched.password_confirmation && errors.password_confirmation}
                  label="Password Confirmation"
                  margin="normal"
                  name="password_confirmation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password_confirmation}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="h6"
                  >
                    Sign in
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;
