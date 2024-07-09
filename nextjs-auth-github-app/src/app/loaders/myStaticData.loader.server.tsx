// myStaticData.loader.server.tsx
export async function loader() {
    const currentDateTime = new Date().toLocaleString();
    return { currentDateTime };
}