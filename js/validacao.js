const dataNascimento = document.querySelector('#nascimento');

const validadores = {
    dataNascimento:input => validaDataNascimento(input)
}

const statusErrorMsg = {
    nome: {
        valueMissing: `O campo nome não pode estar vazio`,
    },
    email: {
        valueMissing: `O campo e-mail não pode estar vazio`,
        typeMismatch: `O e-mail deve ter um formato válido`,
    },
    senha: {
        valueMissing: `O campo senha não pode estar vazio`,
        patternMismatch: `A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e não pode conter símbolos`,
    },
    dataNascimento: {
        valueMissing: `O campo data de nascimento não pode estar vazio`,
        customError: `Você deve ser maior de idade para se cadastrar`,
    }

}

const typeErrorMsg = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

export function valida(input){
    const tipoInput = input.dataset.tipo;
    if(validadores[tipoInput]){
        validadores[tipoInput](input);
    }

    if(input.validity.valid){
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else {
        input.parentElement.classList.add('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = returnErrorMessage(tipoInput, input);
    }
}

function returnErrorMessage(tipoInput, input){
    let mensagem = '';

    typeErrorMsg.forEach(erro => {
        if(input.validity[erro])
            mensagem = statusErrorMsg[tipoInput][erro];
    })

    return mensagem;
}

dataNascimento.addEventListener('blur',(event) => {
    validaDataNascimento(event.target);
});

function validaDataNascimento(data){
    // if( !(typeof(data.value) == 'string') )
    //     return;
    
    let mensagem = '';

    const dataRecebida = new Date(data.value);

    if (!maiorIdade(dataRecebida, 18)) {
        mensagem = 'Você precisa ser maior de idade';
    }
    data.setCustomValidity(mensagem);
}

function maiorIdade(data, threshold){
    // if( !(typeof(data) == 'string') || !(typeof(threshold) == 'number') )
    //     return;
    const dataAtual = new Date();
    const dataTeste = new Date(data.getUTCFullYear()+threshold, data.getUTCMonth(), data.getUTCDay());

    return (dataAtual>=dataTeste);
}