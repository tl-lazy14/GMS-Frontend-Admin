import { Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { styled } from "@mui/material/styles";
import CircleIcon from "@mui/icons-material/Circle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";

const ImageSliderItem = styled("img")(({ heightImage }) => ({
  maxWidth: "100%",
  height: heightImage === "DetailGymDialog" ? '40vh' : '75vh',
  objectFit: "cover",
  borderRadius: 16,
}));

const NextArrow = styled(ChevronRightIcon)(() => ({
  position: "absolute",
  right: 10,
  fontSize: 70,
  fontWeight: 900,
  color: "white",
  opacity: 0.5,
  transition: "0.3s",
  "&:hover": {
    color: "white",
    opacity: 1,
  },
}));

const PrevArrow = styled(ChevronLeftIcon)(() => ({
  position: "absolute",
  left: 10,
  fontSize: 70,
  fontWeight: 900,
  color: "white",
  opacity: 0.5,
  transition: "0.3s",
  zIndex: 1,
  "&:hover": {
    color: "white",
    opacity: 1,
  },
}));

const IndicatorItem = styled(CircleIcon)(() => ({
  position: "absolute",
  bottom: 40,
  fontSize: 14,
  color: "white",
  transition: 0.3,
  "&:hover": {
    opacity: 0.8,
  },
}));

const ImageSlider = ({ images, nameComponent }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = {
    customPaging: function (i) {
      return (
        <IndicatorItem
          sx={{
            opacity: i === activeIndex ? `1 !important` : 0.5,
          }}
        />
      );
    },
    beforeChange: (oldIndex, newIndex) => {
      setActiveIndex(newIndex);
    },
    dots: images.length > 1 ? true : false,
    infinite: images.length > 1 ? true : false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <Box
        sx={{ maxWidth: "100%", position: "relative", marginBottom: "-4px" }}
      >
        <Slider {...settings}>
          {images.map((img, idx) => (
            <ImageSliderItem heightImage={nameComponent} key={idx} src={img} alt="ImageSlider" />
          ))}
        </Slider>
      </Box>
    </>
  );
};

export default ImageSlider;
