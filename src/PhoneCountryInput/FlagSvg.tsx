import React, {useEffect, useState} from "react";

const FlagSvg: React.FC<{code: string}> = ({ code }) => {

    const [data, setData] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const d = await import(`./flags/${code}.svg?raw`)
            setData(d.default)
        }
        fetchData().catch(console.error);
    }, []);

    return (
        <div className='phone-country-select-list-flag' dangerouslySetInnerHTML={{ __html: data }} />
    )

}

export default FlagSvg;