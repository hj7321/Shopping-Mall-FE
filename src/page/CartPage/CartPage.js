import { useEffect, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { getCartList, toggleAllItems } from "../../features/cart/cartSlice";

const CartPage = () => {
  const { cartList, selectedCartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    //카트리스트 불러오기
    dispatch(getCartList());
  }, [dispatch]);

  const selectedItems = useMemo(() => {
    return cartList.filter((item) => selectedCartItems.includes(item._id));
  }, [cartList, selectedCartItems]);

  const selectedItemsTotalPrice = useMemo(() => {
    return selectedItems.reduce(
      (total, item) => total + item.productId.price * item.qty,
      0
    );
  }, [selectedItems]);

  const handleAllCheckboxChange = (e) => {
    dispatch(toggleAllItems({ checked: e.target.checked }));
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={7}>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={
                selectedCartItems.length === cartList.length &&
                cartList.length > 0
              }
              onChange={handleAllCheckboxChange}
              className="checkbox-large"
            />
            <span className="font-suit-600">전체 선택</span>
          </div>
          {cartList.length > 0 ? (
            cartList.map((item) => (
              <CartProductCard
                key={item._id}
                item={item}
                isChecked={selectedCartItems.includes(item._id)}
              />
            ))
          ) : (
            <div className="text-align-center empty-bag">
              <h2>카트가 비어있습니다.</h2>
              <div>상품을 담아주세요!</div>
            </div>
          )}
        </Col>
        <Col xs={12} md={5}>
          <OrderReceipt
            cartList={selectedItems}
            totalPrice={selectedItemsTotalPrice}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
