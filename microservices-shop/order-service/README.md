# Order Service

Service quản lý đơn hàng cho hệ thống microservices shop.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình môi trường:
- Tạo file `.env` với các biến môi trường sau:
```
PORT=3002
MONGO_URI=mongodb://localhost:27017/order_db
PRODUCT_SERVICE_URL=http://localhost:3001
```

3. Chạy MongoDB:
- Đảm bảo MongoDB đã được cài đặt và đang chạy trên máy local
- Hoặc sử dụng MongoDB Atlas (cloud)

4. Khởi động service:
```bash
npm start
```

## API Endpoints

### Tạo đơn hàng mới
- **POST** `/orders`
- Body:
```json
{
    "customerId": "customer123",
    "items": [
        {
            "productId": "product123",
            "quantity": 2
        }
    ]
}
```

### Lấy danh sách đơn hàng
- **GET** `/orders`

### Lấy chi tiết đơn hàng
- **GET** `/orders/:id`

### Cập nhật trạng thái đơn hàng
- **PATCH** `/orders/:id/status`
- Body:
```json
{
    "status": "confirmed"
}
```
- Các trạng thái có thể: pending, confirmed, shipped, delivered, cancelled

### Hủy đơn hàng
- **DELETE** `/orders/:id` 