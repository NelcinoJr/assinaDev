import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import session from "express-session";
import { openDatabase } from "./db.js";
import { SqliteSessionStore } from "./session-store.js";
import { createUserRepository } from "./users.js";
import { createAuditLog } from "./audit.js";
import { csrfProtection } from "./middleware/csrf.js";
import { loadCurrentUser, requireAuth } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SESSION_COOKIE = "assinadev.sid";

export function createApp({
  database = path.join(rootDir, "data", "assinadev.db"),
  sessionSecret = process.env.SESSION_SECRET,
  secureCookies = process.env.NODE_ENV === "production",
} = {}) {
  if (!sessionSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET é obrigatório em produção");
    }
    sessionSecret = crypto.randomBytes(32).toString("hex");
  }

  const db = openDatabase(database);
  const users = createUserRepository(db);
  const audit = createAuditLog(db);

  const app = express();
  app.set("view engine", "ejs");
  app.set("views", path.join(rootDir, "views"));
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.locals.db = db;
  app.locals.currentUser = null;
  app.locals.csrfToken = "";

  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      name: SESSION_COOKIE,
      secret: sessionSecret,
      store: new SqliteSessionStore(db),
      resave: false,
      saveUninitialized: false,
      // Sem maxAge: cookie de sessão, descartado quando o navegador é fechado.
      cookie: { httpOnly: true, secure: secureCookies, sameSite: "lax" },
    })
  );
  app.use(loadCurrentUser(users));
  app.use(csrfProtection);

  app.use(authRouter({ users, audit, sessionCookieName: SESSION_COOKIE }));

  app.get("/", requireAuth, (req, res) => {
    res.render("home", { title: "Início" });
  });

  app.use((req, res) => {
    res.status(404).render("error", {
      title: "Página não encontrada",
      message: "O endereço acessado não existe.",
    });
  });

  app.use((err, req, res, _next) => {
    console.error(err);
    res.status(500).render("error", {
      title: "Erro inesperado",
      message: "Algo deu errado. Tente novamente em instantes.",
    });
  });

  return app;
}
