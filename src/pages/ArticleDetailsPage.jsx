import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import WestIcon from "@mui/icons-material/West";
import dayjs from "dayjs";
import QuillContent from "../components/QuillContent";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import api from "../components/axiosInterceptor";
import axios from "axios";

const ToolButton = styled(Button)(() => ({
  textTransform: "none",
  backgroundColor: "#6e34d5",
  fontSize: 17,
  fontWeight: 400,
  fontFamily: "'Outfit Variable', sans-serif",
  color: "white",
  borderRadius: 8,
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "#4919a4",
  },
}));

const Title = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 53,
  lineHeight: 1.3,
  textTransform: "capitalize",
  fontWeight: 700,
}));

const Thumbnail = styled("img")(() => ({
  width: "100%",
  height: "90vh",
  objectFit: "cover",
  borderRadius: 40,
  objectPosition: "center center",
}));

const ArticleDetailsPage = () => {
  useScrollToTop();
  const { id } = useParams();

  const parseTagString = (tagString) => {
    // Kiểm tra xem tagString có rỗng không
    if (!tagString || tagString.trim() === "") {
      return [];
    }
    const tags = tagString.split("/");
    return tags.filter((tag) => tag.trim() !== "");
  };

  const navigate = useNavigate();
  const [articleData, setArticleData] = useState({});

  const getArticle = async () => {
    try {
      const response = await axios.get(`https://eagle-fits.onrender.com/gms/api/v1/article/get-article/${id}`);
      const articleInfo = response.data;
      setArticleData({
        ...articleInfo,
        tags: parseTagString(articleInfo.tags),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const addView = async () => {
    try {
      await axios.put(`https://eagle-fits.onrender.com/gms/api/v1/article/add-view/${id}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getArticle();
    addView();
  }, []);

  const [openAlert, setOpenAlert] = useState(false);
  const [contentAlert, setContentAlert] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handlePublish = async (isPublish) => {
    // Xu ly publish bai viet
    try {
      await api.put(`/article/handle-publish/${id}`);
      setContentAlert(
        `The article has been ${
          isPublish === 1 ? "published" : "unpublished"
        } successfully!`
      );
      setOpenAlert(true);
      getArticle();
      const targetElement = document.getElementById("main-section");
      targetElement.scrollIntoView();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      id="main-section"
      sx={{
        backgroundColor: "#f5f7fa",
        minHeight: "89.5vh",
        boxSizing: "border-box",
        px: 5,
        py: 3,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "#343c6a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          Article Details
        </Typography>
        <Box display="flex" gap={2}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<WestIcon />}
            onClick={() => navigate("/articles")}
          >
            Back to List
          </ToolButton>
        </Box>
      </Box>

      <Box>
        <Title sx={{ my: 3 }}>{articleData.title}</Title>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography
              sx={{
                fontSize: 18,
                fontFamily: "'Outfit Variable', sans-serif",
                color: "#6e34d5",
              }}
            >
              Tags:
            </Typography>
            <Typography
              sx={{
                fontSize: 18,
                fontFamily: "'Outfit Variable', sans-serif",
                maxWidth: "40vw",
              }}
            >
              {articleData.tags?.length === 1
                ? articleData.tags[0]
                : articleData.tags?.join(" / ")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            {articleData.isPublish === 1 && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontFamily: "'Outfit Variable', sans-serif",
                    color: "#6e34d5",
                  }}
                >
                  Published at:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 18,
                  }}
                >
                  {dayjs(articleData.publishedAt).format("HH:mm, MMMM D, YYYY")}
                </Typography>
              </Box>
            )}

            <Typography
              sx={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 18,
                border: "2px solid #221551",
                py: 1,
                px: 2,
                borderRadius: 4,
                backgroundColor: "#221551",
                color: "white",
              }}
            >
              {articleData.category}
            </Typography>
          </Box>
        </Box>

        <Thumbnail
          src={articleData.thumbnail}
          alt="thumbnail img"
          sx={{ marginTop: 5, marginBottom: 2 }}
        />
        <Box sx={{ px: 20 }}>
          <QuillContent content={articleData.content} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<EditIcon />}
            onClick={() => navigate(`/articles/edit/${id}`)}
          >
            Edit
          </ToolButton>
          {articleData.isPublish === 0 ? (
            <ToolButton
              sx={{ px: 3 }}
              startIcon={<PublishIcon />}
              onClick={() => handlePublish(1)}
            >
              Publish now
            </ToolButton>
          ) : (
            <ToolButton
              sx={{ px: 3 }}
              startIcon={<UnpublishedIcon />}
              onClick={() => handlePublish(0)}
            >
              Unpublish now
            </ToolButton>
          )}
        </Box>
      </Box>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          variant="filled"
          sx={{
            maxWidth: "35vw",
            fontFamily: "'Outfit Variable', sans-serif",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            fontWeight: 400,
          }}
        >
          {contentAlert}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArticleDetailsPage;
