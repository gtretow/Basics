const input = document.getElementById("search-bar");
const btn = document.getElementById("btn-search");
const searchError = document.getElementById("error");

/* Dados usuarios */
const userDetails = document.getElementById("user-details");
const userImage = document.getElementById("user-img");
const userName = document.getElementById("username");
const seguidores = document.getElementById("followers");
const seguindo = document.getElementById("following");
const email = document.getElementById("email");
const bio = document.getElementById("bio");
const lista = document.getElementById("repo-list");

/* Dados repositório */

const repoDetails = document.getElementById("repo-details");
const repoName = document.getElementById("repo-name");
const repoDescription = document.getElementById("repo-descript");
const repoStars = document.getElementById("repo-stars");
const repoLanguage = document.getElementById("repo-language");
const repoGitHubLink = document.getElementById("access-repo");
const selection = document.getElementById("selection");
const voltarLink = document.getElementById("back-link");

// pesquisa de usuário

btn.onclick = function () {
  fetch(`https://api.github.com/users/${input.value}`)
    .then(function (response) {
      if (!response.ok) {
        searchError.setAttribute("style", "display: block");
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(function (data) {
      userDetails.setAttribute("style", "display: block");
      userName.innerText = data.name;
      userImage.setAttribute("src", `${data.avatar_url}`);
      seguidores.innerText = data.followers;
      seguindo.innerText = data.following;
      data.email === null
        ? (email.innerText = "Nenhum email cadastrado")
        : (email.innerText = data.email);
      data.bio === null
        ? (bio.innerText = "Nenhuma bio cadastrada")
        : (bio.innerText = data.bio);
    })
    .catch(function (error) {
      console.log(error);
    });

  // RENDERIZAR REPOSITÓRIOS

  fetch(`https://api.github.com/users/${input.value}/repos`)
    .then(function (response) {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then(function (data) {
      function repoInfo() {
        if (selection.value === "less-stars") {
          data.sort((a, b) => {
            return a.stargazers_count - b.stargazers_count;
          });
        } else {
          data.sort((a, b) => {
            return b.stargazers_count - a.stargazers_count;
          });
        }

        data.map((repositorio) => {
          let li = document.createElement("li");
          let eachRepoLink = document.createElement("a");

          lista.appendChild(li);
          li.innerText = `${repositorio.name} - ${repositorio.stargazers_count} stars`;

          lista.appendChild(eachRepoLink);
          eachRepoLink.setAttribute("id", `${repositorio.name}`);
          eachRepoLink.setAttribute("href", `#${repositorio.name}`);
          eachRepoLink.innerText = "Ver mais";

          eachRepoLink.onclick = function () {
            userDetails.setAttribute("style", "display: none");
            repoDetails.setAttribute("style", "display: block");

            // RENDERIZAR DETALHES DE CADA REPOSITÓRIO

            fetch(
              `https://api.github.com/repos/${input.value}/${eachRepoLink.id}`
            )
              .then(function (response) {
                if (!response.ok) throw new Error(response);
                return response.json();
              })
              .then(function (data) {
                repoName.innerText = data.name;
                data.description === null
                  ? (repoDescription.innerText = "Nenhuma descrição")
                  : (repoDescription.innerText = data.description);

                repoStars.innerText = data.stargazers_count;
                repoLanguage.innerText = data.language;
                repoGitHubLink.setAttribute("href", `https://github.com/${input.value}/${repositorio.name}`);
              })
              .catch(function (error) {
                console.log(error.message);
              });
          };
        });
      }

      repoInfo();

      // ALTERAR ORDEM DA LISTA DE REPOSITÓRIOS

      selection.onchange = function () {
        lista.innerHTML = "";
        repoInfo();
      };
    })
    .catch(function (error) {
      console.log(error);
    });
};

// VOLTAR PARA O USUÁRIO

voltarLink.onclick = function () {

  // userDetails.setAttribute("style", "display: block");
  repoDetails.setAttribute("style", "display: none"); 

  window.history.back();
};

// LIMPAR ERRO

input.onfocus = function () {
  searchError.setAttribute("style", "display: none");
};
