import React from 'react';
import {
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import FormView from './FormView';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ProductForm = () => {
  const classes = useStyles();
  return (
    <Page
      className={classes.root}
      title="Product"
    >
      <Container maxWidth={false}>
        <FormView />
      </Container>
    </Page>
  );
};

export default ProductForm;
