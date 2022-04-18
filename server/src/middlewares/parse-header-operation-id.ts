export default (req, res, next): void => {
  if (req.headers['x-loco-op-id']) {
    const unsafeId = req.headers['x-loco-op-id'];
    if (unsafeId.length !== 36) {
      res.json({
        error: 'INVALID HEADERS',
      });
      return;
    }

    // eslint-disable-next-line no-unused-expressions
    req.headerOperationId = unsafeId;
  }
  next();
};
