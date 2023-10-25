import {EntryList} from "../entry-list/entry-list"

export function Blog(){

    return(
        <>
            <EntryList entry = {[
                ["2023 Oct 2", "page", "Hello Webpage", ""],
                ["2023 Oct 2", "link", "Hello Webpage Github", "https://google.com"]
            ]}/>
        </>
        
    );
}