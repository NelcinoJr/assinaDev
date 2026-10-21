import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const EMAIL = "emissor@assinadev.com";
const PASSWORD = "senha-segura";

function csrfFrom(html) {
  const match = html.match(/name="_csrf" value="([^"]+)"/);
  if (!match) throw new Error("Token CSRF não encontrado na página");
  return match[1];
}

async function csrfToken(agent, path = "/login") {
  const res = await agent.get(path);
  return csrfFrom(res.text);
}

async function register(agent, { email = EMAIL, password = PASSWORD } = {}) {
  const _csrf = await csrfToken(agent, "/register");
  return agent.post("/register").type("form").send({ _csrf, email, password });
}

async function login(agent, { email = EMAIL, password = PASSWORD } = {}) {
  const _csrf = await csrfToken(agent, "/login");
  return agent.post("/login").type("form").send({ _csrf, email, password });
}

async function logout(agent) {
  const home = await agent.get("/");
  return agent.post("/logout").type("form").send({ _csrf: csrfFrom(home.text) });
}

function sessionCookie(res) {
  return (res.headers["set-cookie"] ?? []).find((c) => c.startsWith("assinadev.sid="));
}

describe("0010 — Conta e login do emissor", () => {
  let app;
  let agent;

  beforeEach(() => {
    app = createApp({ database: ":memory:", sessionSecret: "test-secret" });
    agent = request.agent(app);
  });

  describe("O emissor deve conseguir", () => {
    it("criar uma conta com e-mail e senha e ficar logado logo em seguida", async () => {
      const res = await register(agent);
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/");

      const home = await agent.get("/");
      expect(home.status).toBe(200);
      expect(home.text).toContain(EMAIL);
    });

    it("entrar com e-mail e senha cadastrados", async () => {
      await register(agent);
      await logout(agent);

      const res = await login(agent);
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/");
      expect((await agent.get("/")).status).toBe(200);
    });

    it("ver o próprio e-mail e o botão 'Sair' no cabeçalho enquanto estiver logado", async () => {
      await register(agent);
      const home = await agent.get("/");
      expect(home.text).toMatch(new RegExp(`data-testid="current-user-email">${EMAIL}<`));
      expect(home.text).toMatch(/<button[^>]*>Sair<\/button>/);
    });

    it("sair pelo botão 'Sair' e voltar para a página de login", async () => {
      await register(agent);
      const res = await logout(agent);
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/login");

      const home = await agent.get("/");
      expect(home.headers.location).toBe("/login");
    });

    it.todo("usar as páginas de cadastro e de login em um celular com 360px de largura");
  });

  describe("O sistema deve", () => {
    it("recusar e-mail em formato inválido com 'Informe um e-mail válido'", async () => {
      const res = await register(agent, { email: "nao-e-email" });
      expect(res.status).toBe(422);
      expect(res.text).toContain("Informe um e-mail válido");
    });

    it("recusar senha com menos de 8 caracteres com 'A senha deve ter pelo menos 8 caracteres'", async () => {
      const res = await register(agent, { password: "1234567" });
      expect(res.status).toBe(422);
      expect(res.text).toContain("A senha deve ter pelo menos 8 caracteres");
    });

    it("recusar e-mail já existente com 'Este e-mail já está cadastrado'", async () => {
      await register(agent);
      const other = request.agent(app);
      const res = await register(other);
      expect(res.status).toBe(422);
      expect(res.text).toContain("Este e-mail já está cadastrado");
    });

    it("tratar 'Fulano@Email.com' e 'fulano@email.com' como o mesmo e-mail", async () => {
      await register(agent, { email: "Fulano@Email.com" });

      const other = request.agent(app);
      const duplicate = await register(other, { email: "fulano@email.com" });
      expect(duplicate.text).toContain("Este e-mail já está cadastrado");

      const res = await login(other, { email: "FULANO@email.COM" });
      expect(res.headers.location).toBe("/");
    });

    it("guardar a senha apenas como hash, nunca em texto", async () => {
      await register(agent);
      const row = app.locals.db.prepare("SELECT * FROM users WHERE email = ?").get(EMAIL);
      expect(row.password_hash).not.toContain(PASSWORD);
      expect(row.password_hash).toMatch(/^\$2[aby]\$\d{2}\$/);
      expect(Object.values(row).some((v) => String(v).includes(PASSWORD))).toBe(false);
    });

    it("recusar login errado com 'E-mail ou senha incorretos', sem indicar qual campo errou", async () => {
      await register(agent);
      await logout(agent);

      const wrongPassword = await login(agent, { password: "senha-errada" });
      const wrongEmail = await login(agent, { email: "outro@assinadev.com" });

      for (const res of [wrongPassword, wrongEmail]) {
        expect(res.status).toBe(401);
        expect(res.text).toContain("E-mail ou senha incorretos");
      }
    });

    it("emitir cookie de sessão sem Max-Age/Expires, para encerrar ao fechar o navegador", async () => {
      const res = await register(agent);
      const cookie = sessionCookie(res);
      expect(cookie).toBeDefined();
      expect(cookie).not.toMatch(/Max-Age=/i);
      expect(cookie).not.toMatch(/Expires=/i);
    });

    it("redirecionar para o login quem acessa página protegida sem estar logado", async () => {
      const res = await agent.get("/");
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/login");
    });

    it("levar para a página inicial quem já está logado e abre login ou cadastro", async () => {
      await register(agent);
      for (const path of ["/login", "/register"]) {
        const res = await agent.get(path);
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/");
      }
    });

    it("impedir a reutilização de uma sessão encerrada pelo 'Sair'", async () => {
      const res = await register(agent);
      const oldCookie = sessionCookie(res).split(";")[0];
      await logout(agent);

      const replay = await request(app).get("/").set("Cookie", oldCookie);
      expect(replay.status).toBe(302);
      expect(replay.headers.location).toBe("/login");
    });

    it("recusar envio de formulário sem token CSRF válido", async () => {
      await agent.get("/register");
      const missing = await agent.post("/register").type("form").send({ email: EMAIL, password: PASSWORD });
      const forged = await agent
        .post("/register")
        .type("form")
        .send({ _csrf: "token-falso", email: EMAIL, password: PASSWORD });

      expect(missing.status).toBe(403);
      expect(forged.status).toBe(403);
      const count = app.locals.db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
      expect(count).toBe(0);
    });

    it("emitir o cookie de sessão com HttpOnly, Secure e SameSite", async () => {
      const secureApp = createApp({ database: ":memory:", sessionSecret: "test-secret", secureCookies: true });
      const res = await request(secureApp).get("/login").set("X-Forwarded-Proto", "https");
      const cookie = sessionCookie(res);
      expect(cookie).toMatch(/HttpOnly/i);
      expect(cookie).toMatch(/Secure/i);
      expect(cookie).toMatch(/SameSite=Lax/i);
    });

    it("registrar em auditoria cadastro, login com sucesso, login com falha e logout", async () => {
      await register(agent);
      await logout(agent);
      await login(agent, { password: "senha-errada" });
      await login(agent);

      const events = app.locals.db
        .prepare("SELECT event, email FROM audit_logs ORDER BY id")
        .all();
      expect(events.map((e) => e.event)).toEqual([
        "register",
        "logout",
        "login_failure",
        "login_success",
      ]);
      expect(events.every((e) => e.email === EMAIL)).toBe(true);
    });
  });
});
