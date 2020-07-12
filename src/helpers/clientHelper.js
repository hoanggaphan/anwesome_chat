import moment from "moment";

export let bufferToBase64 = (bufferFrom) => {
  return Buffer.from(bufferFrom).toString("base64");  
}

export let lastItemFromArr = (arr) => {
  if(!arr.length) return [];
  return arr[arr.length - 1];
}

export let convertTimestampHumanTime = (timestamp) => {
  if(!timestamp) {
    return "";
  }
  return moment(timestamp).locale("vi").startOf("seconds").fromNow();    
}
