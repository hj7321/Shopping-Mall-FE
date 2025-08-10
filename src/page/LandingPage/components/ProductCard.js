import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <div
      className="w-[310px] h-[470px] hover:cursor-pointer hover:scale-105 transform transition-all duration-300 ease-in-out"
      onClick={() => showProduct(item._id)}
    >
      <img
        src={item?.image}
        alt=""
        className="w-[310px] h-[420px] object-cover rounded-[10px]"
      />
      <div className="font-suit-700">{item?.name}</div>
      <div className="font-suit-400 text-[#6e6e6e]">
        {currencyFormat(item?.price)}원
      </div>
    </div>
  );
};

export default ProductCard;
