const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Schema cho Order
const orderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    items: [{
        productId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

// API Endpoints
// Tạo đơn hàng mới
app.post('/orders', async (req, res) => {
    try {
        const { customerId, items } = req.body;
        
        // Tính tổng tiền và kiểm tra sản phẩm
        let totalAmount = 0;
        for (let item of items) {
            // Gọi Product Service để lấy thông tin sản phẩm
            const productResponse = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/products/${item.productId}`);
            const product = productResponse.data;
            
            // Kiểm tra số lượng tồn kho
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Sản phẩm ${product.name} không đủ số lượng trong kho` 
                });
            }
            
            // Cập nhật giá từ product service
            item.price = product.price;
            totalAmount += product.price * item.quantity;
        }

        const order = new Order({
            customerId,
            items,
            totalAmount
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.status(400).json({ message: error.message });
    }
});

// Lấy danh sách đơn hàng
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy chi tiết đơn hàng
app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cập nhật trạng thái đơn hàng
app.patch('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Hủy đơn hàng
app.delete('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Khởi động server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 