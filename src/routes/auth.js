import { Router } from "express";
import { AuditEvent } from "../audit.js";
import { normalizeEmail, validateRegistration } from "../users.js";
import { redirectIfAuthenticated } from "../middleware/auth.js";

const DUPLICATE_EMAIL = "Este e-mail já está cadastrado";
const INVALID_CREDENTIALS = "E-mail ou senha incorretos";

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()));
  });
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => (err ? reject(err) : resolve()));
  });
}

async function startSession(req, userId) {
  // Novo ID de sessão no login evita fixação de sessão.
  await regenerateSession(req);
  req.session.userId = userId;
}

export function authRouter({ users, audit, sessionCookieName }) {
  const router = Router();

  router.get("/register", redirectIfAuthenticated, (req, res) => {
    res.render("register", { title: "Criar conta", values: {}, errors: {} });
  });

  router.post("/register", redirectIfAuthenticated, async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password ?? "");
    const errors = validateRegistration({ email, password });

    if (!errors.email && users.existsByEmail(email)) {
      errors.email = DUPLICATE_EMAIL;
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).render("register", { title: "Criar conta", values: { email }, errors });
    }

    let user;
    try {
      user = await users.create({ email, password });
    } catch (err) {
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return res.status(422).render("register", {
          title: "Criar conta",
          values: { email },
          errors: { email: DUPLICATE_EMAIL },
        });
      }
      throw err;
    }

    audit.record({ event: AuditEvent.REGISTER, userId: user.id, email: user.email, ip: req.ip });
    await startSession(req, user.id);
    res.redirect("/");
  });

  router.get("/login", redirectIfAuthenticated, (req, res) => {
    res.render("login", { title: "Entrar", values: {}, error: null });
  });

  router.post("/login", redirectIfAuthenticated, async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const user = await users.authenticate({ email, password: req.body.password });

    if (!user) {
      audit.record({ event: AuditEvent.LOGIN_FAILURE, email, ip: req.ip });
      return res.status(401).render("login", {
        title: "Entrar",
        values: { email },
        error: INVALID_CREDENTIALS,
      });
    }

    audit.record({ event: AuditEvent.LOGIN_SUCCESS, userId: user.id, email: user.email, ip: req.ip });
    await startSession(req, user.id);
    res.redirect("/");
  });

  router.post("/logout", async (req, res) => {
    if (req.user) {
      audit.record({ event: AuditEvent.LOGOUT, userId: req.user.id, email: req.user.email, ip: req.ip });
    }
    await destroySession(req);
    res.clearCookie(sessionCookieName);
    res.redirect("/login");
  });

  return router;
}
