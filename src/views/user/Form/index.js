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

const UserForm = () => {
  const classes = useStyles();
  return (
    <Page
      className={classes.root}
      title="User"
    >
      <Container maxWidth={false}>
        <FormView />
      </Container>
    </Page>
  );
};

export default UserForm;
