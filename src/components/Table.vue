<template>
  <div>
    <h1>Eğitim Tamamlama Girişleri</h1>
    <div class="input-group">
      <form @submit.prevent="send()" class="form">
        <input
          :maxlength="11"
          :minlength="11"
          required
          placeholder="TCKN"
          type="text"
          v-model.number="tckn"
        />
        <input required placeholder="İsim Soyisim" type="text" v-model="name" />
        <input
          required
          placeholder="Bitirme Tarihi"
          type="date"
          v-model="date"
        />
        <select required v-model="selected" name="egitimler">
          <option v-for="name in egitimler" :key="name" :value="name">{{
            name
          }}</option>
        </select>
        <button class="btn-green" type="submit">Ekle</button>
      </form>
      <div class="search-area">
        <label for="search">Ara</label>
        <input id="search" type="text" v-model="searchText" placeholder="ara" />
      </div>
    </div>

    <div v-if="allList" class="list">
      <table>
        <thead>
          <th @click="sortBy('tckn')" :class="handleSorted('tckn')">
            TCKN
          </th>
          <th @click="sortBy('name')" :class="handleSorted('name')">
            İsim Soyisim
          </th>
          <th
            @click="sortBy('selectedCourse')"
            :class="handleSorted('selectedCourse')"
          >
            Eğitim Adı
          </th>
          <th @click="sortBy('date')" :class="handleSorted('date')">
            Bitirme Tarihi
          </th>
          <th>
            Edit
          </th>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.tckn">
            <td>{{ item.tckn }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.selectedCourse }}</td>
            <td>{{ item.date }}</td>
            <td>
              <button @click="deleteItem(item.id)" class="btn-red">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="btn-green" @click="downloadExcel">Excel Olarak İndir</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tckn: "",
      name: "",
      date: "",
      selected: "",
      egitimler: ["Kurs1", "Kurs2", "Kurs3"],
      allList: [],
      sortedName: "",
      asc: true,
      searchText: "",
    };
  },

  props: {
    msg: String,
  },

  methods: {
    send() {
      const sendItem = {
        name: this.name,
        tckn: this.tckn,
        date: this.date,
        selectedCourse: this.selected,
      };

      this.name = "";
      this.tckn = "";
      this.date = "";
      this.selected = "";
      axios
        .post("https://vue-js-13b12.firebaseio.com/course.json", {
          course: sendItem,
        })
        .then(() => this.allList.push(sendItem))
        .catch((error) => console.log(error));
    },

    sortBy(name) {
      if (this.asc) {
        this.allList.sort((a, b) =>
          a[name].toString().localeCompare(b[name].toString())
        );
        this.asc = false;
      } else {
        this.allList.sort((a, b) =>
          b[name].toString().localeCompare(a[name].toString())
        );
        this.asc = true;
      }
      this.sortedName = name;
    },

    handleSorted(name) {
      return name === this.sortedName ? "selectedTh" : null;
    },

    downloadExcel() {
      // TODO: download as a excel method will add here!
    },

    deleteItem(id) {
      axios
        .delete(`https://vue-js-13b12.firebaseio.com/course/${id}.json`)
        .then(() => {
          this.allList = this.allList.filter((course) => course.id !== id);
        });
    },
  },

  computed: {
    filtered() {
      let filter = new RegExp(this.searchText, "i");
      return this.allList.filter(
        (el) => el.name.match(filter) || el.tckn.toString().match(filter)
      );
    },
  },

  created() {
    axios
      .get("https://vue-js-13b12.firebaseio.com/course.json")
      .then((response) => {
        for (const key in response.data) {
          const element = {
            id: key,
            name: response.data[key].course.name,
            tckn: response.data[key].course.tckn,
            date: response.data[key].course.date,
            selectedCourse: response.data[key].course.selectedCourse,
          };
          this.allList.push(element);
        }
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
  text-transform: capitalize;
}
.input-group,
.list {
  border: 1px solid lightgray;
  border-radius: 10px;
  width: 80%;
  margin: 10px auto;
  padding: 20px;
}

input,
select {
  padding: 10px;
  background-color: aliceblue;
  margin: 10px;
  border: 1px solid aliceblue;
  width: 20%;
}

input:focus {
  background-color: whitesmoke;
  border: 1px solid whitesmoke;
}
.btn-green {
  background-color: green;
  border: none;
  padding: 10px 25px;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  width: 30%;
  margin: 10px auto;
}
.btn-green:hover {
  background-color: #42b983;
  cursor: pointer;
}
table {
  width: 100%;
}
tr {
  background-color: whitesmoke;
  border: 1px solid gray;
}
tr:nth-child(even) {
  background-color: lightgrey;
}
th:hover {
  cursor: pointer;
  color: lightcoral;
}
.selectedTh {
  color: lightcoral;
}

.btn-red {
  background-color: darkred;
  border: none;
  padding: 10px 25px;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  margin: 10px auto;
}
.btn-red:hover {
  background-color: rgb(95, 2, 2);
  cursor: pointer;
}
.search-area {
  box-shadow: 0 0 3px;
  margin: 20px auto;
  width: max-content;
  min-width: 60%;
}
</style>
