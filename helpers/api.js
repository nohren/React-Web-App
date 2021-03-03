const axios = require('axios');
const config = require('../config.js');

axios.defaults.headers.common.authorization = config.API_TOKEN;

// broken down by widget to minimize toe-on-toe action

// PRODUCTS DETAIL WIDGET HELPERS

const getProductData = (id, cb) => {
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/products/${id}`)
    .then((response) => {
      cb(null, response);
    })
    .catch((err) => cb(err, null));
};

const getStyles = (id, cb) => {
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/products/${id}/styles`)
    .then((response) => {
      cb(null, response);
    })
    .catch((err) => cb(err, null));
};

const getRelated = (id, cb) => {
  axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/products/${id}/related`)
    .then((response) => {
      cb(null, response);
    })
    .catch((err) => cb(err, null));
};

// Q/A WIDGET HELPERS
const getQuestions = (id, count, cb) => {
  const url = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/qa/questions?product_id=${id}&page=1&count=${count}&sort=helpful`;

  axios.get(url)
    .then((response) => cb(null, response.data.results))
    .catch((err) => cb(err, null));
};

// RELATED ITEMS/OUTFIT WIDGET HELPERS


// RATINGS/REVIEWS WIDGET HELPERS
const getAllReviews = (id, cb) => {
  // IOCE - input a product id and a callback
  // output is an array of all reviews for the input product id
  // method of operation is a recursive call to each page until reviews array is empty... asynchronously
  const reviews = [];
  const innerRecursiveFunc = (pageCount) => {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/reviews/?page=${pageCount}&product_id=${id}`)
      .then((response) => {
        // base case reviews empty
        if (response.data.results.length === 0) {
          cb(null, reviews.flat());
          return;
        }
        // recursive
        if (response.data.results.length > 0) {
          reviews.push(response.data.results);
          innerRecursiveFunc(pageCount + 1);
        }
      })
      .catch((err) => {
        // err does not get triggered if the page is empty.  Only if the request fails at the server.
        cb(err, null);
      });
  };
  innerRecursiveFunc(1);
};

module.exports = {
  getProductData,
  getStyles,
  getRelated,
  getQuestions,
  getAllReviews
};
