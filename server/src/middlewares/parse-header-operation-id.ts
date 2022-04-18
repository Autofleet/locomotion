export default (req, res, next): void => {
  if (req.headers['X-LOCO-OP-ID']) {
    const unsafeId = req.headers['X-LOCO-OP-ID'];
    if (unsafeId.length !== 36) {
      res.json({
        error: 'INVALID HEADERS',
      });
      return;
    }

    // eslint-disable-next-line no-unused-expressions
    req.headerOperationId = req.headers['X-LOCO-OP-ID'];
  }
  next();
};
