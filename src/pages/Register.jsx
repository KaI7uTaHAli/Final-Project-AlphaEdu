import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Box,
  Paper,
  Link as MuiLink,
} from "@mui/material";
import { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, password } = formData;

    if (!firstName || firstName.trim().length < 3) {
      toast.error("Имя должно содержать минимум 3 символа.");
      return false;
    }

    if (!lastName || lastName.trim().length < 3) {
      toast.error("Фамилия должна содержать минимум 3 символа.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Введите корректный email.");
      return false;
    }

    if (!password || password.length < 6) {
      toast.error("Пароль должен содержать минимум 6 символов.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { firstName, lastName, email, password } = formData;

    setLoading(true);

    try {
      const registerData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      console.log("Отправка данных на регистрацию:", registerData);

      const response = await axiosInstance.post(
        "/api/users/register",
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Регистрация прошла успешно, теперь логиним
      const loginRes = await axiosInstance.post("/api/users/login", {
        email: email.trim(),
        password: password.trim(),
      });

      if (loginRes?.data) {
        localStorage.setItem("user", JSON.stringify(loginRes.data));
        toast.success("Добро пожаловать!");
        navigate("/");
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error.response || error);
      if (error.response?.status === 409) {
        toast.error("Пользователь с таким email уже существует");
      } else if (error.response?.status === 422) {
        toast.error("Ошибка регистрации. Неверные данные или формат.");
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) =>
          toast.error(err.msg)
        );
      } else {
        toast.error("Произошла ошибка. Попробуйте снова.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              fullWidth
              required
              label="Имя"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              label="Фамилия"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
            <MuiLink component={Link} to="/login" variant="body2">
              Уже зарегистрированы? Войти
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;