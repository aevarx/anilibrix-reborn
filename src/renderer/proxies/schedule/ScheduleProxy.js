import BaseProxy from '@proxies/BaseProxy'
import __get from 'lodash/get'

export default class ScheduleProxy extends BaseProxy{
  getApiV1Endpoint () {
    const endpoint = require('@store/index').default?.state?.app?.settings?.system?.api?.endpoint_v1new
    return endpoint || 'https://anilibria.top'
  }

  mapDayIndex (publishDayValue) {
    const day = Number(publishDayValue)
    if (!Number.isInteger(day)) return null
    if (day < 1 || day > 7) return null
    return day - 1
  }

  toAbsoluteUrl (url) {
    if (!url) return null
    if (/^https?:\/\//.test(url)) return url
    return `${this.getApiV1Endpoint()}${url}`
  }

  getPublishedEpisodeNumber (publishedReleaseEpisode) {
    if (publishedReleaseEpisode === null || publishedReleaseEpisode === undefined) return null
    if (typeof publishedReleaseEpisode === 'number') return publishedReleaseEpisode
    if (typeof publishedReleaseEpisode === 'object') {
      const ordinal = Number(__get(publishedReleaseEpisode, 'ordinal', NaN))
      return Number.isFinite(ordinal) ? ordinal : null
    }
    return null
  }

  transformScheduleItem (item) {
    const release = __get(item, 'release', {})
    const posterUrl = __get(release, 'poster.preview', null) ||
      __get(release, 'poster.src', null) ||
      __get(release, 'poster.optimized.preview', null) ||
      __get(release, 'poster.thumbnail', null) ||
      __get(release, 'poster.optimized.thumbnail', null) ||
      __get(release, 'poster.optimized.src', null)
    const episodesPublished = this.getPublishedEpisodeNumber(__get(item, 'published_release_episode', null))
    const episodesNext = Number(__get(item, 'next_release_episode_number', NaN))
    const episodesTotal = __get(release, 'episodes_total', null)
    const shownEpisodeNumber = episodesPublished || (Number.isFinite(episodesNext) ? Math.max(episodesNext - 1, 0) : 0)
    const episodeString = episodesTotal
      ? `${shownEpisodeNumber}/${episodesTotal}`
      : `${shownEpisodeNumber}`

    return {
      id: release.id,
      names: {
        ru: __get(release, 'name.main', __get(release, 'name.english', 'Без названия'))
      },
      posters: {
        small: {
          url: this.toAbsoluteUrl(posterUrl)
        }
      },
      player: {
        episodes: {
          string: episodeString
        }
      }
    }
  }

  transformWeekSchedule (rows) {
    const week = Array.from({ length: 7 }, (_, day) => ({
      day,
      list: []
    }))

    rows
      .filter(item => item && typeof item === 'object')
      .forEach(item => {
        const dayIndex = this.mapDayIndex(__get(item, 'release.publish_day.value', null))
        if (dayIndex === null) return
        const release = this.transformScheduleItem(item)
        if (!release.id) return
        week[dayIndex].list.push(release)
      })

    return week
  }

  /**
   * Parse base response model
   *
   * @param response
   * @return {*}
   */
  handleResponse (response) {
    const data = __get(response, 'data', null)
    const status = __get(response, 'status', false)
    const message = __get(response, 'error.message', 'Ошибка при запросе')

    if (status === 200) {
      return data
    } else {
      throw new Error(message)
    }
  }

  /**
   * Get schedule
   *
   * @return {Promise}
   */
  async getSchedule(){
    const include = [
      'id',
      'name',
      'poster',
      'publish_day',
      'episodes_total'
    ].join(',')
    const response = await this.submit('GET', `${this.getApiV1Endpoint()}/api/v1/anime/schedule/week`, {
      parameters: { include }
    })

    const rows = Array.isArray(response.data) ? response.data : []
    return this.transformWeekSchedule(rows)
  }
}