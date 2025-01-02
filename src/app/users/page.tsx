"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import texts from "../../locales/en.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useForm } from "react-hook-form";

interface User {
    id: number;
    name: string;
    email: string;
    company: { name: string };
    website: string;
    address: { city: string };
    role?: string;
    city: string;
}

const ROLES = ["admin", "uploader", "viewer"];

export default function UsersPage() {
    const { user } = useUser();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [apiError, setApiError] = useState<string | null>(null); // status error API

    const USERS_PER_PAGE = 5;

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch users. Please try again later.");
            }
            return res.json();
          })
          .then((data) => {
            const usersWithRoles = data.map((user: User) => ({
              ...user,
              role: ROLES[Math.floor(Math.random() * ROLES.length)], // Random assignment of roles
            }));
            setLoading(false);
            setUsers(usersWithRoles);
            setFilteredUsers(usersWithRoles);
          })
          .catch((error) => {
            console.error("Error while retrieving data:", error.message);
            setApiError(error.message);
            setLoading(false); // stop loading case error
          });
      }, []);

    // filter users user.name / user.email
    useEffect(() => {
        let updatedUsers = users.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (cityFilter) {
            updatedUsers = updatedUsers.filter(
                (user) => user.address.city === cityFilter
            );
        }
        setFilteredUsers(updatedUsers);
        setCurrentPage(1);
    }, [searchTerm, cityFilter, users]);

    // Pagination
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    // useForm hook for Add User Form
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            email: "",
            company: "",
            website: "",
            city: "",
        },
    });

    const onSubmit = (data: User) => {
        const newUser: User = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            company: { name: data.company },
            website: data.website,
            address: { city: data.city },
            role: "viewer",

        };
        setUsers((prev) => [...prev, newUser]);
        setShowModal(false);
        reset(); // Reset form after submission
    };

    // delete user
    const handleDeleteUser = (id: number) => {
        if (user?.role === "admin") {
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    return (
        <div className="container">
            <h1 className="text-xl font-bold mb-4">{texts.users.title}</h1>
            {/* Search Bar and Filter */}
            <div className="md:flex-row space-x-2 mb-4">
                <input
                    type="text"
                    placeholder={texts.users.inputSearch}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-4 py-2 mb-4 rounded"
                />
                <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="border px-2 py-2 mb-4 rounded"
                >
                    <option value="">{texts.users.allCites}</option>
                    {[...new Set(users.map((user) => user.address.city))].map(
                        (city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        )
                    )}
                </select>
                {user?.role === "admin" && (
                    <button
                        className="bg-blue-500 text-white px-2 py-2 mb-4 rounded"
                        onClick={() => setShowModal(true)}
                    >
                       <FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px' }} />
                       {texts.users.btnAdd}
                    </button>
                )}
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
                {loading && <p className="text-blue-500">Loading users, please wait...</p>}
                {apiError && <p className="text-red-500">Error: {apiError}</p>}

                {!loading && !apiError && (
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">{texts.users.table.name}</th>
                                <th className="border border-gray-300 px-4 py-2">{texts.users.table.email}</th>
                                <th className="border border-gray-300 px-4 py-2">{texts.users.table.companyName}</th>
                                <th className="border border-gray-300 px-4 py-2">{texts.users.table.website}</th>
                                <th className="border border-gray-300 px-4 py-2">{texts.users.table.city}</th>
                                <th className="border border-gray-300 px-4 py-2">{texts.users.table.role}</th>
                                {user?.role === "admin" && (
                                    <th className="border border-gray-300 px-4 py-2">{texts.users.table.actions}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((userItem) => (
                                <tr key={userItem.id}>
                                    <td className="border border-gray-300 px-4 py-2">{userItem.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userItem.email}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userItem.company.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userItem.website}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userItem.address.city}</td>
                                    <td className="border border-gray-300 px-4 py-2">{userItem.role}</td>
                                    {user?.role === "admin" && (
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button
                                                onClick={() => handleDeleteUser(userItem.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                <FontAwesomeIcon icon={faTrash} style={{ marginRight: '10px' }} />
                                                {texts.users.btnDelete}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`px-4 py-2 rounded ${
                            currentPage === i + 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Modal for Adding User */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">{texts.users.btnAdd}</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                type="text"
                                placeholder={texts.users.table.name}
                                {...register("name", { required: "Name is required" })}
                                className="w-full border px-4 py-2 mb-2"
                            />
                            <input
                                type="email"
                                placeholder={texts.users.table.email}
                                {...register("email", { required: "Email is required" })}
                                className="w-full border px-4 py-2 mb-2"
                            />
                            <input
                                type="text"
                                placeholder={texts.users.table.companyName}
                                {...register("company")}
                                className="w-full border px-4 py-2 mb-2"
                            />
                            <input
                                type="text"
                                placeholder={texts.users.table.website}
                                {...register("website")}
                                className="w-full border px-4 py-2 mb-2"
                            />
                            <input
                                type="text"
                                placeholder={texts.users.table.city}
                                {...register("city", { required: "City is required" })}
                                className="w-full border px-4 py-2 mb-2"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 px-4 py-2 rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    {texts.users.btnCancel}
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {texts.users.btnSave}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
