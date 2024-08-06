export const getFirstParagraph = (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const firstParagraph = doc.querySelector("p");

  return firstParagraph ? firstParagraph.outerHTML : "";
};

export const convertToEmbedUrl = (youtubeUrl) => {
  // Kiểm tra xem URL có chứa "watch?v=" hay không
  if (youtubeUrl.includes("watch?v=")) {
    // Tách id video từ URL
    const videoId = youtubeUrl.split("watch?v=")[1];

    // Tạo URL embed
    return `https://www.youtube.com/embed/${videoId}`;
  } else {
    // Nếu URL đã ở dạng embed, trả về nguyên bản
    return youtubeUrl;
  }
};

export const formatOperatingHours = (operatingTime) => {
  let result = "";
  const days = Object.keys(operatingTime);
  let currentStartDay = null;
  let currentEndDay = null;
  let currentTime = null;
  let groupedHours = [];

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const time = operatingTime[day];

    if (
      currentStartDay === null &&
      currentEndDay === null &&
      currentTime === null
    ) {
      currentStartDay = day;
      currentEndDay = day;
      currentTime = time;
    } else if (time === currentTime) {
      currentEndDay = day;
    } else {
      if (currentStartDay === currentEndDay) {
        groupedHours.push(`${currentStartDay}: ${currentTime}`);
      } else {
        groupedHours.push(
          `${currentStartDay} - ${currentEndDay}: ${currentTime}`
        );
      }
      currentStartDay = day;
      currentEndDay = day;
      currentTime = time;
    }
  }

  if (currentStartDay === currentEndDay) {
    groupedHours.push(`${currentStartDay}: ${currentTime}`);
  } else {
    groupedHours.push(`${currentStartDay} - ${currentEndDay}: ${currentTime}`);
  }

  result = groupedHours.join("\n");
  return result;
};

export const formatPhone = (str) => {
  const len = str.length;
  if (len === 10) {
    return str.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2 $3");
  } else if (len === 11) {
    return str.replace(/(\d{3})(\d{4})(\d{4})/, "($1) $2 $3");
  } else {
    return str;
  }
};

export const formatCurrency = (value) => {
  if (value == null) return "";

  const [integerPart, decimalPart] = value.toString().split(".");

  let formattedValue;

  // Nếu phần nguyên có từ 7 chữ số trở lên, định dạng thành K
  if (integerPart.length >= 7) {
    const thousands = Math.round(value / 1000);
    formattedValue = `${thousands}K`;
  } else {
    // Format phần nguyên với dấu '.'
    formattedValue = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Thêm phần thập phân nếu có
    if (decimalPart) {
      formattedValue += "." + decimalPart.padEnd(2, "0");
    }
  }

  return formattedValue;
};
