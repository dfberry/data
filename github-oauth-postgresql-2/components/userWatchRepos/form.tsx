'use client'

import { CreateNewRepoToWatch } from "@/actions/userWatchRepo";
import { useState, useRef, Suspense } from "react";
import { z } from "zod";

const regexOrgRepo = /^[^\/]+\/[^\/]+$/;

const orgRepoSchema = z.string().regex(regexOrgRepo, "Invalid org/repo format");

function validateRepoUrl(orgRepo: string) {
    console.log(`validateRepoUrl start: ${orgRepo}`);

    try {

        orgRepoSchema.parse(orgRepo);
        console.log(`validateRepoUrl: ${orgRepo}`);

        // Extract the org/repo part
        return { success: true, repo: orgRepo };
    } catch (e) {
        console.log(`validateRepoUrl error: ${e}`);
        if (e instanceof z.ZodError) {
            e.errors.forEach((error) => {
                console.error(`Validation error: ${error.message}`);
            });
        } else {
            console.error("Unexpected error:", e);
        }
        return { success: false, error: e };
    }
}

const NewRepoToWatchForm = () => {
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleChange = () => {
        console.log("NewRepoToWatchForm handleChange");
        if (error) {
            setError(null);
        }
    };

    async function action(formData: FormData) {

        console.log("NewRepoToWatchForm action");

        const formValues = Object.fromEntries(formData.entries());
        const url = formValues["repo"] as string;
        const orgRepo = url.toLowerCase();

        console.log("action url", url);
        const { success, error, repo } = validateRepoUrl(orgRepo)

        if (!success) {
            console.log("action error validat", error);
            setError("The repository URL must conform to the GitHub format.");
            return;
        }

        try {
            await CreateNewRepoToWatch(orgRepo);
            formRef?.current?.reset();
        } catch (e) {
            console.log("action error", e);
            setError("The repository does not exist or is not accessible for this user.");
        }
    }

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <form action={action} ref={formRef} className="p-6 bg-white shadow-md rounded-md">
                <div className="flex flex-col items-start space-y-4">
                    <label className="text-gray-700 font-semibold">Repo Name</label>
                    <input
                        type="text"
                        name="repo"
                        className={`w-[50ch] p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="myname/myrepo"
                        onChange={handleChange}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors" type="submit">Create</button>
                </div>
            </form>
        </Suspense>
    );
};

export default NewRepoToWatchForm;