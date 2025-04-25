export default function Skills({ skills }) {
    return (
        <>
            {/* <h1>This is Skills</h1> */}

            {skills.length > 0 && skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-b border-gray-200">
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{skill}</span>
                    </div>
                </div>
            ))}
        </>
    );
};
