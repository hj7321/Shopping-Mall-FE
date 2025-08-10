import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleQtyChange = (id, value) => {
    dispatch(updateQty({ id, value }));
  };

  const deleteCart = (id) => {
    dispatch(deleteCartItem(id));
  };

  return (
    <div className="p-[10px] bg-[#eeeeee] mb-[10px] rounded-[6px]">
      <Row>
        <Col md={2} xs={12}>
          <img
            src={item.productId.image}
            width={112}
            alt="product"
            className="rounded-[4px]"
          />
        </Col>
        <Col md={10} xs={12}>
          <div className="relative display-flex space-between">
            <h3 className="font-suit-700 text-[24px]">{item.productId.name}</h3>
            <button className="absolute right-[10px]">
              <FontAwesomeIcon
                icon={faTrash}
                width={16}
                onClick={() => deleteCart(item._id)}
              />
            </button>
          </div>

          <div className="font-suit-400">
            사이즈 :{" "}
            <span className="font-suit-600">{item.size.toUpperCase()}</span>
          </div>
          <div className="font-suit-400">
            가격 :{" "}
            <span className="font-suit-600">
              {currencyFormat(item.productId.price * item.qty)}원
            </span>
          </div>
          <div className="font-suit-400 flex items-center gap-2 text-black">
            <span>수량:</span>
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
