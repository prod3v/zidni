const readingTime = (content: string) => {
  const WPS = 275 / 60;

  let images = 0;
  const regex = /\w/;

  let words = content.split(" ").filter((word) => {
    if (word.includes("<img")) {
      images += 1;
    }
    return regex.test(word);
  }).length;

  let imageAdjust = images * 4;
  let imageSecs = 0;
  let imageFactor = 12;

  while (images) {
    imageSecs += imageFactor;
    if (imageFactor > 3) {
      imageFactor -= 1;
    }
    images -= 1;
  }

  const minutes = Math.ceil(((words - imageAdjust) / WPS + imageSecs) / 60);

  if (minutes === 1) {
    return `دقيقة واحدة للقراءة`;
  } else if (minutes === 2) {
    return `دقيقتان للقراءة`;
  } else if (minutes >= 3 && minutes <= 10) {
    return `${minutes} دقائق للقراءة`;
  } else {
    return `${minutes} دقيقة للقراءة`;
  }
};

export default readingTime;
