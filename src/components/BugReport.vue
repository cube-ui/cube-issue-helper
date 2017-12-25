<template>
  <div class="row" style="margin:0">
    <div class="col-12 col-lg-4">
      <input-typeahead
        v-model="attrs.version"
        :title="i18n('version-title')"
        :suggestions="suggestions"
        :search="{
          sort: [{ field: 'index', direction: 'asc' }],
          empty_sort: [{ field: 'index', direction: 'asc' }],
          limit: 10
        }"
        required
        :subtitle="i18n('version-subtitle')"/>
    </div>

    <div class="col-12 col-lg-8">
      <input-text
        type="url"
        v-model="attrs.reproduction"
        :title="i18n('repro-title')"
        required
        subtitle="yes">
        <i18n slot="subtitle"
          id="repro-subtitle"
          @click-modal="show = true"/>
      </input-text>
    </div>

    <div class="col-12">
      <input-textarea
        v-model="attrs.steps"
        :title="i18n('steps-title')"
        required
        subtitle="yes">
        <i18n slot="subtitle" id="steps-subtitle"/>
      </input-textarea>
    </div>

    <div class="col-12 col-lg-6">
      <input-textarea v-model="attrs.expected" :title="i18n('expected-title')" required/>
    </div>

    <div class="col-12 col-lg-6">
      <input-textarea v-model="attrs.actual" :title="i18n('actual-title')" required/>
    </div>

    <div v-for="(item, index) in dependencies" :key="index" class="col-12 col-lg-6">
      <input-typeahead
          v-model="attrs.dependVersions[index]"
          :title="item.name + i18n('dependency-version-title')"
          :suggestions="dependSuggestions[index] || defaultSuggestions"
          :search="{
          sort: [{ field: 'index', direction: 'asc' }],
          empty_sort: [{ field: 'index', direction: 'asc' }],
          limit: 10
        }"/>
    </div>

    <div class="col-12">
      <input-textarea v-model="attrs.extra"
        :title="i18n('extra-title')"
        :subtitle="i18n('extra-subtitle')" />
    </div>

    <modal :open="show" @close="show = false">
      <div class="card">
        <div class="card-header">
          <h4 class="mb-0">{{ i18n('repro-modal-title') }}</h4>
        </div>
        <i18n class="card-block" id="repro-modal"/>
      </div>
    </modal>
  </div>
</template>

<script>
import { versionCompare, generate, updateQuery } from '../helpers'
import { repos } from '../config'

export default {
  props: ['repo'],

  data: () => ({
    show: false,
    attrs: {
      version: '',
      dependVersions: [],
      reproduction: '',
      steps: '',
      expected: '',
      actual: '',
      extra: '',
    },
    versions: {},
    dependencies: [],
    dependSuggestions: [],
    defaultSuggestions: [{ name: 'Loading...' }]
  }),

  computed: {
    suggestions () {
      return this.suggestHandle(this.repo, this.versions)
    },
    dependSuggestions () {
      const dependencies = this.dependencies
      const versions = this.versions

      return dependencies.map((item) => (suggestHandle(item.id, versions)))
    }
  },

  methods: {
    async fetchVersions (repo, index, page = 1) {
      const response = await this.$http.get(`https://api.github.com/repos/${repo}/releases`, {
        params: {
          page,
          per_page: 100
        }
      })
      const versions = await response.json()

      if (!versions || !(versions instanceof Array)) return false

      if (!(repo in this.versions)) {
        this.$set(this.versions, repo, [])
      }

      this.versions[repo].push(
          ...versions.map(v => (/^v/.test(v.tag_name) ? v.tag_name.substr(1) : v.tag_name))
              .map(name => ({ id: name, name }))
      )

      if (page === 1) {
        const version = this.versions[repo].length ? this.versions[repo][0].id : ''
        if (index === -1) {
          this.attrs.version = version
        } else {
          this.attrs.dependVersions[index] = version
        }
      }

      const link = response.headers.get('Link')

      if (link && link.indexOf('rel="next"') > -1) {
        this.fetchVersions(repo, page + 1)
      }
    },

    generate () {
      const { version, reproduction, steps, expected, actual, extra } = this.attrs

      return generate(`
### Version
${version}

### Reproduction link
[${reproduction}](${reproduction})

### Steps to reproduce
${steps}

### What is expected?
${expected}

### What is actually happening?
${actual}

${extra ? `---\n${extra}` : ''}
  `.trim())
    },
    deepFetchVersions () {
      this.fetchVersions(this.repo, -1)

      const repo = repos.find((item) => {
        return item.id === this.repo
      })

      if (repo.dependencies) {
        this.dependencies = repo.dependencies
        repo.dependencies.forEach((item, index) => {
          this.fetchVersions(item.id, index)
        })
      } else {
        this.dependencies = []
      }
    },
    updateSuggestion () {
      this.attrs.version = this.versions[this.repo][0].id
      this.attrs.dependVersions = this.dependencies.map((item) => (this.versions[item.id][0].id))
    },
    suggestHandle (repo, versions) {
      if (!(repo in versions)) return [{ name: 'Loading...' }]

      return versions[repo].slice()
        .sort((a, b) => -versionCompare(a.id, b.id))
        .map((a, index) => (Object.assign({}, a, { index })))
    }
  },

  created () {
    this.deepFetchVersions()
  },

  watch: {
    repo (repo) {
      if (!this.versions[repo]) {
        this.deepFetchVersions()
      } else {
        this.updateSuggestion()
      }
      updateQuery({ repo })
    }
  }
}
</script>
