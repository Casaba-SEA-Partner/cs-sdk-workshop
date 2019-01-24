import ProductDetail from '@/views/product/detail.vue'

import { gqlClient } from '@/plugins/gqlClient'
import PRODUCT_DETAIL from '@/api/schema/productDetail.gql'

export default {
  name: 'ProductDetail',
  data() {
    return {}
  },
  async mounted() {
    const res = await gqlClient.query({
      query: PRODUCT_DETAIL,
      variables: {
        codes: ['144'],
      },
    })
    console.log('res example............', res.data)
  },
  render() {
    return <ProductDetail />
  },
}
