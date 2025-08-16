import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
  selectedCartItems: [],
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 });
      dispatch(
        showToastMessage({
          message: "카트에 아이템이 추가되었습니다.",
          status: "success",
        })
      );
      return response.data.cartItemQty;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.message || "카트에 아이템이 추가되지 않았습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete("/cart", { data: { id } });
      dispatch(
        showToastMessage({
          message: "상품이 삭제되었습니다.",
          status: "success",
        })
      );
      dispatch(getCartList());
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "상품을 삭제하지 못했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateQty",
  async ({ id, qty, size, oldQty, oldSize }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put("/cart", { id, qty, size });

      let message = "";
      if (oldQty !== qty && oldQty !== undefined) {
        message = `상품 수량 변경 성공: ${oldQty} → ${qty}`;
      } else if (oldSize !== size) {
        message = `상품 사이즈 변경 성공: ${oldSize.toUpperCase()} → ${size.toUpperCase()}`;
      }

      dispatch(
        showToastMessage({
          message,
          status: "success",
        })
      );
      dispatch(getCartList());
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "상품 수량 변경에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart/qty");
      return response.data.data;
    } catch (error) {
      dispatch(showToastMessage({ message: error.message, status: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 체크박스 클릭 시 호출될 액션
    toggleCartItem: (state, action) => {
      const { itemId } = action.payload;
      const index = state.selectedCartItems.indexOf(itemId);
      // 이미 선택된 아이템이면 배열에서 제거
      if (index > -1) state.selectedCartItems.splice(index, 1);
      // 선택되지 않은 아이템이면 배열에 추가
      else state.selectedCartItems.push(itemId);
    },
    // 전체 선택/해제 토글 액션
    toggleAllItems: (state, action) => {
      const { checked } = action.payload;
      if (checked)
        state.selectedCartItems = state.cartList.map((item) => item._id);
      else state.selectedCartItems = [];
    },
    initialCart: (state) => {
      state.cartItemCount = 0;
      state.selectedCartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload;
        state.cartItemCount = action.payload.length;
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
        // 장바구니 목록을 불러오면 전체 선택되도록 초기화
        state.selectedCartItems = action.payload.map((item) => item._id);
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload;
        state.cartItemCount = action.payload.length;
        // 삭제된 아이템 ID를 selectedCartItems에서 제거
        state.selectedCartItems = state.selectedCartItems.filter(
          (id) => !action.meta.arg.includes(id)
        );
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload;
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(getCartQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { initialCart, toggleCartItem, toggleAllItems } =
  cartSlice.actions;
