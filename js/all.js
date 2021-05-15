const signInDOM   = document.querySelector('.js-signIn');
const dataList    = document.querySelector('.js-dataList');
const productList = document.querySelector('.js-productList');
const logOutDOM   = document.querySelector('.js-logOut');
const signInForm  = document.querySelector('.js-signInForm');
const app = {
  data: {
    url: 'https://vue3-course-api.hexschool.io',
    path: 'vs',
    originProductsData: []
  },
  getProduct() {
    axios.get(`${this.data.url}/api/${this.data.path}/admin/products?page=1`).then(res => {
      this.data.originProductsData = res.data.products;
      this.productRender();
    })
  },
  deleteProduct(itemId) {
    axios.delete(`${this.data.url}/api/${this.data.path}/admin/product/${itemId}`).then(res => {
      console.log(res.data.message);
      this.getProduct();
    }).catch(res => {
      console.log(res.data.message);
    })
  },
  productRender() {
    let dataString = '';
    this.data.originProductsData.forEach(item => {
      dataString += `
      <tr>
        <td>${item.category}</td>
        <td>${item.title}</td>
        <td>${item.description}</td>
        <td>${item.price}</td>
        <td class="align-middle">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="${item.id}" ${item.is_enabled ? 'checked' : ''}>
            <label class="form-check-label" for="${item.id}">${item.is_enabled ? '已啟用' : '未啟用'}</label>
          </div>
        </td>
        <td>
          <input type="button" data-id="${item.id}" value="刪除" class="btn btn-outline-danger">
        </td>
      </tr>`;
    })
    productList.innerHTML = dataString;
  },
  signIn(Event) {
    Event.preventDefault();
    let userInfo = {
      username: Event.target[0].value,
      password: Event.target[1].value
    }
    axios.post(`${this.data.url}/admin/signin`, userInfo).then(res => {
      const token = res.data.token;
      const expired = res.data.expired;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/` ;
      if (res.data.success === false) {
        signInDOM.classList.remove('d-none');
        dataList.classList.add('d-none');
      } else {
        this.getProduct();
        signInDOM.classList.add('d-none');
        dataList.classList.remove('d-none');
      }
      Event.target.reset();
      console.log(res.data.message);
    }).catch(() => {
      signInDOM.classList.remove('d-none');
    })
  },
  logOut() {
    axios.post(`${this.data.url}/logout`).then(res => {
      document.cookie = `hexToken=; expires=; path=/`;
      signInDOM.classList.remove('d-none');
      dataList.classList.add('d-none');
      this.data.originProductsData = [];
      console.log(res.data.message);
    })
  },
  checkLogin() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(`${this.data.url}/api/user/check`).then(res => {
      if (res.data.success === false) {
        signInDOM.classList.remove('d-none');
        dataList.classList.add('d-none');
      } else {
        this.getProduct();
        signInDOM.classList.add('d-none');
        dataList.classList.remove('d-none');
      }
    })
  },
  created() {
    this.checkLogin();
    // 在這層的 this 指向此物件，利用 .bind() 傳入之後就能正確抓取，否則會指向該 DOM
    signInForm.addEventListener('submit', this.signIn.bind(this));
    logOutDOM.addEventListener('click', this.logOut.bind(this));
    productList.addEventListener('click', Event => {
      if (Event.target.value === '刪除') {
        this.deleteProduct(Event.target.dataset.id);
      }
    })
  }
}
app.created();





