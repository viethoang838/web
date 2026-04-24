import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar(){
    const [keyword, setKeyword] = useState("");
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const handleSearch = (e)=>{
        e.preventDefault(); 
        const params = new URLSearchParams(searchParams);
        if(keyword.trim().length > 0) params.set('search', keyword);
        else params.delete('search');

        router.replace(`${pathname}?${params.toString('')}`);
    }
    return(
        <form onSubmit={handleSearch}>
            <input type="search" placeholder="Nhap tu khoa de tim" onChange={
                (e)=>setKeyword(e.target.value)
            }/>
            <button type="submit">Tim</button>
        </form>
    )
}