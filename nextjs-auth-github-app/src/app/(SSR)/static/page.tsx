export const metadata = {
    title: "Static Page - DateTime",
}
// http://localhost:3000/static
export default async function Page() {
    console.log(`process.env.AZURE_FUNCTION_CODE: ${process.env.AZURE_FUNCTION_CODE}`);
    const url = `https://dfberry-fn.azurewebsites.net/api/get-time?code=${process.env.AZURE_FUNCTION_CODE}`;
    
    const response = await fetch(url,{ next: { revalidate: 86400 } });
    const data = await response.json(); 
    
    return (
        <div className="flex flex-col items-start">
            <h1>SSG API Response: {JSON.stringify(data)}</h1>
        </div>
    );
}
