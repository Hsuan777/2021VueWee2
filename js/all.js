const signInDOM   = document.querySelector('.js-signIn');
const dataList    = document.querySelector('.js-dataList');
const productList = document.querySelector('.js-productList');
const logOutDOM   = document.querySelector('.js-logOut');
const signInForm  = document.querySelector('.js-signInForm');
const app = {
  data: {
    url: 'https://vue3-course-api.hexschool.io',
    path: 'vs',
    originProductsData: [],
    hasLogin: false
  },
  getProduct() {
    axios.get(`${this.data.url}/api/${this.data.path}/admin/products?page=1`).then(res => {
      if (res.data.success && this.hasLogin) {
        this.data.originProductsData = res.data.products;
        this.productRender();
        this.switchLoginDOM();
      } else {
        console.log(res.data.message);
      }
    }).catch(() => {
      console.log('取得資料失敗');
    })
  },
  deleteProduct(itemId) {
    axios.delete(`${this.data.url}/api/${this.data.path}/admin/product/${itemId}`).then(res => {
      if (res.data.success) {
        this.getProduct();
      } else {
        console.log(res.data.message);
      }
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
    let [username, password] = Event.target;
    axios.post(`${this.data.url}/admin/signin`, {username : username.value, password : password.value}).then(res => {
      // const token = res.data.token;
      // const expired = res.data.expired;
      // 改為物件解構時，指派的變數名稱必須是該物件的屬性名稱，否則值為預設值 undefined
      const {token, expired} = res.data
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/` ;
      if (res.data.success) {
        this.hasLogin = true
        this.getProduct();
      } else {
        this.hasLogin = false
        this.switchLoginDOM();
        console.log(res.data.message);
      }
      Event.target.reset();
    }).catch(() => {
      this.switchLoginDOM();
      console.log(res.data.message);
    })
  },
  logOut() {
    axios.post(`${this.data.url}/logout`).then(res => {
      if (res.data.success) {
        document.cookie = `hexToken=; expires=; path=/`;
        this.hasLogin = false;
        this.switchLoginDOM();
        this.data.originProductsData = [];
      } else {
        console.log(res.data.message);
      }
    }).catch(res => {
      console.log(res.data.message);
    })
  },
  checkLogin() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(`${this.data.url}/api/user/check`).then(res => {
      if (res.data.success) {
        this.hasLogin = true;
        // 若在此執行 DOM 切換，會有非同步問題
        this.getProduct();
      } else {
        this.hasLogin = false;
        this.switchLoginDOM();
        console.log(res.data.message);
      }
    }).catch(res => {
      console.log(res.data.message);
    })
  },
  switchLoginDOM() {
    if (this.hasLogin) {
      signInDOM.classList.add('d-none');
      dataList.classList.remove('d-none');
    } else {
      signInDOM.classList.remove('d-none');
      dataList.classList.add('d-none');
    }
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





