const serverResponse = (res, status = 200, message = '') => res.status(status).send(message).end();

export default serverResponse;