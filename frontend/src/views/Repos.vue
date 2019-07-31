<template>
  <v-container>
    <DateRange :startDate="startDate" :endDate="endDate" @range="searchRepos"></DateRange>
    <v-layout>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="repos"
          class="elevation-1"
          :items-per-page-options=[20]
        >
          <template v-slot:items="props">
            <tr hover @click="onRepoClicked(props.item)">
              <td>{{ props.item.name }}</td>
              <td class="text-sm-center">{{ props.item.numOfPR }}</td>
              <td class="text-sm-center">{{ props.item.numOfNoCommentPR }}</td>
              <td class="text-sm-center">{{ props.item.reviewRate }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import DateRange from "../components/DateRange";

export default {
  components: {
    DateRange
  },
  data: () => ({
    rowsPerPageItems: [20],
    startDate: "",
    endDate: "",
    headers: [
      { text: "Repo", align: "center", value: "", sortable: false },
      { text: "# of PR", align: "center", value: "", sortable: false },
      { text: "# of No Comment", align: "center", value: "", sortable: false },
      { text: "Review Rate (%)", align: "center", value: "", sortable: false }
    ],
    repos: []
  }),
  async created() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), 2)
      .toISOString()
      .substr(0, 10);
    this.endDate = today.toISOString().substr(0, 10);

    const range = {
      params: { startDate: this.startDate, endDate: this.endDate }
    };

    console.log(this.startDate);
    // const resp = await instance.get("/", range);
    // this.repos = resp.data.repos;
  },
  methods: {
    async searchRepos(range) {
      this.startDate = range.params.startDate;
      this.endDate = range.params.endDate;
      // const resp = await instance.get("/", range);
      // this.repos = resp.data.repos;
    },
    onRepoClicked(repo) {
      this.$router.push({
        name: "repo",
        params: {
          repoName: repo.name
        },
        query: {
          startDate: this.startDate,
          endDate: this.endDate
        }
      });
    }
  }
};
</script>
