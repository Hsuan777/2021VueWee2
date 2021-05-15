const signInDOM = document.querySelector('.js-signIn');
const dataList = document.querySelector('.js-dataList');
const productList = document.querySelector('.js-productList');

const app = {
  data: {
    url: 'https://vue3-course-api.hexschool.io',
    path: '',
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
      this.getProduct();
    })
  },
  productRender() {
    let dataString = '';
    if (this.data.originProductsData === undefined) {
      productList.innerHTML = '<tr><td colspan="6" class="text-danger">請先輸入正確路徑後，再按 "Update"</td></tr>';
    } else if (this.data.originProductsData.length === 0) {
      productList.innerHTML = '<tr><td colspan="6" class="text-danger">還沒有產品喔～</td></tr>';
    } else {
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
            <div class="d-flex">
              <input type="button" data-id="${item.id}" value="刪除" class="btn btn-outline-danger">
            </div>
          </td>
        </tr>`;
      })
      productList.innerHTML = dataString;
      productList.addEventListener('click', Event => {
        if (Event.target.value === '刪除') {
          this.deleteProduct(Event.target.dataset.id);
          this.productRender();
        }
      })
    }
  },
  signIn(Event) {
    let userInfo = {
      username: Event.target[0].value,
      password: Event.target[1].value
    }
    axios.post(`${this.data.url}/admin/signin`, userInfo).then(res => {
      const token = res.data.token;
      const expired = res.data.expired;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      if (res.data.success === false) {
        signInDOM.classList.remove('d-none');
        dataList.classList.add('d-none');
      } else {
        signInDOM.classList.add('d-none');
        dataList.classList.remove('d-none');
      }
      Event.target.reset()
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
      this.data.path = '';
      console.log(res.data.message);
    })
  },
  checkLogin() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(`${this.data.url}/api/user/check`).then(res => {
      this.getProduct();
      if (res.data.success === false) {
        signInDOM.classList.remove('d-none');
        dataList.classList.add('d-none');
      } else {
        signInDOM.classList.add('d-none');
        dataList.classList.remove('d-none');
      }
    })
  },
  created() {
    this.checkLogin();
    const logOutDOM = document.querySelector('.js-logOut');
    const signInForm = document.querySelector('.js-signInForm');
    const userPath = document.querySelector('#userPath');
    const updateDOM = document.querySelector('.js-update');
    
    // 在這層的 this 指向此物件，利用 .bind() 傳入之後就能正確抓取，否則會指向該 DOM
    logOutDOM.addEventListener('click', this.logOut.bind(this));
    signInForm.addEventListener('submit', this.signIn.bind(this));
    userPath.addEventListener('input', Event => {
      this.data.path = Event.target.value;
    })
    updateDOM.addEventListener('click', this.getProduct.bind(this));
  }
}
app.created();





