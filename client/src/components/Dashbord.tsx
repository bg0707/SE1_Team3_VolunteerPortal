
interface DashboardProps {
    user: any;
    onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
    const isVolunteer = !!user.fullName;
    const isOrganization = !!user.organizationName;

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-[360px] p-8 rounded-xl bg-white shadow-lg text-center">

                {/* Title */}
                <h1 className="text-2xl font-semibold mb-4">
                    Welcome,{" "}
                    {isVolunteer
                        ? user.fullName
                        : isOrganization
                            ? user.organizationName
                            : "User"}
                    !
                </h1>

                {user.email && <p className="text-gray-600 mb-2">Email: {user.email}</p>}
                {user.role && <p className="text-gray-600 mb-2">Role: {user.role}</p>}


                
                {isVolunteer && (
                    <>
                        <p>Age: {user.age}</p>
                    </>
                )}

                {isOrganization && (
                    <>
                        <p>Info: {user.description}</p>
                    </>
                )}

                {/* Logout button */}
                <button
                    className="mt-6 w-full py-2 rounded-md bg-red-500 text-white font-bold hover:bg-red-600"
                    onClick={onLogout}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}
