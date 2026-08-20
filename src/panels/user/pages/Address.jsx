import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Address() {

    const navigate = useNavigate();

    const [address, setAddress] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [isDefault, setIsDefault] = useState(true);

    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const savedAddress = {
            ...address,
            isDefault,
        };

        localStorage.setItem(
            "eco_default_address",
            JSON.stringify(savedAddress)
        );

        alert("Address saved successfully");

        navigate("/");
    };

    return (
        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-2xl font-semibold mb-6">
                Add Delivery Address
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white border rounded-lg p-6 space-y-4"
            >

                <input
                    name="name"
                    value={address.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    className="w-full border rounded-md px-3 py-2.5"
                />

                <input
                    name="phone"
                    value={address.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                    className="w-full border rounded-md px-3 py-2.5"
                />

                <textarea
                    name="address"
                    value={address.address}
                    onChange={handleChange}
                    placeholder="House no, Street, Area"
                    required
                    rows={3}
                    className="w-full border rounded-md px-3 py-2.5"
                />

                <div className="grid grid-cols-2 gap-4">

                    <input
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                        className="border rounded-md px-3 py-2.5"
                    />

                    <input
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        placeholder="State"
                        required
                        className="border rounded-md px-3 py-2.5"
                    />

                </div>

                <input
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    maxLength={6}
                    required
                    className="w-full border rounded-md px-3 py-2.5"
                />

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) =>
                            setIsDefault(e.target.checked)
                        }
                    />

                    Set as default address
                </label>

                <button
                    type="submit"
                    className="w-full bg-bazaar-accent text-white py-3 rounded-md font-semibold"
                >
                    Save Address
                </button>

            </form>
        </div>
    );
}