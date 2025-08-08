import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.product);
  const user = useSelector((state) => state.user.user);
  const [size, setSize] = useState("");
  const { id } = useParams();
  const [sizeError, setSizeError] = useState(false);
  const navigate = useNavigate();

  const addItemToCart = () => {
    // 사이즈를 아직 선택안했다면 에러
    if (!size) {
      setSizeError(true);
      return;
    }
    // 아직 로그인을 안한유저라면 로그인페이지로
    if (!user) {
      navigate("/login");
      return;
    }
    // 카트에 아이템 추가하기
    dispatch(addToCart({ id, size }));
  };
  const selectSize = (value) => {
    // 사이즈 추가하기
    if (sizeError) setSizeError(false);
    setSize(value);
  };

  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [id, dispatch]);

  if (loading || !selectedProduct)
    return (
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );
  return (
    <Container className="product-detail-card">
      <Row>
        <Col sm={6}>
          <img src={selectedProduct.image} className="w-100" alt="" />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-info">{selectedProduct.name}</div>
          <div className="product-info">
            ₩ {currencyFormat(selectedProduct.price)}
          </div>
          <div className="product-info">{selectedProduct.description}</div>

          <select
            id="sizeSelect"
            className={`form-select ${sizeError ? "is-invalid" : ""}`}
            value={size}
            onChange={(e) => selectSize(e.target.value)}
          >
            <option value="">사이즈 선택</option>
            {Object.keys(selectedProduct.stock).map((item, index) => (
              <option
                key={index}
                value={item}
                disabled={selectedProduct.stock[item] <= 0}
              >
                {item.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="warning-message">
            {sizeError && "사이즈를 선택해주세요."}
          </div>
          <Button variant="dark" className="add-button" onClick={addItemToCart}>
            추가
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
