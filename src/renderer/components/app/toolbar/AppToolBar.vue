<template>
  <v-app-bar v-if="!hideToolbar" flat color="transparent" class="toolbar shrink">
    <!-- Search -->
    <search class="mr-4"/>

    <!-- Dropdown Menu -->
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-tooltip left activator="#toolbar__menu">
          <div class="py-1">
            <div class="font-weight">Меню</div>
          </div>
        </v-tooltip>
        <v-btn id="toolbar__menu" icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <!-- Releases -->
        <v-list-item :to="{name: 'releases'}" exact>
          <v-list-item-icon>
            <v-icon>mdi-view-column</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Релизы</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Catalog -->
        <v-list-item :to="{name: 'catalog'}" exact>
          <v-list-item-icon>
            <v-icon>mdi-folder-text-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Каталог</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Schedule -->
        <v-list-item :to="{name: 'schedule'}" exact>
          <v-list-item-icon>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Расписание</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Favorites -->
    <div>
      <v-btn icon id="toolbar__favorites" :to="{name: 'favorites'}" exact>
        <v-icon>mdi-star</v-icon>
      </v-btn>
      <v-tooltip left activator="#toolbar__favorites">Избранное</v-tooltip>
    </div>

    <!-- Additional Components -->
    <update/>
    <notifications/>
    <settings/>
    <account/>
  </v-app-bar>
</template>

<script>
import Update from './components/update'
import Search from './components/search'
import Account from './components/account'
import Settings from './components/settings'
import Notifications from './components/notifications'

export default {
  components: {
    Update,
    Search,
    Account,
    Settings,
    Notifications
  },
  computed: {
    hideToolbar() {
      return this.$__get(this.$route, 'meta.layout.hide_toolbar') || false
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  ::v-deep {
    .v-toolbar__content {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
