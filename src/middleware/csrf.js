import crypto from "node:crypto";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfProtection(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }
  res.locals.csrfToken = req.session.csrfToken;

  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const sent = Buffer.from(String(req.body?._csrf ?? ""));
  const expected = Buffer.from(req.session.csrfToken);
  if (sent.length !== expected.length || !crypto.timingSafeEqual(sent, expected)) {
    return res.status(403).render("error", {
      title: "Requisição inválida",
      message: "O formulário expirou. Volte, recarregue a página e tente de novo.",
    });
  }

  next();
}
