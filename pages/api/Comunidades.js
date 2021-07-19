import { SiteClient } from 'datocms-client'; 

export default async function recebedorDeRequests(request, response) {
  if(request.method === 'POST'){
        const TOKEN = '95928ae674df1da16d5ff6a8590e1b';
        const client = new SiteClient(TOKEN);
        
      // Validar os dados, antes de sair cadastrando

      const registroCriado = await client.items.create({
          itemType: "975667", // ID do Model de "Communidaties" criado pelo Dato
          ...request.body,
          // title: "Comunidade de Teste",
          // imageUrl: "https://github.com/ViniciusB-DEV.png",
          // creatorslug: "pood"
        })
      
        console.log(registroCriado);
      
        response.json({
          dados: 'Algum dado qualquer',
          registroCriado: registroCriado
        })
        return;
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST tem!'
  })
}