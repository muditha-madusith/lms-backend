const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const borrwingRoutes =  require('./routes/borrowingRoutes');
require('dotenv').config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use('/book', bookRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/borrowings', borrwingRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
