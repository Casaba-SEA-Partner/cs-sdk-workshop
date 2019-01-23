import { mapState, mapActions } from 'vuex'
import vue from 'vue'
import { get, isEmpty, min, debounce, includes } from 'lodash'
import storage from '@/utils/storage'
import { productMaxLimited } from '@/constants/cart'
import numberInput from '@/components/number-input'
import { on, off } from '@/utils/dom'
import './MiniCart.scss'

export default {
  name: 'MiniCart',
  components: {
    numberInput,
  },
  data() {
    return {
      limitVisible: false,
      limitProductName: '',
      show: true,
      spinIndex: null,
      deleteVisible: false,
      deleteId: null,
    }
  },
  computed: {
    ...mapState({
      items: state => get(state, 'shopingCart.items', []),
      cart: state => state.shopingCart.cart,
      isMobile: state => state.globe.isMobile,
      isVisible: state => state.shopingCart.drawerCartVisible,
      ableCartItems: state => get(state, 'shopingCart.ableCartItems'),
      appliedCoupons: state => get(state, 'shopingCart.appliedCoupons'),
    }),
    empty() {
      return isEmpty(this.items)
    },
    amount() {
      return get(this.cart, 'amount.amount')
    },
  },
  async mounted() {
    const couponCode = get(storage.get('applyCoupon'), 'code') || ''
    await this.getCart()
    await this.getBffCart({ couponCodes: [couponCode] })
    await this.getMiniCart()
    on(window, 'scroll', this.scroll)
  },
  beforeDestroy() {
    off(window, 'scroll', this.scroll)
  },
  methods: {
    ...mapActions([
      'getMiniCart',
      'cartItemDelete',
      'getCart',
      'getBffCart',
      'cartItemUpdate',
    ]),
    gotoCart() {
      this.handleHideMiniCar()
      this.$router.push('/shoppingCart.html')
    },
    deleteProduct(id) {
      this.deleteId = id
      this.deleteVisible = true
    },
    handleDelete() {
      this.cartItemDelete({
        ids: [this.deleteId],
      }).then(() => {
        this.deleteVisible = false
      })
    },
    handleDeleteCancle() {
      this.deleteVisible = false
    },
    handleHideMiniCar() {
      this.$store.commit('setDrawerCartVisible', false)
    },
    getProductMaxMount(netQty) {
      return min([netQty, productMaxLimited])
    },
    getDebounce: debounce((...args) => {
      const fn = Array.prototype.shift.call(args)
      fn(args)
    }, 2000),
    quantityChange(mini, index, quantity) {
      const self = this
      this.spinIndex = index
      vue.set(this.items[index], 'spinning', true)
      async function quantityChangeQuery() {
        try {
          await self.cartItemUpdate([
            {
              id: mini.sku.id,
              quantity,
            },
          ])
        } catch (e) {
          const errorString = JSON.stringify(e.graphQLErrors)
          if (includes(errorString, '限购上限')) {
            self.limitProductName = mini.sku.product.title
            self.limitVisible = true
          }
        }
      }
      self.getDebounce(() => {
        quantityChangeQuery()
      })
    },

    handleOk() {
      this.limitVisible = false
      this.show = false
      vue.set(this.items[this.spinIndex], 'spinning', false)
      this.$nextTick(() => {
        this.show = true
      })
    },
    goCheckOut() {
      storage.set('orderConfirm', this.ableCartItems)
      storage.set('applyCoupon', get(this.appliedCoupons, ['0']))
      storage.set('isImmediatelyBuy', false)
      storage.set('buyNowBffSpu', {})
      this.handleHideMiniCar()
      this.$router.push({ name: 'orderConfirm' })
    },
    scroll() {
      if (this.isVisible) {
        if (window.pageYOffset > 100) {
          document.getElementsByClassName('ant-drawer')[0].style.display =
            'none'
        } else {
          document.getElementsByClassName('ant-drawer')[0].style.display =
            'block'
        }
      }
    },
  },
  render() {
    return (
      <a-drawer
        visible={this.isVisible}
        width={this.isMobile ? '290px' : '390px'}
        onClose={this.handleHideMiniCar}
        closable={false}
        getContainer="#app-content"
        id="minicart-drawer"
      >
        <div class="mini-title">
          <p>{this.$t('locales.shoppingCart.myCart')}</p>
          <span onClick={this.handleHideMiniCar}>
            {this.$t('locales.shoppingCart.close')}
          </span>
        </div>
        {this.empty ? (
          <div class="empty-cart">{this.$t('locales.shoppingCart.noItem')}</div>
        ) : (
          <div>
            {this.show && (
              <div class="mini-items">
                {this.items.map((mini, index) => (
                  <div key={index} class="minicar-item">
                    <img
                      src={mini.spuPicURL.url}
                      alt=""
                      class="header-img-minicar"
                    />
                    <div class="item-detail">
                      <div class="detail-wrapper">
                        <div style="max-width:90%">
                          <a
                            data-cy="minicart-item-header"
                            class="header-minicar-title"
                          >
                            {mini.sku.product.title}
                          </a>
                        </div>
                        <a-icon
                          type="close"
                          class="item-remove"
                          onClick={() => this.deleteProduct(mini.sku.id)}
                        />
                      </div>

                      <div class="item-option" />
                      <p class="item-qty">
                        <label>QTY：</label>
                        <number-input
                          value={mini.quantity}
                          max={this.getProductMaxMount(mini.sku.inventory)}
                          default-value={1}
                          style="display: inline-flex; width: 80px;"
                          data-cy="updateNum"
                          isCaret={true}
                          input={value =>
                            this.quantityChange(mini, index, value)
                          }
                          spinning={this.items[index].spinning}
                          isDisabled={true}
                        />
                      </p>
                      <p class="header-minicar-price">
                        {this.$options.filters.customerCurrency(mini.sku.salePrice.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div class="bottom-container">
              <div class="subtotal">
                <span class="label">
                  {this.$t('locales.shoppingCart.subtotal')} :
                </span>
                <span class="price">
                  {this.$options.filters.customerCurrency(this.amount)}
                </span>
              </div>
              <div class="action-viewcart">
                <a onClick={this.gotoCart}>
                  {this.$t('locales.shoppingCart.goCart')}
                </a>
              </div>
              <div class="action-checkout">
                <button class="checkout-button" onClick={this.goCheckOut}>
                  {this.$t('locales.shoppingCart.goCheckOut')}
                </button>
              </div>
            </div>
          </div>
        )}
        <a-modal
          title="ATTENTION"
          width={'75%'}
          visible={this.limitVisible}
          wrapClassName={'limit-visible'}
          onOk={this.handleOk}
          onCancel={this.handleOk}
        >
          <p>
            {this.$t('locales.shoppingCart.limitItem', {
              msg: this.limitProductName,
            })}
          </p>
        </a-modal>
        <a-modal
          width={'75%'}
          visible={this.deleteVisible}
          wrapClassName={'delete-visible'}
          onOk={this.handleDelete}
          onCancel={this.handleDeleteCancle}
        >
          <p>{this.$t('locales.shoppingCart.deletePrompt')}</p>
        </a-modal>
      </a-drawer>
    )
  },
}
