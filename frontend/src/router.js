import Vue from "vue";
import Router from "vue-router";

import Repos from "./views/Repos.vue";
import Repo from "./views/Repo.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "repos",
      component: Repos
    },
    {
      path: "/repos/:repoName/prs",
      name: "repo",
      component: Repo
    },
    {
      path: "/about",
      name: "about",
      component: function() {
        return import(/* webpackChunkName: "about" */ "./views/About.vue");
      }
    }
  ]
});
