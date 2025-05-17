import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Обработчик для Google OAuth редиректа
app.get('/redirect', (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.send('Нет кода авторизации!');
  }
  res.send('Google вернул вас сюда! Ваш code: ' + code);
});

// Обработчик для обмена code на токены
app.post('/api/auth/google', async (req, res) => {
  const { code } = req.body;
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });
    res.json(response.data); // access_token, refresh_token, id_token и т.д.
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обмена кода на токен', details: err.response?.data });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend запущен на порту ${PORT}`));