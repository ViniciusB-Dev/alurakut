import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MaingGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(propriedades) {
  return (
    <Box as="aside">
        <img src={`https://github.com/${propriedades.githubUser}.png`} style={ { borderRadius: '8px' }}/>
        <hr />
 
        <p> 
          <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
            @{propriedades.githubUser}
          </a>
        </p>
        <hr />

        <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return (
          <ProfileRelationsBoxWrapper>

          <h2 className="smallTitle">
          {propriedades.title} ({propriedades.items.length})
          </h2>

          <ul>
              {/* {seguidores.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                        <a href={`http://github.com/${itemAtual}.png`} key={itemAtual.title}>
                        <img src={itemAtual.image} />
                        <span>{itemAtual.title}</span>
                      </a>
                  </li>
                ) 
              } )} */}
          </ul>

        </ProfileRelationsBoxWrapper>
  )
}
export default function Home(props) {

  const usuarioAleatorio = props.githubUser;

  const [comunidades, setComunidades] = React.useState([]);
  // const comunidades = ['Alurakut'];

  const pessoasFavoritas = ['juunegreiros', 
                            'omariosouto', 
                            'peas', 
                            'rafaballerini', 
                            'marcobrunodev',
                            'felipefialho'
                          ]
;

// 0 - Pegar o array de dados do github
const [seguidores, setSeguidores] = React.useState([]);

React.useEffect(function() {
  // Get
  fetch("https://api.github.com/users/ViniciusB-Dev/followers")
  .then(function (respostaDoServidor){
    return respostaDoServidor.json();
  })
  .then(function(respostaCompleta) {
    setSeguidores(respostaCompleta)
  })

  // APi GraphQL
  fetch("https://graphql.datocms.com/", { 
    method: 'POST',
    headers: {
      'Authorization': '1011539c889e79fb436566c3534a22',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ "query": `query {
        allCommunities{
          id
          title
          imageUrl
          creatorslug
        }
      }` })
     })
     .then((response) => response.json())
     .then((respostaCompleta) => {
       const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
       console.log(comunidadesVindasDoDato);
       setComunidades(comunidadesVindasDoDato)
     })
}, [])

console.log('seguidores antes do return', seguidores);

// 1 - Criar um box que vaiter um map, baseado nps items do array que pegamos do GitHub
// que pegamos do GitHub

  return (
    <>
    <AlurakutMenu/>
     <main>
       <MainGrid>
         <div className="profileArea" style={{ gridArea: 'profileArea'}}>
            <ProfileSideBar githubUser={usuarioAleatorio} />
         </div>
        <div className="welcomeArea"  style={{ gridArea: 'welcomeArea'}}>
          <Box className="title">
            <h1>
              Bem vindo(a)
              </h1>

              <OrkutNostalgicIconSet/>
          </Box>

          <Box>
            <h2 className="subTitle" >O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();

              const dadosDoForm = new FormData(e.target);

              console.log('Campo: ', dadosDoForm.get('title'));
              console.log('Campo: ', dadosDoForm.get('image'));

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorslug: usuarioAleatorio,
              }

              fetch('/api/Comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                console.log(dados);
              })

              // const comunidadesAtualizadas = [...comunidades, comunidade];
              // setComunidades(comunidadesAtualizadas)

            }}>
                <div>
                  <input 
                    placeholder="Qual vai ser o nome da sua comunidade?" 
                    name="title" 
                    aria-label="Qual vai ser o nome da sua comunidade?"
                    type="text"
                    />
                </div>
                <div>
                  <input 
                    placeholder="Coloque uma URL para usarmos de capa" 
                    name="image" 
                    aria-label="Coloque uma URL para usarmos de capa"/>
                </div>

                <button>
                  Criar comunidade
                </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea"  style={{ gridArea: 'profileRelationsArea'}}>

         <ProfileRelationsBox title="Seguidores" items={seguidores}/>

         <ProfileRelationsBoxWrapper>

             <h2 className="smallTitle">
              Comunidades ({comunidades.length})
             </h2>
    
             <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                       <a href={`/communities/${itemAtual.id}`} key={itemAtual.id}>
                        <img src={itemAtual.imageUrl} />
                        <span>{itemAtual.title}</span>
                      </a>
                  </li>
                ) 
              } )}
            </ul>
         
         </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>

            <h2 className="smallTitle">
               Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                       <a href={`/users/${itemAtual}`} key={itemAtual}>
                        <img src={`https://github.com/${itemAtual}.png`} />
                        <span>{itemAtual}</span>
                      </a>
                  </li>
                ) 
              } )}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
       </MainGrid>  
     </main>
     </>
  )
}
export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}