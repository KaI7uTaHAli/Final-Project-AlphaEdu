import {
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/profile");
        console.log("Ответ от сервера:", response.data); // Отладочный вывод

        // Проверяем структуру данных
        setProfile(response.data);
        setBio(response.data.bio || "");
        setAvatarUrl(response.data.avatar || "");
      } catch (err) {
        console.error("Ошибка при получении профиля", err);
      }
    };

    fetchProfile();
  }, []);

  const handleBioSave = async () => {
    try {
      const response = await axiosInstance.put(`/api/profile/${profile._id}`, { bio });
      setProfile((prev) => ({ ...prev, bio }));
    } catch (err) {
      console.error("Ошибка при обновлении биографии:", err);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axiosInstance.post(`/api/profile/${profile._id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAvatarUrl(response.data.avatar);
    } catch (err) {
      console.error("Ошибка при загрузке аватара:", err);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await axiosInstance.delete(`/api/profile/${profile._id}/avatar`);
      setAvatarUrl("");
    } catch (err) {
      console.error("Ошибка при удалении аватара:", err);
    }
  };

  if (!profile) return <Typography>Загрузка...</Typography>;

  return (
    <Paper sx={{ p: 4, mt: 4, maxWidth: 600, mx: "auto" }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Avatar src={avatarUrl} sx={{ width: 100, height: 100 }} />
        <Button variant="contained" component="label">
          Загрузить аватар
          <input type="file" hidden onChange={handleAvatarUpload} />
        </Button>
        {avatarUrl && (
          <Button color="error" onClick={handleAvatarDelete}>
            Удалить аватар
          </Button>
        )}

        <Divider sx={{ my: 2, width: "100%" }} />

        <Typography variant="h6">
          {profile.firstName} {profile.lastName}
        </Typography>

        <TextField
          label="О себе"
          multiline
          rows={4}
          fullWidth
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <Button variant="contained" onClick={handleBioSave}>
          Сохранить
        </Button>
      </Box>
    </Paper>
  );
};

export default Profile;