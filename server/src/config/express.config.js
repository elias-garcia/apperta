const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const middleware = require('../middleware/index');
const routes = require('../api/index');
const error = require('../util/error');
const appConfig = require('./app.config');
const ApiError = require('../api/api-error');

const configure = (app) => {
  /* Use morgan to log if in dev mode */
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  /* Basic security protection */
  app.use(helmet());

  /* Accept origins */
  app.use(middleware.accessControl);

  /* Server configuration */
  app.set('port', appConfig.port);

  /* Use json as body request parser */
  app.use(express.json({ limit: '5mb' }));

  /* Accept only Content Type application/json */
  app.use(middleware.acceptJson);

  /* Set the application/json Content Type on all responses */
  app.use(middleware.setJson);

  /* Endpoints that requires authentication */
  app.put(`${appConfig.path}/me`, middleware.auth);
  app.patch(`${appConfig.path}/me`, middleware.auth);
  app.delete(`${appConfig.path}/me`, middleware.auth);
  app.post(`${appConfig.path}/businesses`, middleware.auth);
  app.put(`${appConfig.path}/businesses`, middleware.auth);
  app.post(`${appConfig.path}/businesses/:businessId/images`, middleware.auth);
  app.delete(`${appConfig.path}/businesses/:businessId/images/:imageId`, middleware.auth);

  /* Routing configuration */
  app.use(appConfig.path, routes);

  /* Error handler for non existing routes */
  app.use((req, res, next) => {
    next(new ApiError(501, 'not implemented'));
  });

  /* Error handler for runtime and API errors */
  app.use(error.handler);
};

module.exports = configure;
