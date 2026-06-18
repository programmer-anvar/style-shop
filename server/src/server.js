const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helment = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { errorHandler, notFound} = require('./middleware/errorMiddleware');
const orderRoutes = require('./routes/orderRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const uploadRoutes = require('./routes/uploadRoutes')

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(helment());
app.use(morgan('dev'));
app.use('/api/upload', uploadRoutes)
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
  res.json({ message: 'Styleshop API ishlayapti' })
})

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishlayapti`)
})