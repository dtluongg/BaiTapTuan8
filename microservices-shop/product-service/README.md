# Product Service

Service quản lý sản phẩm cho hệ thống microservices shop.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình môi trường:
- Tạo file `.env` với các biến môi trường sau:
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/product_db
```

3. Chạy MongoDB:
- Đảm bảo MongoDB đã được cài đặt và đang chạy trên máy local
- Hoặc sử dụng MongoDB Atlas (cloud)

4. Khởi động service:
```bash
npm start
```

## API Endpoints

### Tạo sản phẩm mới
- **POST** `/products`
- Body:
```json
{
    "name": "Tên sản phẩm",
    "price": 100000,
    "description": "Mô tả sản phẩm",
    "stock": 10
}
```

### Lấy danh sách sản phẩm
- **GET** `/products`

### Lấy chi tiết sản phẩm
- **GET** `/products/:id`

### Cập nhật sản phẩm
- **PUT** `/products/:id`
- Body: Tương tự như tạo mới

### Xóa sản phẩm
- **DELETE** `/products/:id` 