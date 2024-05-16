# SENIOR - Bpm DataSet Exporter

## Exportador de Fontes de Dados do BPM para .csv

Agiliza o processo de importação de tabelas BPM entre tenants, automagicamente exportando o conteúdo para um arquivo .csv da Fonte de Dados podendo ser importado no Tenant destino

## Como Utilizar

É necessário ter o Node instalado, o projeto foi criado com o Node v14.20.1
Atualize o arquivo environment.ts com o Bearer Token desejado caso queira sempre usar um Bearer Token padrão, caso contrário deixe em branco.

```sh
npm i
npm start
```

a aplicação vai perguntar o nome da Fonte de Dados que deseja exportar, digite e pressione enter. Caso não tenha Bearer Token definido no environment a aplicação também vai pedir para informa-lo, o arquivo .csv exportado ficará na pasta exported.

