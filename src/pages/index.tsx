import { Inter } from "next/font/google";
import { useState } from "react";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const editableArea = document.getElementById("editableArea");
    const savedText = localStorage.getItem("savedText");
    const savedWordCount = localStorage.getItem("savedWordCount");
    if (savedText && editableArea) {
      editableArea.innerHTML = savedText;
    }
    if (savedWordCount) {
      setWordCount(parseInt(savedWordCount));
    }
  }, []);

  const handleWordCount = () => {
    const editableArea = document.getElementById(
      "editableArea"
    ) as HTMLDivElement;
    const content = editableArea.innerText;
    const words = content.trim().split(/\s+/);
    setWordCount(words.length || 0);
    localStorage.setItem("savedText", content);
    localStorage.setItem("savedWordCount", (words.length || 0).toString());
  };

  function clearText() {
    if (window.confirm("Are you sure you want to clear the text?")) {
      const editableArea = document.getElementById(
        "editableArea"
      ) as HTMLDivElement;
      editableArea.innerHTML = "";
      localStorage.removeItem("savedText");
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "C") {
        clearText();
      }
      if (event.shiftKey && event.key === "F") {
        toggleFocusMode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [focusMode, setFocusMode] = useState(false);

  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  return (
    <main
      className={`${inter.className} transition-all pt-12 ${inter.className} ${
        focusMode
          ? "dark:bg-neutral-800 bg-neutral-200"
          : "dark:bg-neutral-900 bg-neutral-50"
      }`}
    >
      <p className="top-4 left-4 absolute font-medium">Words: {wordCount}</p>
      <button
        onClick={toggleFocusMode}
        title={`${focusMode ? "Disable Focus Mode" : "Focus mode (Shift + F)"}`}
        className="mb-4 px-4 py-2 rounded-full absolute top-4 right-4 border border-neutral-500 dark:border-neutral-400 dark:text-neutral-100 text-neutral-950 hover:bg-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-500 dark:hover:bg-neutral-950 transition-colors"
      >
        Focus
      </button>
      <section
        id="main"
        className={`flex min-h-screen flex-col items-center p-10 sm:p-4 transition-all ${
          focusMode ? "p-4 px-8" : ""
        }`}
      >
        <h1
          className={`text-center font-black text-5xl mb-10 cursor-pointer tracking-tight hover:text-neutral-400 hover:underline transition-colors`}
          title="Clear text (Shift + C)"
          onClick={clearText}
        >
          Keímeno
        </h1>
        <div
          id="editableArea"
          contentEditable="true"
          className={`${
            focusMode ? "min-h-[750px]" : "min-h-[550px]"
          } my-2 mx-[30px] sm:mx-4 ${
            focusMode ? "max-h-screen" : "max-h-[750px]"
          } min-w-full font-normal p-5 rounded-[20px] overflow-auto resize-none dark:bg-neutral-800 bg-neutral-200 dark:text-neutral-100 text-neutral-900 ${
            focusMode ? "border-neutral-600 border" : "border-none"
          } ${focusMode ? "mb-8" : ""}`}
          onInput={handleWordCount}
        ></div>
        <div
          id="underConstruction"
          className={`h-[300px] max-w-full my-[20px] mx-[30px] rounded-[20px] overflow-hidden bg-wip min-w-full  ${
            focusMode ? "hidden" : ""
          }`}
        ></div>
        <div className={`text-center ${focusMode ? "hidden" : ""}`}>
          <p className="text-xs">Just Text. Just Notes. Save. Secure.</p>
          <p className="text-xs mt-3 font-medium">v0.8.0 &quot;Lumina&quot;</p>
          <p className="text-base mt-3 font-medium">
            Made with ❤️ by{" "}
            <a href="https://gxbs.me" className="font-black underline">
              Gabs
            </a>
          </p>
          <p className="font-bold dark:text-neutral-500 text-neutral-800 mt-3">
            © 2023 Gabs/Gabriel Cozma. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
