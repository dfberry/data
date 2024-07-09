// catch all route, everything after /data except root with no further segment
// http://localhost:3000/dr/exclusive/data1/help/me
const DataPage = ({params}:any) => {

    const dataAsString = JSON.stringify(params);

    return (
        <div>
            <h1>(1) /src/app/(SSR)/dr/exclusive/(dynamic-routes-not-inclusive)/[...data]/page.tsx - {dataAsString}</h1>
        </div>
    );
}

export default DataPage;