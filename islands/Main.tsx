import { useEffect, useState } from "preact/hooks";

export default function Main() {
  const [wordCount, setWordCount] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const editableArea = document.getElementById("editableArea") as HTMLDivElement;
    const savedText = localStorage.getItem("saveText");
    const savedWordCount = localStorage.getItem("savedWordCount");
    if (savedText && editableArea) {
      editableArea.innerHTML = savedText;
    }
    if (savedWordCount) {
      setWordCount(parseInt(savedWordCount));
    }

    setIsMac(navigator.userAgent.toLowerCase().includes("mac"));
  }, []);

  const handleWordCount = () => {
    const editableArea = document.getElementById("editableArea") as HTMLDivElement;
    const content = editableArea.innerText;
    const words = content.trim().split(/\s+/);
    const wordCount = words.length || 0;
    setWordCount(wordCount);
    localStorage.setItem("savedText", content);
    localStorage.setItem("savedWordCount", wordCount.toString());
  };

  const clearText = () => {
    if (confirm("Are you sure you want to clear the text?")) {
      const editableArea = document.getElementById("editableArea") as HTMLDivElement;
      editableArea.innerHTML = "";
      localStorage.removeItem("savedWordCount");
      setWordCount(0);
      localStorage.removeItem("savedText");
    }
  };

  const formatText = (style: string) => {
    const selection = globalThis.getSelection();
    const range = selection?.getRangeAt(0);
    const span = document.createElement("span");
    span.style.cssText = style;
    if (range) {
      range.surroundContents(span);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const keyActions: { [key: string]: () => void } = {
      "c": clearText,
      "f": toggleFocusMode,
      "b": () => formatText("font-weight: bold"),
      "i": () => formatText("font-style: italic"),
      "u": () => formatText("text-decoration: underline"),
      "s": saveText,
      "o": openFile,
      "d": () => formatText("text-decoration: line-through"),
      "p": printText,
    };

    if (event.metaKey && event.shiftKey && keyActions[event.key]) {
      event.preventDefault();
      keyActions[event.key]();
    } else if (event.key === "Escape") {
      setShowShortcuts(false);
      setShowAbout(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleFocusMode = () => setFocusMode(!focusMode);
  const toggleShortcuts = () => setShowShortcuts(!showShortcuts);
  const toggleAbout = () => setShowAbout(!showAbout);

  const saveText = () => {
    const editableArea = document.getElementById("editableArea") as HTMLDivElement;
    const content = editableArea.innerText;
    const words = content.trim().split(/\s+/);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keimeno-${words.length}-words.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const editableArea = document.getElementById("editableArea") as HTMLDivElement;
        editableArea.innerText = text;
        handleWordCount();
      }
    };
    input.click();
  };

  const printText = () => {
    const editableArea = document.getElementById("editableArea") as HTMLDivElement;
    const content = editableArea.innerText;
    const pdfWindow = globalThis.open("", "_blank");
    const pdfDocument = pdfWindow?.document;
    if (pdfDocument) {
      pdfDocument.open();
      pdfDocument.write(`
        <html>
          <head>
            <title>Print Text - Keímeno</title>
          </head>
          <body>
            <pre>${content}</pre>
          </body>
        </html>
      `);
      pdfDocument.close();
      pdfWindow?.print();
    }
  };

  useEffect(() => {
    const hoverElement = document.querySelector("h1");
    const originalColor = "inherit";

    if (hoverElement) {
      const handleMouseEnter = () => {
        hoverElement.style.color = getRandomColor();
      };
      const handleMouseLeave = () => {
        hoverElement.style.color = originalColor;
      };

      hoverElement.addEventListener("mouseenter", handleMouseEnter);
      hoverElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        hoverElement.removeEventListener("mouseenter", handleMouseEnter);
        hoverElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  const getRandomColor = () => {
    const hexValues = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += hexValues[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <main
      className={`font-sans transition-all py-12 ${
        focusMode
          ? "dark:bg-neutral-800 bg-neutral-200"
          : "dark:bg-neutral-900 bg-neutral-50"
      }`}
    >
      <header className="pt-10">
        <p className="top-4 left-4 absolute font-medium">Words: {wordCount}</p>
        <div className="absolute top-4 right-4 flex gap-2 mb-4">
          {[
            {
              onClick: toggleFocusMode,
              title: `${
                focusMode
                  ? "Disable Focus Mode (Shift + Cmd + F)"
                  : "Enable Focus Mode (Shift + Cmd + F)"
              }`,
              icon: "adjust",
              sizeClass: "size-[40px]",
              textClass: "dark:text-neutral-100",
            },
            {
              onClick: toggleShortcuts,
              title: "Keyboard Shortcuts",
              icon: "keyboard_command_key",
              sizeClass: "size-10",
              textClass: "dark:text-neutral-200",
            },
          ].map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              title={button.title}
              className={`${button.sizeClass} p-2 flex items-center justify-center rounded-full border border-neutral-500 dark:border-neutral-400 ${button.textClass} text-neutral-950 hover:bg-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-500 dark:hover:bg-neutral-950 transition-colors`}
            >
              <span className="material-symbols-outlined opacity-80">
                {button.icon}
              </span>
            </button>
          ))}
        </div>
      </header>
      <div className="flex flex-col gap-10 px-10 pb-10 sm:p-4">
        <h1
          className="text-center font-black text-5xl cursor-pointer tracking-tight hover:underline transition-colors duration-500"
          title="Clear Text (Shift + Cmd + C)"
          onClick={clearText}
        >
          Keímeno
        </h1>
        <section
          id="main"
          className={`flex flex-col items-center gap-1 overflow-hidden rounded-3xl transition-all ${
            focusMode ? "p-4 px-8" : ""
          }`}
        >
          <figure
            id="editableArea"
            contentEditable="true"
            className={`${
              focusMode ? "min-h-[750px]" : "min-h-[550px]"
            } mx-7 sm:mx-4 ${
              focusMode ? "max-h-[75vh] min-h-[75vh]" : "max-h-[750px]"
            } min-w-full font-normal p-5 overflow-auto resize-none dark:bg-neutral-800 bg-neutral-200 dark:text-neutral-100 text-neutral-900 max-w-full ${
              focusMode ? "border-neutral-600 border rounded-3xl" : "border-none"
            } ${focusMode ? "mb-8" : ""}`}
            onInput={handleWordCount}
          >
          </figure>
          <aside
            className={`h-[300px] max-w-full mx-7 overflow-hidden bg-stable min-w-full dark:opacity-40 ${
              focusMode ? "hidden" : ""
            }`}
          />
        </section>
      </div>
      <footer
        className={`text-center flex flex-col gap-3 ${
          focusMode ? "hidden" : ""
        }`}
      >
        <p className="text-xs">Just Text. Just Notes. Save. Secure.</p>
        <p className="text-xs font-medium">v1.0.0-rc.8 &quot;Prut&quot;</p>
        <p className="text-base font-medium">
          Made with ❤️ by{" "}
          <a
            href="https://gxbs.dev"
            className="font-black underline"
          >
            Gabs
          </a>
        </p>
        <div className="flex justify-center items-center gap-4">
          <p
            className="text-sm font-bold underline cursor-pointer"
            onClick={toggleAbout}
          >
            About Keímeno
          </p>
          <p className="text-sm font-bold underline">
            <a href="https://github.com/GabsEdits/keimeno">Source Code</a>
          </p>
        </div>
      </footer>
      {showShortcuts && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md">
          <article className="bg-white p-8 rounded-lg dark:bg-neutral-800 max-w-[650px]">
            <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
            <ul className="flex flex-col gap-2">
              {[
                {
                  keys: `${isMac ? "Command" : "Ctrl"} + C`,
                  action: "Clear Text",
                },
                {
                  keys: `${isMac ? "Command" : "Ctrl"} + F`,
                  action: "Toggle Focus Mode",
                },
                {
                  keys: `${isMac ? "Command" : "Ctrl"} + B`,
                  action: "Bold Text",
                },
                {
                  keys: `${isMac ? "Command" : "Ctrl"} + I`,
                  action: "Italicize Text",
                },
                {
                  keys: `${isMac ? "Command" : "Ctrl"} + U`,
                  action: "Underline Text",
                },
                {
                  keys: `${isMac ? "Command" : "Ctrl"} + S`,
                  action: "Save Text",
                },
                {
                  keys: `${isMac ? "Command" : "Ctrl"} + O`,
                  action: "Open File",
                },
                {
                  keys: `${isMac ? "Command" : "Ctrl"} + D`,
                  action: "Strikethrough Text",
                },
                { keys: "Escape", action: "Close Modals" },
                {
                  keys: `${isMac ? "Command" : "Ctrl"} + P`,
                  action: "Print Text",
                },
              ].map((shortcut, index) => (
                <li key={index}>
                  <span className="font-bold p-1 rounded-md bg-neutral-300 dark:bg-neutral-700">
                    {shortcut.keys}
                  </span>{" "}
                  : {shortcut.action}
                </li>
              ))}
            </ul>
            <button
              onClick={toggleShortcuts}
              className="mt-3 px-4 py-2 rounded-full bg-neutral-200 text-black hover:bg-neutral-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 transition-colors"
            >
              Close
            </button>
          </article>
        </div>
      )}
      {showAbout && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md">
          <article className="bg-white p-8 rounded-lg dark:bg-neutral-800 max-w-[650px]">
            <h2 className="text-2xl font-extrabold mb-2 text-center">
              About Keímeno
            </h2>
            <div className="flex flex-col gap-2">
              {[
                `<b>Keímeno</b> is a simple note-taking app that saves your text locally in your browser. It is designed to be distraction-free and minimalist. Providing a clean interface for you to write your thoughts. It also provides a word count feature and focus mode - which removes all the distractions from the interface. You can toggle focus mode using the button on the top right or by pressing ${
                  isMac ? "Command" : "Ctrl"
                } + Shift + F. The name &quot;Keímeno&quot; is derived from the Greek word for &quot;text&quot;.`,
                `It provides a few basic text formatting options like bold, italic and strikethrough. You can also save your text as a file {"(txt)"} and open text files using specific keyboard shortcuts. The app also provides a keyboard shortcut to clear the text and print the text. You can view the keyboard shortcuts by pressing the &quot;Shortcuts&quot; button.`,
                `It is also optimized to allow the user to take the text offline, the text can be saved locally, and the text can be printed with a simple keyboard shortcut {"("}${
                  isMac ? "Command" : "Ctrl"
                } + P{")"}.`,
                `The app is built using <a href="https://nextjs.org/">Next.js</a> and <a href="https://tailwindcss.com">Tailwind CSS</a>. It is a PWA and can be installed on your device for offline use.`,
                `The project is open-source and the source code is available on <a href="https://github.com/GabsEdits/keimeno" className="font-bold underline">GitHub</a>`,
              ].map((text, index) => (
                <p
                  key={index}
                  className="text-pretty"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              ))}
              <button
                onClick={toggleAbout}
                className="mt-3 px-4 py-2 rounded-full bg-neutral-200 text-black hover:bg-neutral-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 transition-colors"
              >
                Close
              </button>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
