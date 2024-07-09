import { createNewRepo } from "@/actions/repo";
const NewRepo = async () => {
    return (
        <form action={createNewRepo}>
            <div className="flex flex-col">
                <label>Repo Name</label>
                <input type="text" name="repo" className="mt-2 border border-gray-200"/>
                <button type="submit">create</button>
            </div>
        </form>
    );
};

export default NewRepo;
