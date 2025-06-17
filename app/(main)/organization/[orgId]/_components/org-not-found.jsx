"use client";

import { CircleAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

const OrgNotFound = () => {
return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-6">
    <div className="flex items-center gap-3 mb-4 text-red-500">
        <CircleAlert className="w-8 h-8" />
        <h1 className="text-2xl font-semibold">Organization Not Found</h1>
    </div>
    <p className="text-slate-400 text-center max-w-md mb-6">
        We couldn’t find the organization you’re looking for. It may have been deleted,
        or you might not have access to it.
    </p>
    <Link
        href="/"
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500 rounded-md px-4 py-2 text-sm"
    >
        <ArrowLeft className="w-4 h-4" />
        Go Back Home
    </Link>
    </div>
);
};

export default OrgNotFound;
