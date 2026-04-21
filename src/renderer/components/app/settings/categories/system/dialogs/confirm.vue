<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title class="text-h5">
        ПРЕДУПРЕЖДЕНИЕ
      </v-card-title>
      <v-card-text>

        <p>
          Требуется согласие на передачу данных (сессионного идентификатора) на сторонний сервер для работы с снапшотами
        </p>

        <p class="mt-1">
          <b>Пароль учетной записи не раскрывается и не передается ни в каком виде</b>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          v-on:click="$emit('openSnapshots')"
        >
          Я согласен
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          v-on:click="visible = false"
        >
          Нет, спасибо
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      loading: false,
    }
  },
  methods: {
    hideDialog () {
      this.visible = false
    },
    /**
     * Show dialog
     *
     * @return void
     */
    showDialog () {
      this.visible = true
    }
  }

}
</script>
