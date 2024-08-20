import React from 'react';
import './App.css';
import { Swiper, SwiperSlide } from 'swiper/react';

type ReviewImageProps = {
  images: string[];
  activeIndex: number;

  onMaskClick: () => void;
};
const ReviewImage: React.FC<ReviewImageProps> = (props) => {
  const { images, activeIndex, onMaskClick } = props;

  const swiperSlideElementArray = images.map((img, index) => {
    return (
      <SwiperSlide key={index}>
        <img
          onClick={(event) => {
            event.stopPropagation();
          }}
          key={index}
          src={img}
          className="lookImg"
        />
      </SwiperSlide>
    );
  });

  // 图片地址 https://pixabay.com/zh/photos/horse-animal-head-portrait-4330166/
  return (
    <div
      className="mask"
      onClick={() => {
        onMaskClick();
      }}
    >
      <Swiper initialSlide={activeIndex} slidesPerView={1}>
        {swiperSlideElementArray}
      </Swiper>
    </div>
  );
};

function App() {
  const [visible, setVisible] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const imgs = [
    'https://cdn.pixabay.com/photo/2023/11/26/23/43/horse-8414411_960_720.jpg',
    'https://cdn.pixabay.com/photo/2017/06/30/00/04/pony-2456757_640.jpg',
    'https://cdn.pixabay.com/photo/2020/06/19/08/31/haflinger-5316218_1280.jpg',
    'https://cdn.pixabay.com/photo/2019/07/11/07/01/horse-4330166_1280.jpg',
  ];

  const imageElementArray = imgs.map((img, index) => (
    <img
      src={img}
      key={index}
      onClick={() => {
        setActiveIndex(index);
        setVisible(true);
      }}
    />
  ));

  const handleOnMaskClick = () => {
    setVisible(false);
  };

  return (
    <div>
      {visible && (
        <ReviewImage
          onMaskClick={handleOnMaskClick}
          activeIndex={activeIndex}
          images={imgs}
        />
      )}
      <div className="previewImage">{imageElementArray}</div>
    </div>
  );
}

export default App;
