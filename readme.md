# Coordenadas Do CEP

Coordenadas Do CEP é um pacote do NPM que, com base em um CEP informado é possível 
conseguir as informações sobre o mesmo (bairro, logradouro, estado e etc) e ainda 
sua latitude e longitude (não é 100% preciso, e as vezes se utiliza de aproximação
para conseguir as coordenadas do CEP desejado).

API's utilizadas:

 - [Viacep](https://viacep.com.br)
 - [Open Street Map (Nominatim)](https://www.nominatim.org)

## Instalação

Use o NPM para instalar o Coordenadas Do CEP.

```bash
npm install coordenadas-do-cep
```

## Utilização


### Função 'getByCep'

Nesta função é passado um parâmetro, o CEP (por exemplo "12345-678" ou "123456789" são incorretos, sendo o formato correto "12345678"), e então é retornado um callback contendo o erro e as informações do CEP juntamente com suas coordenadas.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

CepCoords.getByCep("12345678", (err, info) =>{
   if(err){
      //... FAÇA ALGO NO CASO DE UM ERRO
   } else {
      //... SENÃO FAÇA OUTRA COISA
   }
});
```

#### Parâmetro 'info' do callback:
```javascript
{ 
  cep: '06600-025',
  logradouro: 'Rua Elton Silva',
  complemento: '',
  bairro: 'Centro',
  localidade: 'Jandira',
  uf: 'SP',
  unidade: '',
  ibge: '3525003',
  gia: '3980',
  lat: -23.5283,
  lon: -46.8991 
}
```
#### Erros possíveis (parâmetro 'err' do callback):
- 400
- 500
- 404

### Função 'getInfoCep'

Nesta função é passado um parâmetro, o CEP (por exemplo "12345-678" ou "123456789" são incorretos, sendo o formato correto "12345678"), e então é retornado um callback contendo o erro e as informações do CEP.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

CepCoords.getInfoCep("12345678", (err, info_cep) =>{
   if(err){
      //... FAÇA ALGO NO CASO DE UM ERRO
   } else {
      //... SENÃO FAÇA OUTRA COISA
   }
});
```

#### Parâmetro 'info_cep' do callback:
```javascript
{ 
  cep: '06600-025',
  logradouro: 'Rua Elton Silva',
  complemento: '',
  bairro: 'Centro',
  localidade: 'Jandira',
  uf: 'SP',
  unidade: '',
  ibge: '3525003',
  gia: '3980'
}
```
#### Erros possíveis (parâmetro 'err' do callback):
- 400
- 500


### Função 'getByEndereco'

Nesta função é passado um parâmetro, o endereço (não possui um padrão "correto", mas seguir um modelo de pesquisa semelhante a "UF, município bairro rua numero" gera bons resultados), e então é retornado um callback contendo o erro e as coordenadas do endereço.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

CepCoords.getByEndereco("Sp, jandira rua elton silva", (err, coords)=>{
   if(err){
      //... FAÇA ALGO NO CASO DE UM ERRO
   } else {
      //... SENÃO FAÇA OUTRA COISA
   }
});
```

#### Parâmetro 'coords' do callback:
```javascript
{
   lat: -23.5283,
   lon: -46.8991
}
```
#### Erros possíveis (parâmetro 'err' do callback):
- 404 (Endereço não encontrado)
- 500


### Tratamento de erros
Os erros (códigos) que podem ser retornados no callback das funções do Coordenadas Do CEP são os seguintes

- 500 (Erro de servidor) - Este erro ocorre devido a alguma falha no server-side de algumas das API's utilizadas (devido queda de internet, o servidor fora do ar, etc)

 - 400 (Má requisição) - Este erro pode ocorrer devido ao CEP possuir algum caractere inválido na hora da buscar, ou o mesmo estando em um formato incorreto.

- 404 (Não encontrado) - Este erro ocorre pois provavelmente o CEP foi encontrado, porem não foi possível encontrar as coordenadas do mesmo (informações em como suprimir este erro em 'Aproximação' na seção sobre a função 'setOpcoes')

Exemplo de tratamento do erro 404 (aplicável a todos os outros)
```javascript
const CepCoords = require("coordenadas-do-cep");

CepCoords.getByCep("12345678", (err, info) =>{
   if(err){
      if(err == 404){
         //... FAÇA ALGO NO CASO DE UM ERRO 404
      }

   } else {
      //... SENÃO FAÇA OUTRA COISA
   }
});
```

### Função 'setOpcoes'

Esta função permite que você "customize" o JSON de retorno de algumas funções, ela não possui callback, só necessita que seja passado um JSON com as opções.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

CepCoords.setOpcoes({
   busca_aproximada: false,
   precisao: 6
})

CepCoords.getByCep("12345678", (err, info) =>{
   if(err){
      //... FAÇA ALGO NO CASO DE UM ERRO
   } else {
      //... SENÃO FAÇA OUTRA COISA
   }
});
```


#### Aproximação (Funciona apenas na função 'getByCep')


A aproximação vai basicamente permitir o fim do erro 404 da função 'getByCep'.

Ela irá funcionar da seguinte maneira:
1. As coordenadas do endereço pertencente ao CEP não serão encontradas.
2. Então, ele ira buscar as coordenadas de forma menos especifica, se utilizando apenas do estado e do município ao qual pertencem o CEP, assim retornando as coordenadas do centro do município do CEP.

A aproximação já vem setada como ativa por padrão, caso deseje desativar-la, coloque ela como false no 'setOpcoes'.

```javascript
const CepCoords = require("coordenadas-do-cep");

CepCoords.setOpcoes({ busca_aproximada: false })
```

#### Precisão (Funciona apenas nas função 'getByCep' e 'getByEndereco')

Quando estamos falando de coordenadas, estamos falando também de números com muitas casas decimais, e quanto mais casas decimais a latitude e a longitude possuírem, mais precisas elas serão em determinar uma localização (por exemplo a latitude 14.9873 é mais precisa que a latitude 14.9).

Por padrão a precisão é de 4 casas decimais, que oferece uma exatidão de até 11 metros até a localização exata do CEP.

Os valorem que são permitidos vão de 0 até 7, segue tabela:

| Casas | Exemplo | Precisão | 
|---|---|---|
| 0 | 1 | 111.3 km |
| 1 | 1.1 | 11.1 km |
| 2 | 1.01 | 1.1 km |
| 3 | 1.001 | 111.3 m |
| 4 (Padrão) | 0.0001 | 11.1 m |
| 5 | 1.00001 | 1.1 m |
| 6 | 1.000001 | 11.1 cm |
| 7 | 1.0000001 | 1.1 cm |

Por exemplo, para usar uma precisão de 2 dígitos ao invés dos 4 padrão, é só adicionar a mesma a função 'setOpcoes'.

```javascript
const CepCoords = require("coordenadas-do-cep");

CepCoords.setOpcoes({ precisao: 2 })
```

## Código Fonte
O codigo pode ser acessado pelo [repositório oficial](https://github.com/viniciusm2001/coordenadas-do-cep)

## Licença
[Eiffel Forum License, version 2](http://www.eiffel-nice.org/license/eiffel-forum-license-2.txt)