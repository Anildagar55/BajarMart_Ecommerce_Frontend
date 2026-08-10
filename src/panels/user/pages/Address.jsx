import { useState } from "react";
import { MapPin, Plus } from "lucide-react";

export default function Address() {

    const [showAddress, setShowAddress] = useState(false);

    const defaultAddress = JSON.parse(
        localStorage.getItem("eco_default_address") || "null"
    );

    return (
        <>
            <div
                onClick={() => setShowAddress(true)}
                className="flex items-center gap-2 cursor-pointer"
            >
                <MapPin size={16} />

                <div>
                    <p className="text-xs text-gray-500">
                        Deliver to
                    </p>

                    <p className="font-medium">
                        {defaultAddress?.pincode || "Add address"}
                    </p>
                </div>
            </div>


            {showAddress && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="bg-white rounded-lg w-[400px] max-w-[90%] p-5">

                        <div className="flex justify-between mb-5">

                            <h2 className="font-semibold text-lg">
                                Select delivery address
                            </h2>

                            <button
                                onClick={() => setShowAddress(false)}
                                className="text-gray-500"
                            >
                                ✕
                            </button>

                        </div>


                        {defaultAddress ? (
                            <div className="border rounded-md p-4 mb-4">

                                <div className="flex justify-between">

                                    <p className="font-medium">
                                        {defaultAddress.name}
                                    </p>

                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                        DEFAULT
                                    </span>

                                </div>

                                <p className="text-sm text-gray-600 mt-2">
                                    {defaultAddress.address}
                                </p>

                                <p className="text-sm text-gray-600">
                                    {defaultAddress.city},{" "}
                                    {defaultAddress.state}
                                </p>

                                <p className="text-sm font-medium mt-1">
                                    PIN: {defaultAddress.pincode}
                                </p>

                            </div>
                        ) : (

                            <p className="text-sm text-gray-500 mb-4">
                                No delivery address added.
                            </p>

                        )}


                        <button
                            onClick={() => {
                                window.location.href = "/addresses";
                            }}
                            className="w-full flex items-center justify-center gap-2 border py-2.5 rounded-md"
                        >
                            <Plus size={16} />
                            Add new address
                        </button>

                    </div>

                </div>
            )}
        </>
    );
}