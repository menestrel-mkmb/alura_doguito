const dataNascimento = document.querySelector('#nascimento');

export function valida(input){
    const tipoInput = input.dataset.tipo;
    if(validadores[tipoInput]){
        validadores[tipoInput](input);
    }

    (input.validity.valid) ? input.parentElement.classList.remove('input-container--invalido') : input.parentElement.classList.add('input-container--invalido');
}

const validadores = {
    dataNascimento:input => validaDataNascimento(input)
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