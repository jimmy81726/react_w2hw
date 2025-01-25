import { useState } from "react";

// import "./App.css";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;
// 記得env檔案要放在外層
function App() {
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setAuth] = useState(false);
  // 成功登入改狀態,為了顯示首頁面用
  const [products, setProducts] = useState([]);
  // 取得所有資料用
  const [tempProduct, setTempProduct] = useState({});
  // 當選擇看單一產品細節的時候用

  const handleKeyin = (e) => {
    const { id, value } = e.target;
    setAccount((data) => ({
      ...data,
      // 一定要展開式不然會整個蓋過去而不是更改
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/v2/admin/signin`, account);
      setAuth(true);
      // 登入成功後改狀態再依條件渲染
      const { expired, token } = res.data;
      document.cookie = `token=${token}; expires=${new Date(expired)}`;
      // 將登入成功的臨時身分證存起來給別的方法用
      axios.defaults.headers.common["Authorization"] = token;
      // 把header給預設好
      getProducts();
      // 當然是成功登入後再取得資料
    } catch (error) {
      alert("登入失敗囉!");
      console.dir(error);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(`${url}/v2/api/${api_path}/admin/products/`);
      // api來調用產品資料,已預設header,注意products/all取得的不是陣列不能.map
      setProducts(res.data.products);
      // 更新狀態後再渲染一次,取得產品資料
    } catch (error) {
      console.error(err.response.data.message);
    }
  };

  const checkLogin = async () => {
    try {
      const res = await axios.post(`${url}/v2/api/user/check`, account);
      alert("現在狀態:已登入");
    } catch (error) {
      console.error(err.response.data.message);
    }
  };

  return (
    <>
      {isAuth ? (
        <div className="container py-5">
          <div className="row">
            <div className="col-6">
              <button className="btn btn-warning " onClick={checkLogin}>
                驗證登入狀態
              </button>
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled}</td>
                      <td>
                        <button
                          onClick={() => setTempProduct(product)}
                          // 若點擊,把當下迴圈到的product送出去
                          className="btn btn-primary"
                          type="button"
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <h2>單一產品細節</h2>
              {tempProduct.title ? (
                <div className="card">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top img-fluid"
                    alt={tempProduct.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge text-bg-primary">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <p className="card-text">
                      <del>{tempProduct.origin_price} 元</del> /{" "}
                      {tempProduct.price} 元
                    </p>
                    <h5 className="card-title">更多圖片：</h5>
                    {tempProduct.imagesUrl?.map(
                      (image) =>
                        image && (
                          <img key={image} src={image} className="img-fluid" />
                        )
                    )}
                  </div>
                </div>
              ) : (
                <p>請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input
                value={account.username}
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                onChange={handleKeyin}
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                value={account.password}
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                onChange={handleKeyin}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" className="btn btn-primary">
              登入
            </button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App;
