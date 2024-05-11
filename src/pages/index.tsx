import { Inter } from "next/font/google";
import { useState } from "react";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [wordCount, setWordCount] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const editableArea = document.getElementById(
      "editableArea"
    ) as HTMLDivElement;
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
      if (event.ctrlKey && event.key === "b") {
        event.preventDefault();
        makeTextBold();
      }
      if (event.ctrlKey && event.key === "i") {
        event.preventDefault();
        makeTextItalic();
      }
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        const editableArea = document.getElementById(
          "editableArea"
        ) as HTMLDivElement;
        const content = editableArea.innerText;
        const words = content.trim().split(/\s+/);
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `keimeno-${words.length}-words.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
      if (event.ctrlKey && event.key === "o") {
        event.preventDefault();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".txt";
        input.onchange = async (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            const text = await file.text();
            const editableArea = document.getElementById(
              "editableArea"
            ) as HTMLDivElement;
            editableArea.innerText = text;
            handleWordCount();
          }
        };
        input.click();
      }
      if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        const editableArea = document.getElementById(
          "editableArea"
        ) as HTMLDivElement;
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const span = document.createElement("span");
        span.style.textDecoration = "line-through";
        if (range) {
          range.surroundContents(span);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
      if (event.key === "Escape") {
        setShowShortcuts(false);
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

  const makeTextBold = () => {
    const editableArea = document.getElementById(
      "editableArea"
    ) as HTMLDivElement;
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontWeight = "bold";
    if (range) {
      range.surroundContents(span);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const makeTextItalic = () => {
    const editableArea = document.getElementById(
      "editableArea"
    ) as HTMLDivElement;
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontStyle = "italic";
    if (range) {
      range.surroundContents(span);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const toggleShortcuts = () => {
    setShowShortcuts(!showShortcuts);
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
      <button
        onClick={toggleShortcuts}
        title="Keyboard Shortcuts"
        className="mb-4 px-4 py-2 rounded-full absolute top-4 right-[110px] border border-neutral-500 dark:border-neutral-400 dark:text-neutral-100 text-neutral-950 hover:bg-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-500 dark:hover:bg-neutral-950 transition-colors sm:hidden"
      >
        Shortcuts
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
          className={`h-[300px] max-w-full my-[20px] mx-[30px] rounded-[20px] overflow-hidden bg-stable min-w-full  ${
            focusMode ? "hidden" : ""
          }`}
        ></div>
        <div className={`text-center ${focusMode ? "hidden" : ""}`}>
          <p className="text-xs">Just Text. Just Notes. Save. Secure.</p>
          <p className="text-xs mt-3 font-medium">v1.0.0-rc.0 &quot;Prut&quot;</p>
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
      {showShortcuts && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md ">
          <div className="bg-white p-8 rounded-lg dark:bg-neutral-800">
            <h2 className="text-lg font-bold mb-2">Keyboard Shortcuts</h2>
            <ul>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  Shift + C
                </span>{" "}
                : Clear text
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  Shift + F
                </span>{" "}
                : Toggle Focus Mode
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  Ctrl + B
                </span>{" "}
                : Make text bold
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  Ctrl + I
                </span>{" "}
                : Make text italic
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  Ctrl + S
                </span>{" "}
                : Save text as file
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  Ctrl + O
                </span>{" "}
                : Open text file
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  Ctrl + D
                </span>{" "}
                : Strikethrough text
              </li>
            </ul>
            <button
              onClick={toggleShortcuts}
              className="mt-4 px-4 py-2 rounded-full bg-neutral-200 text-black hover:bg-neutral-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
