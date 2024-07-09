import { createNewRepo } from "@/actions/repo";
const NewRepo = async () => {
    return (
        <form action={createNewRepo}>
            <div className="flex items-center">
                <label className="mr-4">Repo Name</label>
                <input type="text" name="repo" className="flex-1 mt-2 border border-gray-200" />
                <button className="ml-4 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors" type="submit">Create</button>
            </div>
        </form>
    );
};

export default NewRepo;
