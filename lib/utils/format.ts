export const formatPhone = (value: string) => {  
  const onlyNums = value.replace(/[^0-9]/g, "");
  if (onlyNums.length < 4) return onlyNums;
  if (onlyNums.length < 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
};

export const formatCardNo = (value: string) => {
  const onlyNums = value.replace(/[^0-9]/g, "").slice(0, 16);
  return onlyNums.match(/.{1,4}/g)?.join("-") ?? onlyNums;
};

// 하이픈 앞에서 backspace 누르면 하이픈+숫자를 같이 지우는 핸들러

export const handleFormattedBackspace = (
  e: React.KeyboardEvent<HTMLInputElement>,
  formatter: (value: string) => string,
  onChange: (value: string) => void
) => {
  if (e.key !== "Backspace") return;

  const input = e.currentTarget;
  const cursorPos = input.selectionStart ?? 0;
  if (input.value[cursorPos - 1] !== "-") return; // 하이픈 앞이 아니면 기본 동작에 맡김

  e.preventDefault();
  const raw = input.value.slice(0, cursorPos - 2) + input.value.slice(cursorPos);
  onChange(formatter(raw));

  requestAnimationFrame(() => {
    const newPos = cursorPos - 2;
    input.setSelectionRange(newPos, newPos);
  });
};