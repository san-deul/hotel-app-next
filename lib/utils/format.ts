export const formatPhone = (value: string) => {  
  const onlyNums = value.replace(/[^0-9]/g, "");
  if (onlyNums.length < 4) return onlyNums;
  if (onlyNums.length < 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
};