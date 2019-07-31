<template>
  <v-container>
    <DateRange :startDate="startDate" :endDate="endDate" @range="searchRange"></DateRange>
    <v-layout>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="prs"
          class="elevation-1"
          :items-per-page-options=[20]
        >
          <template v-slot:items="props">
            <tr>
              <td class="text-sm-center">{{ props.item.date }}</td>
              <td>{{ props.item.title }}</td>
              <td class="text-sm-center">{{ props.item.numOfReviews }}</td>
              <td class="text-sm-center">
                <a :href="props.item.url">link</a>
              </td>
              <td class="text-sm-center">{{ props.item.countOfGood }}</td>
              <td class="text-sm-center">
                <v-btn text icon fab small @click="likePR(props.item)">
                  <v-icon color="cyan">thumb_up</v-icon>
                </v-btn>
              </td>
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
    repoName: "",
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    headers: [
      { text: "Date", align: "center", value: "date", },
      { text: "Title", align: "center", value: "title", sortable: false,},
      { text: "# of Review", align: "center", value: "numOfReviews",},
      { text: "Github", align: "center", value: "github",},
      { text: "Likes", align: "center", value: "countOfGood" },
      { text: "Action", align: "center", value: "action", sortable: false },
    ],
    prs: []
  }),
  async created() {
    this.repoName = this.$route.params.repoName;
    if (
      this.$route.query.hasOwnProperty("startDate") &&
      this.$route.query.hasOwnProperty("endDate")
    ) {
      this.startDate = this.$route.query.startDate;
      this.endDate = this.$route.query.endDate;
      const range = {
        params: {
          startDate: this.$route.query.startDate,
          endDate: this.$route.query.endDate
        }
      };
      this.searchRange(range);
    } else {
      // this.prs = (await instance.get(
      //   `/repository/${this.repoName}/prs`
      // )).data.prs;
      console.log(JSON.stringify(this.prs))
    }
  },
  methods: {
    async searchRange(range) {
      // const resp = await instance.get(
      //   `/repository/${this.repoName}/prs`,
      //   range
      // );
      // this.prs = resp.data.prs;
      // console.log(JSON.stringify(this.prs))
    },
    async likePR(pr) {
      // const updatedPR = (await instance.get(
      //   `/repository/${this.repoName}/prs/${pr.id}`
      // )).data;

      // let idx = this.prs.findIndex(p => p.id == pr.id)
      // this.prs[idx].countOfGood = updatedPR.countOfGood * 1;
    }
  }
};
</script>
