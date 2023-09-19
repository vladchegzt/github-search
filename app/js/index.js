window.addEventListener("load", function() {
    "use strict";

    // Github
    // UI
    
    const GITHUB_API = "https://api.github.com";
    
    const searchInput = document.querySelector(".searchUser");

    // async function logMovies() {
    //     const response = await fetch(`${GITHUB_API}/users/vlad/repos?client_id=f1d2d52c5eeb982fd272&client_secret=9d7540b77dc9debe90d4363257d301ed6242f30b`);
    //     const list = await response.json();
    //     console.log(list);
    //   }
    //   logMovies()
    
    class Github {
      constructor() {
        this.clientId = "f1d2d52c5eeb982fd272";
        this.clientSecret = "9d7540b77dc9debe90d4363257d301ed6242f30b";
      }
    
      async getUser(userName) {
        const response = await fetch(
          `${GITHUB_API}/users/${userName}?client_id=${this.clientId}&client_secret=${this.clientSecret}`
        );
        const user = await response.json();
            // console.log(user)
        return user;
      }
      async getRepos(userName) {
        const response = await fetch(
          `${GITHUB_API}/users/${userName}/repos?sort=created&client_id=${this.clientId}&client_secret=${this.clientSecret}`
        );
        const repos = await response.json();
            // console.log(repos)
        return repos;
      }
    }
    
    class UI {
      constructor() {
        this.profile = document.querySelector(".profile");
      }
    
      showProfile(user, repos) {
        let reposHtml = '';
        if(typeof repos !== 'undefined' && repos.length > 0) {
            for(let key of repos.slice(0, 5)) {
                const {name, html_url: url} = key;
                const repoItemHtml = `<a target="_blank" href="${url}" class="repo-item">${name}</a>`;
                reposHtml += repoItemHtml;
            }
        } else {
            reposHtml = `<h3 class="alert">Repositories not found from this user</h3>`;
        }
        this.profile.innerHTML = `
        <div class="card card-body mb-3">
        <div class="row">
          <div class="col-md-3">
            <img class="img-fluid mb-2" src="${user.avatar_url}">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website/Blog: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
      <h3 class="page-heading mb-3">Latest Repos</h3>
      <div class="repos">${reposHtml}</div>
        `;
      }
    
      clearProfile() {
        this.profile.innerHTML = "";
      }
    
      showAlert(message, className) {
        this.clearAlert();
        const div = document.createElement("div");
    
        div.className = className;
        div.innerHTML = message;
    
        const search = document.querySelector(".search");
    
        search.before(div);
    
        setTimeout(() => {
          this.clearAlert();
        }, 3000);
      }
    
      clearAlert() {
        const alert = document.querySelector(".alert");
        if (alert) {
          alert.remove();
        }
      }
    }
    
    const github = new Github();
    const ui = new UI();
    const delay = 500;
    
    searchInput.addEventListener("input", _.debounce(async (e) => {
      const inputValue = e.target.value;
    
      if (inputValue !== "") {
        const userData = await github.getUser(inputValue);
        const userRepos = await github.getRepos(inputValue);
    
        if (userData.message === "Not Found") {
          ui.clearProfile();
          return ui.showAlert(userData.message, "alert alert-danger");
        }
        return ui.showProfile(userData, userRepos);
      }
    
      ui.clearProfile();
    }, delay));
});
