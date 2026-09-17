import express from 'express'
import cors from 'cors'
import * as Usuarios from './service/usuario.js'
import * as Tarefas from './service/tarefa.js'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json("{'result': 'ok'}")
})

// ------------ USUARIOS ------------

app.get('/usuarios', async (req, res) => {
    try {
        let result = await Usuarios.consultar()
        
        if (result.length > 0) {
                res.status(200).json(result)
        } else {
            res.status(404).json({ erro: 'Nenhum recurso encontrado' })
        }
    } catch (err) {
        console.error('Erro na consulta:', err)
        res.status(500).json({ erro: 'Erro interno do servidor' })
    }
})

app.get('/usuario/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let result = await Usuarios.consultarPorId(id)

        if (result.length > 0) {
            res.status(200).json(result)
        } else {
            res.status(404).json({ erro: 'Recurso não encontrado' })
        }
    } catch (err) {
        console.error('Erro ao consultar usuário por ID:', err)
        res.status(500).json({ erro: 'Erro interno do servidor' })
    }
})

app.post('/usuarios', async (req, res) => {
    try {
        const { nome, email, senha } = req.body

        const novoUsuario = await Usuarios.cadastrar(nome, email, senha)

        res.status(201).json(novoUsuario)
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err)
        res.status(500).json({ erro: 'Erro interno do servidor' })
    }
})

// ------------ TAREFAS ------------
app.get('/tarefas', async (req, res) => {
    try {
        let usuarioId = req.query.usuario_id

        if (!usuarioId) {
            return res.status(400).json({ erro: 'Informe o ID do usuário' })
        } 

        let result = await Tarefas.consultar(usuarioId)

        if (result.length > 0) {
            res.status(200).json(result)
        } else {
            res.status(404).json({ erro: 'Nenhuma tarefa encontrada' })
        }
    } catch (err) {
        console.error('Erro na consulta:', err)
        res.status(500).json({ erro: 'Erro interno do servidor' })
    }
})

app.get('/tarefas:id', async (req, res) => {
    try {
        let id = req.params.id
        let result = await Tarefas.consultarPorId(id)
        if (result.length > 0) {
            res.status(200).json(result)
        } else {
            res.status(404).json({ erro: 'Recurso não encontrado' })
        }
    } catch (err) {
        console.error('Erro ao consultar tarefa por ID:', err)
        res.status(500).json({ erro: 'Erro interno do servidor' })
    }
})

app.post('/tarefas', async (req, res) => {
    try {
        const { usuario_id, titulo, descricao } = req.body

        const novaTarefa = await Tarefas.cadastrar(usuario_id, titulo, descricao)

        res.status(201).json(novaTarefa)
    } catch (err) {
        console.error('Erro ao cadastrar tarefa:', err)
        res.status(500).json({ erro: 'Erro interno do servidor' })
    }
})

app.put('/tarefas/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { titulo, descricao, status } = req.body

        const tarefaAtualizada = await Tarefas.atualizar(id, titulo, descricao, status)

        if (tarefaAtualizada.length > 0) {
            res.status(200).json(tarefaAtualizada)
        } else {
            res.status(404).json({ erro: 'Recurso não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao atualizar tarefa:', err)
        res.status(500).json({ erro: 'Erro interno do servidor'})
    }
})

app.delete('/tarefas/:id', async (res, req) => {
    try {
        const id = req.params.id
        const linhasAfetadas = await Tarefas.remover(id)    

        if (linhasAfetadas > 0) {
            res.status(200).json({ resultado: 'Tarefa removida com sucesso' })
        } else {
            res.status(404).json({ erro: 'Recurso não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao remover tarefa:', err)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

app.listen(3000, () => {
    let data = new Date()
    console.log(`Sistema incializado: \nInf: ${data}`)
    console.log('http://localhost:3000/')
})