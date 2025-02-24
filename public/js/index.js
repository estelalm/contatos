'use strict'

import { excluirContato, getContatos, criarContato, atualizarContato } from "./api.js"

function formatarCelular(celular){
    celular = celular.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
    return celular
}
function formatarTelefone(celular){
    celular = celular.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
    return celular
}
function formatarData(data){
    data = data.split('-').reverse().join("/")
    return data
}

$(function () {


    function listarContatos(){
        getContatos().then(contatos => {
            let tabela = $("#container-contatos")
            tabela.empty() // ver se tem outra forma de fazer isso
    
            contatos.forEach(contato =>{
    
                let linhaContato = $("<tr>").attr("id", contato.id)
                let colunaNome = $("<td>").text(contato.nome).addClass("py-4")
                let colunaNascimento = $("<td>").text(formatarData(contato.data_nascimento)).addClass("py-4")
                let colunaEmail = $("<td>").text(contato.email).addClass("py-4")
                let colunaCelular = $("<td>").text(formatarCelular(contato.celular)).addClass("py-4")
                let colunaAcoes = $("<td>").addClass("py-4 flex")
    
                let btnEditar = $("<button>")
                    .addClass("h-100 bg-transparent border-0")
                    .append($("<img>").attr("src", "./public/assets/editar.png").attr("alt", "Editar"))
                
                let btnExcluir = $("<button>")
                    .addClass("h-100 bg-transparent border-0")
                    .append($("<img>").attr("src", "./public/assets/excluir.png").attr("alt", "Excluir"))
    
                btnExcluir.on("click", () =>{
                    if(confirm("Tem certeza que deseja excluir o contato?")){
                        excluirContato(contato.id).then(() =>{ linhaContato.remove() })
                    }
                })
    
                btnEditar.on("click", () =>{
    
                    $("#btn-cadastrar").text("Atualizar contato").addClass("modo-editar").attr("data-id", contato.id)
    
                    $("#input-nome").val(contato.nome)
                    $("#input-email").val(contato.email)
                    $("#input-profissao").val(contato.profissao)
                    $("#input-nascimento").val(contato.data_nascimento)
                    $("#input-celular").val(formatarCelular(contato.celular))
                    if(contato.telefone !== null){$("#input-telefone").val(formatarTelefone(contato.telefone))}
    
                    $("#check-sms").prop("checked", contato.enviar_sms === "1")
                    $("#check-email").prop("checked", contato.enviar_email === "1")
                    $("#check-whatsapp").prop("checked", contato.possui_whatsapp === "1")
    
                    // ir para cima quando clicar em editar
                    $("html, body").animate({ scrollTop: 0 }, "slow")
    
                })
    
                colunaAcoes.append(btnEditar, btnExcluir)
                linhaContato.append(colunaNome, colunaNascimento, colunaEmail, colunaCelular, colunaAcoes)
                tabela.append(linhaContato)
    
            })
    
             
        })
    }
    listarContatos()

    //formatar os campos
    $("#input-celular").on("input", function () {  
        let numero = $(this).val().replace(/\D/g, "")

        if (numero.length > 2) { 
            numero = `(${numero.substring(0, 2)}) ${numero.substring(2)}`
        }
        if (numero.length > 7) {
            numero = `${numero.substring(0, 10)}-${numero.substring(10, 14)}`
        }
    
        $(this).val(numero)
    })
    $("#input-telefone").on("input", function () {  
        let numero = $(this).val().replace(/\D/g, "")
    
        if (numero.length > 2) { 
            numero = `(${numero.substring(0, 2)}) ${numero.substring(2)}`
        }
        if (numero.length > 6) {
            numero = `${numero.substring(0, 9)}-${numero.substring(9, 13)}`
        }
    
        $(this).val(numero)
    })
    $("#input-nascimento").on("input", function () {

        let data = $(this).val().replace(/\D/g, "")

        if (data.length > 2) {
            data = `${data.substring(0, 2)}/${data.substring(2)}`
        }

        if (data.length > 5) {
            data = `${data.substring(0, 5)}/${data.substring(5, 9)}`
        }

    })

    $("#form-contato").on("submit", function ( event ) {
        event.preventDefault()

        let nome = $("#input-nome").val().trim()
        let email = $("#input-email").val().trim()
        let profissao = $("#input-profissao").val().trim()
        let dataNascimento = $("#input-nascimento").val().split("/").reverse().join("-")
        let telefone = $("#input-telefone").val().replace(/\D/g, "")
        let celular = $("#input-celular").val().replace(/\D/g, "")
        let possuiWhatsapp = $("#check-whatsapp").is(":checked")
        let enviarEmail = $("#check-email").is(":checked")
        let enviarSms = $("#check-sms").is(":checked")

        let contatoJSON = {
            "nome": nome,
            "email": email,
            "data_nascimento": dataNascimento,
            "celular": celular,
            "profissao": profissao,
            "telefone": telefone,
            "enviar_sms": enviarSms,
            "enviar_email": enviarEmail,
            "possui_whatsapp": possuiWhatsapp
        }

        let btnSubmit = $("#btn-cadastrar")

        if(btnSubmit.hasClass("modo-editar")){
            atualizarContato(btnSubmit.attr("data-id"), contatoJSON).then(response =>{
                alert(response.mensagem)
                $("#form-contato")[0].reset(); 
                btnSubmit.text("Cadastrar contato").removeClass("modo-editar")
                listarContatos()
            }).catch(error => {
                alert("Erro ao editar contato!"); 
                console.error("Erro:", error); 
            });
        }else{
            criarContato(contatoJSON).then(response =>{
                alert(response.mensagem)
            }).catch(error => {
                alert("Erro ao cadastrar contato!"); 
                console.error("Erro:", error); 
            });
        }

    })

})

