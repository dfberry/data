// catch all route, everything after /data including root with no further segment
// http://localhost:3000/dr/inclusive/data2
const DataPage = ({params}:any) => {

    const dataAsString = JSON.stringify(params);

    return (
        <div>
            <h1>(2) /src/app/(SSR)/dr/inclusive/(dynamic-routes-inclusive)/[[...data2]]/page.tsx - {dataAsString}</h1>
        </div>
    );
}

export default DataPage;