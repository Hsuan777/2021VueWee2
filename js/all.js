const app = {
  data: {
    url: 'https://vue3-course-api.hexschool.io',
    path: '',
    hasLogin: false,
    tabList: ['商品', '訂單', '優惠券', '文章'],
    selectTabName: '',
    originProductsData: []
  },
  getProduct() {
    axios.get(`${this.data.url}/api/${this.data.path}/admin/products?page=1`).then(res => {
      console.log(res.data.products);
      this.originProductsData = res.data.products;
    })
  },
  deleteProduct(itemId) {
    console.log(itemId);
    axios.delete(`${this.data.url}/api/${this.data.path}/admin/product/${itemId}`).then(res => {
      console.log(res.data);
      this.getProduct()
    })
  },
  signIn(Event) {
    // let userInfo = {
    //   username: ,
    //   password:
    // }
    axios.post(`${this.data.url}/admin/signin`, this.data.userInfo).then(res => {
      const token = res.data.token;
      const expired = res.data.expired;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      this.hasLogin = true
      console.log(res.data.message);
      this.checkLogin()
    }).catch(() => {
      this.hasLogin = false
    })
  },
  logOut() {
    axios.post(`${this.data.url}/logout`).then(res => {
      document.cookie = `hexToken=; expires=; path=/`;
      this.hasLogin = false
      console.log(res.data);
    })
  },
  checkLogin() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(`${this.data.url}/api/user/check`).then(res => {
      if (res.data.success === false) {
        this.hasLogin = false
      } else {
        this.hasLogin = true;
      }
    })
  },
  formReset() {
    this.userInfo = {};
  },
  created() {
    this.checkLogin()
  }
}
app.created()
