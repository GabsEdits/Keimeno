import "react-material-symbols/rounded";

import { useEffect, useState } from "react";

import { Inter } from "next/font/google";
import { MaterialSymbol } from "react-material-symbols";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [wordCount, setWordCount] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const editableArea = document.getElementById(
      "editableArea",
    ) as HTMLDivElement;
    const savedText = localStorage.getItem("savedText");
    const savedWordCount = localStorage.getItem("savedWordCount");
    if (savedText && editableArea) {
      editableArea.innerHTML = savedText;
    }
    if (savedWordCount) {
      setWordCount(parseInt(savedWordCount));
    }

    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      setIsMac(true);
    }
  }, []);

  const handleWordCount = () => {
    const editableArea = document.getElementById(
      "editableArea",
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
        "editableArea",
      ) as HTMLDivElement;
      editableArea.innerHTML = "";
      localStorage.removeItem("savedWordCount");
      setWordCount(0);
      localStorage.removeItem("savedText");
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.shiftKey && event.key === "c") {
        clearText();
      }
      if (event.metaKey && event.shiftKey && event.key === "f") {
        toggleFocusMode();
      }
      if (event.metaKey && event.key === "b") {
        event.preventDefault();
        makeTextBold();
      }
      if (event.metaKey && event.key === "i") {
        event.preventDefault();
        makeTextItalic();
      }
      if (event.metaKey && event.shiftKey && event.key === "s") {
        event.preventDefault();
        const editableArea = document.getElementById(
          "editableArea",
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
      if (event.metaKey && event.shiftKey && event.key === "o") {
        event.preventDefault();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".txt";
        input.onchange = async (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            const text = await file.text();
            const editableArea = document.getElementById(
              "editableArea",
            ) as HTMLDivElement;
            editableArea.innerText = text;
            handleWordCount();
          }
        };
        input.click();
      }
      if (event.metaKey && event.shiftKey && event.key === "d") {
        event.preventDefault();
        const editableArea = document.getElementById(
          "editableArea",
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
      if (event.key === "Escape") {
        setShowAbout(false);
      }
      if (event.metaKey && event.key === "p") {
        event.preventDefault();
        const editableArea = document.getElementById(
          "editableArea",
        ) as HTMLDivElement;
        const content = editableArea.innerText;
        const pdfWindow = window.open("", "_blank");
        const pdfDocument = pdfWindow?.document;
        if (pdfDocument) {
          pdfDocument.open();
          pdfDocument.write(`
        <html>
          <head>
            <title>Print Document - Keímeno</title>
          </head>
          <body>
            <pre>${content}</pre>
          </body>
        </html>
          `);
          pdfDocument.close();
          pdfWindow?.print();
        }
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
      "editableArea",
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
      "editableArea",
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

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  useEffect(() => {
    const hoverElement = document.querySelector("h1");
    const originalColor = "inherit";

    if (hoverElement) {
      hoverElement.addEventListener("mouseenter", function () {
        const randomColor = getRandomColor();
        hoverElement.style.color = randomColor;
      });

      hoverElement.addEventListener("mouseleave", function () {
        hoverElement.style.color = originalColor;
      });

      return () => {
        hoverElement.removeEventListener("mouseenter", function () {
          const randomColor = getRandomColor();
          hoverElement.style.color = randomColor;
        });

        hoverElement.removeEventListener("mouseleave", function () {
          hoverElement.style.color = originalColor;
        });
      };
    }
  }, []);

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <main
      className={`${inter.className} transition-all py-12 ${inter.className} ${
        focusMode
          ? "dark:bg-neutral-800 bg-neutral-200"
          : "dark:bg-neutral-900 bg-neutral-50"
      }`}
    >
      <header className="pt-10">
        <p className="top-4 left-4 absolute font-medium">Words: {wordCount}</p>
        <div className="absolute top-4 right-4 flex gap-2 mb-4">
          <button
            onClick={toggleFocusMode}
            title={`${
              focusMode ? "Disable Focus Mode" : "Focus mode (Shift + F)"
            }`}
            className="w-[40px] h-[40px] p-2 flex items-center justify-center rounded-full border border-neutral-500 dark:border-neutral-400 dark:text-neutral-100 text-neutral-950 hover:bg-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-500 dark:hover:bg-neutral-950 transition-colors"
          >
            <MaterialSymbol
              icon="adjust"
              size={22}
              fill
              grade={-25}
              className="opacity-80"
            />
          </button>
          <button
            onClick={toggleShortcuts}
            title="Keyboard Shortcuts"
            className="w-[40px] h-[40px] p-2 flex items-center justify-center rounded-full border border-neutral-500 dark:border-neutral-400 dark:text-neutral-100 text-neutral-950 hover:bg-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-500 dark:hover:bg-neutral-950 transition-colors sm:hidden"
          >
            <MaterialSymbol
              icon="keyboard_command_key"
              size={22}
              fill
              grade={-25}
              className="opacity-80"
            />
          </button>
        </div>
      </header>
      <div className="flex flex-col gap-10">
        <h1
          className={`text-center font-black text-5xl cursor-pointer tracking-tight hover:text-neutral-400 hover:underline transition-color duration-500`}
          title="Clear text (Shift + C)"
          onClick={clearText}
        >
          Keímeno
        </h1>
        <section
          id="main"
          className={`flex flex-col items-center gap-8 px-10 pb-10 sm:p-4 transition-all ${
            focusMode ? "p-4 px-8" : ""
          }`}
        >
          <figure
            id="editableArea"
            contentEditable="true"
            className={`${
              focusMode ? "min-h-[750px]" : "min-h-[550px]"
            } mx-[30px] sm:mx-4 ${
              focusMode ? "max-h-[75vh] min-h-[75vh]" : "max-h-[750px]"
            } min-w-full font-normal p-5 rounded-[20px] overflow-auto resize-none dark:bg-neutral-800 bg-neutral-200 dark:text-neutral-100 text-neutral-900 max-w-full ${
              focusMode ? "border-neutral-600 border" : "border-none"
            } ${focusMode ? "mb-8" : ""}`}
            onInput={handleWordCount}
          ></figure>
          <aside
            id="underConstruction"
            className={`h-[300px] max-w-full mx-[30px] rounded-[20px] overflow-hidden bg-stable min-w-full dark:opacity-40 ${
              focusMode ? "hidden" : ""
            }`}
          ></aside>
        </section>
      </div>
      <footer
        className={`text-center flex flex-col gap-3 ${focusMode ? "hidden" : ""}`}
      >
        <p className="text-xs">Just Text. Just Notes. Save. Secure.</p>
        <p className="text-xs font-medium">v1.0.0-rc.8 &quot;Prut&quot;</p>
        <p className="text-base font-medium">
          Made with ❤️ by{" "}
          <a href="https://gxbs.me" className="font-black underline">
            Gabs
          </a>
        </p>
        <p className="font-bold dark:text-neutral-500 text-neutral-800">
          © 2023-{new Date().getFullYear()} Gabriel Cozma.
        </p>
        <section className="flex justify-center gap-4">
          <p
            className="text-sm font-bold underline cursor-pointer"
            onClick={toggleAbout}
          >
            About Keímeno
          </p>
          <p className="text-sm font-bold underline">
            <a href="https://github.com/GabsEdits/keimeno">Source Code</a>
          </p>
        </section>
      </footer>
      {showShortcuts && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md ">
          <article className="bg-white p-8 rounded-lg dark:bg-neutral-800">
            <h2 className="text-lg font-bold mb-2">Keyboard Shortcuts</h2>
            <ul>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  {isMac ? "Command" : "Ctrl"} + Shift + C
                </span>{" "}
                : Clear text
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  {isMac ? "Command" : "Ctrl"} + D
                </span>{" "}
                : Strikethrough text
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  {isMac ? "Command" : "Ctrl"} + B
                </span>{" "}
                : Make text bold
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  {isMac ? "Command" : "Ctrl"} + I
                </span>{" "}
                : Make text italic
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  {isMac ? "Command" : "Ctrl"} + Shift + F
                </span>{" "}
                : Toggle Focus Mode
              </li>
              <li>
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  {isMac ? "Command" : "Ctrl"} + Shift + S
                </span>{" "}
                : Save text as file
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  {isMac ? "Command" : "Ctrl"} + Shift + O
                </span>{" "}
                : Open text file
              </li>
              <li className="mb-2">
                <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                  {isMac ? "Command" : "Ctrl"} + P
                </span>{" "}
                : Print text {"(opens in new tab)"}
              </li>
            </ul>
            <button
              onClick={toggleShortcuts}
              className="mt-4 px-4 py-2 rounded-full bg-neutral-200 text-black hover:bg-neutral-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 transition-colors"
            >
              Close
            </button>
          </article>
        </div>
      )}
      {showAbout && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md ">
          <article className="bg-white p-8 rounded-lg dark:bg-neutral-800 max-w-[650px]">
            <h2 className="text-2xl font-extrabold mb-2 text-center">
              About Keímeno
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-pretty">
                <b>Keímeno</b> is a simple note-taking app that saves your text
                locally in your browser. It is designed to be distraction-free
                and minimalist. Providing a clean interface for you to write
                your thoughts. It also provides a word count feature and focus
                mode - which removes all the distractions from the interface.
                You can toggle focus mode using the button on the top right or
                by pressing
                {isMac ? "Command" : "Ctrl"} + Shift + F. The name
                &quot;Keímeno&quot; is derived from the Greek word for
                &quot;text&quot;.
              </p>
              <p className="text-pretty">
                It provides a few basic text formatting options like bold,
                italic and strikethrough. You can also save your text as a file{" "}
                {"(txt)"} and open text files using specific keyboard shortcuts.
                The app also provides a keyboard shortcut to clear the text and
                print the text. You can view the keyboard shortcuts by pressing
                the &quot;Shortcuts&quot; button.
              </p>
              <p className="text-pretty">
                It is also optimized to allow the user to take the text offline,
                the text can be saved locally, and the text can be printed with
                a simple keyboard shortcut {"("}
                {isMac ? "Command" : "Ctrl"} + P{")"}.
              </p>
              <p className="text-pretty">
                The app is built using <a href="https://nextjs.org/">Next.js</a>{" "}
                and <a href="https://tailwindcss.com">Tailwind CSS</a>. It is a
                PWA and can be installed on your device for offline use.
              </p>
              <p>
                The project is open-source and the source code is available on{" "}
                <a
                  href="https://github.com/GabsEdits/keimeno"
                  className="font-bold underline"
                >
                  GitHub
                </a>
              </p>
            </div>
            <button
              onClick={toggleAbout}
              className="mt-4 px-4 py-2 rounded-full bg-neutral-200 text-black hover:bg-neutral-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 transition-colors"
            >
              Close
            </button>
          </article>
        </div>
      )}
    </main>
  );
}
