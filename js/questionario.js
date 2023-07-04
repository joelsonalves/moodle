const remover_excesso_de_espacos = (texto) => {
    return texto.replaceAll('  ', ' ').trim();

};

const ajustar_texto = (arr_entrada, competencia) => {
    
    // Remover excesso de espaços e linhas vazias.
    let index = 0;
    while (index < arr_entrada.length) {
        arr_entrada[index] = remover_excesso_de_espacos(arr_entrada[index]);
        if (arr_entrada[index] === '') arr_entrada.splice(index, 1);
        else index++;
    }

    // Trocar o símbolo de igual (=) pelo código "&equals;"
    for (let i = 0; i < arr_entrada.length; i++) arr_entrada[i] = arr_entrada[i].replaceAll('=', '&equals;');

    // Trocar o símbolo de til (~) pelo código "&tilde;"
    for (let i = 0; i < arr_entrada.length; i++) arr_entrada[i] = arr_entrada[i].replaceAll('~', '&tilde;');

    // Trocar o símbolo dois dois pontos (::) pelo código "&colon;&colon;"
    for (let i = 0; i < arr_entrada.length; i++) arr_entrada[i] = arr_entrada[i].replaceAll('::', '&colon;&colon;');

    // Trocar o símbolo de chave abrindo ({) pelo código "&lbrace;"
    for (let i = 0; i < arr_entrada.length; i++) arr_entrada[i] = arr_entrada[i].replaceAll('{', '&lbrace;');

    // Trocar o símbolo de chave fechando (}) pelo código "&rbrace;"
    for (let i = 0; i < arr_entrada.length; i++) arr_entrada[i] = arr_entrada[i].replaceAll('}', '&rbrace;');

    // Trocar o símbolo de hashtag (#) pelo código "&num;"
    for (let i = 0; i < arr_entrada.length; i++) arr_entrada[i] = arr_entrada[i].replaceAll('#', '&num;');

    // Colocar o símbolo de igual (=) na alternativa correta.
    [
        'A) ', 'A. ', 'A- ', 'A - ', 'A– ', 'A – ',
    ].forEach((item) => {
        for (let i = 0; i < arr_entrada.length; i++) {
            if (arr_entrada[i].indexOf(item) === 0) arr_entrada[i] = arr_entrada[i].replace(item, '=');
            else if (arr_entrada[i].indexOf(item.toLowerCase()) === 0) arr_entrada[i] = arr_entrada[i].replace(item.toLowerCase(), '=');
        }
    });

    // Colocar o símbolo de til (~) nas demais alternativas.
    [
        'B) ','B. ', 'B- ', 'B - ', 'B– ', 'B – ',
        'C) ','C. ', 'C- ', 'C - ', 'C– ', 'C – ',
        'D) ','D. ', 'D- ', 'D - ', 'D– ', 'D – ',
        'E) ','E. ', 'E- ', 'E - ', 'E– ', 'E – ',
    ].forEach((item) => {
        for (let i = 0; i < arr_entrada.length; i++) {
            if (arr_entrada[i].indexOf(item) === 0) arr_entrada[i] = arr_entrada[i].replace(item, '~');
            else if (arr_entrada[i].indexOf(item.toLowerCase()) === 0) arr_entrada[i] = arr_entrada[i].replace(item.toLowerCase(), '~');
        }
    });

    // Adicionar o símbolo de hashtag (#) nos comentários.
    for (let i = 1; i < arr_entrada.length; i++) {
        if (['=', '~'].includes(arr_entrada[i - 1][0])) {
            arr_entrada[i] = '#' + arr_entrada[i];
        }
    }

    // Adicionar a competência ou NOA e, o número da questão.
    for (let i = 0; i < arr_entrada.length; i++) {
        for (let j = 1; j <= 20; j++) {
            [
                `${j}) `, `${j}. `, `${j}- `, `${j} - `, `${j}–`, `${j} – `,
            ].forEach((item) => {
                if (arr_entrada[i].indexOf(item) === 0) {
                    if (competencia.toLowerCase() === 'noa') arr_entrada[i] = arr_entrada[i].replace(item, `::NOA_Q${(j < 10) ? ('0') : ('')}${j}::`);
                    if (competencia.toLowerCase() === 'av') arr_entrada[i] = arr_entrada[i].replace(item, `::AV_Q${(j < 10) ? ('0') : ('')}${j}::`);
                    else arr_entrada[i] = arr_entrada[i].replace(item, `::C${(parseInt(competencia) < 10) ? ('0') : ('')}${competencia}_Q${(j < 10) ? ('0') : ('')}${j}::`);
                }
            });
        }
    }

    // Adicionar o símbolo de abertura de chave ({) na linha anterior ao símbolo de igual (=).
    index = 0;
    while (index < arr_entrada.length) {
        if (arr_entrada[index][0] === '=') {
            arr_entrada.splice(index, 0, '{');
            index += 2;
        } else {
            index++;
        }
    }

    // Adicionar o símbolo de fechamento de chave (}) na linha anterior a marcação da questão.
    let primeira_ocorrencia = true;
    index = 0;
    while (index < arr_entrada.length) {
        if (arr_entrada[index].indexOf('::C') === 0 || arr_entrada[index].indexOf('::AV') === 0 || arr_entrada[index].indexOf('::NOA') === 0) {
            if (!primeira_ocorrencia) {
                arr_entrada.splice(index, 0, '}');
                arr_entrada.splice(index + 1, 0, '');
                index += 3;
            } else {
                primeira_ocorrencia = false;
                index++;
                continue;
            }
        } else {
            index++;
        }
    }
    if (arr_entrada.length > 0) arr_entrada.push('}');

    return arr_entrada;

};

const select_competencia = document.querySelector('#competencia');

const textarea_entrada = document.querySelector('#entrada');

const textarea_saida = document.querySelector('#saida');

const button_ajuda = document.querySelector('#ajuda');

const button_processar = document.querySelector('#processar');

const button_copiar = document.querySelector('#copiar');

const button_limpar = document.querySelector('#limpar');

const button_mais_ferramentas = document.querySelector('#mais-ferramentas');

const div_mais_ferramentas = document.querySelector('div.mais-ferramentas');

const button_baixar = document.querySelector('#baixar');

const baixar_arquivo_txt = () => {

    let texto = textarea_saida.value;
    
    let link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(texto);
    link.download = `questionario_${select_competencia.value}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

};

button_ajuda.addEventListener('click', () => {

    window.location.assign('https://github.com/joelsonalves/moodle');

});

textarea_entrada.placeholder = [
    '1) Texto da questão',
    'Suporte da questão',
    'A) alternativa 1',
    'Feedback alternativa 1',
    'b) alternativa 2',
    'Feedback alternativa 2',
    '',
    '2- Texto da questão',
    'Suporte da questão',
    'a- alternativa 1',
    'Feedback alternativa 1',
    'B- alternativa 2',
    'Feedback alternativa 2',
    '',
    '3 - Texto da questão',
    'Suporte da questão',
    'B - alternativa 1',
    'Feedback alternativa 1',
    'b - alternativa 2',
    'Feedback alternativa 2',
    '',
    '4. Texto da questão',
    'Suporte da questão',
    'A. alternativa 1',
    'Feedback alternativa 1',
    'b. alternativa 2',
    'Feedback alternativa 2',
].join('\n');

textarea_saida.placeholder = [
    '::C01_Q01::Texto da questão',
    'Suporte da questão',
    '{',
    '=alternativa 1',
    '#Feedback alternativa 1',
    '~alternativa 2',
    '#Feedback alternativa 2',
    '}',
    '',
    '::C01_Q02::Texto da questão',
    'Suporte da questão',
    '{',
    '=alternativa 1',
    '#Feedback alternativa 1',
    '~alternativa 2',
    '#Feedback alternativa 2',
    '}',
    '',
    '::C01_Q03::Texto da questão',
    'Suporte da questão',
    '~alternativa 1',
    '#Feedback alternativa 1',
    '~alternativa 2',
    '#Feedback alternativa 2',
    '}',
    '',
    '::C01_Q04::Texto da questão',
    'Suporte da questão',
    '{',
    '=alternativa 1',
    '#Feedback alternativa 1',
    '~alternativa 2',
    '#Feedback alternativa 2',
    '}',
].join('\n');

button_processar.addEventListener('click', () => {

    if (textarea_entrada.value !== '') {

        let arr_entrada = textarea_entrada.value.split('\n');
        arr_entrada = ajustar_texto(arr_entrada, competencia.value.toLowerCase());
        textarea_saida.value = arr_entrada.join('\n');

    } else alert('Não há questionário para processar!')

});

button_copiar.addEventListener('click', async () => {

    if (textarea_entrada.value !== '') button_processar.click();
    if (textarea_saida.value !== '') await navigator.clipboard.writeText(textarea_saida.value);
    else alert('Por hora, não há nada para ser colocado na área de transferência!');

});

button_baixar.addEventListener('click', () => {

    if (textarea_entrada.value !== '') button_processar.click();
    if (textarea_saida.value !== '') baixar_arquivo_txt();
    else alert('Por hora, não há nada para ser baixado!');

});

button_limpar.addEventListener('click', () => {

    textarea_entrada.value = '';
    textarea_saida.value = '';

});

button_mais_ferramentas.addEventListener('click', () => {
    if (div_mais_ferramentas.style.display === 'none') div_mais_ferramentas.style.display = 'block';
    else div_mais_ferramentas.style.display = 'none';
});

button_mais_ferramentas.click();

div_mais_ferramentas.querySelector('section.localizar-e-substituir button').addEventListener('click', () => {
    let input_localizar = div_mais_ferramentas.querySelectorAll('section.localizar-e-substituir input')[0];
    let input_substituir = div_mais_ferramentas.querySelectorAll('section.localizar-e-substituir input')[1];
    textarea_entrada.value = textarea_entrada.value.replaceAll(input_localizar.value, input_substituir.value);
    input_localizar.value = '';
    input_substituir.value = '';
});