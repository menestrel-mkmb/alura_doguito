/*jshint esversion: 6 */

const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => verificaCEP(input),
};

const statusErrorMsg = {
    nome: {
        valueMissing: `O campo 'nome' não pode estar vazio`,
    },
    email: {
        valueMissing: `O campo 'e-mail' não pode estar vazio`,
        typeMismatch: `O e-mail deve ter um formato válido`,
    },
    senha: {
        valueMissing: `O campo 'senha' não pode estar vazio`,
        patternMismatch: `A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e não pode conter símbolos`,
    },
    dataNascimento: {
        valueMissing: `O campo 'data de nascimento' não pode estar vazio`,
        customError: `Você deve ser maior de idade para se cadastrar`,
    },
    cpf: {
        valueMissing: `O campo 'CPF' não pode estar vazio`,
        customError: `O CPF digitado é inválido`,
    },
    cep: {
        valueMissing: `O campo 'CEP' não pode estar vazio`,
        patternMismatch: `Os formatos aceitos são 12345678, 12345-678 ou 12.345-678`,
        customError: `Erro na consulta do CEP`,
    },
    logradouro: {
        valueMissing: `O campo 'logradouro' não pode estar vazio`,
    },
    cidade: {
        valueMissing: `O campo 'cidade' não pode estar vazio`,
    },
    estado: {
        valueMissing: `O campo 'estado' não pode estar vazio`,
    },
    preco: {
        valueMissing: `O campo 'preço' não pode estar vazio`,
    },
};

const typeErrorMsg = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
];

export function valida(input){
    const tipoInput = input.dataset.tipo;
    if(validadores[tipoInput]){
        validadores[tipoInput](input);
    }

    if(input.validity.valid){
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
    } else {
        input.parentElement.classList.add('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = returnErrorMessage(tipoInput, input);
    }
}

/*
 * CONSULTA CEP / ViaCEP
*/

function returnErrorMessage(tipoInput, input){
    let mensagem = '';

    typeErrorMsg.forEach(erro => {
        if(input.validity[erro])
            mensagem = statusErrorMsg[tipoInput][erro];
    });

    return mensagem;
}

function verificaCEP(input){
    const cepFormatado = input.value.replace(/\D/g, '');
    const url = `https://viacep.com.br/ws/${cepFormatado}/json/`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    };

    if(!input.validity.patternMismatch && !input.validity.valueMissing){
        fetch(url, options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro){
                    input.setCustomValidity('Erro na consulta do CEP');
                    return;
                }
                input.setCustomValidity('');
                return preencheEndereco(data);
            }
        );
    }
}

function preencheEndereco(data){
    const logradouro = document.querySelector('[data-tipo="logradouro"');
    const cidade = document.querySelector('[data-tipo="cidade"');
    const estado = document.querySelector('[data-tipo="estado"');
    
    logradouro.value = data.logradouro;
    cidade.value = data.localidade;
    estado.value = data.uf;

    return;
}

/*
 * DATA DE NASCIMENTO / MAIOR IDADE
*/

function validaDataNascimento(data){
    let mensagem = '';

    const dataRecebida = new Date(data.value);

    if (!maiorIdade(dataRecebida, 18)) {
        mensagem = 'Você precisa ser maior de idade';
    }
    data.setCustomValidity(mensagem);
}

function maiorIdade(data, threshold){
    const dataAtual = new Date();
    const dataTeste = new Date(data.getUTCFullYear()+threshold, data.getUTCMonth(), data.getUTCDay());

    return (dataAtual>=dataTeste);
}

/*
 * VALIDADOR DE CPF
*/

function validaCPF(input){
    const cpfFormatado = input.value.replace(/\D/g, '');
    let mensagem = '';

    if(!checaCPFRepetido(cpfFormatado) || !checaCPFValido(cpfFormatado))
        mensagem = 'O CPF digitado é inválido';

    console.log(mensagem);

    input.setCustomValidity(mensagem);
}

function checaCPFRepetido(cpfFormatado){
    const cpfsRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
    ];
    let cpfValido = true;
    console.log(cpfFormatado);

    cpfsRepetidos.forEach(value => {
        if(cpfFormatado == value){
            cpfValido = false;
        }
    });

    return cpfValido;
}

function confirmaDigito(soma){
    return (11 - (soma%11))%10;
}

function checaDigitoVerificador(cpfFormatado, multiplicador){
    if(multiplicador >= 12) //AVOID_MAGIC_NUMBER RECURSIVE_END_LOOP
        return true;

    let soma = 0;
    const multiplicadorInicial = multiplicador;
    const cpfSemDigitos = (cpfFormatado.substr(0,multiplicador-1));
    const digitoVerificador = cpfFormatado.charAt(multiplicador-1);
    
    for(let contador = 0; multiplicador > 1; multiplicador--){
        soma += cpfSemDigitos[contador] * multiplicador;
        contador++;
    }
    
    if( digitoVerificador == confirmaDigito(soma) )
        return checaDigitoVerificador(cpfFormatado, multiplicadorInicial + 1); //AVOID_MAGIC_NUMBER
    
    return false;
}

function checaCPFValido(cpfFormatado){
    const multiplicador = 10;
    return checaDigitoVerificador(cpfFormatado, multiplicador); //AVOID_MAGIC_NUMBER
}