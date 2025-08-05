import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
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
      <Row>
        {productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
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
      </Row>
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
    </Container>
  );
};

export default LandingPage;
