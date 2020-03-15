# Coordenadas Do CEP

Coordenadas Do CEP é um pacote do NPM, que, com base em um CEP informado é possível conseguir as informações sobre o mesmo (bairro, logradouro, estado e etc) e ainda sua latitude e longitude (não é 100% preciso, e as vezes se utiliza de aproximação para conseguir as coordenadas do CEP desejado).

Além disso consegue calcular a distancia entre dois CEPs (leve em consideração que ele apenas calcula a distancia direta ("em linha reta") entre as coordenadas, ou seja, o calculo é feito de forma totalmente diferente de um GPS, no qual são considerados as estradas/ruas/avenidas).

API's utilizadas:

 - [Viacep](https://viacep.com.br)
 - [Open Street Map (Nominatim)](https://www.nominatim.org)

## Instalação

Use o NPM para instalar o Coordenadas Do CEP.

```bash
npm install coordenadas-do-cep
```

## Novidades na versão 1.2.0

Agora todas as funções do Coordenadas do CEP utilizam promises nativas do javascript  (ES6/ES2015), ou seja, não utilizam nenhuma biblioteca de promises externa como o bluebird ou promisify.

Além disso, não é utilizado mais nenhum pacote como o is_html ou request, assim, deixando a instalação mais rápida, além de possuir uma performance um pouco melhor.

Agora também é possível calcular a distancia entre dois CEPs, a distancia entre dois endereços e a distancia entre duas coordenadas. 

## Utilização

### Função 'getByCep'

Nesta função é passado um parâmetro, o CEP (por exemplo "12345-678" ou "123456789" são incorretos, sendo o formato correto "12345678"), e então é retornado uma promise contendo o erro ou as informações do CEP juntamente com suas coordenadas.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

(async () => {

   try{
      const info = await CepCoords.getByCep("06310390");
   } catch (err) {
      //o parâmetro 'err' possui o código do erro http
   }

})()


// OU

CepCoords.getByCep("06310390")
.then(info => {
   //retorna o mesmo 'info' da versão em promise
})
.catch(err => {
   //retorna o mesmo parâmetro 'err' da versão em promise
})

```

#### Parâmetro 'info':
```javascript
{
  cep: '06310-390',
  logradouro: 'Avenida Francisco Pignatari',
  complemento: '',
  bairro: 'Vila Gustavo Correia',
  localidade: 'Carapicuíba',
  uf: 'SP',
  unidade: '',
  ibge: '3510609',
  gia: '2550',
  lat: -23.5235,
  lon: -46.8407
}
```
#### Erros possíveis (parâmetro 'err'):
- 400
- 404
- 500

### Função 'getInfoCep'

Nesta função é passado um parâmetro, o CEP (por exemplo "12345-678" ou "123456789" são incorretos, sendo o formato correto "12345678"), e então é retornado uma promise contendo o erro ou as informações do CEP.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

(async () => {

   try{
      const info_cep = await CepCoords.getInfoCep("06310390");
   } catch (err) {
      //o parâmetro 'err' possui o código do erro http
   }

})()


// OU

CepCoords.getInfoCep("06310390")
.then(info_cep => {
   //retorna o mesmo 'info_cep' da versão em promise
})
.catch(err => {
   //retorna o mesmo parâmetro 'err' da versão em promise
})
```

#### Parâmetro 'info_cep':
```javascript
{
  cep: '06310-390',
  logradouro: 'Avenida Francisco Pignatari',
  complemento: '',
  bairro: 'Vila Gustavo Correia',
  localidade: 'Carapicuíba',
  uf: 'SP',
  unidade: '',
  ibge: '3510609',
  gia: '2550'
}
```
#### Erros possíveis (parâmetro 'err'):
- 400
- 500


### Função 'getByEndereco'

Nesta função é passado um parâmetro, o endereço (não possui um padrão "correto", mas seguir um modelo de pesquisa semelhante a "UF, município bairro rua numero" gera bons resultados), e então é retornado uma promise contendo o erro ou as coordenadas do endereço.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

(async () => {

   try{
      const coords = await CepCoords.getByEndereco("Sp, carapicuíba avenida francisco pignatari");
   } catch (err) {
      //o parâmetro 'err' possui o código do erro http
   }

})()

// OU

CepCoords.getByEndereco("Sp, carapicuíba avenida francisco pignatari")
.then(coords => {
   //retorna o mesmo 'coords' da versão em promise
})
.catch(err => {
   //retorna o mesmo parâmetro 'err' da versão em promise
})
```

#### Parâmetro 'coords':
```javascript
{
  lat: -23.5235,
  lon: -46.8407
}
```
#### Erros possíveis (parâmetro 'err'):
- 404
- 500

### Função 'getDistEntreCeps'

Nesta função são passados dois parâmetro, os CEPs (por exemplo "12345-678" ou "123456789" são incorretos, sendo o formato correto "12345678"), e então é retornado uma promise contendo o erro ou a distancia (em quilômetros) entre os CEPs.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

(async () => {

   try{
      const distancia = await CepCoords.getDistEntreCeps("06310390", "06600025");
   } catch (err) {
      //o parâmetro 'err' possui o código do erro http
   }

})()

// OU

CepCoords.getDistEntreCeps("06310390", "06600025")
.then(distancia => {
   //retorna o mesmo 'distancia' da versão em promise
})
.catch(err => {
   //retorna o mesmo parâmetro 'err' da versão em promise
})
```

#### Parâmetro 'distancia':
```javascript
//numero
5.98
```
#### Erros possíveis (parâmetro 'err'):
- 400
- 404
- 500

### Função 'getDistEntreEnderecos'

Nesta função são passados dois parâmetros, os endereços (não possui um padrão "correto", mas seguir um modelo de pesquisa semelhante a "UF, município bairro rua numero" gera bons resultados), e então é retornado uma promise contendo o erro ou a distancia (em quilômetros) entre os endereços.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

const endereco1 = "Sp, carapicuíba avenida francisco pignatari";
const endereco2 = "Sp, jandira rua elton silva";

(async () => {

   try{
      const distancia = await CepCoords.getDistEntreEnderecos(endereco1, endereco2);
   } catch (err) {
      //o parâmetro 'err' possui o código do erro http
   }

})()

// OU

CepCoords.getDistEntreEnderecos(endereco1, endereco2)
.then(distancia => {
   //retorna o mesmo 'distancia' da versão em promise
})
.catch(err => {
   //retorna o mesmo parâmetro 'err' da versão em promise
})
```

#### Parâmetro 'distancia':
```javascript
//numero
5.98
```
#### Erros possíveis (parâmetro 'err'):
- 400
- 404
- 500

### Função 'getDistancia'

Nesta função são passados dois parâmetros, as coordenadas (ambas em formato JSON) contendo a latitude (sempre como 'lat') e a longitude (sempre como 'lon'), e então é retornado uma promise contendo o erro ou a distancia (em quilômetros) entre as coordenadas.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

const coord1 = {
   lat: -23.5235,
   lon: -46.8407
};

const coord2 = {
   lat: -23.5283,
   lon: -46.8991
};

const distancia_km = CepCoords.getDistancia(coord1, coord2);
```

#### Parâmetro 'distancia_km':
```javascript
//numero
5.98
```
#### Erros possíveis (parâmetro 'err'):
- 400
- 404
- 500

### Tratamento de erros
Os erros (códigos HTTP) que podem ser retornados das promises do Coordenadas Do CEP são os seguintes

 - 400 (Má requisição) - Este erro pode ocorrer devido ao CEP possuir algum caractere inválido na hora da buscar, ou o mesmo estando em um formato incorreto.

- 404 (Não encontrado) - Este erro ocorre pois provavelmente o CEP foi encontrado, porem não foi possível encontrar as coordenadas do mesmo (informações em como suprimir este erro em 'Aproximação' na seção sobre a função 'setOpcoes'), ou o endereço (caso esteja utilizando a função 'getByEndereco') não foi encontrado.

- 500 (Erro de servidor) - Este erro ocorre devido a alguma falha no server-side de algumas das API's utilizadas (devido queda de internet, o servidor fora do ar, etc).

Exemplo de tratamento do erro 404 (aplicável a todos os outros)
```javascript
const CepCoords = require("coordenadas-do-cep");


(async () => {

   try{
      const info = await CepCoords.getByCep("06310390");
   } catch (err) {

      if(err == 404){
      //... faça algo no caso de um erro 404
      }

   }

})()

// OU

CepCoords.getByCep("06310390")
.then(info => {
   //faça algo
})
.catch(err => {

   if(err == 404){
      //... faça algo no caso de um erro 404
   }

})
```

### Função 'setOpcoes'

Esta função permite que você "customize" o JSON de retorno de algumas funções, ela não possui retorno, só necessita que seja passado um JSON com as opções.

Exemplo:
```javascript
const CepCoords = require("coordenadas-do-cep");

CepCoords.setOpcoes({
   busca_aproximada: false,
   precisao: 6,
   casas_dec_dist: 1
})
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

#### Precisão (Funciona apenas nas funções 'getByCep' e 'getByEndereco')

Quando estamos falando de coordenadas, estamos falando também de números com muitas casas decimais, e quanto mais casas decimais a latitude e a longitude possuírem, mais precisas elas serão em determinar uma localização (por exemplo a latitude 14.9873 é mais precisa que a latitude 14.9).

Por padrão a precisão é de 4 casas decimais, que oferece uma exatidão de até 11 metros até a localização do CEP.

Os valorem que são permitidos vão de 0 até 7, segue tabela:

| Casas | Exemplo | Precisão | 
|---|---|---|
| 0 | 1 | 111.3 km |
| 1 | 1.1 | 11.1 km |
| 2 | 1.01 | 1.1 km |
| 3 | 1.001 | 111.3 m |
| 4 (Padrão) | 1.0001 | 11.1 m |
| 5 | 1.00001 | 1.1 m |
| 6 | 1.000001 | 11.1 cm |
| 7 | 1.0000001 | 1.1 cm |

Por exemplo, para usar uma precisão de 2 dígitos ao invés dos 4 padrão, é só adicionar a mesma ao 'setOpcoes'.

```javascript
const CepCoords = require("coordenadas-do-cep");

CepCoords.setOpcoes({ precisao: 2 })
```

#### Numero de casas decimais da distância (Funciona apenas nas funções 'getDistEntreCeps', 'getDistEntreEnderecos' e 'getDistancia')

Este parametro basicamente permite mudar o numero de casas decimais que a distancia possuirá, o padrão é 2, mas você caso queira mudar coloque o valor desejado no 'setOpcoes'.

```javascript
const CepCoords = require("coordenadas-do-cep");

CoordenadasDoCep.setOpcoes({casas_dec_dist: 5});
```

## Código Fonte
O código pode ser acessado pelo [repositório oficial](https://github.com/viniciusm2001/coordenadas-do-cep)

## Licença
[Eiffel Forum License, version 2](http://www.eiffel-nice.org/license/eiffel-forum-license-2.txt)