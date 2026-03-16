import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Stack,
  Avatar,
  useTheme
} from "@mui/material";
import ArticleForm from "./PostDetails/ArticleForm";
import ArticleList from "./PostDetails/ArticleList";
import {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../../api/articleService";
import { useAuth } from "../../../context/authContext";
import { Description } from "@mui/icons-material";

export default function ArticlePage() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(
   null
    );
  const [openForm, setOpenForm] = useState(false);
  const { user,loadUser } = useAuth();
  const theme = useTheme();

  const loadArticles = async () => {
    const res = await getAllArticles();
    setArticles(res.data.data);
  };

  useEffect(() => {
    loadArticles();
    loadUser();
  }, []);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedArticle(null);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setOpenForm(true);
  };

  const handleDelete = async (article) => {
    await deleteArticle(article.id);
    loadArticles();
  };

  const handleSubmit = async (data, imageData, fileName) => {
    data.imageData = imageData;
    data.fileName = fileName;

    const cleanData = {
      title: data.title,
      content: data.content,
      status: data.status,
      imageData: selectedArticle && imageData.includes(selectedArticle.imageUrl) ? selectedArticle.imageUrl : imageData,
      fileName : fileName,
      articleType: data.articleType,
      createdByAdminId: user.id,
    };

    try {
      if (selectedArticle) {
        const res = await updateArticle(selectedArticle.id, cleanData);
      } else {
        const res =await createArticle(cleanData);
      }

      setOpenForm(false);
      setSelectedArticle(null);
      loadArticles();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Container sx={{marginTop: 4}}>
      <Card
        elevation={0}
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 56,
                height: 56
              }}
            >
              <Description sx={{ fontSize: 32 }} />
            </Avatar>
            <div>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Quản lý bài viết
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Thêm, chỉnh sửa, và quản lý các bài viết trên hệ thống
              </Typography>
            </div>
          </Stack>
        </CardContent>
      </Card>
      <Divider sx={{ my: 2 }} />
      <Button variant="contained" onClick={handleOpenForm}>
        Thêm bài viết
      </Button>
      <ArticleList
        articles={articles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      ></ArticleList>
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>
          {selectedArticle  ?  "Cập nhật bài viết" : "Thêm bài viết" }
        </DialogTitle>
        <DialogContent>
          <ArticleForm
            onSubmit={handleSubmit}
            initialValues={selectedArticle }
          ></ArticleForm>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ width: "100px" }}
            variant="contained"
            onClick={handleCloseForm}
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
