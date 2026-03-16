import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Avatar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";


export default function ArticleList({articles,  onEdit, onDelete }) {



  if (!articles || articles.length === 0) {
    return (
      <Typography
        variant="body1"
        color="text.secondary"
        mt={2}
        textAlign="center"
      >
        Không có bài viết nào.
      </Typography>
    );
  }


  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center"><Typography variant="h6">Ảnh</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Tiêu đề</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Loại</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Trạng thái</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Nội dung</Typography></TableCell>
            <TableCell align="center"><Typography variant="h6">Hành động</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell align="center">

                <Avatar variant="rounded" src={"http://localhost:8090/" + article.imageUrl} alt={article.title} />

              </TableCell>
              <TableCell align="center">{article.title}</TableCell>
              <TableCell align="center">{article.articleType}</TableCell>
              <TableCell align="center">
                {article.status}

              </TableCell>
              <TableCell align="center">
                {article.content?.length > 50
                  ? article.content.substring(0, 50) + "..."
                  : article.content}
              </TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onEdit(article)}>
                  <Edit />
                </IconButton>

                <IconButton color="error" onClick={() => onDelete(article)}>

                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
