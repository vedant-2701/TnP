import { Building } from 'lucide-react';

export default function Overview({ description }) {
    console.log(description);
    return (
        <div className="mx-auto px-6 py-8">
            <div className="">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Company Overview
                    </h2>
                </div>

                <div className="prose max-w-none">
                    {description?.split("\n").map(
                        (paragraph, index) =>
                            paragraph.trim() && (
                                <p
                                    key={index}
                                    className="text-gray-600 leading-relaxed mb-4 text-lg"
                                >
                                    {paragraph}
                                </p>
                            )
                    )}
                </div>
            </div>
        </div>
    );
}
