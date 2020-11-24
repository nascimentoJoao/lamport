import { S3 } from "aws-sdk";
import { AwsClient } from "./aws/AwsClient";
import 'dotenv/config';
import fs from 'fs';
import { INode } from "./interfaces/INode";

const nodeInfo = process.argv[2];
const allNodes: INode[] = [];

fs.readFile('./src/assets/input.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  data.split('\n').forEach((line, index) => {

    if (index === 0) {
      return;
    }

    allNodes.push(<INode>{
      id: Number.parseInt(line.split(' ')[0]),
      host: line.split(' ')[1],
      port: Number.parseInt(line.split(' ')[2]),
      chance: Number.parseFloat(line.split(' ')[3])
    });
  });

  console.log(allNodes);
});

const randomNumber = Math.floor(Math.random() * 11);
const randomNode = Math.floor(Math.random() * 5);

if (randomNumber > allNodes[randomNode].chance * 10) {
  //Incrementa relogio
} else {
  // envia mensagem para o nodo sorteado
}

//Inicia execução

//Aguarda mensagem multicast sinalizando que pode iniciar

//Gera um número aleatorio entre 1 e 10
//Pega probabilidade, verifica o número sorteado
//0 1 2 3 4 5 6 7 8 9 - probabilidade de 0.4 -> 0, 1, 2, 3
// Se aleatorio entre [0, 3] -> envia mensagem
// se aleatorio entre [4, 9] -> incrementa relogio

// for 0 .. 99 ->
// calcularAleatorio();
// verificarAcaoSerRealizada();
//    enviaMensagem() ou incrementaLamport();
//    m i c s d = 123219739123912 1 541  
/**
 * Envio de mensagem: m i c s d, onde m é o tempo do computador local em
milissegundos, i é o ID do nodo local, c é o valor do relógio lógico enviado
(relógio concatenado com o ID), d é o ID do nodo destinatário da mensagem;
 */



// var bucketParams = {
//   Bucket : process.env.AWS_BUCKET_NAME,
//   Key: process.env.AWS_OBJECT_NAME
// };

// const awsService : S3 = AwsClient.getInstance().service;

// // Call S3 to obtain a list of the objects in the bucket
// awsService.getObject(bucketParams, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log(data.Body.toString());
//   }
// });

