const https = require('https');

class CoordenadasDoCep {

   static setOpcoes(opcoes) {
      const { busca_aproximada, precisao, casas_dec_dist } = opcoes;

      this.busca_aproximada = typeof busca_aproximada == 'boolean' ? busca_aproximada : true;
      this.precisao = typeof precisao == 'number' ? precisao : 4;
      this.casas_dec_dist = typeof casas_dec_dist == 'number' ? casas_dec_dist : 2;
   }

   static round(valor, precisao) {
      const multiplicador = Math.pow(10, precisao || 0);
      return Math.round(valor * multiplicador) / multiplicador;
   }

   static async get_https(opcoes_https){

      return new Promise((resolve, reject) => {

         https.get(opcoes_https, (res) => {

            res.setEncoding('utf8');
   
            let dados_acc_do_buffer = "";
   
            //ACUMULA OS DADOS DO BUFFER
            res.on("data", (buffer) => {
               dados_acc_do_buffer += buffer;
            })
   
            //QUANDO NÃO A MAIS A DADOS A SEREM RECEBIDOS
            //ELES SÃO 'ENVIADOS' A QUEM CHAMOU A FUNÇÃO
            .once('end', () => {
               resolve(dados_acc_do_buffer);
            })
   
         }).on("error", (err) => {
            reject(500);
         })
      })
   }
   
   static radianos (graus){
      //o pi/180 é aprox. 0.017453292519944444
      return graus * 0.0174532; 
   }

   static getDistancia (coord1, coord2) {

      const casas_decimais = typeof this.casas_dec_dist == 'number' ? this.casas_dec_dist : 2;
   
      const r_lat_c1 = this.radianos(parseFloat(coord1.lat));
      const r_lon_c1 = this.radianos(parseFloat(coord1.lon));
      const r_lat_c2 = this.radianos(parseFloat(coord2.lat));
      const r_lon_c2 = this.radianos(parseFloat(coord2.lon));
   
      const distancia = 
         6371 * 
   
         Math.acos(
            Math.cos( r_lat_c1 ) *
            Math.cos( r_lat_c2 ) *
            Math.cos( r_lon_c2 - r_lon_c1 ) +
            Math.sin( r_lat_c1 ) *
            Math.sin( r_lat_c2 )
         );
      
      return this.round(distancia, casas_decimais);
   };

   static async getByEndereco(endereco) {

      return new Promise(async (resolve, reject) => {

         const precisao = typeof this.precisao == 'number' ? this.precisao : 4;

         endereco = encodeURI(endereco);

         const opcoes_https = {
            hostname: 'nominatim.openstreetmap.org',
            headers: {
               'User-Agent': 'coordenadas-do-cep-npm-module'
            },
            path: "/search?country=Brazil&q=" + endereco + "&format=json&limit=1"
         };

         try{

            let dados_endereco = await this.get_https(opcoes_https);
            
            dados_endereco = JSON.parse(dados_endereco);

            if (dados_endereco.length == 0) {
               reject(404);
            } else {
               let { lat, lon } = dados_endereco[0];
   
               const coords = {
                  lat: this.round(parseFloat(lat), precisao),
                  lon: this.round(parseFloat(lon), precisao)
               };

               resolve(coords);
            }
         } catch (err) {
            reject(err);
         }
      })
   }

   static async getInfoCep(cep) {

      return new Promise(async (resolve, reject) => {

         const opcoes_https = {
            hostname: 'viacep.com.br',
            path: "/ws/" + cep + "/json/"
         };

         try {
            let resposta = await this.get_https(opcoes_https);

            if (resposta.includes("html")) {
               reject(400);

            } else {
               //TRANSFORMA A RESPOSTA EM JSON
               const info_cep = JSON.parse(resposta);

               if (typeof info_cep.erro != 'undefined') {
                  reject(400);
               } else {
                  resolve(info_cep);
               }
            }
         } catch (err) {
            reject(err);
         }
      })
   }

   static async getByCep(cep) {

      return new Promise(async (resolve, reject) => {

         const busca_aproximada = typeof this.busca_aproximada == 'boolean' ? this.busca_aproximada : true;

         try {
            //PEGA AS INFORMAÇÕES DO CEP DIGITADO
            let info_cep = await this.getInfoCep(cep); 
            
            const endereco_completo =
               info_cep.uf + " " +
               info_cep.localidade + " " +
               info_cep.bairro + " " +
               info_cep.logradouro;

            const endereco_aprox = info_cep.uf + ", " + info_cep.localidade;

            //COM BASE NAS INFORMAÇÕES DO CEP, ELE GERA UMA STRING
            //CONTENDO O ENDEREÇO COMPLETO, E ASSIM BUSCA O MESMO
            //USANDO A API DO OPEN STREET MAP (NOMINATIM)
            this.getByEndereco(endereco_completo)
            .then(coords => {
               
               info_cep.lat = coords.lat;
               info_cep.lon = coords.lon;

               resolve(info_cep);
            })
            .catch(err => {

               //CASO NÃO SEJA ENCONTRADO O ENDEREÇO USANDO-O COMPLETO
               //ELE SERÁ BUSCADO USANDO O ENDEREÇO APROXIMANDO
               if (busca_aproximada) {
                  if (err == 404) {
                     
                     this.getByEndereco(endereco_aprox)
                     .then(coords => {
                        info_cep.lat = coords.lat;
                        
                        info_cep.lon = coords.lon;
                        
                        resolve(info_cep);
                     })
                     .catch(err => {
                        reject(err);
                     })

                  } else {
                     reject(err);
                  }
               } else {
                  reject(err);
               }
            })
         } catch (err) {
            reject(err);
         }
    })
   }

   static async getDistEntreCeps(cep1, cep2){

      return new Promise(async (resolve, reject) => {

         try{
            const info_cep1 = await this.getByCep(cep1);

            const info_cep2 = await this.getByCep(cep2);

            const coord1 = {
               lat: info_cep1.lat,
               lon: info_cep1.lon
            };
            
            const coord2 = {
               lat: info_cep2.lat,
               lon: info_cep2.lon
            };

            const distancia_km = this.getDistancia(coord1, coord2);

            resolve(distancia_km);

         } catch (err) {
            reject(err);
         }
      })
   }

   static async getDistEntreEnderecos(end1, end2){

      return new Promise(async (resolve, reject) => {

         try{
            const coord1 = await this.getByEndereco(end1);

            const coord2 = await this.getByEndereco(end2);

            const distancia_km = this.getDistancia(coord1, coord2);

            resolve(distancia_km);

         } catch (err) {
            reject(err);
         }
      })
   }
}

module.exports = CoordenadasDoCep;