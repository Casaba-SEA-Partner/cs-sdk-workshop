import { mapGetters, mapState, mapActions } from 'vuex'
import { get, map, isEmpty } from 'lodash'
import storage from '@/utils/storage'
 import MiniCart from './MiniCart'
import LanguageSelect from './LanguageSelect'
import './KidzHeader.less'

function mapMenu(data) {
  return data.children && data.children.length > 0
    ? data.children.map(m => ({
      id: m.code,
      name: m.name,
      display: m.display,
      url:
          m.urlType === 'PRODUCT_CATEGORY'
            ? `/products/search.html?menuId=${m.code}`
            : m.url,
      urlType: m.urlType,
      parentCode: m.parentCode,
      children: mapMenu(m),
    }))
    : []
}
const menuNotLogin = [
  {
    type: 'UNLINK',
    link: '',
    message: 'Default welcome msg!',
  },
  {
    type: 'LINK',
    link: '',
    message: 'Confirm Payment',
  },
  {
    type: 'LINK',
    link: '',
    message: 'Track OrderComponents',
  },
  {
    type: 'LINK',
    link: '/login.html',
    message: 'Sign In',
  },
  {
    type: 'LINK',
    link: '/register.html',
    message: 'Create an Account',
  },
]
const menuLogin = [
  {
    type: 'UNLINK',
    link: '',
    message: 'Default welcome msg!',
  },
  {
    type: 'LINK',
    link: '/personalCenter',
    message: 'My Account',
  },
  {
    type: 'LINK',
    link: '',
    message: 'My Wish List',
  },
  {
    type: 'LINK',
    link: '',
    message: 'Send Invitations',
  },
  {
    type: 'LINK',
    link: '',
    message: 'Confirm Payment',
  },
  {
    type: 'LINK',
    link: '',
    message: 'Track OrderComponents',
  },
]
const KidzHeader = {
  name: 'SeaHeader',
  props: {
    molecules: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    dynamic: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    MiniCart,
  },
  data() {
    return {
      defaultLanguage: {
        url:
          'https://media.kidzstation.asia/media//weltpixel/multistore/logo/stores/1/flag-uk_1.png',
        title: 'ENG',
      },
      languages: [
        {
          url:
            'https://media.kidzstation.asia/media//weltpixel/multistore/logo/stores/1/flag-uk_1.png',
          title: 'ENG',
        },
        {
          url:
            'https://media.kidzstation.asia/media//weltpixel/multistore/logo/stores/2/flag-indonesia.png',
          title: 'IND',
        },
      ],
      visibleLanguageOption: false,
      visibleOption: false,
      visibleKey: 'MENU',
      openedMenuKey: [],
      rootSubmenuKeys: [],
      fixedTop: false,
    }
  },
  computed: {
    ...mapGetters(['cartTotalQuantity']),
    ...mapState({
      isMobile: state => state.globe.isMobile,
      user: state => state.globe.user,
    }),
    navList() {
      const menuData = this.dynamic.menus || []
      const navLists = mapMenu(menuData[0] || {})
      const displayNavList = navLists.filter(item => item.display === true)
      displayNavList.forEach(item => this.rootSubmenuKeys.push(item.id))
      return navLists && navLists.filter(item => item.display === true)
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.scroll, true)
    })
  },
  unmounted() {
    window.removeEventListener('scroll', this.scroll)
  },
  methods: {
    ...mapActions('member', ['logout']),
    handleminiCar() {
      this.$store.commit('setDrawerCartVisible', true)
    },
    updateOpenedMenuKey(key) {
      const index = this.openedMenuKey.indexOf(key)
      if (index === -1) {
        this.openedMenuKey.push(key)
      } else {
        this.openedMenuKey.splice(index, 1)
      }
      console.log(this.openedMenuKey)
    },
    isOpened(key) {
      return this.openedMenuKey.includes(key)
    },
    scroll() {
      if (window.pageYOffset >= 50) {
        this.fixedTop = true
      } else {
        this.fixedTop = false
      }
    },
    async userLogout() {
      try {
        await this.logout()
        this.$store.commit('globe/setUser', { isVisitor: true })
        storage.clearAll()
        this.visibleOption = false
        this.$router.push({ path: '/logout.html' })
      } catch (e) {
        console.error(e)
      }
    },
  },
  render() {
    const { isVisitor, firstName } = this.user
    menuLogin[0].message = `Welcome, ${firstName}`
    let LoginItem = ''
    if (isVisitor) {
      LoginItem = (
        <div class="item user">
          <i class="icon-user" />
          <span>SIGN IN</span>
          <div class="user-option">
            <a href="/login.html">MY ACCOUNT</a>
            <a href="/login.html">MY WISHLIST</a>
          </div>
        </div>
      )
    } else {
      LoginItem = (
        <div class="item user">
          <i class="icon-user" />
          <span>
            <span class="logout-btn" onClick={this.userLogout}>
              {firstName}/sign out
            </span>
          </span>
          <div class="user-option">
            <a href="/personalCenter">MY ACCOUNT</a>
            <a href="/personalCenter/wishList">MY WISHLIST</a>
          </div>
        </div>
      )
    }
    return (
      <div
        class={[
          'header-box',
          { mobile: this.isMobile, desktop: !this.isMobile },
        ]}
        id="header"
      >
        <header class="page-header">
          <div class="panel">
            <div class="panel-content">
              <div class="panel-content-left">
                <div
                  class={[
                    'panel-content-left__item',
                    { active: this.$route.path === '/' },
                  ]}
                >
                  <router-link to="/">Kidz Station</router-link>
                </div>
                <div
                  class={[
                    'panel-content-left__item',
                    { active: this.$route.path.includes('lego') },
                  ]}
                >
                  <router-link to="/page/lego">LEGO</router-link>
                </div>
              </div>
              <div
                class="nav-toggle"
                onClick={() => {
                  this.visibleOption = !this.visibleOption
                }}
              >
                <icon type="icon-hamburger2" class="hamburger-icon" />
              </div>
              <div class="panel-content-right">
                <div class="item help">
                  <a href="#">Help</a> / <a href="#">FAQ</a>
                </div>
                <LanguageSelect />
                {LoginItem}
                <div class="item">
                  <i class="icon-cart" onClick={this.handleminiCar} />
                  <span>{this.cartTotalQuantity}</span>
                </div>
              </div>
            </div>
          </div>
          <div class={['content-fix-con', { 'show-fixed': this.fixedTop }]} />
          <div class={['content', { 'fixed-top': this.fixedTop }]}>
            <div class="content-box">
              <div class="logo">
                <a href="/">
                  <img
                    src={
                      get(this.molecules, '0.logoImg') ||
                      get(this.dynamic, 'logo')
                    }
                    alt=""
                  />
                </a>
              </div>
              <Search />
              <div class="store-locator">
                <a href="/storelocator">Store Locator</a>
              </div>
            </div>
          </div>
        </header>
        <div
          class={['model', { active: this.visibleOption }]}
          onClick={e => {
            if (e.target.className.match('model')) {
              this.visibleOption = !this.visibleOption
            }
          }}
        >
          <div
            class="close-section-btn"
            onClick={() => {
              this.visibleOption = !this.visibleOption
            }}
          >
            <icon type="icon-hamburger2" class="hamburger-icon" />
          </div>
          <div class={['section', { active: this.visibleOption }]}>
            <div class="section-item-content">
              <div class="switch">
                <div
                  class={[
                    'section-item-switch',
                    {
                      active: this.visibleKey === 'MENU',
                    },
                  ]}
                  onClick={() => {
                    this.visibleKey = 'MENU'
                  }}
                >
                  <span class="title">MENU</span>
                </div>
                <div
                  class={[
                    'section-item-switch',
                    {
                      active: this.visibleKey === 'ACCOUNT',
                    },
                  ]}
                  onClick={() => {
                    this.visibleKey = 'ACCOUNT'
                  }}
                >
                  <span class="title">ACCOUNT</span>
                </div>
                <div class="section-item-switch" />
              </div>
              <div class={['navs', { active: this.visibleKey === 'MENU' }]}>
                {map(this.navList, menu => (
                  <div class="nav">
                    <div class="nav-item">
                      <a
                        href={menu.url}
                        target="_self"
                        title={menu.name}
                        class="nav-menu"
                      >
                        {menu.name}
                      </a>
                      {!isEmpty(menu.children) && (
                        <i
                          onClick={() => this.updateOpenedMenuKey(menu.id)}
                          class={[
                            'open-btn',
                            { active: this.isOpened(menu.id) },
                          ]}
                        />
                      )}
                    </div>
                    {!isEmpty(menu.children) && (
                      <div
                        class={[
                          'submenu',
                          'level1',
                          { active: this.isOpened(menu.id) },
                        ]}
                      >
                        <div class="submenu-inner">
                          <div class="content-wrapper">
                            {map(menu.children, childMenu => (
                              <div class="submenu-item">
                                <div class="nav-item">
                                  <a
                                    href={childMenu.url}
                                    class="nav-menu"
                                    class={[
                                      'nav-menu',
                                      {
                                        'other-branch':
                                          childMenu.name === 'Other Brands' ||
                                          childMenu.name === 'OTHER BRANDS',
                                      },
                                    ]}
                                    target="_self"
                                    title={childMenu.name}
                                  >
                                    {childMenu.name}
                                  </a>
                                  {!isEmpty(childMenu.children) && (
                                    <i
                                      onClick={() =>
                                        this.updateOpenedMenuKey(childMenu.id)
                                      }
                                      class={[
                                        'open-btn',
                                        { active: this.isOpened(childMenu.id) },
                                      ]}
                                    />
                                  )}
                                </div>
                                {!isEmpty(childMenu.children) && (
                                  <div
                                    class={[
                                      'submenu',
                                      'level2',
                                      { active: this.isOpened(childMenu.id) },
                                    ]}
                                  >
                                    <div class="submenu-inner">
                                      <div class="content-wrapper">
                                        {map(
                                          childMenu.children,
                                          childMenuItem => (
                                            <div class="submenu-item">
                                              <a
                                                href={childMenuItem.url}
                                                target="_self"
                                                title={childMenuItem.name}
                                              >
                                                {childMenuItem.name}
                                              </a>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div
                class={[
                  'navs',
                  'account-nav',
                  { active: this.visibleKey === 'ACCOUNT' },
                ]}
              >
                {isVisitor ? (
                  <AccountLogin menu={menuNotLogin} />
                ) : (
                  <AccountLogin menu={menuLogin} />
                )}
                {!isVisitor && (
                  <div class="nav">
                    <div class="nav-item">
                      <span
                        onClick={this.userLogout}
                        class="nav-menu"
                        title="Action Toys"
                      >
                        Sign Out
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <MiniCart />
      </div>
    )
  },
}

export const AccountLogin = ({ props }) =>
  props.menu.map(item => {
    if (item.type === 'LINK') {
      return (
        <div class="nav">
          <div class="nav-item">
            <a href={item.link} class="nav-menu" title="Action Toys">
              {item.message}
            </a>
          </div>
        </div>
      )
    }
    return (
      <div class="nav">
        <div class="nav-item">
          <span class="nav-menu-title" title="Action Toys">
            {item.message}
          </span>
        </div>
      </div>
    )
  })

const Search = () => (
  <div class="search">
    <icon type="icon-search2" class="search-icon" />
    <input type="text" placeholder="Search entire store here..." />
  </div>
)

export default KidzHeader
