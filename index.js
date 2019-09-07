const https = require('https');
const request = require("request");
const round = require("round-to");
const isHtml = require("is-html");

class CoordenadasDoCep {

   static setOpcoes(opcoes){
      const { busca_aproximada, precisao } = opcoes;
      
      this.busca_aproximada = typeof busca_aproximada == 'boolean' ? busca_aproximada : true;
      this.precisao = typeof precisao == 'number' ? precisao : 4;
   }

	static getByEndereco(endereco, callback){

      const precisao = typeof this.precisao == 'number' ? this.precisao : 4;  

      endereco = encodeURI(endereco);

		const opcoes_https = {
         hostname: 'nominatim.openstreetmap.org',
         headers: {
           'User-Agent': 'coordenadas-do-cep-npm-module'
         },
         path:"/search?country=Brazil&q=" + endereco + "&format=json&limit=1"
		}
      
      //TIVE DE USAR O MODULO 'HTTPS' AQUI, POIS O 'REQUEST'
      //NÃO ESTAVA DEIXANDO QUE FOSSE UTILIZADO O HEADER
      //DO 'USER AGENT' CUSTOMIZADO QUE É NECESSARIO PARA QUE
      //A API DO OSM FUNCIONE
		https.get(opcoes_https, (res)=>{

         res.setEncoding('utf8');

         let dados_acc_do_buffer = "";

         //ACUMULA OS DADOS DO BUFFER
			res.on("data", (buffer)=>{
            dados_acc_do_buffer += buffer;
         })
         //QUANDO NÃO A MAIS A DADOS A SEREM RECEBIDOS
         //ELES SÃO CONVERTIDOS EM JSON
         .once('end', ()=>{
            const dados_endereco = JSON.parse(dados_acc_do_buffer);
            
            if(dados_endereco.length == 0){

               callback(404, null);

            } else {
               let { lat, lon } = dados_endereco[0];
   
               const coords = {
                  lat:round(parseFloat(lat), precisao), 
                  lon:round(parseFloat(lon), precisao) 
               }

               callback(null, coords);
            }
         })

		}).on("error", (err)=>{
         callback(500, null)
      })
   }

   
   static getInfoCep(cep, callback){
      
      const url_api_viacep = "https://viacep.com.br/ws/" + cep + "/json/";
      
      //BUSCA O CEP NA VIACEP 
      request.get(url_api_viacep, (err, res, body) => {
         if (err) {
            callback(500, null);

         } else {

            if(isHtml(body)) {
               callback(400, null);

            } else {
               //TRANSFORMA A RESPOSTA EM JSON
               const info_cep = JSON.parse(body);

               if (typeof info_cep.erro != 'undefined') {
                  callback(400, null);
   
               } else {
                  callback(null, info_cep)

               }
            }
         }
      })
   }

   static getByCep(cep, callback){
      const busca_aproximada = typeof this.busca_aproximada == 'boolean' ? this.busca_aproximada : true;
      
      //PEGA AS INFORMAÇÕES DO CEP DIGITADO
      this.getInfoCep(cep, (err, info_cep)=>{

         if(err){
            callback(err, null)

         } else {
            const endereco_completo =
               info_cep.uf + " " +
               info_cep.localidade + " " +
               info_cep.bairro + " " +
               info_cep.logradouro;
            
            const endereco_aprox = info_cep.uf + ", " + info_cep.localidade;
      
            //COM BASE NAS INFORMAÇÕES DO CEP, ELE GERA UMA STRING
            //CONTENDO O ENDEREÇO COMPLETO, E ASSIM BUSCA O MESMO
            //USANDO A API DO OPEN STREET MAP (NOMINATIM)
            this.getByEndereco(endereco_completo, (err, coords)=>{

               if(err){
                  //CASO NÃO SEJA ENCONTRADO O ENDEREÇO USANDO-O COMPLETO
                  //ELE SERÁ BUSCADO USANDO O ENDEREÇO APROXIMANDO
                  if(busca_aproximada){
                     if(err == 404){

                        this.getByEndereco(endereco_aprox, (err, coords)=>{
                           
                           if(err){
                              callback(500, null);

                           } else {

                              info_cep.lat = coords.lat;
                              info_cep.lon = coords.lon;

                              callback(null, info_cep);
                           }
                        })

                     } else {
                        callback(err, null);
                     }

                  } else {
                     callback(err, null);
                  }
                     
                  
               } else {
                  info_cep.lat = coords.lat;
                  info_cep.lon = coords.lon;

                  callback(null, info_cep);
               }
            })
         }
      })
   } 
   
}

module.exports = CoordenadasDoCep;