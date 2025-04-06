import { useState, useEffect, useRef } from 'react';

export const useLazyLoadedIcons = (active) => {
    const [icons, setIcons] = useState(null);
    const [error, setError] = useState(null);
    const isLoadingRef = useRef(false); // Track ongoing load to prevent race conditions

    useEffect(() => {
        let mounted = true;

        const loadIcons = async () => {

            if (isLoadingRef.current) return; // Prevent overlapping loads
            isLoadingRef.current = true;

            try {
                const { 
                    EnvelopeIcon, 
                    PhoneIcon,
                    AcademicCapIcon,
                    UserCircleIcon,
                    IdentificationIcon,
                    DocumentArrowDownIcon,
                    ExclamationTriangleIcon,
                    BuildingOffice2Icon,
                    ClockIcon,
                    ArrowPathIcon 
                } = await import('@heroicons/react/24/outline');
    
                const { FaAward, FaRegIdBadge } = await import('react-icons/fa6');
        
                if (!mounted) return;
        
                setIcons({
                    EnvelopeIcon,
                    PhoneIcon,
                    AcademicCapIcon,
                    UserCircleIcon,
                    IdentificationIcon,
                    DocumentArrowDownIcon,
                    ExclamationTriangleIcon,
                    BuildingOffice2Icon,
                    ClockIcon,
                    ArrowPathIcon,
                    FaAward,
                    FaRegIdBadge
                });
                setError(null);
            } catch (err) {
                if (!mounted) return;
                setError(err instanceof Error ? err : new Error('Failed to load icons'));
                setIcons(null);
            } finally {
                if (mounted) isLoadingRef.current = false;
            }
        };

        if (active) {
            loadIcons();
        } else {
            setIcons(null);
            setError(null);
        }

        return () => {
            mounted = false;
        };
    }, [active]);

    return { icons, error };
};
