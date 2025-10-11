import React, { useEffect } from "react";

const ChatBox: React.FC = () => {
  useEffect(() => {
    // Create script tag for Tawk.to widget
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/67e3bba4591d01190a171ab1/1in8p9uud";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Insert the script tag before the first existing script tag on the page
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Optionally return a cleanup function to remove the script if the component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []); // Empty dependency array to run only once on mount

  return <div></div>;
};

export default ChatBox;
