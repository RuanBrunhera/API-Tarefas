const API_URL = 'http://localhost:3000';

let usuarioAtual = 1;

const botoesUsuario = document.querySelectorAll('.btn-usuario');
const listaTarefas = document.getElementById('lista-tarefas');
const formNovaTarefa = document.getElementById('form-nova-tarefa');
const inputTitulo = document.getElementById('titulo');
const inputDescricao = document.getElementById('descricao');
const mensagem = document.getElementById('mensagem');

// TROCA DE USUARIO AI, DE 1 PARA 2
botoesUsuario.forEach((botao) => {
    botao.addEventListener('click', () => {
        botoesUsuario.forEach((b) => b.classList.remove('ativo'));
        botao.classList.add('ativo');
        usuarioAtual = botao.dataset.id;
        carregarTarefas();
    });
});

// CARREGA AS TAREFA DO USUARIO ATUAL, QUE É PADRAO 1 LA
async function carregarTarefas() {
    mensagem.textContent = '';
    listaTarefas.innerHTML = '<p>Carregando...</p>';

    try {
        const resposta = await fetch(`${API_URL}/tarefas?usuario_id=${usuarioAtual}`);

        if (resposta.status === 404) {
            listaTarefas.innerHTML = '';
            mensagem.textContent = 'Nenhuma tarefa encontrada para este usuário.';
            return;
        }

        if (!resposta.ok) {
            throw new Error('Erro ao buscar tarefas');
        }

        const tarefas = await resposta.json();
        renderizarTarefas(tarefas);
    } catch (erro) {
        console.error(erro);
        listaTarefas.innerHTML = '';
        mensagem.textContent = 'Erro ao carregar tarefas. Verifique se a API está rodando.';
    }
}

// MOSTRA AS TAREFAS NA TELA
function renderizarTarefas(tarefas) {
    listaTarefas.innerHTML = '';

    // ORDENA POR PENDENTE DEPOIS AS CONCLUIDAS
    tarefas.sort((a ,b ) => {
        if (a.status === b.status) return 0;
        return a.status === 'PENDENTE' ? -1 : 1;
    })

    tarefas.forEach((tarefa) => {
        const li = document.createElement('li');
        li.className = 'tarefa' + (tarefa.status === 'CONCLUIDA' ? ' concluida' : '');

        li.innerHTML = `
            <div class="tarefa-info">
                <h3>${tarefa.titulo}</h3>
                <p>${tarefa.descricao || ''}</p>
            </div>
            <div class="tarefa-acoes">
                ${tarefa.status === 'PENDENTE'
                    ? `<button class="btn-concluir" data-id="${tarefa.id}">Concluir</button>`
                    : ''}
                <button class="btn-excluir" data-id="${tarefa.id}">Excluir</button>
            </div>
        `;

        listaTarefas.appendChild(li);
    });

    // BOTAO DE CONCLUIR
    document.querySelectorAll('.btn-concluir').forEach((botao) => {
        botao.addEventListener('click', () => concluirTarefa(botao.dataset.id, tarefas));
    });

    // BOTAO DE EXCLUIR
    document.querySelectorAll('.btn-excluir').forEach((botao) => {
        botao.addEventListener('click', () => excluirTarefa(botao.dataset.id));
    });
}

// CADASTRA NOVA TAREFA
formNovaTarefa.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensagem.textContent = '';

    const titulo = inputTitulo.value.trim();
    const descricao = inputDescricao.value.trim();

    if (!titulo) return;

    try {
        const resposta = await fetch(`${API_URL}/tarefas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: usuarioAtual,
                titulo,
                descricao
            })
        });

        if (!resposta.ok) {
            throw new Error('Erro ao cadastrar tarefa');
        }

        inputTitulo.value = '';
        inputDescricao.value = '';
        carregarTarefas();
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = 'Erro ao cadastrar tarefa.';
    }
});

// CONCLUI A TAREFA AI 
async function concluirTarefa(id, tarefas) {
    const tarefa = tarefas.find((t) => t.id == id);
    if (!tarefa) return;

    try {
        const resposta = await fetch(`${API_URL}/tarefas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: tarefa.titulo,
                descricao: tarefa.descricao,
                status: 'CONCLUIDA'
            })
        });

        if (!resposta.ok) {
            throw new Error('Erro ao atualizar tarefa');
        }

        carregarTarefas();
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = 'Erro ao concluir tarefa.';
    }
}

// EXCLUI A TAREFA
async function excluirTarefa(id) {
    try {
        const resposta = await fetch(`${API_URL}/tarefas/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao excluir tarefa');
        }

        carregarTarefas();
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = 'Erro ao excluir tarefa.';
    }
}

// INICIA COM AS TAREFAS DO USUARIO 1 AI, QUE É O PADRAO
carregarTarefas();