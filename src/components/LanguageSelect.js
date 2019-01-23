import Cookie from 'js-cookie'

import './LanguageSelect.less'

const Language = ({ props: { language, active } }) => (
  <div
    class={['language', { active }]}
    onClick={() => {
      const currentLanguage = Cookie.get('cs-i18n')
      if (language.code && currentLanguage !== language.code) {
        Cookie.set('cs-i18n', language.code)

        // has saved any lang code
        if (currentLanguage) {
          global.location.reload()
        }
      }
    }}
  >
    <img src={language.url} alt="" />
    <span>{language.title}</span>
  </div>
)

const LanguageSelect = {
  name: 'LanguageSelect',
  props: {
    molecules: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      languages: [
        {
          url:
            'https://media.kidzstation.asia/media//weltpixel/multistore/logo/stores/1/flag-uk_1.png',
          title: 'ENG',
          code: 'en',
        },
        {
          url:
            'https://media.kidzstation.asia/media//weltpixel/multistore/logo/stores/2/flag-indonesia.png',
          title: 'IDN',
          code: 'ind',
        },
      ],
      visibleLanguageOption: false,
    }
  },
  computed: {
    currentLanguage() {
      const { locale } = this.$i18n
      return (
        this.languages.find(lan => lan.code === locale) || this.languages[0]
      )
    },
  },
  methods: {},
  render() {
    return (
      <div class="item language-select">
        <div
          class="language-default"
          onClick={() => {
            this.visibleLanguageOption = !this.visibleLanguageOption
          }}
        >
          <Language language={this.currentLanguage} active />
        </div>
        {this.visibleLanguageOption && (
          <div class="language-options">
            {this.languages
              .filter(lan => lan.code !== this.currentLanguage.code)
              .map(language => <Language language={language} />)}
          </div>
        )}
      </div>
    )
  },
}

export default LanguageSelect
