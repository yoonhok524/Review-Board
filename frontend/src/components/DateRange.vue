<template>
  <v-layout>
    <v-flex xs12 sm6 md2 mt-5>
      <v-menu v-model="pickerStartDate" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-text-field v-model="sDate" label="Start Date" readonly v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="sDate" @input="pickerStartDate = false"></v-date-picker>
      </v-menu>
    </v-flex>
    <v-flex xs12 sm6 md2 mt-5 ml-5>
      <v-menu v-model="pickerEndDate" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-text-field v-model="eDate" label="End Date" readonly v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="eDate" @input="pickerEndDate = false"></v-date-picker>
      </v-menu>
    </v-flex>
    <v-flex pa-2 ma-5>
      <v-btn dark color="cyan" @click="searchPRs">Search</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ["startDate", "endDate"],
  data: () => ({
    pickerStartDate: "",
    pickerEndDate: "",
    sDate: "",
    eDate: ""
  }),
  created() {
    this.sDate = this.startDate;
    this.eDate = this.endDate;
  },
  methods: {
    async searchPRs() {
      const range = {
        params: {
          startDate: this.sDate,
          endDate: this.eDate
        }
      };
      this.$emit("range", range);
    }
  }
};
</script>
