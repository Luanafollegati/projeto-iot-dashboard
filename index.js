const IP_DO_COMPUTADOR = '10.88.200.210';

const PORTA_MQTT = 9001;

const TOPICO_TEMPERATURA = 'aulas/professor/temperatura';
const TOPICO_UMIDADE = 'aulas/professor/umidade';
const TOPICO_QUALIDADE_AR = 'aulas/professor/qualidade_ar';

const btnSobre = document.getElementById('btnSobre');
const btnDashboard = document.getElementById('btnDashboard');

const sobre = document.getElementById('sobre');
const dashboard = document.getElementById('dashboard');

const statusMQTT = document.getElementById('statusMQTT');

const temperatura = document.getElementById('temperatura');
const umidade = document.getElementById('umidade');
const qualidadeAr = document.getElementById('qualidadeAr');

const btnSenha = document.getElementById('btnSenha');

/* NAVEGAÇÃO */

btnSobre.addEventListener('click', function () {
    sobre.style.display = 'block';
    dashboard.style.display = 'none';
});

btnDashboard.addEventListener('click', function () {
    sobre.style.display = 'none';
    dashboard.style.display = 'block';
});

/* SENHA DO GRUPO */

btnSenha.addEventListener('click', function () {
    const senha = prompt('Digite a senha fornecida pelo professor:');

    if (senha) {
        localStorage.setItem('senhaGrupo', senha);

        alert('Senha salva com sucesso!');
    }
});

/* MQTT */

const clientId = 'dashboard-' + Math.random().toString(16).substring(2);

const client = new Paho.MQTT.Client(IP_DO_COMPUTADOR, PORTA_MQTT, clientId);

/* CONEXÃO */

client.connect({
    useSSL: false,

    onSuccess: function () {
        console.log('Conectado ao Mosquitto!');

        statusMQTT.className = 'conectado';

        statusMQTT.textContent = '🟢 Conectado';

        client.subscribe(TOPICO_TEMPERATURA);

        client.subscribe(TOPICO_UMIDADE);

        client.subscribe(TOPICO_QUALIDADE_AR);

        console.log('Inscrito nos tópicos MQTT.');
    },

    onFailure: function (erro) {
        console.log('Erro ao conectar:', erro);

        statusMQTT.className = 'desconectado';

        statusMQTT.textContent = '🔴 Desconectado';
    },
});

/* CONEXÃO PERDIDA */

client.onConnectionLost = function (responseObject) {
    console.log('Conexão perdida.');

    statusMQTT.className = 'desconectado';

    statusMQTT.textContent = '🔴 Desconectado';
};

/* RECEBER MENSAGENS */

client.onMessageArrived = function (message) {
    console.log('Tópico:', message.destinationName);

    console.log('Valor:', message.payloadString);

    const valor = message.payloadString;

    if (message.destinationName === TOPICO_TEMPERATURA) {
        temperatura.textContent = valor + ' °C';
    }

    if (message.destinationName === TOPICO_UMIDADE) {
        umidade.textContent = valor + ' %';
    }

    if (message.destinationName === TOPICO_QUALIDADE_AR) {
        qualidadeAr.textContent = valor;
    }
};
