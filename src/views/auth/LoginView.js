import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
import { uuid } from 'uuidv4';
import Page from 'src/components/Page';
import api from 'src/services/api';
import config from 'src/config';
import formError from 'src/utils/formError';
import { useDispatch } from 'react-redux';
import { setSnackbar } from 'src/redux/ducks/snackbar';
import { fetchLogin } from 'src/redux/ducks/auth';

const { backendUrl } = config;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const classes = useStyles();
  const navigate = useNavigate();

  const login = (user) => new Promise((resolve, reject) => {
    user.device = uuid();
    api(backendUrl)
      .post('auth/login', user)
      .then((response) => {
        resolve(response.data);
      }).catch((error) => {
        reject(error.response.data);
      });
  });

  return (
    <Page
      className={classes.root}
      title="Login"
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
              credential: state ? state.credential : '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              credential: Yup.string().max(255).required('Username / Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
              try {
                const response = await login(values);
                dispatch(fetchLogin(response.data));
                dispatch(setSnackbar({ message: 'Login Success' }));
                navigate('/app/dashboard', {
                  replace: true,
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
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.credential && errors.credential)}
                  fullWidth
                  helperText={touched.credential && errors.credential}
                  label="Username / Email"
                  margin="normal"
                  name="credential"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.credential}
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
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Sign up
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

export default LoginView;
