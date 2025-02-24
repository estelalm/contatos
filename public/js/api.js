'use strict'

const baseUrl = "http://localhost:8000"

export function getContatos() {

    return $.ajax({
        url: `${baseUrl}/contatos`,
        type: "GET",
        dataType: "json"
    })

}

export function getContatoPorId(id) {

    return $.ajax({
        url: `${baseUrl}/contatos/${id}`,
        type: "GET",
        dataType: "json"
    })

}

export function criarContato(dados){

    return $.ajax({
        url: `${baseUrl}/contatos`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dados)
    })

}

export function atualizarContato(id, dados){

    return $.ajax({
        url:`${baseUrl}/contatos/${id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(dados)
    })

}

export function excluirContato(id){

    return $.ajax({
        url: `${baseUrl}/contatos/${id}`,
        type: "DELETE"
    })

}