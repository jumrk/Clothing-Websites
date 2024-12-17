const express = require('express');
const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const route = require('./routes/index');
const methodOverride = require('method-override');

// Connect to DB
const db = require('./config/db');
db.connect();

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// method Override
app.use(methodOverride('_method'))
// Middleware for parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// HTTP Logger
app.use(morgan('dev'));

// Template Engine
app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes
const authRoutes = require('./routes/authRouter');
app.use(authRoutes);
route(app);
// Start Server
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`),
);
