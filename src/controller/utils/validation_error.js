class ApiErrors extends Error {
  constructor(message, statusCode) {
    console.log(message);
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true;
  }
}

module.exports = ApiErrors;
