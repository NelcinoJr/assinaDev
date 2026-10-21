import session from "express-session";

const IDLE_TTL_MS = 24 * 60 * 60 * 1000;

export class SqliteSessionStore extends session.Store {
  constructor(db) {
    super();
    this.getStmt = db.prepare("SELECT data FROM sessions WHERE sid = ? AND expires_at > ?");
    this.setStmt = db.prepare(`
      INSERT INTO sessions (sid, data, expires_at) VALUES (?, ?, ?)
      ON CONFLICT(sid) DO UPDATE SET data = excluded.data, expires_at = excluded.expires_at
    `);
    this.destroyStmt = db.prepare("DELETE FROM sessions WHERE sid = ?");
    this.touchStmt = db.prepare("UPDATE sessions SET expires_at = ? WHERE sid = ?");
    this.purgeStmt = db.prepare("DELETE FROM sessions WHERE expires_at <= ?");
  }

  get(sid, callback) {
    try {
      const row = this.getStmt.get(sid, Date.now());
      callback(null, row ? JSON.parse(row.data) : null);
    } catch (err) {
      callback(err);
    }
  }

  set(sid, sess, callback) {
    try {
      this.purgeStmt.run(Date.now());
      this.setStmt.run(sid, JSON.stringify(sess), Date.now() + IDLE_TTL_MS);
      callback?.(null);
    } catch (err) {
      callback?.(err);
    }
  }

  destroy(sid, callback) {
    try {
      this.destroyStmt.run(sid);
      callback?.(null);
    } catch (err) {
      callback?.(err);
    }
  }

  touch(sid, _sess, callback) {
    try {
      this.touchStmt.run(Date.now() + IDLE_TTL_MS, sid);
      callback?.(null);
    } catch (err) {
      callback?.(err);
    }
  }
}
