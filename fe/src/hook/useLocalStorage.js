import { useState } from 'react';

/**
 * Custom hook để lưu và lấy dữ liệu từ localStorage
 * @param {string} key - Tên key trong localStorage
 * @param {any} initialValue - Giá trị mặc định nếu không có trong localStorage
 * @returns [value, setValue] - value: giá trị từ localStorage, setValue: hàm để cập nhật giá trị
 */
function useLocalStorage(key, initialValue) {
  // Kiểm tra xem có giá trị trong localStorage không
  const storedValue = localStorage.getItem(key);
  
  // Nếu có, parse ra và sử dụng, nếu không thì dùng giá trị mặc định
  const [value, setValue] = useState(() => {
    try {
      // Nếu storedValue hợp lệ, parse; nếu không có dữ liệu thì dùng giá trị mặc định
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      // Nếu có lỗi trong JSON.parse (ví dụ dữ liệu bị hỏng), trả về giá trị mặc định
      console.error("Error parsing JSON:", error);
      return initialValue;
    }
  });

  // Hàm cập nhật giá trị và lưu vào localStorage
  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

export default useLocalStorage;
