exports.post = function(req, res, next) {
  var sid = req.session.id;

  var io = req.app.get('io');
  req.session.destroy(function(err) {
    // TODO must be like this, broadcastion...
    // io.sockets.$emit("session:reload", sid);
    io.sockets.emit("session:reload", sid);
    if (err) return next(err);

    res.redirect('/');
  });
};