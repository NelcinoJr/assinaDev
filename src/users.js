import bcrypt from "bcryptjs";

const BCRYPT_COST = 12;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Comparado quando o e-mail não existe, para que a resposta leve o mesmo tempo
// e não revele quais e-mails estão cadastrados.
const DUMMY_HASH = bcrypt.hashSync("assinadev-dummy-password", BCRYPT_COST);

export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

export function validateRegistration({ email, password }) {
  const errors = {};
  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Informe um e-mail válido";
  }
  if (String(password ?? "").length < MIN_PASSWORD_LENGTH) {
    errors.password = `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }
  return errors;
}

export function createUserRepository(db) {
  const findByEmail = db.prepare("SELECT * FROM users WHERE email = ?");
  const findById = db.prepare("SELECT id, email FROM users WHERE id = ?");
  const insert = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");

  return {
    findById(id) {
      return findById.get(id);
    },

    existsByEmail(email) {
      return Boolean(findByEmail.get(normalizeEmail(email)));
    },

    async create({ email, password }) {
      const hash = await bcrypt.hash(password, BCRYPT_COST);
      const { lastInsertRowid } = insert.run(normalizeEmail(email), hash);
      return findById.get(lastInsertRowid);
    },

    async authenticate({ email, password }) {
      const user = findByEmail.get(normalizeEmail(email));
      const valid = await bcrypt.compare(String(password ?? ""), user?.password_hash ?? DUMMY_HASH);
      return user && valid ? { id: user.id, email: user.email } : null;
    },
  };
}
