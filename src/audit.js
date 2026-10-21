export const AuditEvent = Object.freeze({
  REGISTER: "register",
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILURE: "login_failure",
  LOGOUT: "logout",
});

export function createAuditLog(db) {
  const insert = db.prepare(
    "INSERT INTO audit_logs (event, user_id, email, ip) VALUES (@event, @userId, @email, @ip)"
  );

  return {
    record({ event, userId = null, email = null, ip = null }) {
      insert.run({ event, userId, email, ip });
    },
  };
}
