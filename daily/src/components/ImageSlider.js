import styles from '../css/LoginForm.module.css'; // 모듈화된 CSS 파일 가져오기
import React, { useState, useEffect } from "react";
import myImage1 from '../images/calender.png';
import myImage2 from '../images/calender(1).png';
import myImage3 from '../images/calender(2).png';
import myImage4 from '../images/calender(3).png';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [myImage1, myImage2, myImage3, myImage4];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000); 
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className={styles.lfimageSlider}>
      <div
        className={styles.lfslides}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`
        }}
      >
        {images.map((image, index) => (
          <img 
            key={index} 
            src={image} 
            alt={`Slide ${index + 1}`} 
            className={styles.lfslideImage} 
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
