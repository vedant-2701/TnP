export default function Overview({ description }) {
    console.log(description);
    return (
        <div className="px-4 py-6">
            <h1 className="text-lg">{description}</h1>
        </div>
    );
};
