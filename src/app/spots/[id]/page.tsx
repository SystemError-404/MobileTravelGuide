// src/app/spots/[id]/page.tsx

import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation"; // Import next/navigation to trigger notFound() if document isn't found
import { FC } from "react";
import Link from "next/link";
import {db} from "../../../../lib/firebase";
import {TouristSpot} from "../../../../types/TouristSpot";

interface SpotDetailsProps {
    params: Promise<{ id: string }> // Expecting params to be an object with id
}

const SpotDetails: FC<SpotDetailsProps> = async ({ params }) => {
    const { id } = await params; // Now we can access `id` after `params` is awaited

    // Fetch data from Firestore
    const docRef = doc(db, "touristSpots", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        notFound(); // Automatically triggers 404 page if spot isn't found
    }

    const spot: TouristSpot = {
        Attraction_Id: docSnap.id,
        ...docSnap.data(),
    } as TouristSpot;

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            {/* Image section */}
            {spot.Image_Base64 && (
                <div className="w-full h-1/3 bg-gray-300 mb-6 overflow-hidden">
                    <img
                        src={`data:image/png;base64,${spot.Image_Base64}`}
                        alt={spot.Name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Title and description section */}
            <div className="w-full max-w-4xl px-6 py-4 bg-white shadow-md rounded-lg">
                <h1 className="text-4xl font-bold text-center mb-4 text-blue-600">{spot.Name}</h1>
                <p className="text-lg text-gray-600 mt-2"><strong>Location:</strong> {spot.Location}</p>
                <p className="text-lg text-gray-700 mt-2"><strong>Description:</strong> {spot.Description}</p>
                <p className="text-xl text-yellow-500 mt-4"><strong>Rating:</strong> {spot.Rating}</p>
            </div>

            {/* Back to Home link */}
            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default SpotDetails;
