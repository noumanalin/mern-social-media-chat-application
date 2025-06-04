import { useEffect, useState } from "react";

const colors = [
  { name: "blue", colorCode: "#3385ff" },
  { name: "red", colorCode: "#df2d56" },
  { name: "yellow", colorCode: "#eca61c" },
  { name: "green", colorCode: "#04bb90" },
  { name: "purple", colorCode: "#b21fc9" },
];

const themeMode = [
  { name: "light", title: "Light Mode", colorCode: "#fff" },
  { name: "dark", title: "Dark Mode", colorCode: "#000" }
];

const ThemeColorPicker = () => {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("theme-color") || "green";
  });

  const [mode, setMode] = useState<any>(() => {
    return localStorage.getItem("theme-mode");
  });



  const changeThemeColor = (color: string) => {
    const oldClass = `theme-${theme}`;
    const newClass = `theme-${color}`;

    document.documentElement.classList.remove(oldClass);
    document.documentElement.classList.add(newClass);

    localStorage.setItem("theme-color", color);
    setTheme(color);
  };

const changeThemeMode = (newMode: string) => {
  if (newMode === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme-mode", "dark");
    setMode("dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme-mode", "light");
    setMode("light"); 
  }
};



useEffect(() => {
  // Apply saved theme color
  document.documentElement.classList.add(`theme-${theme}`);

  if (mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark"); 
  }
}, [mode, theme]); 



  return (
    <section className="p-4 text-center">
      {/* Color Theme Picker */}
      <article className="mb-8">
        <h2 className="text-lg font-bold mb-4">Primary Colors</h2>
        <ul className="flex justify-center gap-3">
          {colors.map((color, index) => (
            <li
              key={index}
              className={`w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 ${
                theme === color.name ? "border-primary" : "border-transparent"
              }`}
              style={{ backgroundColor: color.colorCode }}
              onClick={() => changeThemeColor(color.name)}
              title={color.name}
              aria-label={`Change to ${color.name} theme`}
            />
          ))}
        </ul>
      </article>

      {/* Light/Dark Mode Toggle */}
      <article>
        <h2 className="text-lg font-bold mb-4">Appearance</h2>
        <ul className="flex justify-center gap-4">
          {themeMode.map((m, index) => (
            <li 
              key={index} 
              onClick={() => changeThemeMode(m.name)}
              className={`flex flex-col items-center cursor-pointer group`}
            >
              <div 
                className={`w-16 h-16 rounded-full border-2 transition-all ${
                  mode === m.name ? "border-primary" : "border-gray-300 dark:border-gray-600"
                } group-hover:border-primary p-1`}
              >
                <div 
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: m.colorCode }}
                />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {m.title}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};

export default ThemeColorPicker;