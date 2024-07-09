const TodoByIdPage = ({params}:any) => {
    return (
        <div>
            <h1>Dynamic Todos Page: {params.id} </h1>
        </div>
    );
}

export default TodoByIdPage;