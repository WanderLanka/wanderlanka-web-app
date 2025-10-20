import { useEffect, useState } from 'react';

/**
 * Custom hook to dynamically load external scripts
 * @param {string} src - The URL of the script to load
 * @returns {boolean} - Returns true when script is loaded, false otherwise
 */
export const useScript = (src) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!src) {
            console.error('❌ useScript: No source URL provided');
            setError(true);
            return;
        }
        
        console.log('🔄 useScript: Attempting to load script:', src);
        
        // Check if script is already loaded
        const existingScript = document.querySelector(`script[src="${src}"]`);
        
        if (existingScript) {
            console.log('📜 Script already exists in DOM');
            // If script already exists and is loaded
            if (existingScript.dataset.loaded === 'true') {
                console.log('✅ Script already loaded');
                setLoaded(true);
                return;
            }
            
            // If script exists but not loaded yet, wait for it
            const handleLoad = () => {
                console.log('✅ Existing script loaded');
                existingScript.dataset.loaded = 'true';
                setLoaded(true);
            };
            
            const handleError = () => {
                console.error('❌ Existing script failed to load');
                setError(true);
            };
            
            existingScript.addEventListener('load', handleLoad);
            existingScript.addEventListener('error', handleError);
            
            return () => {
                existingScript.removeEventListener('load', handleLoad);
                existingScript.removeEventListener('error', handleError);
            };
        }

        // Create new script element
        console.log('📜 Creating new script element');
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;

        const handleLoad = () => {
            console.log('✅ New script loaded successfully');
            script.dataset.loaded = 'true';
            setLoaded(true);
        };

        const handleError = () => {
            console.error('❌ Failed to load script:', src);
            setError(true);
        };

        script.addEventListener('load', handleLoad);
        script.addEventListener('error', handleError);

        // Append script to document
        document.body.appendChild(script);
        console.log('📜 Script appended to body');

        // Cleanup function
        return () => {
            script.removeEventListener('load', handleLoad);
            script.removeEventListener('error', handleError);
        };
    }, [src]);

    return loaded && !error;
};

export default useScript;
