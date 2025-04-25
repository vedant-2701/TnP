import { getCriteriaGroups, formatCriteriaValue, getLabelFromKey } from "../../../../../../utils/criteriaLabel";
import { 
    GraduationCap, Percent, Users, Calendar, Award, BarChart, FileQuestion
  } from 'lucide-react';

export default function Criteria({ criteria }) {
    console.log(criteria);
  // Check if criteria is empty
  const isEmpty = !criteria || Object.keys(criteria).length === 0;
  
  if (isEmpty) {
    return <EmptyCriteria />;
  }
  
  // Group criteria for better organization
  const criteriaGroups = getCriteriaGroups(criteria);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Eligibility Criteria</h2>
        <p className="text-gray-600">The following criteria must be met to qualify.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(criteriaGroups).map(([groupName, groupCriteria]) => (
          <div key={groupName} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
              {groupName}
            </h3>
            {Object.entries(groupCriteria).map(([key, value]) => (
              <CriteriaCard 
                key={key} 
                criteriaKey={key} 
                value={value}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const EmptyCriteria = () => {
    return (
        <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FileQuestion className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Criteria Specified</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                There are currently no eligibility criteria defined for this opportunity.
                All applicants are welcome to apply.
                </p>
            </div>
        </div>
    );
}

const CriteriaCard = ({ criteriaKey, value }) => {
    const label = getLabelFromKey(criteriaKey);
  const formattedValue = formatCriteriaValue(criteriaKey, value);
  
  // Get the appropriate icon based on the criteria type
  const getIcon = () => {
    switch(criteriaKey) {
      case 'gender':
        return <Users className="w-5 h-5" />;
      case '10th':
      case '12th':
        return <Percent className="w-5 h-5" />;
      case '12th_diploma':
      case 'diploma':
        return <Award className="w-5 h-5" />;
      case 'academic_year':
        return <Calendar className="w-5 h-5" />;
      case 'cgpa':
        return <BarChart className="w-5 h-5" />;
      default:
        return <GraduationCap className="w-5 h-5" />;
    }
  };
  
  // Get appropriate background color based on criteria type
  const getCardStyle = () => {
    if (criteriaKey.includes('cgpa')) {
      return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
    } else if (criteriaKey.includes('th') || criteriaKey.includes('diploma')) {
      return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
    } else if (criteriaKey === 'gender') {
      return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200';
    } else if (criteriaKey === 'academic_year') {
      return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200';
    }
    return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
  };
  
  return (
    <div 
      className={`p-4 rounded-lg border transition-all duration-300 ease-in-out hover:shadow-md ${getCardStyle()}`}
    >
      <div className="flex items-center">
        <div className="rounded-full p-2 mr-3 bg-white/80 shadow-sm">
          {getIcon()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-800">{formattedValue}</p>
        </div>
      </div>
    </div>
  );
}