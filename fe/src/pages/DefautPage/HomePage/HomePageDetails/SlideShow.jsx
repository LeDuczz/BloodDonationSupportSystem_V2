import { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const slides = [
  {
    image: "/banner/banner1.jpg",
    caption: "Hinh 1",
  },
  {
    image: "/banner/banner2.jpg",
    caption: "Hinh 2",
  },

];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        marginTop: "64px",
        width: "100%",
        height: "400px",
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            display: index === current ? "block" : "none",
            width: "100%",
            height: "100%",
            position: "absolute",
            transition: "all 0.5s ease-in-out",
          }}
        >
          <img
            src={slide.image}
            alt={slide.caption}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      ))}

      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "40%",
          height: "100px",
          width: "100px",
          left: 16,
          color: "black",
          zIndex: 1,
        }}
      >
        <ArrowBackIos />
      </IconButton>
      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          height: "100px",
          width: "100px",
          top: "40%",
          right: 16,
          color: "black",
          zIndex: 1,
        }}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default Banner;
