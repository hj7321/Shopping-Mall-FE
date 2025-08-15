import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import OrderDetailDialog from "./component/OrderDetailDialog";
import OrderTable from "./component/OrderTable";
import SearchBox from "../../common/component/SearchBox";
import {
  getOrderList,
  setSelectedOrder,
} from "../../features/order/orderSlice";
import "./style/adminOrder.style.css";

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { orderList, totalPageNum } = useSelector((state) => state.order);
  const [open, setOpen] = useState(false);

  const tableHeader = [
    "#",
    "Order#",
    "Order Date",
    "User",
    "Order Item",
    "Address",
    "Total Price",
    "Status",
  ];

  const openEditForm = (order) => {
    setOpen(true);
    dispatch(setSelectedOrder(order));
  };

  const handlePageClick = ({ selected }) => {
    const newQuery = new URLSearchParams();
    newQuery.set("page", selected + 1);
    navigate(`?${newQuery.toString()}`);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const page = query.get("page") || 1;
    const ordernum = query.get("ordernum") || "";
    dispatch(getOrderList({ query: { page, ordernum }, isAdmin: true }));
  }, [query, dispatch]);

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2 display-center mb-2">
          <SearchBox
            query={query}
            navigate={navigate}
            placeholder="주문 번호"
            field="ordernum"
          />
        </div>

        <OrderTable
          header={tableHeader}
          data={orderList}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={Number(query.get("page") || 1) - 1}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          pageLinkClassName="px-[16px] py-[8px] block text-gray-700 font-suit-600 no-underline"
          previousClassName=""
          previousLinkClassName="px-[16px] py-[8px] block text-gray-700 font-suit-600 no-underline"
          nextClassName=""
          nextLinkClassName="px-[16px] py-[8px] block text-gray-700 font-suit-600 no-underline"
          breakLabel="..."
          breakClassName="text-gray-500 font-suit-600"
          breakLinkClassName="px-[16px] py-[8px] block text-gray-700 font-suit-600 no-underline"
          containerClassName="flex justify-center items-center mt-4 mb-4 gap-x-2"
          activeClassName="bg-yellow-200 border-yellow-200 text-white hover:bg-yellow-400"
          className="display-center list-style-none"
        />
      </Container>

      {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
    </div>
  );
};

export default AdminOrderPage;
