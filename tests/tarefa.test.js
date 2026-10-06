import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import * as Tarefas from '../service/tarefa.js'

vi.mock('../service/tarefa.js')

describe('Testes da API de tarefas', () => {

    it('deve retornar erro 400 quando o usuario_id não for informado', async () => {
        const response = await request(app).get('/tarefas')

        expect(response.status).toBe(400)
    })

    it('deve cadastrar uma nova tarefa', async () => {
        const novaTarefa = {
            usuario_id: 1,
            titulo: 'Estudar vitest',
            descricao: 'Criar testes automatizados'
        }

        Tarefas.cadastrar.mockResolvedValue({
            id: 1,
            usuario_id: 1,
            titulo: 'Estudar vitest',
            descricao: 'Criar testes automatizados'
        })

        const response = await request(app)
            .post('/tarefas')
            .send(novaTarefa)

        expect(response.status).toBe(201)
    })

    it('deve deletar uma tarefa existente', async () => {
        Tarefas.remover.mockResolvedValue(true)

        const response = await request(app)
            .delete('/tarefas/1')

        expect(response.status).toBe(200)
    })

    it('deve atualizar uma tarefa existente', async () => {

    const tarefaAtualizada = {
        titulo: 'Estudar Supertest',
        descricao: 'Finalizar os testes da API',
        status: 'concluida'
    }

    Tarefas.atualizar.mockResolvedValue([
        {
            id: 1,
            ...tarefaAtualizada
        }
    ])

    const response = await request(app)
        .put('/tarefas/1')
        .send(tarefaAtualizada)

    expect(response.status).toBe(200)

    expect(Tarefas.atualizar).toHaveBeenCalledWith(
        '1',
        'Estudar Supertest',
        'Finalizar os testes da API',
        'concluida'
    )
})

    it('deve retornar 404 quando a tarefa não existir', async () => {
        Tarefas.consultarPorId.mockResolvedValue([])

        const response = await request(app)
            .get('/tarefas/2')

        expect(response.status).toBe(404)
    })

})