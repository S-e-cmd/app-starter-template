export function createD1RecordRepository(db) {
  if (!db) throw new Error('D1 binding is not configured');

  return {
    async getById(id) {
      return db.prepare('SELECT * FROM app_records WHERE id = ?1').bind(id).first();
    },

    async upsert(record) {
      const now = new Date().toISOString();
      await db.prepare(`
        INSERT INTO app_records (id, payload, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?3)
        ON CONFLICT(id) DO UPDATE SET
          payload = excluded.payload,
          updated_at = excluded.updated_at
      `).bind(record.id, JSON.stringify(record.payload), now).run();
    }
  };
}
