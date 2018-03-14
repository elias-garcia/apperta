const createData = (arr) => {
  const content = {};

  arr.forEach((elem) => {
    content[elem.title] = elem.data;
  });

  return content;
};

const createError = (status, message) => {
  const content = {
    status,
    message,
  };

  return content;
};

module.exports = {
  createData,
  createError,
};
