
interface DashboardProps {
    user: any;
    onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
    console.log(user);
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
                    
                </h1>

                {<p className="text-gray-600 mb-2">
                    <span className="font-bold">Email: </span>{user.email}
                </p>}

                {<p className="text-gray-600 mb-2">
                    <span className="font-bold"> Role: </span> {user.role}
                </p>}

                {isVolunteer && (
                    <>
                        <p className="text-gray-600 mb-2">
                            <span className="font-bold">Age: </span>{user.age}
                        </p>
                    </>
                )}

                {isOrganization && (
                    <>

                        <p className="text-gray-600 mb-2">
                            <span className="font-bold">Description: </span> {user.description}
                        </p>

                        <p className="text-gray-600 mb-2">
                            <span className="font-bold">isVerified: </span> {String(user.isVerified)}
                        </p>

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
