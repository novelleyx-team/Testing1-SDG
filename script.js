/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const file = 'c:/Novelleyx dube/SDG PROJECT/SDG PROJECT/src/app/(auth)/login/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace segmented control (AuthContent)
content = content.replace(
  '<div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">',
  '<div className="flex bg-white/30 dark:bg-gray-800/40 backdrop-blur-md p-1.5 rounded-xl shadow-inner border border-white/30 dark:border-gray-700/50">'
);
content = content.replace(
  /className={\`flex-1 py-2 text-sm font-medium rounded-md transition-colors \${mode === "login" \? "bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}\`}/g,
  'className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${mode === "login" ? "bg-white/90 dark:bg-gray-700/90 shadow-md text-blue-700 dark:text-blue-400 scale-100" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/50 scale-[0.98]"}`}'
);
content = content.replace(
  /className={\`flex-1 py-2 text-sm font-medium rounded-md transition-colors \${mode === "register" \? "bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}\`}/g,
  'className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${mode === "register" ? "bg-white/90 dark:bg-gray-700/90 shadow-md text-blue-700 dark:text-blue-400 scale-100" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/50 scale-[0.98]"}`}'
);

// Replace Input classNames
content = content.replace(
  /className={errors\.(\w+) \? "border-red-500 focus-visible:ring-red-500" : ""}/g, 
  'className={`bg-white/50 dark:bg-gray-900/50 border-white/40 dark:border-gray-700/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-gray-900/80 transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 ${errors.$1 ? "border-red-500 focus-visible:ring-red-500" : ""}`}'
);

// Replace select classNames
content = content.replace(
  /className={\`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground \${/g,
  'className={`flex h-10 w-full rounded-md border bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-white/40 dark:border-gray-700/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground transition-all duration-300 shadow-sm hover:bg-white/60 dark:hover:bg-gray-800/60 focus:bg-white/80 dark:focus:bg-gray-900/80 ${'
);

// Update submit buttons
content = content.replace(
  /<Button type="submit" className="w-full" disabled={isLoading}>/g,
  '<Button type="submit" className="w-full bg-blue-600/90 hover:bg-blue-600 backdrop-blur-sm shadow-lg shadow-blue-600/20 transition-all duration-300" disabled={isLoading}>'
);

fs.writeFileSync(file, content);
console.log('Update complete');
