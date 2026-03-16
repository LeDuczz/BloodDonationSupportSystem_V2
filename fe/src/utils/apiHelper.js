export const apiResponse = async (apiFunc) => {
  try {
    const res = await apiFunc();

    return {
      success: res.data.status === 200,
      status: res.data.status === 200,
      ...res.data,
    };
  } catch (err) {
    const status = err?.response?.status || 500;

    let message = "Đã có lỗi xảy ra !!!";
    if (status === 403) {
      message = "Bạn chưa đăng nhập !!!";
    } else if (err?.response?.data?.message) {
      message = err.response.data.message;
    }
    return {
      success: false,
      status,
      message,
      data: null,
    };
  }
};
