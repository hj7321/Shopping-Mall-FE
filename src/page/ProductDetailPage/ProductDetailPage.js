import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
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
  // const selectSize = (value) => {
  //   // 사이즈 추가하기
  //   if (sizeError) setSizeError(false);
  //   setSize(value);
  // };

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
    <Container className="mb-[100px]">
      <Row>
        <Col sm={6}>
          <img
            src={selectedProduct.image}
            className="w-100 rounded-[6px] mt-[8px]"
            alt=""
          />
        </Col>
        <Col className="" sm={6}>
          <div className="font-suit-700 text-[28px]">
            {selectedProduct.name}
          </div>
          <div className="font-suit-400 text-[20px]">
            {currencyFormat(selectedProduct.price)}원
          </div>
          <div className="mt-[10px]">{selectedProduct.description}</div>

          <div className="mt-[20px]">
            <div className="font-suit-400 text-[14px] mb-[6px]">
              사이즈 선택
            </div>
            <div className="flex gap-[10px] font-suit-600">
              {Object.keys(selectedProduct.stock).map((item) => {
                const isDisabled = selectedProduct.stock[item] <= 0;
                const isSelected = size === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (isDisabled) return;
                      setSizeError(false);
                      setSize((prev) => (prev === item ? "" : item));
                    }}
                    disabled={isDisabled}
                    className={[
                      "px-[20px] py-[8px] border rounded-[4px] transition-colors",
                      "focus:outline-none focus:ring-0",
                      // isSelected가 true일 때만 bg-black 적용
                      isSelected
                        ? "bg-black text-white"
                        : // isSelected가 false일 때 hover 효과 적용
                          "bg-white text-black hover:bg-[#cccccc]",
                      isDisabled ? "opacity-50 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {item.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <div className="warning-message">
              {sizeError && "사이즈를 선택해주세요."}
            </div>
          </div>
          <button
            className="mt-[10px] w-full bg-[#484848] hover:bg-black text-white py-[8px] rounded-[4px]"
            onClick={addItemToCart}
          >
            장바구니에 추가
          </button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
