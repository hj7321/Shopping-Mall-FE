import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import {
  updateCart,
  deleteCartItem,
  toggleCartItem,
} from "../../../features/cart/cartSlice";
import { useNavigate } from "react-router";

const CartProductCard = ({ item, isChecked }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToProductDetail = () => {
    navigate(`/product/${item.productId._id}`);
  };

  const handleSizeChange = (id, newSize) => {
    dispatch(
      updateCart({ id, qty: item.qty, size: newSize, oldSize: item.size })
    );
  };

  const handleQtyChange = (id, newQty) => {
    dispatch(
      updateCart({ id, qty: newQty, size: item.size, oldQty: item.qty })
    );
  };

  const deleteCart = (id) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (isConfirmed) {
      dispatch(deleteCartItem([id]));
    }
  };

  const handleCheckboxChange = () => {
    dispatch(toggleCartItem({ itemId: item._id }));
  };

  // 재고가 있는 사이즈만 필터링
  const availableSizes = Object.entries(item.productId.stock)
    .filter(([size, stock]) => stock > 0)
    .map(([size]) => size);

  return (
    <div className="p-[10px] bg-[#eeeeee] mb-[10px] rounded-[6px] relative">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="absolute top-2 left-2 w-5 h-5"
      />
      <Row>
        <Col
          md={2}
          xs={12}
          onClick={goToProductDetail}
          style={{ cursor: "pointer" }}
        >
          <img
            src={item.productId.image}
            width={112}
            alt="product"
            className="rounded-[4px]"
          />
        </Col>
        <Col md={10} xs={12}>
          <div className="relative display-flex space-between">
            <h3
              className="font-suit-700 text-[24px]"
              onClick={goToProductDetail}
              style={{ cursor: "pointer" }}
            >
              {item.productId.name}
            </h3>
            <button className="absolute right-[10px]">
              <FontAwesomeIcon
                icon={faTrash}
                width={16}
                onClick={() => deleteCart(item._id)}
              />
            </button>
          </div>

          <div className="font-suit-400 flex items-center gap-2 text-black">
            <span>사이즈 : </span>
            <select
              value={item.size}
              onChange={(e) => handleSizeChange(item._id, e.target.value)}
              className="inline-block border rounded bg-white h-[24px] text-[12px] leading-[1] py-[2px] pr-[18px] pl-[6px] w-[80px] align-middle"
            >
              {availableSizes.map((sizeOption) => (
                <option key={sizeOption} value={sizeOption}>
                  {sizeOption.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="font-suit-400">
            가격 :{" "}
            <span className="font-suit-600">
              {currencyFormat(item.productId.price * item.qty)}원
            </span>
          </div>
          <div className="font-suit-400 flex items-center gap-2 text-black">
            <span>수량 : </span>
            <select
              value={item.qty ?? 1}
              onChange={(e) =>
                handleQtyChange(item._id, Number(e.target.value))
              }
              className="inline-block border rounded bg-white h-[24px] text-[12px] leading-[1] py-[2px] pr-[18px] pl-[6px] w-[80px] align-middle"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
