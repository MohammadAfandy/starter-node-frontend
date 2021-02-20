export default (errors) => {
  const formError = {};
  errors.forEach((v) => {
    formError[v.param] = v.message;
  });
  return formError;
};
