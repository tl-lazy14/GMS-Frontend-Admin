import { Box, Button, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
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

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  flexGrow: 1,
  gap: 15,
}));

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  color: "white",
  fontWeight: 500,
}));

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  color: "white",
}));

const socialMedia = [
  { name: "facebook", icon: <FaFacebook /> },
  { name: "youtube", icon: <FaYoutube /> },
  { name: "instagram", icon: <FaInstagram /> },
  { name: "twitter", icon: <FaXTwitter /> },
  { name: "tiktok", icon: <FaTiktok /> },
  { name: "pinterest", icon: <FaPinterest /> },
  { name: "linkedin", icon: <FaLinkedin /> },
];

const BrandInfoPage = () => {
  useScrollToTop();

  const [data, setData] = useState({});

  const navigate = useNavigate();

  const getBrandInfo = async () => {
    try {
      const response = await axios.get("https://eagle-fits.onrender.com/gms/api/v1/brand/get-brand-info");
      setData({
        brandLogo: response.data.logo,
        brandName: response.data.nameBrand,
        hotline: response.data.hotline,
        email: response.data.email,
        businessAddress: response.data.businessAddress,
        taxCode: response.data.taxCode,
        dayPassFee: response.data.dayPassFee,
        bankAccounts: JSON.parse(response.data.bankAccounts),
        mediaLink: JSON.parse(response.data.mediaLink)
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBrandInfo();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        minHeight: "89.5vh",
        boxSizing: "border-box",
        px: 5,
        py: 3,
      }}
    >
      <Box display="flex" justifyContent="end">
        <ToolButton sx={{ px: 3 }} startIcon={<EditIcon />} onClick={() => navigate('/brand-info/edit')}>
          Edit
        </ToolButton>
      </Box>

      <Box
        sx={{
          my: 4,
          backgroundColor: "#221551",
          borderRadius: 4,
          p: 3,
          border: "1px solid #ddd",
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "white",
            fontSize: 25,
            fontWeight: 600,
          }}
        >
          General Information
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            mx: 10,
            my: 3,
          }}
        >
          <FieldContainer>
            <TitleField>Brand logo:</TitleField>
            <img
              src={data.brandLogo}
              alt="logo trademark"
              style={{ maxWidth: 190 }}
            />
          </FieldContainer>
          <Box
            sx={{
              display: "flex",
              gap: 20,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <FieldContainer>
                <TitleField>Brand name:</TitleField>
                <TextStyled>{data.brandName}</TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleField>Email:</TitleField>
                <TextStyled>{data.email}</TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleField>Hotline:</TitleField>
                <TextStyled>{data.hotline}</TextStyled>
              </FieldContainer>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                justifyContent: "start",
              }}
            >
              <FieldContainer sx={{ alignItems: "start" }}>
                <TitleField>Address:</TitleField>
                <TextStyled>{data.businessAddress}</TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleField>Tax code:</TitleField>
                <TextStyled>{data.taxCode}</TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleField>Day pass fee:</TitleField>
                <TextStyled>{data.dayPassFee} $</TextStyled>
              </FieldContainer>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 3, my: 4 }}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            p: 3,
            border: "1px solid #ddd",
            flexGrow: 1,
            flexBasis: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              color: "#343c6a",
              fontSize: 25,
              fontWeight: 600,
            }}
          >
            Payment Information
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              my: 5,
            }}
          >
            {data.bankAccounts?.map((item, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 3 }}>
                <img src={item.qrCode} alt="qr code bank" width={180} />
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 18,
                    }}
                    gutterBottom
                  >
                    Bank: {item.bank}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 18,
                    }}
                    gutterBottom
                  >
                    Account number: {item.accNumber}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 18,
                    }}
                    gutterBottom
                  >
                    Account owner: {item.owner}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            p: 3,
            border: "1px solid #ddd",
            flexGrow: 1,
            flexBasis: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              color: "#343c6a",
              fontSize: 25,
              fontWeight: 600,
            }}
          >
            Social Media
          </Typography>

          <List sx={{ my: 2 }}>
            {data.mediaLink && socialMedia.map((media) => {
              const url = data.mediaLink[media.name];
              if (url) {
                return (
                  <ListItem key={media.name} sx={{ mb: 1 }}>
                    <ListItemIcon title={`${media.name}`} sx={{ fontSize: 40, color: '#221551' }}>{media.icon}</ListItemIcon>
                    <ListItemText>
                      <Link
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ fontFamily: "'Outfit Variable', sans-serif", fontSize: 17 }}
                      >
                        {url}
                      </Link>
                    </ListItemText>
                  </ListItem>
                );
              }
              return null;
            })}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default BrandInfoPage;
