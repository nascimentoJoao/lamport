export interface IMessage{
    timestamp: number;
    localId: number;
    localClock: string;
}

/*   
    Evento local: m i c l, onde m é o tempo do computador local em milissegundos, i
    é o ID do nodo local e c é o valor do relógio lógico local, concatenado com o ID
    do nodo; <LocalEvent>

    Envio de mensagem: m i c d, onde m é o tempo do computador local em
    milissegundos, i é o ID do nodo local, c é o valor do relógio lógico enviado
    (relógio concatenado com o ID), d é o ID do nodo destinatário da mensagem; <SentMessage>

    Recebimento de mensagem: m i c r s t, onde onde m é o tempo do computador
    local em milissegundos, i é o ID do nodo local, c é o valor do relógio lógico
    depois do recebimento da mensagem, s é ID do nodo remetente da mensagem, t
    é o valor do relógio lógico recebido com a mensagem. <ReceivedMessage>
*/