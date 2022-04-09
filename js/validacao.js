const dataNascimento = document.querySelector('#nascimento');

dataNascimento.addEventListener('blur',(event) => {
    validaDataNascimento(event.target);
});

function validaDataNascimento(data){
    // if( !(data.value == 'string') )
    //     return;
    
    let mensagem = '';

    const dataRecebida = new Date(data.value);

    console.log(maiorIdade(dataRecebida, 18));
    if (!maiorIdade(dataRecebida, 18)) {
        mensagem = 'Você precisa ser maior de idade';
    }
    data.setCustomValidity(mensagem);
}

function maiorIdade(data, threshold){
    // if( !(data == 'string') || !(threshold == 'number') )
    //     return;
    const dataAtual = new Date();
    const dataTeste = new Date(data.getUTCFullYear()+threshold, data.getUTCMonth(), data.getUTCDay());

    return (dataAtual>=dataTeste);
}