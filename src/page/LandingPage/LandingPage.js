import { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Container } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate";
import { ColorRing } from "react-loader-spinner";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const productList = useSelector((state) => state.product.productList);
  const totalPageNum = useSelector((state) => state.product.totalPageNum);
  const loading = useSelector((state) => state.product.loading);
  const name = query.get("name");
  const page = query.get("page") || 1;

  const handlePageClick = ({ selected }) => {
    const params = new URLSearchParams(query);
    params.set("page", selected + 1);
    navigate(`?${params.toString()}`);
  };

  useEffect(() => {
    dispatch(
      getProductList({
        name,
        page,
      })
    );
  }, [query, dispatch, name, page]);

  if (loading) {
    return (
      <div className="loader-container">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    );
  }

  return (
    <Container>
      <div
        className="w-full mx-auto
                  max-w-[310px]      
                  sm:max-w-[638.1px] 
                  lg:max-w-[966.2px] 
                  xl:max-w-[1294.3px] mb-[50px]"
      >
        <div className="flex flex-wrap justify-start gap-[18.1px]">
          {productList.length > 0 ? (
            productList.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))
          ) : (
            <div className="text-align-center empty-bag">
              {name === null || name === "" ? (
                <h2>등록된 상품이 없습니다!</h2>
              ) : (
                <h2>"{name}" 검색 결과가 없습니다.</h2>
              )}
            </div>
          )}
        </div>
        {totalPageNum > 1 && ( // 페이지가 1개 초과일 때만 페이지네이션 표시
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPageNum}
            forcePage={page - 1}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            className="display-center list-style-none"
          />
        )}
      </div>
    </Container>
  );
};

export default LandingPage;
