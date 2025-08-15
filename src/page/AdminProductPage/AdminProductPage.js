import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SearchBox from "../../common/component/SearchBox";
import NewItemDialog from "./component/NewItemDialog";
import ProductTable from "./component/ProductTable";
import {
  deleteProduct,
  getProductList,
  setSelectedProduct,
} from "../../features/product/productSlice";

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const totalPageNum = useSelector((state) => state.product.totalPageNum);
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState("new");

  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];

  const deleteItem = (id) => {
    // 아이템 삭제하기
    dispatch(deleteProduct(id));
    const currentQuery = new URLSearchParams(query);
    navigate(`?${currentQuery.toString()}`);
  };

  const openEditForm = (product) => {
    // edit모드로 설정하고
    setMode("edit");
    // 아이템 수정다이얼로그 열어주기
    dispatch(setSelectedProduct(product));
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    // new 모드로 설정하고
    setMode("new");
    // 다이얼로그 열어주기
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    const currentName = query.get("name") || "";
    const newQuery = new URLSearchParams();
    if (currentName) {
      newQuery.set("name", currentName);
    }
    newQuery.set("page", selected + 1);
    navigate(`?${newQuery.toString()}`);
  };

  // 상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(() => {
    const page = query.get("page") || 1;
    const name = query.get("name") || "";
    dispatch(getProductList({ page, name }));
  }, [query, dispatch]);

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2">
          <SearchBox
            query={query}
            navigate={navigate}
            placeholder="제품 이름으로 검색"
            field="name"
          />
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>

        <ProductTable
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum} // 전체 페이지
          forcePage={Number(query.get("page")) - 1 || 0} // 1페이지이면 2
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

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        currentPage={Number(query.get("page")) || 1}
      />
    </div>
  );
};

export default AdminProductPage;
