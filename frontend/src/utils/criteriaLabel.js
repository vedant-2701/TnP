// Utility functions for the Criteria component

// Maps the criteria keys to human-readable labels
export const getLabelFromKey = (key) => {
    const labelMap= {
      'gender': 'Gender',
      '10th': '10th Percentage',
      '12th_diploma': '12th/Diploma Percentage',
      '12th': '12th Percentage',
      'diploma': 'Diploma Percentage',
      'academic_year': 'Academic Year',
      'cgpa': 'CGPA'
    };
    
    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  };
  
  // Formats the criteria value based on its type
  export const formatCriteriaValue = (key, value) => {
    if (value === null || value === undefined) return 'Not specified';
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      
      // Handle range criteria (min/max values)
      if ('min' in value || 'max' in value) {
        const min = 'min' in value ? value.min : null;
        const max = 'max' in value ? value.max : null;
        
        if (min !== null && max !== null) {
          if (key === 'cgpa') {
            return `${min} - ${max}`;
          }
          return `${min}% - ${max}%`;
        } else if (min !== null) {
          if (key === 'cgpa') {
            return `Minimum ${min}`;
          }
          return `Minimum ${min}%`;
        } else if (max !== null) {
          if (key === 'cgpa') {
            return `Maximum ${max}`;
          }
          return `Maximum ${max}%`;
        }
      }
      
      return JSON.stringify(value);
    }
    
    // Format percentage values
    if (key.includes('th') || key === 'diploma') {
      return `${value}%`;
    }
    
    return value.toString();
  };
  
  // Group related criteria for better organization
  export const getCriteriaGroups = (criteria) => {
    const groups = {
      'Personal': {},
      'Academic Qualifications': {},
      'Other Requirements': {}
    };
    
    Object.entries(criteria).forEach(([key, value]) => {
      if (key === 'gender') {
        groups['Personal'][key] = value;
      } else if (key.includes('th') || key.includes('diploma') || key === 'cgpa') {
        groups['Academic Qualifications'][key] = value;
      } else {
        groups['Other Requirements'][key] = value;
      }
    });
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (Object.keys(groups[key]).length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  };