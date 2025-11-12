/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get all products
*
* no response value expected for this operation
* */
const productsGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete product by ID
*
* id String 
* no response value expected for this operation
* */
const productsIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get product by ID
*
* id String 
* no response value expected for this operation
* */
const productsIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update product by ID
*
* id String 
* productInput ProductInput 
* no response value expected for this operation
* */
const productsIdPUT = ({ id, productInput }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        productInput,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Create product
*
* productInput ProductInput 
* no response value expected for this operation
* */
const productsPOST = ({ productInput }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        productInput,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  productsGET,
  productsIdDELETE,
  productsIdGET,
  productsIdPUT,
  productsPOST,
};
