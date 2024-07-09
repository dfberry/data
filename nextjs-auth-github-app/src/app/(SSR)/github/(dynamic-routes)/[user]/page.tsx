const UserPage = ({params}:any) => {
    return (
        <div>
            <h1>Dynamic User Page: {params.user}</h1>
        </div>
    );
}

export default UserPage;