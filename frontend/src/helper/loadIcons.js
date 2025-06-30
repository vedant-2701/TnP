export const loadIcons = async () => {
    try {
        const [
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
            FaRegIdBadge,
        ] = await Promise.all([
            import('@heroicons/react/24/outline').then((module) => module.EnvelopeIcon),
            import('@heroicons/react/24/outline').then((module) => module.PhoneIcon),
            import('@heroicons/react/24/outline').then((module) => module.AcademicCapIcon),
            import('@heroicons/react/24/outline').then((module) => module.UserCircleIcon),
            import('@heroicons/react/24/outline').then((module) => module.IdentificationIcon),
            import('@heroicons/react/24/outline').then((module) => module.DocumentArrowDownIcon),
            import('@heroicons/react/24/outline').then((module) => module.ExclamationTriangleIcon),
            import('@heroicons/react/24/outline').then((module) => module.BuildingOffice2Icon),
            import('@heroicons/react/24/outline').then((module) => module.ClockIcon),
            import('@heroicons/react/24/outline').then((module) => module.ArrowPathIcon),
            import('react-icons/fa6').then((module) => module.FaAward),
            import('react-icons/fa6').then((module) => module.FaRegIdBadge),
        ]);
  
        return {
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
            FaRegIdBadge,
        };
    } catch (error) {
        console.error("Error loading icons:", error);
        // Return an empty object or fallback icons in case of an error
        return {};
    }
};