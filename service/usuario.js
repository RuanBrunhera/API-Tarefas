import pool from '../data/index.js'

export const consultar = async () => {
    try {
        const cx = await pool.getConnection()
        const cmdSql = 'SELECT id, email, nome, created_at FROM usuarios'
        const [dados] = await cx.query(cmdSql)
        cx.release()
        return dados
    } catch (err) {
        throw err
    }
}

export const consultarPorId = async (id) => {
    try {
        const cx = await pool.getConnection()
        const cmdSql = 'SELECT id, email, nome, created_at FROM usuarios WHERE id = ?'
        const [dados] = await cx.query(cmdSql, [id])
        cx.release()
        return dados
    } catch (err) {
        throw err
    }
}

export const cadastrar = async (nome, email, senha) => {
    try {
        const cx = await pool.getConnection()
        const cmdSql = 'INSERT INTO usuarios(nome, email, senha) VALUES(?, ?, ?)'
        await cx.query(cmdSql, [nome, email, senha])

        const [result] = await cx.query('SELECT LAST_INSERT_ID() as lastId')
        const lastId = result[0].lastId
        
        const [dados] = await cx.query(
            'SELECT id, email, nome, created_at FROM usuarios WHERE id = ?'
            [lastId]
        )
        cx.release()
        return dados
    } catch (err) {
        throw err
    }
}