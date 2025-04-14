// Main app entry point
const { useState, useEffect } = React;

// App Component
function App() {
    const [darkMode, setDarkMode] = useState(false);
    
    // Check system preference for dark mode
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
        
        // Add listener for changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            setDarkMode(e.matches);
        };
        
        mediaQuery.addEventListener('change', handleChange);
        
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);
    
    // Apply dark mode class to body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);
    
    return (
        <HomeView darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 