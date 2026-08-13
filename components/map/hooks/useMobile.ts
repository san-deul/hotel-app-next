import { useEffect, useRef, useState } from "react";

export function useMobile() {

  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);


  useEffect(() => {
    const checkMobile = () => {

      const val = window.innerWidth <= 1028; // false true ,

      setIsMobile(val);
      isMobileRef.current = val;

    }

    checkMobile();
    window.addEventListener(
      "resize",
      checkMobile
    );


    return () => {
      window.removeEventListener(
        "resize",
        checkMobile
      );
    }
  }, []);

  return {
    isMobile,
    isMobileRef
  }
}
