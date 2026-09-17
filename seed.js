import pool from './data/index.js';

const seed = async () => {
    try {
        const cx = await pool.getConnection();

        // Limpa as tabelas antes de inserir (opcional, útil pra rodar de novo)
        await cx.query('DELETE FROM tarefas');
        await cx.query('DELETE FROM usuarios');
        await cx.query('ALTER TABLE tarefas AUTO_INCREMENT = 1');
        await cx.query('ALTER TABLE usuarios AUTO_INCREMENT = 1');

        // Insere usuários
        await cx.query(`
            INSERT INTO usuarios (nome, email, senha) VALUES
            ('Ruan Aronchi', 'ruan@email.com', '123456'),
            ('Maria Silva', 'maria@email.com', '123456')
        `);

        // Insere tarefas
        await cx.query(`
            INSERT INTO tarefas (fk_usuario_id, titulo, descricao, status) VALUES
            (1, 'Estudar Node.js', 'Revisar conceitos de Express e rotas', 'PENDENTE'),
            (1, 'Terminar API de tarefas', 'Finalizar rotas de CRUD', 'PENDENTE'),
            (1, 'Entregar atividade', 'Enviar o projeto no prazo', 'CONCLUIDA'),
            (2, 'Comprar mantimentos', 'Fazer lista antes de ir ao mercado', 'PENDENTE'),
            (2, 'Reunião com equipe', 'Alinhar entregas da semana', 'CONCLUIDA')
        `);

        cx.release();
        console.log('Seed executada com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao executar seed:', error);
        process.exit(1);
    }
};

seed();