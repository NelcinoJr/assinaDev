export function loadCurrentUser(users) {
  return (req, res, next) => {
    const user = req.session.userId ? users.findById(req.session.userId) : null;
    req.user = user ?? null;
    res.locals.currentUser = req.user;
    next();
  };
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
}

export function redirectIfAuthenticated(req, res, next) {
  if (req.user) {
    return res.redirect("/");
  }
  next();
}
