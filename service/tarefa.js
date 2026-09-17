import pool from '../data/index.js';

export const consultar = async (usuarioId) => {
    try {
        const cx = await pool.getConnection();
        const cmdSql = 'SELECT * FROM tarefas WHERE fk_usuario_id = ? ORDER BY created_at DESC';
        const [dados] = await cx.query(cmdSql, [usuarioId]);
        cx.release();
        return dados;
    } catch (error) {
        throw error;
    }
};

export const consultarPorId = async (id) => {
    try {
        const cx = await pool.getConnection();
        const cmdSql = 'SELECT * FROM tarefas WHERE id = ?';
        const [dados] = await cx.query(cmdSql, [id]);
        cx.release();
        return dados;
    } catch (error) {
        throw error;
    }
};

export const cadastrar = async (fkUsuarioId, titulo, descricao) => {
    try {
        const cx = await pool.getConnection()
        const cmdSql = 'INSERT INTO tarefas(fk_usuario_id, titulo, descricao) VALUES (?, ?, ?)';
        await cx.query(cmdSql, [fkUsuarioId, titulo, descricao]);

        const [result] = await cx.query('SELECT LAST_INSERT_ID() as lastId')
        const lastId = result[0].lastId

        const [dados] = await cx.query('SELECT * FROM tarefas WHERE id = ?', [lastId])
        cx.release()
        return dados
    } catch (err) {
        throw err
    }
}

export const atualizar = async (id, titulo, descricao, status) => {
    try {
        const cx = await pool.getConnection()
        const cmdSql = `
            UPDATE tarefas
            SET titulo = ?, descricao = ?, status = ?
            WHERE id = ?
        `;
        await cx.query(cmdSql, [titulo, descricao, status, id]);

        const [dados] = await cx.query('SELECT * FROM tarefas WHERE id = ?', [id])
        cx.release()
        return dados
    } catch (err) {
        throw err
    }
}

export const remover = async (id) => {
    try {
        const cx = await pool.getConnection()
        const cmdSql = 'DELETE FROM tarefas WHERE id = ?'
        const [resultado] = await cx.query(cmdSql, [id])
        cx.release()
        return resultado.affectedRows
    } catch (err) {
        throw err
    }
}