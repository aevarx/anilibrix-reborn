<template>

  <!-- Check if release is in favorite -->
  <!-- Remove release from favorites -->
  <v-btn
    v-if="_isAuthorized"
    :color="isInFavorite ? 'secondary' : color"
    :loading="_loading"
    @click.stop="isInFavorite ? _removeFromFavorites(release) : _addToFavorites(release)">

    <v-icon v-if="isInFavorite">mdi-star</v-icon>
    <v-icon v-else>mdi-star-outline</v-icon>
    <span v-if="favoriteRating" class="ml-1">{{ favoriteRating }}</span>

  </v-btn>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex'

const props = {
  release: {
    type: Object,
    default: null
  },
  color: {
    type: String,
    default: null
  }
}

export default {
  props,
  computed: {
    ...mapState('favorites', { _loading: s => s.loading }),
    ...mapGetters('app/account', { _isAuthorized: 'isAuthorized' }),

    /**
     * Check if provided release is in favorite
     *
     * @return {*}
     */
    isInFavorite () {
      return this.$store.getters['favorites/isInFavorite'](this.release)
    },

    /**
    * Get release favorite rating
    *
    * @return {*}
    */
    favoriteRating() {
      return this.$__get(this.release, 'favoriteRating.text')
    }

  },

  methods: {
    ...mapActions('favorites', {
      _addToFavorites: 'addToFavorites',
      _removeFromFavorites: 'removeFromFavorites'
    })
  },
}
</script>

